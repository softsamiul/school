import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("api"),
});

export const readyResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.literal("api"),
  checks: z.object({ database: z.literal("ok") }),
});
