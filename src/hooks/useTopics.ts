import { getTopics } from "@/api/topics.api";
import { useQuery } from "@tanstack/react-query";

export function useTopics(subjectId?: string) {
  return useQuery({
    queryKey: ["topics", subjectId],
    queryFn: () => getTopics(subjectId!),
    enabled: !!subjectId,
  });
}
