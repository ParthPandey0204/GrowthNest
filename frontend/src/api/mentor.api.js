import api from "./axios";

export const getMentorStats = () => api.get("/api/mentor/stats").then(({ data }) => data);
