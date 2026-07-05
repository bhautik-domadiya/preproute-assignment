import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBulkQuestions, bulkSubmitQuestions } from "@/api/question.api";
import type { BulkQuestionCreatePayload } from "@/types/question";

export function useQuestions(questionIds: string[]) {
  return useQuery({
    queryKey: ["questions", questionIds],
    queryFn: () => fetchBulkQuestions(questionIds),
    enabled: !!questionIds && questionIds.length > 0,
    placeholderData: (previousData) => previousData,
  });
}

export function useBulkSubmitQuestions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      questions,
    }: {
      testId: string;
      questions: BulkQuestionCreatePayload[];
    }) => bulkSubmitQuestions(questions),
    onSuccess(_, variables) {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      queryClient.invalidateQueries({ queryKey: ["test", variables.testId] });
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });
}
