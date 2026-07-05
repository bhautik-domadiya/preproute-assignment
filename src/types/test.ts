export type TestStatus =
  | "draft"
  | "live"
  | "scheduled"
  | "expired"
  | "unpublished";

export interface Test {
  id: string;
  name: string;
  subject: string;
  topics: string[];
  type?: string;
  status: TestStatus | null;
  created_at: string;
}

export interface TestsResponse {
  success: boolean;
  data: Test[];
}

export interface CreateTestPayload {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  difficulty: "easy" | "medium" | "hard";
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status: "draft" | "live" | "scheduled" | "expired" | "unpublished";
  questions?: string[];
}

export interface TestDetail extends CreateTestPayload {
  id: string;
  created_at: string;
}
