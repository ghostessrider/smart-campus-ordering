import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(2).max(100),

  peripherals: z.array(z.string()),

  imageUrl: z.string().url(),

  price: z.number().positive(),

  prepTime: z.number().min(1).max(180),

  availability: z.boolean(),
});
