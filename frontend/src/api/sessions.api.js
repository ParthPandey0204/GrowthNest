import api from "./axios";

export const getSessions = (params) => api.get("/api/sessions", { params }).then(({ data }) => data);
export const createSession = (payload) => api.post("/api/sessions", payload).then(({ data }) => data);
export const updateSession = (id, payload) => api.put(`/api/sessions/${id}`, payload).then(({ data }) => data);
export const deleteSession = (id) => api.delete(`/api/sessions/${id}`).then(({ data }) => data);
export const attendSession = (id) => api.post(`/api/sessions/${id}/attend`).then(({ data }) => data);
