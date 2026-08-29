import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/useAuth.js";

export function NoHousehold({ onChanged }) {
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/households`,
        { name },
        { headers }
      );
      onChanged();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create household");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/households/join`,
        { inviteCode },
        { headers }
      );
      onChanged();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join household");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}

      <form onSubmit={handleCreate}>
        <h2>Create a household</h2>
        <input
          type="text"
          placeholder="Household name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Create
        </button>
      </form>

      <form onSubmit={handleJoin}>
        <h2>Join a household</h2>
        <input
          type="text"
          placeholder="Invite code"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Join
        </button>
      </form>
    </div>
  );
}
