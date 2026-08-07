import { useState } from "react";
import { useSessions } from "../../services/session.service";

/* ---------- Helpers ---------- */

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupByDate(sessions) {
  return sessions.reduce((acc, session) => {
    const dateKey = new Date(session.datetime).toDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(session);
    return acc;
  }, {});
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
        status === "upcoming"
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {status === "upcoming" ? "Upcoming" : "Completed"}
    </span>
  );
}

function EmptyState({ label }) {
  return (
    <div className="py-20 text-center">
      <p className="text-sm text-gray-500">
        No {label.toLowerCase()} sessions scheduled.
      </p>
    </div>
  );
}

/* ---------- Page ---------- */

function Sessions() {
  const [tab, setTab] = useState("upcoming");
  const { data: sessionsData = [], isLoading, error, refetch } = useSessions();

  const filteredSessions = sessionsData.filter(
    (s) => s.status === tab
  );

  const groupedSessions = groupByDate(filteredSessions);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">
        Loading sessions...
      </div>
    );
  }

  if (error) {
    return <div className="rounded-xl border border-rose-200 bg-rose-50 py-12 text-center text-sm text-rose-700">Unable to load sessions. <button onClick={() => refetch()} className="font-semibold underline">Try again</button></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Sessions
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your mentoring sessions
          </p>
        </div>

        <button className="rounded-lg bg-[#0C2B4E] px-4 py-2 text-sm font-medium text-white hover:bg-[#143D6B] transition">
          + Schedule Session
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {["upcoming", "completed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              tab === t
                ? "bg-[#1D546C] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t === "upcoming" ? "Upcoming" : "Completed"}
          </button>
        ))}
      </div>

      {/* Calendar / Agenda */}
      {filteredSessions.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white">
          <EmptyState label={tab} />
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSessions).map(
            ([dateKey, sessions]) => (
              <div key={dateKey}>
                {/* Date Header */}
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  {formatDate(sessions[0].datetime)}
                </h3>

                {/* Sessions for Date */}
                <div className="space-y-3">
                  {sessions.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-sm"
                    >
                      {/* Left */}
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {s.topic}
                        </span>
                        <span className="mt-0.5 text-xs text-gray-500">
                          {s.course} · {s.durationMin} min ·{" "}
                          {s.attendees} attendees
                        </span>
                      </div>

                      {/* Right */}
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">
                          {formatTime(s.datetime)}
                        </span>

                        <StatusBadge status={s.status} />

                        {s.status === "upcoming" ? (
                          <button className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 transition">
                            Join
                          </button>
                        ) : (
                          <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition">
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Sessions;
