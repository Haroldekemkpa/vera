import { z } from "zod";

export const searchInputSchema = z.object({
  query: z.string().trim().min(1),
  searchDepth: z.enum(["basic", "advanced"]).default("basic"),
  topic: z.enum(["general", "news"]).default("general"),
  maxResults: z.coerce.number().int().min(1).max(20).default(5),
  includeAnswer: z.coerce.boolean().default(true),
  includeRawContent: z.coerce.boolean().default(false),
  includeImages: z.coerce.boolean().default(false),
  days: z.coerce.number().int().min(1).max(30).optional(),
});
