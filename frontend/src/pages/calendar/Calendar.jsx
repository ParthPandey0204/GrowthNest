import { useEffect, useMemo, useState } from "react";
import taskSeed from "../../data/tasks/TaskData";
import { getSessions } from "../../services/session.service";

function Calendar() {
  const [mode, setMode] = useState("Week");
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function loadSessions() {
      const data = await getSessions();
      setSessions(data);
    }

    loadSessions();
  }, []);

  const timelineItems = useMemo(() => {
    const sessionItems = sessions.map((session) => ({
      id: session.id,
      title: session.topic,
      subtitle: session.course,
      date: session.datetime.slice(0, 10),
      type: "Session",
    }));

    const taskItems = taskSeed.map((task) => ({
      id: task.id,
      title: task.title,
      subtitle: task.course,
      date: task.deadline,
      type: "Deadline",
    }));

    return [...sessionItems, ...taskItems].sort((a, b) => a.date.localeCompare(b.date));
  }, [sessions]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_24%),linear-gradient(135deg,#0C2B4E,#1D546C)] px-6 py-7 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.28em] text-white/65">Calendar</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">See the whole learning rhythm</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Blend live sessions and assignment deadlines into a single schedule view so the platform feels coordinated and recruiter-ready.
            </p>
          </div>
          <div className="flex gap-2 rounded-2xl bg-white/10 p-1.5">
            {["Week", "Month"].map((item) => (
              <button
                key={item}
                onClick={() => setMode(item)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  mode === item ? "bg-white text-[#0C2B4E]" : "text-white/75"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-7 gap-3 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {mode === "Week"
              ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="rounded-2xl bg-slate-50 px-2 py-3">{day}</div>
                ))
              : Array.from({ length: 28 }, (_, index) => index + 1).map((day) => (
                  <div key={day} className="rounded-2xl bg-slate-50 px-2 py-3">{day}</div>
                ))}
          </div>

          <div className="mt-6 space-y-4">
            {timelineItems.slice(0, mode === "Week" ? 6 : 10).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-[24px] border border-slate-100 bg-slate-50/70 px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.type === "Session" ? "bg-sky-50 text-sky-700" : "bg-amber-50 text-amber-700"}`}>
                    {item.type}
                  </span>
                  <p className="mt-2 text-sm text-slate-500">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Upcoming reminders</h2>
            <div className="mt-5 space-y-3">
              {timelineItems.slice(0, 4).map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.date}</p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default Calendar;
