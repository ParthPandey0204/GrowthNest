import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMentorContent } from "../../api/mentor.api";

function ContentManager() {
  const [filter, setFilter] = useState("All");
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["mentor-content"], queryFn: getMentorContent });
  const items = useMemo(() => (data?.programs ?? []).flatMap((program) => program.lessons.map((lesson) => ({ ...lesson, course: program.title, programId: program.id }))), [data]);
  const filteredItems = filter === "All" ? items : items.filter((item) => item.type === filter.toUpperCase());

  return <div className="space-y-6">
    <section className="rounded-[32px] bg-[linear-gradient(135deg,#0C2B4E,#1D546C)] px-6 py-7 text-white shadow-lg"><p className="text-xs uppercase tracking-[0.28em] text-white/65">Content Manager</p><h1 className="mt-3 text-3xl font-semibold">Your lesson library</h1><p className="mt-2 text-sm text-white/80">Content is pulled directly from the lessons in your programs.</p></section>
    <div className="flex flex-wrap gap-2">{["All", "Article", "Video", "Assignment", "Live"].map((type) => <button key={type} onClick={() => setFilter(type)} className={`rounded-full px-4 py-2 text-sm font-medium ${filter === type ? "bg-[#1D546C] text-white" : "bg-white text-slate-600 shadow-sm"}`}>{type}</button>)}</div>
    {isLoading ? <p className="rounded-2xl bg-white p-6 text-slate-500">Loading content…</p> : error ? <div className="rounded-2xl bg-rose-50 p-6 text-rose-700">Unable to load content. <button onClick={() => refetch()} className="font-semibold underline">Try again</button></div> : filteredItems.length ? <div className="grid gap-5 xl:grid-cols-2">{filteredItems.map((item) => <article key={item.id} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-semibold text-slate-900">{item.title}</h2><p className="mt-1 text-sm text-slate-500">{item.course}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase text-slate-600">{item.type}</span></div><p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">{item.content || "No written content has been added yet."}</p><p className="mt-5 text-xs text-slate-400">Updated {new Date(item.updatedAt).toLocaleDateString()}</p></article>)}</div> : <p className="rounded-2xl bg-white p-8 text-center text-slate-500">No matching lessons yet. Add one from a program’s lesson section.</p>}
  </div>;
}

export default ContentManager;
