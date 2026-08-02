import { z } from "zod";

export const notionPageParamsSchema = z.object({
  pageId: z.string().min(1),
});

export const notionDatabaseParamsSchema = z.object({
  databaseId: z.string().min(1),
});

export const searchNotionInputSchema = z.object({
  query: z.string().trim().optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  startCursor: z.string().trim().min(1).optional(),
});

export const queryNotionDatabaseInputSchema = z.object({
  filter: z.record(z.string(), z.unknown()).optional(),
  sorts: z.array(z.record(z.string(), z.unknown())).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  startCursor: z.string().trim().min(1).optional(),
});

export const createNotionPageInputSchema = z.object({
  parent: z.record(z.string(), z.unknown()),
  properties: z.record(z.string(), z.unknown()),
  children: z.array(z.record(z.string(), z.unknown())).optional(),
});
