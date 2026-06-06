import seedThreads from "../data/messages/MessageData";

const STORAGE_KEY = "growthnest.messages";

function delay(ms = 180) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function readThreads() {
  if (typeof window === "undefined") {
    return seedThreads;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (!storedValue) {
    return seedThreads;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return seedThreads;
  }
}

function persistThreads(threads) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  }
}

export async function getMessageThreads() {
  await delay();
  return readThreads();
}

export async function sendMessage(threadId, text) {
  await delay(120);

  const threads = readThreads().map((thread) => {
    if (thread.id !== threadId) {
      return thread;
    }

    const nextMessage = {
      id: `msg_${Date.now()}`,
      sender: "You",
      type: "sent",
      time: "Now",
      text,
    };

    return {
      ...thread,
      lastActive: "Now",
      unreadCount: 0,
      messages: [...thread.messages, nextMessage],
    };
  });

  persistThreads(threads);

  return threads;
}
