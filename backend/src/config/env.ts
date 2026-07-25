import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  CLIENT_URL: z.string().default("http://localhost:5173"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
});

export const env = envSchema.parse(process.env);
