import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createEnrollment, getLessonProgress, getMyEnrollments, getProgressSummary, updateLessonProgress } from "../api/enrollments.api";

export const myEnrollmentsQueryKey = ["my-enrollments"];

export function useMyEnrollments() {
  return useQuery({
    queryKey: myEnrollmentsQueryKey,
    queryFn: async () => (await getMyEnrollments()).enrollments,
  });
}

export function useEnrollProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programId) => createEnrollment({ programId }),
    onMutate: async (programId) => {
      await queryClient.cancelQueries({ queryKey: myEnrollmentsQueryKey });
      const previousEnrollments = queryClient.getQueryData(myEnrollmentsQueryKey);
      queryClient.setQueryData(myEnrollmentsQueryKey, (current = []) => [
        ...current,
        { id: `optimistic-${programId}`, programId, progress: 0, status: "ACTIVE", isOptimistic: true },
      ]);
      return { previousEnrollments };
    },
    onError: (_error, _programId, context) => {
      queryClient.setQueryData(myEnrollmentsQueryKey, context?.previousEnrollments);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: myEnrollmentsQueryKey }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: myEnrollmentsQueryKey }),
  });
}

export function useUpdateLessonProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateLessonProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myEnrollmentsQueryKey });
      queryClient.invalidateQueries({ queryKey: ["lesson-progress"] });
    }
  });
}

export function useLessonProgress(programId) {
  return useQuery({
    queryKey: ["lesson-progress", programId],
    queryFn: async () => (await getLessonProgress(programId)).lessonProgress,
    enabled: Boolean(programId),
  });
}

export function useStudentProgressSummary() {
  return useQuery({ queryKey: ["student-progress-summary"], queryFn: getProgressSummary });
}
