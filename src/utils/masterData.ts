import type { SubTopic, Topic } from "@/types/master";

export function resolveSubjectId(
  subjectValue: string | undefined,
  subjects: { id: string; name: string }[]
): string {
  if (!subjectValue) return "";
  return subjects.find((s) => s.name === subjectValue || s.id === subjectValue)?.id ?? subjectValue;
}

export function resolveTopicIds(
  topicValues: string[] | undefined,
  topics: Topic[]
): string[] {
  if (!topicValues?.length || !topics.length) return topicValues ?? [];

  return topicValues
    .map((value) => topics.find((t) => t.name === value || t.id === value)?.id ?? value)
    .filter(Boolean);
}

export function resolveSubTopicIds(
  subTopicValues: string[] | undefined,
  subTopics: SubTopic[]
): string[] {
  if (!subTopicValues?.length || !subTopics.length) return subTopicValues ?? [];

  return subTopicValues
    .map(
      (value) => subTopics.find((st) => st.name === value || st.id === value)?.id ?? value
    )
    .filter(Boolean);
}

export function resolveTopicId(topicValue: string | undefined, topics: Topic[]): string {
  if (!topicValue) return "";
  return topics.find((t) => t.name === topicValue || t.id === topicValue)?.id ?? topicValue;
}

export function resolveSubTopicId(
  subTopicValue: string | undefined,
  subTopics: SubTopic[]
): string {
  if (!subTopicValue) return "";
  return (
    subTopics.find((st) => st.name === subTopicValue || st.id === subTopicValue)?.id ??
    subTopicValue
  );
}
