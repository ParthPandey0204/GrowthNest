import api from "./axios";

export const getUsers = (params) => api.get("/api/admin/users", { params }).then(({ data }) => data);
export const changeUserRole = (id, payload) => api.patch(`/api/admin/users/${id}/role`, payload).then(({ data }) => data);
export const approveMentor = (id) => api.patch(`/api/admin/mentors/${id}/approve`).then(({ data }) => data);
