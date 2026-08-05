import api from "./axios";

export const createAssignment = (payload) => api.post("/api/assignments", payload).then(({ data }) => data);
export const getAssignments = (params) => api.get("/api/assignments", { params }).then(({ data }) => data);
export const getAssignmentSubmissions = (id) => api.get(`/api/assignments/${id}/submissions`).then(({ data }) => data);
