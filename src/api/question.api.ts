import { api } from "./axios";
import type {
  BulkQuestionCreatePayload,
  Question,
  QuestionsResponse,
} from "@/types/question";

export async function bulkSubmitQuestions(
  questions: BulkQuestionCreatePayload[]
) {
  const { data } = await api.post<{ success: boolean; data: Question[] }>(
    "/questions/bulk",
    { questions }
  );
  return data.data;
}

export async function fetchBulkQuestions(questionIds: string[]) {
  if (!questionIds || questionIds.length === 0) return [];
  const { data } = await api.post<QuestionsResponse>(
    "/questions/fetchBulk",
    { question_ids: questionIds }
  );
  return data.data;
}
