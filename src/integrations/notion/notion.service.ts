import { notionRequest } from "./notion.client.js";
import {
  createNotionPageInputSchema,
  queryNotionDatabaseInputSchema,
  searchNotionInputSchema,
} from "./notion.schema.js";
import type {
  CreateNotionPageInput,
  NotionListResult,
  QueryNotionDatabaseInput,
  SearchNotionInput,
} from "./notion.types.js";

type NotionListResponse = {
  results?: unknown[];
  next_cursor?: string | null;
  has_more?: boolean;
};

function mapListResponse(response: NotionListResponse): NotionListResult {
  return {
    results: response.results ?? [],
    nextCursor: response.next_cursor ?? null,
    hasMore: response.has_more ?? false,
  };
}

export async function searchNotion(input: SearchNotionInput = {}) {
  const validatedInput = searchNotionInputSchema.parse(input);
  const response = await notionRequest<NotionListResponse>("/search", {
    method: "POST",
    body: JSON.stringify({
      query: validatedInput.query,
      page_size: validatedInput.pageSize,
      start_cursor: validatedInput.startCursor,
    }),
  });

  return mapListResponse(response);
}

export async function getNotionPage(pageId: string) {
  return notionRequest(`/pages/${pageId}`);
}

export async function createNotionPage(input: CreateNotionPageInput) {
  const validatedInput = createNotionPageInputSchema.parse(input);

  return notionRequest("/pages", {
    method: "POST",
    body: JSON.stringify(validatedInput),
  });
}

export async function queryNotionDatabase(
  databaseId: string,
  input: QueryNotionDatabaseInput = {},
) {
  const validatedInput = queryNotionDatabaseInputSchema.parse(input);
  const response = await notionRequest<NotionListResponse>(`/databases/${databaseId}/query`, {
    method: "POST",
    body: JSON.stringify({
      filter: validatedInput.filter,
      sorts: validatedInput.sorts,
      page_size: validatedInput.pageSize,
      start_cursor: validatedInput.startCursor,
    }),
  });

  return mapListResponse(response);
}
