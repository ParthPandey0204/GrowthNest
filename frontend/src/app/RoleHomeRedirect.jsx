import { Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { getHomePath } from "./homePath";

export default function RoleHomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={getHomePath(user?.role)} replace />;
}
