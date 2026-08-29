import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth.js";
import { ItemRow } from "./items/ItemRow.jsx";

const CATEGORIES = ["produce", "dairy", "meat", "pantry", "frozen", "other"];
const STATUSES = ["fresh", "expiring-soon", "expired", "used", "wasted"];

export function ItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("expiryDate");
  const [actioningItemId, setActioningItemId] = useState(null);

  const { token } = useAuth();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/items`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          category: category !== "all" ? category : undefined,
          status: status !== "all" ? status : undefined,
          sort,
        },
      });
      setItems(res.data.items);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  }, [category, status, sort, token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard fetch-on-mount/dependency-change pattern
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id) => {
    setActioningItemId(id);
    setError("");
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete item");
    } finally {
      setActioningItemId(null);
    }
  };

  const handleMarkStatus = async (id, newStatus) => {
    setActioningItemId(id);
    setError("");
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/items/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setActioningItemId(null);
    }
  };

  const handleSave = async (id, updatedFields) => {
    setActioningItemId(id);
    setError("");
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/items/${id}`,
        updatedFields,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update item");
    } finally {
      setActioningItemId(null);
    }
  };

  return (
    <div className="page">
      <h1>Inventory</h1>
      {error && <p className="error">{error}</p>}

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="expiryDate">Expiry date (soonest first)</option>
        <option value="-expiryDate">Expiry date (latest first)</option>
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ItemRow
                key={item._id}
                item={item}
                onDelete={handleDelete}
                onMarkStatus={handleMarkStatus}
                onSave={handleSave}
                isActioning={actioningItemId === item._id}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
