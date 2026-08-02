import type { z } from "zod";
import type { searchInputSchema } from "./search.schema.js";

export type SearchInput = z.input<typeof searchInputSchema>;

export type SearchResultItem = {
  title: string | null;
  url: string | null;
  content: string | null;
  score: number | null;
  rawContent: string | null;
};

export type SearchResult = {
  query: string;
  answer: string | null;
  images: unknown[];
  results: SearchResultItem[];
};
