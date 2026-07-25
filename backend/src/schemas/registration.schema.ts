import { z } from "zod";

export const registrationQuerySchema = z.object({
  status: z.enum(["Confirmed", "Pending"]).optional(),
});
