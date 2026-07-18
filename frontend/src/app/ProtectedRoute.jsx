import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../store/AuthContext";

function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
