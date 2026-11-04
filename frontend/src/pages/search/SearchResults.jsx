import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourses, getMyCourses } from "../../api/courses.api";
import { getMentorStudents } from "../../api/mentor.api";
import { getSessions } from "../../api/sessions.api";
import { useAuth } from "../../store/AuthContext";

function SearchResults() {
  const [params, setParams] = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");
  const query = (params.get("q") ?? "").trim();
  const { user } = useAuth();
  const enabled = query.length > 0;
  const { data, isLoading, error } = useQuery({
    queryKey: ["global-search", user?.id, query],
    enabled,
    queryFn: async () => {
      const [courseData, sessionData, studentData] = await Promise.all([
        user?.role === "MENTOR" ? getMyCourses({ page: 1, limit: 100 }) : getCourses({ page: 1, limit: 100, search: query }),
        getSessions(),
        user?.role === "MENTOR" ? getMentorStudents() : Promise.resolve({ enrollments: [] }),
      ]);
      const term = query.toLocaleLowerCase();
      const programs = (courseData.programs ?? []).filter((program) => `${program.title} ${program.description ?? ""} ${program.mentor?.name ?? ""}`.toLocaleLowerCase().includes(term));
      const sessions = sessionData.filter((session) => `${session.title} ${session.program?.title ?? ""} ${session.mentor?.name ?? ""}`.toLocaleLowerCase().includes(term));
      const learners = (studentData.enrollments ?? []).filter(({ user: learner, program }) => `${learner.name} ${learner.email} ${program.title}`.toLocaleLowerCase().includes(term));
      return { programs, sessions, learners };
    },
  });

  const search = (event) => { event.preventDefault(); const next = new URLSearchParams(params); if (value.trim()) next.set("q", value.trim()); else next.delete("q"); setParams(next); };
  const total = (data?.programs.length ?? 0) + (data?.sessions.length ?? 0) + (data?.learners.length ?? 0);

  return <main className="space-y-6">
    <header className="rounded-3xl bg-[linear-gradient(135deg,#0C2B4E,#1D546C)] p-7 text-white"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100/70">Workspace search</p><h1 className="mt-2 text-3xl font-semibold">Search courses, learners, and sessions</h1><form onSubmit={search} className="mt-5 flex max-w-2xl gap-2"><input autoFocus value={value} onChange={(event) => setValue(event.target.value)} placeholder="Type a course, learner, or session" className="min-w-0 flex-1 rounded-xl px-4 py-3 text-sm text-slate-900" /><button className="rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-900">Search</button></form></header>
    {!enabled ? <p className="rounded-2xl bg-white p-6 text-slate-600">Enter a search term to find matching items.</p> : isLoading ? <p className="rounded-2xl bg-white p-6 text-slate-600">Searching…</p> : error ? <p role="alert" className="rounded-2xl bg-rose-50 p-6 text-rose-700">Search could not be completed. Please try again.</p> : !total ? <p className="rounded-2xl bg-white p-8 text-center text-slate-600">No results for “{query}”.</p> : <div className="space-y-5">
      {!!data.programs.length && <section className="rounded-2xl bg-white p-5"><h2 className="text-lg font-semibold">Courses</h2><div className="mt-3 divide-y">{data.programs.map((program) => <Link key={program.id} to={user?.role === "MENTOR" ? `/dashboard/courses/${program.id}` : `/programs/${program.id}`} className="block py-3 hover:text-[#1D546C]"><p className="font-medium">{program.title}</p><p className="mt-1 text-sm text-slate-500">{program.description || "Program"}</p></Link>)}</div></section>}
      {!!data.learners.length && <section className="rounded-2xl bg-white p-5"><h2 className="text-lg font-semibold">Learners</h2><div className="mt-3 divide-y">{data.learners.map(({ user: learner, program }, index) => <div key={`${learner.id}-${program.id}-${index}`} className="py-3"><p className="font-medium">{learner.name}</p><p className="text-sm text-slate-500">{learner.email} · {program.title}</p></div>)}</div></section>}
      {!!data.sessions.length && <section className="rounded-2xl bg-white p-5"><h2 className="text-lg font-semibold">Sessions</h2><div className="mt-3 divide-y">{data.sessions.map((session) => <Link key={session.id} to="/dashboard/sessions" className="block py-3 hover:text-[#1D546C]"><p className="font-medium">{session.title}</p><p className="text-sm text-slate-500">{session.program?.title ?? "General session"} · {new Date(session.startsAt).toLocaleString()}</p></Link>)}</div></section>}
    </div>}
  </main>;
}

export default SearchResults;
