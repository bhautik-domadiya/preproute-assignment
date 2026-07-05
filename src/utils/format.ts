import { TEST_TYPE_OPTIONS } from "@/constants/testForm.constants";

export function formatTestType(type?: string): string {
  if (!type) return "—";
  return TEST_TYPE_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

export function formatDifficulty(value?: string): string {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatTopics(topics?: string[]): string {
  return topics?.length ? topics.join(", ") : "—";
}
