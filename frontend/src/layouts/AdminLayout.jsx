import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0C2B4E] text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight">GrowthNest Admin</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            User Management
          </NavLink>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-slate-300 rounded-lg hover:bg-white/5 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8">
          <h2 className="text-sm font-semibold text-slate-800">Admin Dashboard</h2>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
