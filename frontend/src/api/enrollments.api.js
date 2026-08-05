import api from "./axios";

export const createEnrollment = (payload) => api.post("/api/enrollments", payload).then(({ data }) => data);
export const getMyEnrollments = () => api.get("/api/enrollments/me").then(({ data }) => data);
export const updateEnrollmentProgress = (id, payload) => api.patch(`/api/enrollments/${id}/progress`, payload).then(({ data }) => data);
