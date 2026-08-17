import { createAssignment, getAssignments } from "../api/assignments.api";

const normalizeTask = (assignment) => ({
  id: assignment.id,
  title: assignment.title,
  course: assignment.program?.title ?? "General",
  programId: assignment.programId,
  deadline: assignment.dueAt ? new Date(assignment.dueAt).toLocaleDateString() : "No deadline",
  status: assignment.status === "CLOSED" ? "Reviewed" : assignment.status === "DRAFT" ? "Pending" : "Submitted",
  submissions: assignment._count?.submissions ?? 0,
  reviewed: 0,
  priority: "Medium",
});

export async function getTasks() {
  const { assignments } = await getAssignments();
  return assignments.map(normalizeTask);
}

export async function createTask({ title, programId, deadline }) {
  const { assignment } = await createAssignment({ title, programId, dueDate: deadline || null });
  return normalizeTask(assignment);
}
