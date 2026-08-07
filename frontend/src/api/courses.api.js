import api from "./axios";

export const getCourses = (params) => api.get("/api/programs", { params }).then(({ data }) => data);
export const getCourse = (id) => api.get(`/api/programs/${id}`).then(({ data }) => data);
export const createCourse = (payload) => api.post("/api/programs", payload).then(({ data }) => data);
export const updateCourse = (id, payload) => api.put(`/api/programs/${id}`, payload).then(({ data }) => data);
export const archiveCourse = (id) => api.delete(`/api/programs/${id}`).then(({ data }) => data);
export const getCourseLessons = (id) => api.get(`/api/programs/${id}/lessons`).then(({ data }) => data);
export const createCourseLesson = (id, payload) => api.post(`/api/programs/${id}/lessons`, payload).then(({ data }) => data);
export const getCourseEnrollments = (id) => api.get(`/api/programs/${id}/enrollments`).then(({ data }) => data);
export const getCourseAnalytics = (id, range) => api.get(`/api/programs/${id}/analytics`, { params: { range } }).then(({ data }) => data);
