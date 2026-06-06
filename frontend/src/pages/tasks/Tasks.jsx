import { startTransition, useEffect, useMemo, useState } from "react";
import useLocalStorageState from "../../hooks/useLocalStorageState";
import { createTask, getTasks, updateTaskStatus } from "../../services/task.service";

const statusOptions = ["Pending", "Submitted", "Reviewed"];
const priorityClasses = {
  High: "bg-rose-50 text-rose-700",
  Medium: "bg-amber-50 text-amber-700",
  Low: "bg-emerald-50 text-emerald-700",
};

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [activeStatus, setActiveStatus] = useLocalStorageState("growthnest.tasks.filter", "All");
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    course: "DSA Mastery",
    deadline: "2026-04-08",
    priority: "Medium",
  });

  useEffect(() => {
    async function loadTasks() {
      const data = await getTasks();
      setTasks(data);
    }

    loadTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    if (activeStatus === "All") {
      return tasks;
    }
    return tasks.filter((task) => task.status === activeStatus);
  }, [activeStatus, tasks]);

  async function handleCreateTask(event) {
    event.preventDefault();
    const nextTask = await createTask({ ...form, status: "Pending" });

    startTransition(() => {
      setTasks((current) => [nextTask, ...current]);
      setIsCreatorOpen(false);
      setForm({
        title: "",
        course: "DSA Mastery",
        deadline: "2026-04-08",
        priority: "Medium",
      });
    });
  }

  async function handleStatusChange(taskId, status) {
    const nextTasks = await updateTaskStatus(taskId, status);
    setTasks(nextTasks);
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_25%),linear-gradient(135deg,#0C2B4E,#1D546C)] px-6 py-7 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.28em] text-white/65">Assignments</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Track the work, not just the sessions</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Create assignments, manage deadlines, and follow submission state so GrowthNest becomes more than a course dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreatorOpen((current) => !current)}
            className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0C2B4E] transition hover:bg-slate-100"
          >
            {isCreatorOpen ? "Close creator" : "+ Create Assignment"}
          </button>
        </div>
      </section>

      {isCreatorOpen && (
        <form onSubmit={handleCreateTask} className="grid gap-4 rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm md:grid-cols-2 xl:grid-cols-4">
          <input
            required
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Assignment title"
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10 xl:col-span-2"
          />
          <select
            value={form.course}
            onChange={(event) => setForm((current) => ({ ...current, course: event.target.value }))}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
          >
            <option>DSA Mastery</option>
            <option>Frontend Interview Prep</option>
            <option>System Design Fundamentals</option>
            <option>Backend with Node.js</option>
          </select>
          <input
            type="date"
            value={form.deadline}
            onChange={(event) => setForm((current) => ({ ...current, deadline: event.target.value }))}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
          />
          <select
            value={form.priority}
            onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button className="rounded-2xl bg-[#0C2B4E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#143D6B] xl:col-span-1">
            Save Assignment
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {["All", ...statusOptions].map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeStatus === status
                ? "bg-[#1D546C] text-white"
                : "bg-white text-slate-600 shadow-sm hover:bg-slate-100"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {filteredTasks.map((task) => (
          <div key={task.id} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{task.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{task.course}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClasses[task.priority]}`}>
                {task.priority}
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-500">Deadline</p>
                <p className="mt-2 font-semibold text-slate-900">{task.deadline}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-500">Submitted</p>
                <p className="mt-2 font-semibold text-slate-900">{task.submissions}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-500">Reviewed</p>
                <p className="mt-2 font-semibold text-slate-900">{task.reviewed}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                Current status: {task.status}
              </span>
              <select
                value={task.status}
                onChange={(event) => handleStatusChange(task.id, event.target.value)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
              >
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;
