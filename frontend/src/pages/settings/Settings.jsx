import { useState } from "react";

const notificationOptions = [
  {
    id: "session_reminders",
    title: "Session reminders",
    description: "Get nudges before each live session starts.",
  },
  {
    id: "support_messages",
    title: "Support messages",
    description: "Stay updated when cohort support threads and mentor inbox requests need attention.",
  },
  {
    id: "weekly_digest",
    title: "Weekly digest",
    description: "Receive a compact summary of engagement and course movement.",
  },
];

function Settings() {
  const [toggles, setToggles] = useState({
    session_reminders: true,
    support_messages: true,
    weekly_digest: false,
  });

  function handleToggle(id) {
    setToggles((current) => ({
      ...current,
      [id]: !current[id],
    }));
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.18),_transparent_25%),linear-gradient(135deg,#0C2B4E,#1D546C)] px-6 py-7 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.28em] text-white/65">Profile & Settings</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Shape your mentor workspace</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              This page is frontend-only for now, which makes it a good place to practice form design, preference panels, and account UX before you wire backend persistence.
            </p>
          </div>
          <button className="rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-[#0C2B4E] transition hover:bg-slate-100">
            Save Changes
          </button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Public profile</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Display name</span>
              <input
                defaultValue="Parth Pandey"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Role</span>
              <input
                defaultValue="Mentor"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Bio</span>
              <textarea
                rows={4}
                defaultValue="Frontend-focused mentor building scalable cohort experiences through structured tasks, live sessions, and clear support systems."
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#1D546C] focus:ring-4 focus:ring-[#1D546C]/10"
              />
            </label>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Notification preferences</h2>
          <div className="mt-6 space-y-4">
            {notificationOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-100 bg-slate-50/70 px-4 py-4"
              >
                <div>
                  <p className="font-medium text-slate-900">{option.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle(option.id)}
                  className={`relative h-7 w-12 rounded-full transition ${
                    toggles[option.id] ? "bg-[#1D546C]" : "bg-slate-200"
                  }`}
                  aria-pressed={toggles[option.id]}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      toggles[option.id] ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Settings;

