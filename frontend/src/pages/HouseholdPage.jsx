import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth.js";
import { NoHousehold } from "./household/NoHousehold.jsx";
import { HouseholdView } from "./household/HouseholdView.jsx";

export function HouseholdPage() {
  const [household, setHousehold] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leaving, setLeaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { token } = useAuth();

  useEffect(() => {
    const fetchHousehold = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/households/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHousehold(res.data.household);
      } catch (err) {
        if (err.response?.status === 404) {
          setHousehold(null);
        } else {
          setError(err.response?.data?.message || "Failed to load household");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHousehold();
  }, [refreshKey, token]);

  useEffect(() => {
    if (!household) return;

    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/households/${household._id}/members`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMembers(res.data.members);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load members");
      }
    };

    fetchMembers();
  }, [household, token]);

  const handleLeave = async () => {
    setLeaving(true);
    setError("");

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/households/leave`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHousehold(null);
      setMembers([]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to leave household");
    } finally {
      setLeaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Household</h1>
      {error && <p>{error}</p>}

      {household ? (
        <HouseholdView
          household={household}
          members={members}
          onLeave={handleLeave}
          leaving={leaving}
        />
      ) : (
        <NoHousehold onChanged={() => setRefreshKey((k) => k + 1)} />
      )}
    </div>
  );
}
