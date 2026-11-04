import api from "./axios";

export const getMessagePrograms = () => api.get("/api/messages/programs").then(({ data }) => data);
export const getProgramMessages = (programId, params) => api.get(`/api/messages/programs/${programId}`, { params }).then(({ data }) => data);
export const createAnnouncement = (programId, payload) => api.post(`/api/messages/programs/${programId}/announcements`, payload).then(({ data }) => data);
export const createQuestion = (programId, payload) => api.post(`/api/messages/programs/${programId}/questions`, payload).then(({ data }) => data);
export const createReply = (programId, messageId, body) => api.post(`/api/messages/programs/${programId}/questions/${messageId}/replies`, { body }).then(({ data }) => data);
export const setQuestionResolved = (programId, messageId, isResolved) => api.patch(`/api/messages/programs/${programId}/questions/${messageId}/resolved`, { isResolved }).then(({ data }) => data);
