import * as z from "zod";

export const amazonVideosEnvSchema = z.object({
  SERPAPI_API_KEY: z
    .string({ error: "SERPAPI_API_KEY is required for Amazon product videos" })
    .optional(),
});
