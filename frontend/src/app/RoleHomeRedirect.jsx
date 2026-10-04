import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const homeByRole = {
  ADMIN: "/admin/dashboard",
  STUDENT: "/student/dashboard",
  MENTOR: "/dashboard",
};

export function getHomePath(role) {
  return homeByRole[role] ?? "/login";
}

export default function RoleHomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={getHomePath(user?.role)} replace />;
}
