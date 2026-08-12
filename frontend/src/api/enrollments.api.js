import api from "./axios";

export const createEnrollment = (payload) => api.post("/api/enrollments", payload).then(({ data }) => data);
export const getMyEnrollments = () => api.get("/api/enrollments/me").then(({ data }) => data);
export const updateEnrollmentProgress = (id, payload) => api.patch(`/api/enrollments/${id}/progress`, payload).then(({ data }) => data);
export const updateLessonProgress = (payload) => api.patch(`/api/enrollments/lesson-progress`, payload).then(({ data }) => data);
export const getLessonProgress = (programId) => api.get(`/api/enrollments/lesson-progress/${programId}`).then(({ data }) => data);
export const getProgressSummary = () => api.get("/api/enrollments/me/progress-summary").then(({ data }) => data);
