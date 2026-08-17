import api from "./axios";

export const getUsers = (params) => api.get("/api/admin/users", { params }).then(({ data }) => data);
export const changeUserRole = (id, payload) => api.patch(`/api/admin/users/${id}/role`, payload).then(({ data }) => data);
export const approveMentor = (id) => api.patch(`/api/admin/mentors/${id}/approve`).then(({ data }) => data);
export const toggleUserStatus = (id, payload) => api.patch(`/api/admin/users/${id}/status`, payload).then(({ data }) => data);

export const getAdminStats = () => api.get("/api/admin/analytics/dashboard").then(({ data }) => data);
export const getActivityLogs = () => api.get("/api/admin/analytics/activity").then(({ data }) => data);
export const getAdminPrograms = (params) => api.get("/api/admin/programs", { params }).then(({ data }) => data);
export const updateAdminProgramStatus = (id, status) => api.patch(`/api/admin/programs/${id}/status`, { status }).then(({ data }) => data);
