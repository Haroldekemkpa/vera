import { tool } from "langchain";
import { z } from "zod";

import {
  createNotionPage,
  getNotionPage,
  queryNotionDatabase,
  searchNotion,
} from "../integrations/notion/notion.service.js";
import { toToolResult } from "./toolResult.js";

const recordSchema = z.record(z.string(), z.unknown());

export const searchNotionTool = tool(
  (input) => toToolResult(() => searchNotion(input)),
  {
    name: "search_notion",
    description: "Search Notion pages and databases.",
    schema: z.object({
      query: z.string().trim().optional(),
      pageSize: z.number().int().min(1).max(100).default(10),
      startCursor: z.string().trim().min(1).optional(),
    }),
  },
);

export const getNotionPageTool = tool(
  ({ pageId }) => toToolResult(() => getNotionPage(pageId)),
  {
    name: "get_notion_page",
    description: "Get a Notion page by id.",
    schema: z.object({
      pageId: z.string().min(1),
    }),
  },
);

export const createNotionPageTool = tool(
  (input) => toToolResult(() => createNotionPage(input)),
  {
    name: "create_notion_page",
    description: "Create a Notion page.",
    schema: z.object({
      parent: recordSchema,
      properties: recordSchema,
      children: z.array(recordSchema).optional(),
    }),
  },
);

export const queryNotionDatabaseTool = tool(
  ({ databaseId, ...input }) => toToolResult(() => queryNotionDatabase(databaseId, input)),
  {
    name: "query_notion_database",
    description: "Query a Notion database.",
    schema: z.object({
      databaseId: z.string().min(1),
      filter: recordSchema.optional(),
      sorts: z.array(recordSchema).optional(),
      pageSize: z.number().int().min(1).max(100).default(10),
      startCursor: z.string().trim().min(1).optional(),
    }),
  },
);

export const notionTools = [
  searchNotionTool,
  getNotionPageTool,
  createNotionPageTool,
  queryNotionDatabaseTool,
];
