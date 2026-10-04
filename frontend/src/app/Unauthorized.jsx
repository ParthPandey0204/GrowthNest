import { Link } from "react-router-dom";
import { getHomePath } from "./RoleHomeRedirect";
import { useAuth } from "../store/AuthContext";

export default function Unauthorized() {
  const { user } = useAuth();
  return <main className="grid min-h-screen place-items-center bg-slate-50 p-6"><section className="max-w-md rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm"><h1 className="text-xl font-semibold text-slate-900">This page is not available to your account</h1><p className="mt-3 text-sm leading-6 text-slate-600">Use your dashboard to continue.</p><Link to={getHomePath(user?.role)} className="mt-6 inline-block rounded-xl bg-[#1D546C] px-4 py-2 text-sm font-semibold text-white">Go to my dashboard</Link></section></main>;
}
