import { useQuery } from "@tanstack/react-query";
import { getMyAssignments } from "../api/assignments.api";

export const myAssignmentsQueryKey = ["my-assignments"];

export function useMyAssignments() {
  return useQuery({
    queryKey: myAssignmentsQueryKey,
    queryFn: async () => (await getMyAssignments()).assignments,
  });
}
