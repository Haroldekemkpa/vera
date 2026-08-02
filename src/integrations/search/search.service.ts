import { tavilyRequest } from "./search.client.js";
import { searchInputSchema } from "./search.schema.js";
import type { SearchInput, SearchResult } from "./search.types.js";

export async function searchWeb(input: SearchInput): Promise<SearchResult> {
  const validatedInput = searchInputSchema.parse(input);
  const response = await tavilyRequest<{
    query?: string;
    answer?: string;
    images?: unknown[];
    results?: Array<{
      title?: string;
      url?: string;
      content?: string;
      score?: number;
      raw_content?: string;
    }>;
  }>({
    query: validatedInput.query,
    search_depth: validatedInput.searchDepth,
    topic: validatedInput.topic,
    max_results: validatedInput.maxResults,
    include_answer: validatedInput.includeAnswer,
    include_raw_content: validatedInput.includeRawContent,
    include_images: validatedInput.includeImages,
    days: validatedInput.days,
  });

  return {
    query: response.query ?? validatedInput.query,
    answer: response.answer ?? null,
    images: response.images ?? [],
    results: (response.results ?? []).map((result) => ({
      title: result.title ?? null,
      url: result.url ?? null,
      content: result.content ?? null,
      score: result.score ?? null,
      rawContent: result.raw_content ?? null,
    })),
  };
}
