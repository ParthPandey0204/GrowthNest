import { useQuery } from "@tanstack/react-query";
import { getAdminStats, getActivityLogs } from "../../api/admin.api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
  });

  const { data: activities, isLoading: activityLoading } = useQuery({
    queryKey: ["adminActivity"],
    queryFn: getActivityLogs,
  });

  if (statsLoading || activityLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Platform Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Total Users</p>
          <p className="mt-2 text-4xl font-bold text-[#0C2B4E]">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Total Programs</p>
          <p className="mt-2 text-4xl font-bold text-[#0C2B4E]">{stats?.totalPrograms || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Est. Revenue</p>
          <p className="mt-2 text-4xl font-bold text-emerald-600">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* Charts */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Monthly Growth</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.monthlyGrowth || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="users" name="New Users" fill="#0C2B4E" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="enrollments" name="New Enrollments" fill="#38BDF8" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Activity Log */}
        <aside className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Activity Log</h2>
          <div className="space-y-4">
            {!activities?.length ? (
              <p className="text-sm text-slate-500 text-center py-4">No recent activity.</p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex gap-3 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className={`mt-0.5 shrink-0 h-2 w-2 rounded-full ${
                    activity.type === 'USER_SIGNUP' ? 'bg-indigo-500' :
                    activity.type === 'ENROLLMENT' ? 'bg-emerald-500' :
                    'bg-sky-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800 leading-snug">{activity.message}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(activity.date).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
