import { getSubTopics } from "@/api/subTopics.api";
import { useQuery } from "@tanstack/react-query";

export function useSubTopics(topicIds: string[]) {
  return useQuery({
    queryKey: ["subtopics", topicIds],

    queryFn: () => getSubTopics(topicIds),

    enabled: topicIds.length > 0,
  });
}
