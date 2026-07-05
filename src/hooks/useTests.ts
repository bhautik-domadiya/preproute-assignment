import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTests, getTest, updateTest, deleteTest } from "@/api/tests.api";
import type { CreateTestPayload } from "@/types/test";

export function useTests() {
  return useQuery({
    queryKey: ["tests"],
    queryFn: getTests,
  });
}

export function useTest(id: string) {
  return useQuery({
    queryKey: ["test", id],
    queryFn: () => getTest(id),
    enabled: !!id,
  });
}

export function useUpdateTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateTestPayload> }) =>
      updateTest(id, payload),
    onSuccess(_, variables) {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      queryClient.invalidateQueries({ queryKey: ["test", variables.id] });
    },
  });
}

export function useDeleteTest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTest,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
}