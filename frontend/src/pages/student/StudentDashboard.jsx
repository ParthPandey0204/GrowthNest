import { useState } from "react";
import { Link } from "react-router-dom";
import { useMyEnrollments, useStudentProgressSummary } from "../../services/enrollment.service";
import { useMyAssignments } from "../../services/assignment.service";
import SubmissionForm from "../../components/SubmissionForm";

function ProgressRing({ value }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;
  return <div className="relative h-28 w-28"><svg viewBox="0 0 100 100" className="-rotate-90"><circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="9" /><circle cx="50" cy="50" r={radius} fill="none" stroke="#1D546C" strokeWidth="9" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} /></svg><span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-slate-900">{value}%</span></div>;
}

function StudentDashboard() {
  const { data: enrollments = [], isLoading: enrollmentsLoading, error: enrollmentsError } = useMyEnrollments();
  const { data: assignments = [], isLoading: assignmentsLoading, error: assignmentsError, refetch: refetchAssignments } = useMyAssignments();
  const { data: summary, isLoading: summaryLoading } = useStudentProgressSummary();
  const [activeTab, setActiveTab] = useState("courses");

  if (enrollmentsLoading || assignmentsLoading || summaryLoading) return <div className="grid gap-5 sm:grid-cols-2">{[1, 2].map((item) => <div key={item} className="h-48 animate-pulse rounded-3xl bg-slate-200" />)}</div>;
  if (enrollmentsError || assignmentsError) return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">Unable to load your learning dashboard.</div>;

  const metrics = summary?.metrics ?? {};
  return <div className="space-y-7">
    <section><p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1D546C]">Student dashboard</p><h1 className="mt-2 text-3xl font-semibold text-slate-900">My Learning</h1><p className="mt-2 text-sm text-slate-600">Your progress, coursework, and recent learning activity in one place.</p></section>

    <section className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold text-slate-900">Program progress</h2><div className="mt-5 grid gap-5 sm:grid-cols-2">{enrollments.length ? enrollments.map((enrollment) => <div key={enrollment.id} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4"><ProgressRing value={enrollment.progress} /><div><h3 className="font-semibold text-slate-900">{enrollment.program?.title}</h3><p className="mt-1 text-sm text-slate-500">{enrollment.progress}% complete</p><Link to={`/programs/${enrollment.programId}`} className="mt-2 inline-block text-sm font-semibold text-[#1D546C]">Continue →</Link></div></div>) : <p className="text-sm text-slate-500">Enrol in a program to track progress.</p>}</div></div>
      <aside className="rounded-3xl bg-[linear-gradient(135deg,#0C2B4E,#1D546C)] p-6 text-white shadow-sm"><h2 className="text-lg font-semibold">Learning metrics</h2><div className="mt-5 grid grid-cols-3 gap-3 text-center"><div><p className="text-2xl font-bold">{metrics.assignmentCompletionRate ?? 0}%</p><p className="mt-1 text-xs text-sky-100/75">Assignments done</p></div><div><p className="text-2xl font-bold">{metrics.averageScore ?? "—"}</p><p className="mt-1 text-xs text-sky-100/75">Average score</p></div><div><p className="text-2xl font-bold">{metrics.sessionAttendance ?? 0}</p><p className="mt-1 text-xs text-sky-100/75">Sessions attended</p></div></div></aside>
    </section>

    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>{summary?.recentActivity?.length ? <ol className="mt-4 space-y-3">{summary.recentActivity.map((activity, index) => <li key={`${activity.type}-${index}`} className="flex justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 text-sm"><span className="font-medium text-slate-700">{activity.title}</span><time className="shrink-0 text-slate-500">{new Date(activity.at).toLocaleDateString()}</time></li>)}</ol> : <p className="mt-3 text-sm text-slate-500">Your completed lessons and submissions will appear here.</p>}</section>

    <div className="flex gap-4 border-b border-slate-200"><button onClick={() => setActiveTab("courses")} className={`pb-3 text-sm font-medium ${activeTab === "courses" ? "border-b-2 border-[#0C2B4E] text-[#0C2B4E]" : "text-slate-500"}`}>My Courses</button><button onClick={() => setActiveTab("assignments")} className={`pb-3 text-sm font-medium ${activeTab === "assignments" ? "border-b-2 border-[#0C2B4E] text-[#0C2B4E]" : "text-slate-500"}`}>Assignments</button></div>
    {activeTab === "courses" ? (enrollments.length ? <div className="grid gap-5 sm:grid-cols-2">{enrollments.map((enrollment) => <article key={enrollment.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wide text-[#1D546C]">{enrollment.program?.mentor?.name ?? "GrowthNest"}</p><h2 className="mt-2 text-xl font-semibold text-slate-900">{enrollment.program?.title}</h2><div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-[#1D546C]" style={{ width: `${enrollment.progress}%` }} /></div><p className="mt-2 text-sm text-slate-600">{enrollment.progress}% complete</p></article>)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><p className="text-slate-600">You have not enrolled in a program yet.</p><Link to="/programs" className="mt-4 inline-block rounded-xl bg-[#1D546C] px-4 py-2 text-sm font-medium text-white">Browse programs</Link></div>) : (assignments.length ? <div className="space-y-5">{assignments.map((assignment) => { const submission = assignment.submissions?.[0]; const reviewed = submission?.status === "REVIEWED"; return <article key={assignment.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs font-semibold text-[#1D546C]">{assignment.program?.title}</p><h3 className="mt-1 text-xl font-semibold text-slate-900">{assignment.title}</h3></div><span className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${reviewed ? "bg-emerald-100 text-emerald-700" : submission ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{reviewed ? "Graded" : submission ? "Pending Review" : "Not submitted"}</span></div>{assignment.dueAt && <p className="mt-3 text-sm text-slate-500">Due {new Date(assignment.dueAt).toLocaleDateString()}</p>}{reviewed && <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><p className="font-semibold text-emerald-900">Score: {submission.grade ?? "—"}/100</p><p className="mt-2 text-sm leading-6 text-emerald-800">{submission.feedback || "Your mentor has graded this submission without written feedback."}</p></div>}{!submission && <SubmissionForm assignmentId={assignment.id} onSubmitted={refetchAssignments} />}</article>; })}</div> : <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">You have no assignments yet.</div>)}</div>;
}

export default StudentDashboard;
