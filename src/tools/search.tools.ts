import { tool } from "langchain";
import { z } from "zod";

import { searchWeb } from "../integrations/search/search.service.js";
import { toToolResult } from "./toolResult.js";

export const searchWebTool = tool(
  (input) => toToolResult(() => searchWeb(input)),
  {
    name: "search_web",
    description: "Search the web using Tavily.",
    schema: z.object({
      query: z.string().trim().min(1),
      searchDepth: z.enum(["basic", "advanced"]).default("basic"),
      topic: z.enum(["general", "news"]).default("general"),
      maxResults: z.number().int().min(1).max(20).default(5),
      includeAnswer: z.boolean().default(true),
      includeRawContent: z.boolean().default(false),
      includeImages: z.boolean().default(false),
      days: z.number().int().min(1).max(30).optional(),
    }),
  },
);

export const searchTools = [searchWebTool];
