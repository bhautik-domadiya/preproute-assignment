export interface Question {
  id?: string;
  test_id: string;
  subject?: string;
  type: "mcq";
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: "option1" | "option2" | "option3" | "option4";
  explanation?: string;
  difficulty: "easy" | "medium" | "hard";
  /** Topic UUID for API submission. */
  topic?: string;
  /** Sub-topic UUID for API submission. */
  sub_topic?: string;
  paragraph?: string;
  media_url?: string;
  category?: string;
}

/** Payload shape for POST /questions/bulk (matches API contract). */
export interface BulkQuestionCreatePayload {
  test_id: string;
  subject: string;
  type: "mcq";
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: "option1" | "option2" | "option3" | "option4";
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface QuestionsBulkPayload {
  questions: BulkQuestionCreatePayload[];
}

export interface QuestionsResponse {
  success: boolean;
  data: Question[];
}
