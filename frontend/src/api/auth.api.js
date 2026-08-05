import api from "./axios";

export const register = (payload) => api.post("/api/auth/register", payload).then(({ data }) => data);
export const login = (payload) => api.post("/api/auth/login", payload).then(({ data }) => data);
export const getCurrentUser = () => api.get("/api/auth/me").then(({ data }) => data);
