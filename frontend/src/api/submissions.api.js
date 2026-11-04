import api from "./axios";

export const createSubmission = ({ formData, payload, onUploadProgress }) => (formData
  ? api.post("/api/upload/assignment", formData, { headers: { "Content-Type": "multipart/form-data" }, onUploadProgress })
  : api.post("/api/submissions", payload)).then(({ data }) => data);
export const getAssignmentSubmissions = (id) => api.get(`/api/assignments/${id}/submissions`).then(({ data }) => data);
export const getMySubmissions = () => api.get("/api/submissions/me").then(({ data }) => data);
export const reviewSubmission = (id, payload) => api.patch(`/api/submissions/${id}/review`, payload).then(({ data }) => data);
