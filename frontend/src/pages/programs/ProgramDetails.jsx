import { Link, useParams } from "react-router-dom";
import { useCourse } from "../../services/course.service";
import { useEnrollProgram, useMyEnrollments } from "../../services/enrollment.service";
import { useAuth } from "../../store/AuthContext";
import CreateLessonForm from "../../components/CreateLessonForm";
import { useMemo, useState } from "react";

function ProgramDetails() {
  const { id } = useParams();
  const { data: program, isLoading, error, refetch } = useCourse(id);
  const { user } = useAuth();
  const [isLessonFormOpen, setIsLessonFormOpen] = useState(false);
  const { data: enrollments = [] } = useMyEnrollments();
  const enrollProgram = useEnrollProgram();
  const isEnrolled = enrollments.some((enrollment) => enrollment.programId === id || enrollment.program?.id === id);
  const isProgramMentor = user?.role === "MENTOR" && program?.mentor?.id === user.id;
  const curriculum = useMemo(() => {
    const topics = new Map();
    const add = (topic, item) => {
      const name = topic || "Getting started";
      if (!topics.has(name)) topics.set(name, []);
      topics.get(name).push(item);
    };
    program?.lessons?.forEach((lesson) => add(lesson.topic, { ...lesson, kind: lesson.type.toLowerCase() }));
    program?.assignments?.forEach((assignment) => add(assignment.topic, { ...assignment, kind: "assignment" }));
    return [...topics.entries()];
  }, [program]);

  if (isLoading) return <div className="h-72 animate-pulse rounded-3xl bg-slate-200" />;
  if (error || !program) return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">This program could not be found.</div>;

  return (
    <div className="space-y-6">
      <Link to="/programs" className="text-sm font-medium text-[#1D546C]">← Browse programs</Link>
      <section className="rounded-[32px] bg-[linear-gradient(135deg,#0C2B4E,#1D546C)] px-7 py-9 text-white shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-100/70">Mentor-led program</p>
        <h1 className="mt-2 text-3xl font-semibold">{program.title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-sky-50/85">{program.description || "Build practical skills with structured lessons and mentor support."}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4"><span className="text-sm font-semibold">{program.price ? `₹${program.price}` : "Free"}</span><button onClick={() => enrollProgram.mutate(id)} disabled={isEnrolled || enrollProgram.isPending} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0C2B4E] disabled:cursor-not-allowed disabled:opacity-65">{isEnrolled ? "Enrolled" : enrollProgram.isPending ? "Enrolling..." : "Enrol now"}</button></div>
        {enrollProgram.error && <p className="mt-3 text-sm text-rose-200">{enrollProgram.error.message || "Unable to enrol. Please try again."}</p>}
      </section>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6"><div className="flex items-center justify-between gap-3"><div><h2 className="text-xl font-semibold text-slate-900">Course content</h2><p className="mt-1 text-sm text-slate-500">Learn by topic with video, reading, and practical work in one place.</p></div>{isProgramMentor && <button onClick={() => setIsLessonFormOpen((open) => !open)} className="rounded-xl bg-[#0C2B4E] px-3 py-2 text-sm font-semibold text-white">{isLessonFormOpen ? "Close" : "+ Add content"}</button>}</div>{isLessonFormOpen && <div className="mt-4"><CreateLessonForm programId={id} onCreated={() => { setIsLessonFormOpen(false); refetch(); }} /></div>}<div className="mt-5 space-y-5">{curriculum.length ? curriculum.map(([topic, items], topicIndex) => <section key={topic} className="overflow-hidden rounded-2xl border border-slate-200"><div className="bg-slate-50 px-4 py-3"><p className="text-xs font-semibold uppercase tracking-wide text-[#1D546C]">Topic {topicIndex + 1}</p><h3 className="mt-1 font-semibold text-slate-900">{topic}</h3></div><div className="divide-y divide-slate-100">{items.map((item) => item.kind === "assignment" ? <Link to="/student/dashboard" key={item.id} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50"><span><span className="mr-2 rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Assignment</span>{item.title}</span><span className="text-xs text-slate-500">{item.dueAt ? `Due ${new Date(item.dueAt).toLocaleDateString()}` : "Open assignment"}</span></Link> : <Link to={`/programs/${id}/lessons/${item.id}`} key={item.id} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50"><span><span className={`mr-2 rounded px-2 py-1 text-xs font-semibold ${item.kind === "video" ? "bg-sky-100 text-sky-800" : "bg-emerald-100 text-emerald-800"}`}>{item.kind === "video" ? "Video" : "Article"}</span>{item.title}</span><span className="text-[#1D546C]">Open →</span></Link>)}</div></section>) : <p className="text-sm text-slate-500">Course content will be published soon.</p>}</div></section>
        <aside className="rounded-3xl border border-slate-200 bg-white p-6"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Your mentor</p><h2 className="mt-2 text-xl font-semibold text-slate-900">{program.mentor?.name ?? "GrowthNest Mentor"}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{program.mentor?.bio || "Your mentor will guide you through every stage of this program."}</p></aside>
      </div>
    </div>
  );
}

export default ProgramDetails;
