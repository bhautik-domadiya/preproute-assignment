import { getSubTopics } from "@/api/subTopics.api";
import { filterValidUuids } from "@/utils/masterData";
import { useQuery } from "@tanstack/react-query";

export function useSubTopics(topicIds: string[]) {
  const validTopicIds = filterValidUuids(topicIds);

  return useQuery({
    queryKey: ["subtopics", validTopicIds],
    queryFn: () => getSubTopics(validTopicIds),
    enabled: validTopicIds.length > 0,
  });
}
