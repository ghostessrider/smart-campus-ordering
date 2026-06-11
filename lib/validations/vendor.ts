import { z } from "zod";

export const storeSchema = z.object({
  storeName: z.string().min(2).max(100),

  relativeLocation: z.string().min(2).max(200),

  phoneNumber: z.string().min(10).max(15),
});
