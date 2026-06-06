import { useState } from "react";

function buildInitialForm() {
  const nextHour = new Date();
  nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);

  return {
    topic: "",
    course: "DSA Mastery",
    date: nextHour.toISOString().slice(0, 10),
    time: `${String(nextHour.getHours()).padStart(2, "0")}:00`,
    durationMin: 60,
    attendees: 12,
  };
}

function SessionComposerModal({ onClose, onCreate }) {
  const [form, setForm] = useState(buildInitialForm);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "durationMin" || name === "attendees" ? Number(value) : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const datetime = new Date(`${form.date}T${form.time}:00`);

    onCreate({
      topic: form.topic,
      course: form.course,
      datetime: datetime.toISOString(),
      durationMin: form.durationMin,
      attendees: form.attendees,
      status: "upcoming",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6">
      <div className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 bg-[linear-gradient(135deg,#0c2b4e,#1d546c)] px-6 py-5 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/70">
              Session Planning
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Schedule a new live session</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-3 py-1 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Topic</span>
              <input
                required
                name="topic"
                value={form.topic}
                onChange={handleChange}
                placeholder="Enter the session topic"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Course</span>
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
              >
                <option>DSA Mastery</option>
                <option>System Design Fundamentals</option>
                <option>Frontend Interview Prep</option>
                <option>Backend with Node.js</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Duration</span>
              <select
                name="durationMin"
                value={form.durationMin}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
              >
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Date</span>
              <input
                required
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Start time</span>
              <input
                required
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Expected attendees</span>
              <input
                min={1}
                type="number"
                name="attendees"
                value={form.attendees}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
              />
            </label>
          </div>

          <div className="rounded-3xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
            This session will be stored locally in your browser so you can keep iterating on the frontend workflow without needing a backend yet.
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-[#0C2B4E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#143D6B]"
            >
              Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SessionComposerModal;
