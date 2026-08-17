import { useState } from "react";
import { keepPreviousData, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminPrograms, updateAdminProgramStatus } from "../../api/admin.api";

export default function ProgramModeration() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 10;
  
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminPrograms", page, search, statusFilter],
    queryFn: () => getAdminPrograms({ page, limit, search, status: statusFilter }),
    placeholderData: keepPreviousData,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateAdminProgramStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminPrograms"] }),
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Program Moderation</h2>
          <p className="text-sm text-slate-500">Monitor programs, flag inappropriate content, or archive inactive programs.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search program or mentor..." className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0C2B4E] sm:w-64" />
          <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0C2B4E]">
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3 border-b border-slate-200">Program</th>
              <th className="px-6 py-3 border-b border-slate-200">Mentor</th>
              <th className="px-6 py-3 border-b border-slate-200 text-center">Enrollments</th>
              <th className="px-6 py-3 border-b border-slate-200">Status</th>
              <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500 animate-pulse">Loading programs...</td>
              </tr>
            ) : data?.programs?.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No programs found.</td>
              </tr>
            ) : (
              data?.programs.map((program) => (
                <tr key={program.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{program.title}</div>
                    <div className="text-slate-500 text-xs">Price: {program.price ? `₹${program.price}` : 'Free'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{program.mentor.name}</div>
                    <div className="text-slate-500 text-xs">{program.mentor.email}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {program._count.enrollments}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      program.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 
                      program.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {program.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <select
                      className="rounded border border-slate-300 text-xs py-1 px-2 outline-none focus:border-[#0C2B4E]"
                      value={program.status}
                      onChange={(e) => statusMutation.mutate({ id: program.id, status: e.target.value })}
                      disabled={statusMutation.isPending}
                    >
                      <option value="DRAFT">Flag (Draft)</option>
                      <option value="ACTIVE">Active</option>
                      <option value="ARCHIVED">Archive</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {statusMutation.error ? <p className="border-t border-rose-100 bg-rose-50 px-6 py-3 text-sm text-rose-700">{statusMutation.error?.response?.data?.message || "Unable to update this program. Please try again."}</p> : null}

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
