import { useState } from "react";
import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, changeUserRole, toggleUserStatus, approveMentor } from "../../api/admin.api";

export default function UserManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const limit = 10;
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers", page, search, roleFilter],
    queryFn: () => getUsers({ page, limit, search, role: roleFilter }),
    placeholderData: keepPreviousData,
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => changeUserRole(id, { role }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminUsers"] }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }) => toggleUserStatus(id, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminUsers"] }),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => approveMentor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminUsers"] }),
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">User Management</h2>
          <p className="text-sm text-slate-500">Manage user roles, statuses, and mentor approvals.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0C2B4E] focus:ring-1 focus:ring-[#0C2B4E] outline-none w-full sm:w-64"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0C2B4E] focus:ring-1 focus:ring-[#0C2B4E] outline-none"
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Roles</option>
            <option value="STUDENT">Student</option>
            <option value="MENTOR">Mentor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3 border-b border-slate-200">User</th>
              <th className="px-6 py-3 border-b border-slate-200">Role</th>
              <th className="px-6 py-3 border-b border-slate-200">Status</th>
              <th className="px-6 py-3 border-b border-slate-200">Joined</th>
              <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">Loading users...</td>
              </tr>
            ) : data?.users?.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No users found.</td>
              </tr>
            ) : (
              data?.users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{user.name}</div>
                    <div className="text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      className="rounded border border-slate-300 text-xs py-1 px-2 outline-none focus:border-[#0C2B4E]"
                      value={user.role}
                      onChange={(e) => roleMutation.mutate({ id: user.id, role: e.target.value })}
                      disabled={roleMutation.isPending}
                    >
                      <option value="STUDENT">Student</option>
                      <option value="MENTOR">Mentor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${user.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                    {user.role === 'MENTOR' && !user.isApproved && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {user.role === 'MENTOR' && !user.isApproved && (
                      <button
                        onClick={() => approveMutation.mutate(user.id)}
                        disabled={approveMutation.isPending}
                        className="text-xs font-medium text-sky-600 hover:text-sky-800"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => statusMutation.mutate({ id: user.id, isActive: !user.isActive })}
                      disabled={statusMutation.isPending}
                      className={`text-xs font-medium ${user.isActive ? 'text-rose-600 hover:text-rose-800' : 'text-emerald-600 hover:text-emerald-800'}`}
                    >
                      {user.isActive ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {roleMutation.error || statusMutation.error || approveMutation.error ? (
        <p className="border-t border-rose-100 bg-rose-50 px-6 py-3 text-sm text-rose-700">
          {roleMutation.error?.response?.data?.message || statusMutation.error?.response?.data?.message || approveMutation.error?.response?.data?.message || "Unable to update this user. Please try again."}
        </p>
      ) : null}

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Page {page} of {data.pagination.totalPages}
          </span>
          <div className="space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 text-sm rounded border border-slate-300 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              disabled={page === data.pagination.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 text-sm rounded border border-slate-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
