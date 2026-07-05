export interface SelectOption {
  value: string;
  label: string;
}

export const TEST_TYPE_OPTIONS: SelectOption[] = [
  { value: "chapterwise", label: "Chapter Wise" },
  { value: "mock", label: "Mock Test" },
];

export const DIFFICULTY_OPTIONS: SelectOption[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];
