import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { Navbar } from "./Navbar.jsx";

export function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
