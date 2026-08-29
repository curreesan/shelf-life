import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/household">Household</Link>
      <Link to="/items">Inventory</Link>
      <Link to="/add">Add Item</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
