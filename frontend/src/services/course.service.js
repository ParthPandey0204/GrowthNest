import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  archiveCourse,
  createCourse,
  getCourse,
  getCourses,
  updateCourse,
} from "../api/courses.api";

export const coursesQueryKey = ["courses"];
const PAGE_SIZE = 10;

function normalizeCourse(course) {
  return {
    ...course,
    status: course.status?.toLowerCase(),
    learners: course._count?.enrollments ?? course.learners ?? 0,
    avgProgress: course.avgProgress ?? 0,
  };
}

export async function fetchCourses({ pageParam = 1 } = {}) {
  const response = await getCourses({ page: pageParam, limit: PAGE_SIZE });

  return {
    courses: response.programs.map(normalizeCourse),
    pagination: response.pagination,
  };
}

export function useCourses() {
  return useQuery({
    queryKey: coursesQueryKey,
    queryFn: () => fetchCourses(),
  });
}

export function useInfiniteCourses() {
  return useInfiniteQuery({
    queryKey: [...coursesQueryKey, "infinite"],
    queryFn: fetchCourses,
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? Number(lastPage.pagination.page) + 1
        : undefined,
  });
}

export function useCourse(courseId) {
  return useQuery({
    queryKey: [...coursesQueryKey, courseId],
    queryFn: async () => normalizeCourse((await getCourse(courseId)).program),
    enabled: Boolean(courseId),
  });
}

function useCourseMutation(mutationFn) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: coursesQueryKey }),
  });
}

export function useCreateCourse() {
  return useCourseMutation(createCourse);
}

export function useUpdateCourse() {
  return useCourseMutation(({ id, payload }) => updateCourse(id, payload));
}

export function useDeleteCourse() {
  return useCourseMutation(archiveCourse);
}
