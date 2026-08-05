import api from "./axios";

export const createSubmission = (formData) => api.post("/api/submissions", formData, { headers: { "Content-Type": "multipart/form-data" } }).then(({ data }) => data);
export const getMySubmissions = () => api.get("/api/submissions/me").then(({ data }) => data);
export const reviewSubmission = (id, payload) => api.patch(`/api/submissions/${id}/review`, payload).then(({ data }) => data);
