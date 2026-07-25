import { z } from "zod";

export const selectRoleSchema = z.object({
  role: z.enum(["admin", "student"]),
});
