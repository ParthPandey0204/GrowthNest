import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, getTasks } from "../../services/task.service";
import { getMentorContent } from "../../api/mentor.api";

function Tasks() {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [form, setForm] = useState({ title: "", programId: "", deadline: "" });
  const queryClient = useQueryClient();
  const { data: tasks = [], isLoading, error, refetch } = useQuery({ queryKey: ["assignments"], queryFn: getTasks });
  const { data: content } = useQuery({ queryKey: ["mentor-content"], queryFn: getMentorContent });
  const createMutation = useMutation({ mutationFn: createTask, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["assignments"] }); setIsCreatorOpen(false); setForm({ title: "", programId: "", deadline: "" }); } });
  const submit = (event) => { event.preventDefault(); createMutation.mutate(form); };

  return <div className="space-y-6">
    <section className="rounded-[32px] bg-[linear-gradient(135deg,#0C2B4E,#1D546C)] px-6 py-7 text-white shadow-lg"><p className="text-xs uppercase tracking-[0.28em] text-white/65">Assignments</p><div className="mt-3 flex items-end justify-between gap-5"><div><h1 className="text-3xl font-semibold">Track learner work</h1><p className="mt-2 text-sm text-white/80">Assignments and submission counts come from the live backend.</p></div><button onClick={() => setIsCreatorOpen((open) => !open)} className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0C2B4E]">{isCreatorOpen ? "Close" : "+ Create assignment"}</button></div></section>
    {isCreatorOpen && <form onSubmit={submit} className="grid gap-3 rounded-[28px] bg-white p-6 shadow-sm md:grid-cols-3"><input required value={form.title} onChange={(event) => setForm((value) => ({ ...value, title: event.target.value }))} placeholder="Assignment title" className="rounded-xl border border-slate-200 px-3 py-2" /><select required value={form.programId} onChange={(event) => setForm((value) => ({ ...value, programId: event.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2"><option value="">Select program</option>{(content?.programs ?? []).map((program) => <option key={program.id} value={program.id}>{program.title}</option>)}</select><input type="date" value={form.deadline} onChange={(event) => setForm((value) => ({ ...value, deadline: event.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2" /><button disabled={createMutation.isPending} className="rounded-xl bg-[#0C2B4E] px-4 py-2 text-white disabled:opacity-60">{createMutation.isPending ? "Creating…" : "Save assignment"}</button>{createMutation.error && <p className="text-sm text-rose-600">{createMutation.error.response?.data?.message || "Unable to create assignment."}</p>}</form>}
    {isLoading ? <p className="rounded-2xl bg-white p-6 text-slate-500">Loading assignments…</p> : error ? <div className="rounded-2xl bg-rose-50 p-6 text-rose-700">Unable to load assignments. <button onClick={() => refetch()} className="font-semibold underline">Try again</button></div> : tasks.length ? <div className="grid gap-5 xl:grid-cols-2">{tasks.map((task) => <article key={task.id} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold text-slate-900">{task.title}</h2><p className="mt-1 text-sm text-slate-500">{task.course}</p><div className="mt-5 grid grid-cols-2 gap-4"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Deadline</p><p className="mt-2 font-semibold">{task.deadline}</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Submissions</p><p className="mt-2 font-semibold">{task.submissions}</p></div></div></article>)}</div> : <p className="rounded-2xl bg-white p-8 text-center text-slate-500">No assignments yet.</p>}
  </div>;
}

export default Tasks;
