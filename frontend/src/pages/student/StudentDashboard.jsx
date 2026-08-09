import { Link } from "react-router-dom";
import { useMyEnrollments } from "../../services/enrollment.service";

function StudentDashboard() {
  const { data: enrollments = [], isLoading, error } = useMyEnrollments();
  if (isLoading) return <div className="grid gap-5 sm:grid-cols-2">{[1, 2].map((item) => <div key={item} className="h-48 animate-pulse rounded-3xl bg-slate-200" />)}</div>;
  if (error) return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">Unable to load your learning dashboard.</div>;
  return <div className="space-y-7"><section><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1D546C]">Student dashboard</p><h1 className="mt-2 text-3xl font-semibold text-slate-900">My Learning</h1><p className="mt-2 text-sm text-slate-600">Pick up where you left off and keep your progress moving.</p></section>{enrollments.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><p className="text-slate-600">You have not enrolled in a program yet.</p><Link to="/programs" className="mt-4 inline-block rounded-xl bg-[#1D546C] px-4 py-2 text-sm font-medium text-white">Browse programs</Link></div> : <div className="grid gap-5 sm:grid-cols-2">{enrollments.map((enrollment) => <article key={enrollment.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-[#1D546C]">{enrollment.program?.mentor?.name ?? "GrowthNest"}</p><h2 className="mt-2 text-xl font-semibold text-slate-900">{enrollment.program?.title ?? "New program"}</h2><div className="mt-6"><div className="flex justify-between text-sm text-slate-600"><span>Progress</span><span>{enrollment.progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-[#1D546C]" style={{ width: `${enrollment.progress}%` }} /></div></div><Link to={`/programs/${enrollment.programId}`} className="mt-6 inline-block text-sm font-semibold text-[#1D546C]">Continue learning →</Link></article>)}</div>}</div>;
}

export default StudentDashboard;
