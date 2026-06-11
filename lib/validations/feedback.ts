import { z } from "zod";

export const feedbackSchema = z.object({
  comment: z
    .string()
    .min(5)
    .max(300),
});
