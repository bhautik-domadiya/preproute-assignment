import { z } from "zod";

const integerInRange = (
  label: string,
  min: number,
  max: number,
  requiredMessage: string
) =>
  z.coerce
    .number({
      message: requiredMessage,
    })
    .refine((n) => Number.isFinite(n) && Number.isInteger(n), {
      message: `${label} must be a whole number`,
    })
    .min(min, `${label} must be between ${min} and ${max}`)
    .max(max, `${label} must be between ${min} and ${max}`);

export const testSchema = z.object({
  name: z.string().min(1, "Test name is required"),
  subject: z
    .string({ message: "Subject name is required" })
    .min(1, "Subject name is required"),
  type: z.string().min(1, "Test type is required"),
  topics: z.array(z.string()).min(1, "Select at least one topic"),
  sub_topics: z.array(z.string()),
  difficulty: z.enum(["easy", "medium", "hard"], {
    message: "Difficulty is required",
  }),

  correct_marks: integerInRange(
    "Correct answer marks",
    0,
    10,
    "Correct marks is required"
  ),
  wrong_marks: integerInRange(
    "Wrong answer marks",
    0,
    10,
    "Wrong marks is required"
  ),
  unattempt_marks: integerInRange(
    "Unattempted marks",
    0,
    10,
    "Unattempt marks is required"
  ),
  total_time: z.coerce
    .number({ message: "Duration is required" })
    .refine((n) => Number.isFinite(n) && Number.isInteger(n), {
      message: "Duration must be a whole number",
    })
    .min(1, "Duration must be between 1 and 180 minutes.")
    .max(180, "Duration must be between 1 and 180 minutes."),
  total_marks: integerInRange(
    "Total marks",
    1,
    250,
    "Total marks is required"
  ),
  total_questions: integerInRange(
    "Number of questions",
    1,
    100,
    "Total questions is required"
  ),
});

export type TestFormData = z.infer<typeof testSchema>;
