import { useState } from "react";

const localDateTime = (value) => {
  const date = value ? new Date(value) : new Date(Date.now() + 60 * 60 * 1000);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

function SessionComposerModal({ onClose, onSubmit, programs = [], session, isSaving = false, error }) {
  const [form, setForm] = useState(() => ({
    title: session?.title ?? "",
    programId: session?.programId ?? "",
    scheduledAt: localDateTime(session?.startsAt),
    duration: session?.endsAt ? Math.max(1, Math.round((new Date(session.endsAt) - new Date(session.startsAt)) / 60000)) : 60,
    meetLink: session?.meetingUrl ?? "",
  }));

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({ ...form, scheduledAt: new Date(form.scheduledAt).toISOString(), duration: Number(form.duration), programId: form.programId || undefined, meetLink: form.meetLink || undefined });
  };

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section role="dialog" aria-modal="true" aria-labelledby="session-form-title" className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
      <header className="flex items-start justify-between bg-[linear-gradient(135deg,#0c2b4e,#1d546c)] px-6 py-5 text-white"><div><p className="text-xs uppercase tracking-[0.2em] text-white/70">Mentor calendar</p><h2 id="session-form-title" className="mt-1 text-2xl font-semibold">{session ? "Edit session" : "Schedule a session"}</h2></div><button type="button" onClick={onClose} className="rounded-full border border-white/25 px-3 py-1 text-sm">Close</button></header>
      <form onSubmit={submit} className="space-y-5 p-6">
        <label className="block text-sm font-medium text-slate-700">Session title<input required maxLength={200} name="title" value={form.title} onChange={update} placeholder="e.g. System design office hours" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Program (optional)<select name="programId" value={form.programId} onChange={update} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3"><option value="">General session</option>{programs.map((program) => <option key={program.id} value={program.id}>{program.title}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Duration<select name="duration" value={form.duration} onChange={update} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3">{[30, 45, 60, 90, 120].map((minutes) => <option key={minutes} value={minutes}>{minutes} minutes</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Date and time<input required type="datetime-local" name="scheduledAt" value={form.scheduledAt} onChange={update} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
          <label className="text-sm font-medium text-slate-700">Meeting link<input required type="url" name="meetLink" value={form.meetLink} onChange={update} placeholder="https://meet.google.com/..." className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3" /></label>
        </div>
        {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
        <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm">Cancel</button><button disabled={isSaving} className="rounded-xl bg-[#0C2B4E] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Saving…" : session ? "Save changes" : "Schedule session"}</button></div>
      </form>
    </section>
  </div>;
}

export default SessionComposerModal;
