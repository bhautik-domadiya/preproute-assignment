import { api } from "./axios";
import type { SubTopic } from "@/types/master";

export async function getSubTopics(
  topicIds: string[]
) {
  const { data } = await api.post(
    "/sub-topics/multi-topics",
    {
      topicIds,
    }
  );

  return data.data as SubTopic[];
}