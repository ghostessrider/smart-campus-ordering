import { z } from "zod";

export const createOrderSchema = z.object({
  vendorId: z.string(),

  itemId: z.string(),

  quantity: z.number().min(1).max(20),
});
