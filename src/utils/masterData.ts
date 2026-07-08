import type { SubTopic, Topic } from "@/types/master";
import type { Question } from "@/types/question";

const CORRECT_OPTION_KEYS = ["option1", "option2", "option3", "option4"] as const;
export type CorrectOptionKey = (typeof CORRECT_OPTION_KEYS)[number];

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

export function filterValidUuids(ids: string[]): string[] {
  return ids.filter(isUuid);
}

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

export function resolveCorrectOption(
  correctOption: string | undefined,
  options: Pick<Question, "option1" | "option2" | "option3" | "option4">
): CorrectOptionKey {
  if (
    correctOption &&
    CORRECT_OPTION_KEYS.includes(correctOption as CorrectOptionKey)
  ) {
    return correctOption as CorrectOptionKey;
  }

  const match = CORRECT_OPTION_KEYS.find((key) => options[key] === correctOption);
  return match ?? "option1";
}
