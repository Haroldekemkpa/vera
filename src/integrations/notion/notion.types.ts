import type { z } from "zod";
import type {
  createNotionPageInputSchema,
  queryNotionDatabaseInputSchema,
  searchNotionInputSchema,
} from "./notion.schema.js";

export type SearchNotionInput = z.input<typeof searchNotionInputSchema>;
export type QueryNotionDatabaseInput = z.input<typeof queryNotionDatabaseInputSchema>;
export type CreateNotionPageInput = z.input<typeof createNotionPageInputSchema>;

export type NotionListResult = {
  results: unknown[];
  nextCursor: string | null;
  hasMore: boolean;
};
