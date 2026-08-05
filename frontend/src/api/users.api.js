import api from "./axios";

export const getDashboardStats = () => api.get("/api/users/me/dashboard").then(({ data }) => data);
