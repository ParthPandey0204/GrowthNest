import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const user = null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;
