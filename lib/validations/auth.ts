import { z } from "zod";

export const studentRegisterSchema = z.object({
  name: z.string().min(2).max(100),

  email: z
    .string()
    .email()
    .endsWith("@iitbhilai.ac.in"),

  studentId: z.string().min(3).max(30),

  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),

  password: z.string().min(8),
});
