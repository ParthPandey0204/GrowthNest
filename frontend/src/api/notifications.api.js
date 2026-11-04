import api from "./axios";

export const getMyNotifications = () => api.get("/api/notifications").then(({ data }) => data);
export const markNotificationRead = (id) => api.patch(`/api/notifications/${id}/read`).then(({ data }) => data);
