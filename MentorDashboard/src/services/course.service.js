import courses from "../data/Courses/CourseData";

export const getCourses = async () => {
  return Promise.resolve(courses);
};