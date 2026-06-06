import seedTasks from "../data/tasks/TaskData";

const STORAGE_KEY = "growthnest.tasks";

function delay(ms = 140) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readTasks() {
  if (typeof window === "undefined") {
    return seedTasks;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (!storedValue) {
    return seedTasks;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return seedTasks;
  }
}

function persistTasks(tasks) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}

export async function getTasks() {
  await delay();
  return readTasks();
}

export async function createTask(taskInput) {
  await delay();

  const nextTask = {
    id: `task_${Date.now()}`,
    submissions: 0,
    reviewed: 0,
    ...taskInput,
  };

  const tasks = [nextTask, ...readTasks()];
  persistTasks(tasks);
  return nextTask;
}

export async function updateTaskStatus(taskId, status) {
  await delay(100);

  const tasks = readTasks().map((task) =>
    task.id === taskId ? { ...task, status } : task
  );

  persistTasks(tasks);
  return tasks;
}
