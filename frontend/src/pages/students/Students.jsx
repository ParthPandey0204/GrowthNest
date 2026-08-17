import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMentorStudents } from "../../api/mentor.api";

const statusClass = (progress) => progress >= 75 ? "bg-emerald-50 text-emerald-700" : progress >= 40 ? "bg-sky-50 text-sky-700" : "bg-amber-50 text-amber-700";
const statusLabel = (progress) => progress >= 75 ? "On track" : progress >= 40 ? "In progress" : "Needs support";

function Students() {
  const [query, setQuery] = useState("");
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["mentor-students"], queryFn: getMentorStudents });
  const students = useMemo(() => (data?.enrollments ?? []).filter(({ user, program }) => `${user.name} ${user.email} ${program.title}`.toLowerCase().includes(query.trim().toLowerCase())), [data, query]);
  return <div className="space-y-6">
    <section className="rounded-[32px] bg-[linear-gradient(135deg,#0C2B4E,#1D546C)] px-6 py-7 text-white shadow-lg"><p className="text-xs uppercase tracking-[0.28em] text-white/65">Students</p><h1 className="mt-3 text-3xl font-semibold">Mentor your learners directly</h1><p className="mt-2 text-sm text-white/80">Progress shown here comes from live enrollment records.</p></section>
    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search learners by name, email, or program" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1D546C]" />
    {isLoading ? <p className="rounded-2xl bg-white p-6 text-slate-500">Loading learners…</p> : error ? <div className="rounded-2xl bg-rose-50 p-6 text-rose-700">Unable to load learners. <button onClick={() => refetch()} className="font-semibold underline">Try again</button></div> : students.length ? <div className="grid gap-5 xl:grid-cols-2">{students.map(({ user, program, progress, status, enrolledAt }) => <article key={`${user.id}-${program.id}`} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold text-slate-900">{user.name}</h2><p className="mt-1 text-sm text-slate-500">{user.email}</p><p className="mt-2 text-sm font-medium text-[#1D546C]">{program.title}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(progress)}`}>{status === "COMPLETED" ? "Completed" : statusLabel(progress)}</span></div><div className="mt-6 flex justify-between text-sm"><span className="text-slate-500">Progress</span><span className="font-semibold text-slate-900">{progress}%</span></div><div className="mt-2 h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-[#1D546C]" style={{ width: `${progress}%` }} /></div><p className="mt-4 text-xs text-slate-400">Enrolled {new Date(enrolledAt).toLocaleDateString()}</p></article>)}</div> : <p className="rounded-2xl bg-white p-8 text-center text-slate-500">No learners match this search.</p>}
  </div>;
}

export default Students;
