import { z } from "zod";

export const eventQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
});
