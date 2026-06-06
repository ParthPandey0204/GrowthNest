import courses from "../data/courses/CourseData";

export const getCourses = async () => {
  return Promise.resolve(courses);
};

export const getCourseById = async (courseId) => {
  const course = courses.find((item) => item.id === courseId) ?? null;
  return Promise.resolve(course);
};
