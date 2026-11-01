import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attendSession, createSession, deleteSession, updateSession } from "../../api/sessions.api";
import { getMyCourses } from "../../api/courses.api";
import { useSessions } from "../../services/session.service";
import { useAuth } from "../../store/AuthContext";
import SessionComposerModal from "../../components/sessions/SessionComposerModal";

function formatDate(value) { return new Date(value).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" }); }
function formatTime(value) { return new Date(value).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }); }

function Sessions() {
  const [tab, setTab] = useState("upcoming");
  const [editing, setEditing] = useState(null);
  const [formError, setFormError] = useState("");
  const { user } = useAuth();
  const isMentor = user?.role === "MENTOR";
  const queryClient = useQueryClient();
  const { data: sessions = [], isLoading, error, refetch } = useSessions();
  const { data: coursesResponse } = useQuery({ queryKey: ["mentor-courses", "sessions"], queryFn: () => getMyCourses({ page: 1, limit: 100 }), enabled: isMentor });
  const courses = coursesResponse?.programs ?? [];
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["sessions"] });
  const saveMutation = useMutation({ mutationFn: ({ id, payload }) => id ? updateSession(id, payload) : createSession(payload), onSuccess: () => { refresh(); setEditing(null); setFormError(""); }, onError: (err) => setFormError(err.response?.data?.message || "Unable to save this session.") });
  const statusMutation = useMutation({ mutationFn: ({ id, status }) => updateSession(id, { status }), onSuccess: refresh });
  const deleteMutation = useMutation({ mutationFn: deleteSession, onSuccess: refresh });
  const attendMutation = useMutation({ mutationFn: attendSession, onSuccess: refresh });
  const filtered = sessions.filter((session) => tab === "upcoming" ? ["SCHEDULED", "LIVE"].includes(session.status) : ["COMPLETED", "CANCELLED"].includes(session.status));
  const grouped = filtered.reduce((groups, session) => { const key = new Date(session.startsAt).toDateString(); (groups[key] ||= []).push(session); return groups; }, {});

  if (isLoading) return <div className="rounded-xl border bg-white py-20 text-center text-sm text-gray-500">Loading sessions…</div>;
  if (error) return <div className="rounded-xl border border-rose-200 bg-rose-50 py-12 text-center text-sm text-rose-700">Unable to load sessions. <button onClick={() => refetch()} className="font-semibold underline">Try again</button></div>;

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold text-gray-900">Sessions</h1><p className="mt-1 text-sm text-gray-500">{user?.role === "STUDENT" ? "View your learning sessions" : "Schedule and manage your mentoring sessions"}</p></div>{isMentor && <button onClick={() => { setFormError(""); setEditing({}); }} className="rounded-lg bg-[#0C2B4E] px-4 py-2 text-sm font-medium text-white hover:bg-[#143D6B]">+ Schedule Session</button>}</div>
    <div className="flex gap-2">{["upcoming", "completed"].map((value) => <button key={value} onClick={() => setTab(value)} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tab === value ? "bg-[#1D546C] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{value === "upcoming" ? "Upcoming" : "Past sessions"}</button>)}</div>
    {!filtered.length ? <div className="rounded-xl border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">No {tab === "upcoming" ? "upcoming" : "past"} sessions.</div> : <div className="space-y-6">{Object.entries(grouped).map(([date, items]) => <section key={date}><h2 className="mb-3 text-sm font-semibold text-gray-700">{formatDate(items[0].startsAt)}</h2><div className="space-y-3">{items.map((session) => <article key={session.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4"><div><h3 className="font-medium text-gray-900">{session.title}</h3><p className="mt-1 text-xs text-gray-500">{session.program?.title ?? "General session"} · {session.durationMin} min · {session.attendeeCount} attendee{session.attendeeCount === 1 ? "" : "s"}</p><p className="mt-1 text-xs text-gray-500">{formatTime(session.startsAt)}{session.mentor?.name && user?.role === "STUDENT" ? ` · ${session.mentor.name}` : ""}</p></div><div className="flex flex-wrap items-center gap-2">{session.status === "SCHEDULED" ? <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">Scheduled</span> : session.status === "LIVE" ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">Live</span> : <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">{session.status === "CANCELLED" ? "Cancelled" : "Completed"}</span>}{session.status !== "CANCELLED" && session.meetingUrl && <a href={session.meetingUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white">Open meeting</a>}{user?.role === "STUDENT" && ["SCHEDULED", "LIVE"].includes(session.status) && <button onClick={() => attendMutation.mutate(session.id)} disabled={attendMutation.isPending} className="rounded-lg border px-3 py-1.5 text-xs font-semibold">{attendMutation.isPending ? "Saving…" : "Mark attended"}</button>}{isMentor && ["SCHEDULED", "LIVE"].includes(session.status) && <><button onClick={() => { setFormError(""); setEditing(session); }} className="rounded-lg border px-3 py-1.5 text-xs font-semibold">Edit</button>{session.status === "SCHEDULED" ? <button onClick={() => statusMutation.mutate({ id: session.id, status: "LIVE" })} className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-emerald-700">Start</button> : <button onClick={() => statusMutation.mutate({ id: session.id, status: "COMPLETED" })} className="rounded-lg border px-3 py-1.5 text-xs font-semibold">Complete</button>}{session.status === "SCHEDULED" && <button onClick={() => statusMutation.mutate({ id: session.id, status: "CANCELLED" })} className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-rose-700">Cancel</button>}<button onClick={() => { if (window.confirm("Delete this session permanently?")) deleteMutation.mutate(session.id); }} className="px-2 py-1.5 text-xs font-semibold text-rose-700">Delete</button></>}</div></article>)}</div></section>)}</div>}
    {editing !== null && <SessionComposerModal session={editing.id ? editing : undefined} programs={courses} isSaving={saveMutation.isPending} error={formError} onClose={() => setEditing(null)} onSubmit={(payload) => saveMutation.mutate({ id: editing.id, payload })} />}
  </div>;
}

export default Sessions;
