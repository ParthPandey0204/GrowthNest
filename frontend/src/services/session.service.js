import seedSessions from "../data/sessions/SessionData";

const STORAGE_KEY = "growthnest.sessions";

function delay(ms = 200) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function readSessions() {
  if (typeof window === "undefined") {
    return seedSessions;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (!storedValue) {
    return seedSessions;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return seedSessions;
  }
}

function persistSessions(sessions) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }
}

export async function getSessions() {
  await delay();
  return readSessions();
}

export async function createSession(sessionInput) {
  await delay(150);

  const nextSession = {
    id: `session_${Date.now()}`,
    ...sessionInput,
  };

  const sessions = [nextSession, ...readSessions()];
  persistSessions(sessions);

  return nextSession;
}
