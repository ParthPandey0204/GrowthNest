import api from "./axios";

export const getMyNotifications = () => api.get("/api/notifications").then(({ data }) => data);
