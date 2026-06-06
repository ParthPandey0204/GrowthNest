import { useMemo, useState } from "react";
import students from "../../data/students/StudentData";
import taskSeed from "../../data/tasks/TaskData";
import useLocalStorageState from "../../hooks/useLocalStorageState";

const statusClasses = {
  "On Track": "bg-emerald-50 text-emerald-700",
  "Needs Support": "bg-amber-50 text-amber-700",
  Ahead: "bg-sky-50 text-sky-700",
  "At Risk": "bg-rose-50 text-rose-700",
};

function Students() {
  const [query, setQuery] = useState("");
  const [taskSelections, setTaskSelections] = useState({});
  const [assignments, setAssignments] = useLocalStorageState(
    "growthnest.studentAssignments",
    {}
  );

  const filteredStudents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return students;
    }

    return students.filter((student) =>
      [student.name, student.track, student.status].some((value) =>
        value.toLowerCase().includes(normalized)
      )
    );
  }, [query]);

  function handleAssign(studentId) {
    const taskId = taskSelections[studentId];
    if (!taskId) {
      return;
    }

    setAssignments((current) => {
      const nextAssignments = current[studentId] ?? [];
      if (nextAssignments.includes(taskId)) {
        return current;
      }

      return {
        ...current,
        [studentId]: [...nextAssignments, taskId],
      };
    });
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_26%),linear-gradient(135deg,#0C2B4E,#1D546C)] px-6 py-7 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.28em] text-white/65">Students</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Mentor your learners directly</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Manage enrolled students, follow progress signals, and assign work manually so GrowthNest feels like a real mentoring LMS.
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80">
            {students.length} active learners
          </div>
        </div>
      </section>

      <div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search learners by name, course, or status"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {filteredStudents.map((student) => {
          const assignedTasks = (assignments[student.id] ?? [])
            .map((taskId) => taskSeed.find((task) => task.id === taskId))
            .filter(Boolean);

          return (
            <div key={student.id} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{student.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{student.track}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[student.status]}`}>
                  {student.status}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">Progress</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{student.progress}%</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">Learning streak</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{student.streak}d</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">Last seen</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{student.lastSeen}</p>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Completion curve</span>
                  <span className="font-semibold text-slate-900">{student.progress}%</span>
                </div>
                <div className="mt-3 h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-[linear-gradient(90deg,#0C2B4E,#1D546C)]"
                    style={{ width: `${student.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-slate-100 bg-slate-50/70 px-4 py-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <select
                    value={taskSelections[student.id] ?? ""}
                    onChange={(event) =>
                      setTaskSelections((current) => ({
                        ...current,
                        [student.id]: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
                  >
                    <option value="">Assign a task manually</option>
                    {taskSeed.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleAssign(student.id)}
                    className="rounded-2xl bg-[#0C2B4E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#143D6B]"
                  >
                    Assign
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {assignedTasks.length > 0 ? (
                    assignedTasks.map((task) => (
                      <span
                        key={task.id}
                        className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
                      >
                        {task.title}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No manual tasks assigned yet.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Students;
