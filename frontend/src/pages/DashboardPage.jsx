import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth.js";

export function DashboardPage() {
  const [counts, setCounts] = useState(null);
  const [wasteScore, setWasteScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [expiring, setExpiring] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { token } = useAuth();

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const [statsRes, expiringRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/stats`, { headers }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/expiring`, { headers }),
        ]);

        setCounts(statsRes.data.counts);
        setWasteScore(statsRes.data.wasteScore);
        setLeaderboard(statsRes.data.leaderboard);
        setExpiring(expiringRes.data.items);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p>{error}</p>}

      {counts && (
        <section>
          <h2>Status counts</h2>
          <ul>
            <li>Fresh: {counts.fresh}</li>
            <li>Expiring soon: {counts["expiring-soon"]}</li>
            <li>Expired: {counts.expired}</li>
            <li>Used: {counts.used}</li>
            <li>Wasted: {counts.wasted}</li>
          </ul>
        </section>
      )}

      <section>
        <h2>Waste score</h2>
        <p>{wasteScore.toFixed(1)}%</p>
      </section>

      <section>
        <h2>Leaderboard</h2>
        <ol>
          {leaderboard.map((entry) => (
            <li key={entry.userId}>
              {entry.name} — {entry.score.toFixed(1)}% ({entry.used} used, {entry.wasted} wasted)
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2>Expiring within 24 hours</h2>
        {expiring.length === 0 ? (
          <p>Nothing expiring soon.</p>
        ) : (
          <ul>
            {expiring.map((item) => (
              <li key={item._id}>
                {item.name} — {new Date(item.expiryDate).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
