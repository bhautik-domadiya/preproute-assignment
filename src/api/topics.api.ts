import { api } from "./axios";
import type { Topic } from "@/types/master";

export async function getTopics(subjectId: string) {
  const { data } = await api.get(
    `/topics/subject/${subjectId}`
  );

  return data.data as Topic[];
}