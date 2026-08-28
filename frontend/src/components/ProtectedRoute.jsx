import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

export function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
