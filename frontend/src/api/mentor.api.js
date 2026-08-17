import api from "./axios";

export const getMentorStats = () => api.get("/api/mentor/stats").then(({ data }) => data);
export const getMentorContent = () => api.get("/api/mentor/content").then(({ data }) => data);
export const getMentorStudents = () => api.get("/api/mentor/students").then(({ data }) => data);
