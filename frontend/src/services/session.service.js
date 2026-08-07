import { useQuery } from "@tanstack/react-query";
import { getSessions as getSessionsRequest } from "../api/sessions.api";

const normalizeSession = (session) => ({
  ...session,
  datetime: session.startsAt,
  topic: session.title,
  course: session.program?.title ?? "General",
  durationMin: session.endsAt ? Math.round((new Date(session.endsAt) - new Date(session.startsAt)) / 60000) : 0,
  attendees: session.attendees?.length ?? 0,
  status: ["SCHEDULED", "LIVE"].includes(session.status) ? "upcoming" : "completed",
});

export const fetchSessions = async () => (await getSessionsRequest()).map(normalizeSession);

export function useSessions() {
  return useQuery({ queryKey: ["sessions"], queryFn: fetchSessions });
}
