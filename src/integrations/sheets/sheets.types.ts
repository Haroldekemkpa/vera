import type { z } from "zod";
import type {
  appendSheetValuesInputSchema,
  createSpreadsheetInputSchema,
  getSheetValuesInputSchema,
  updateSheetValuesInputSchema,
} from "./sheets.schema.js";

export type CreateSpreadsheetInput = z.input<typeof createSpreadsheetInputSchema>;
export type GetSheetValuesInput = z.input<typeof getSheetValuesInputSchema>;
export type UpdateSheetValuesInput = z.input<typeof updateSheetValuesInputSchema>;
export type AppendSheetValuesInput = z.input<typeof appendSheetValuesInputSchema>;

export type SpreadsheetResult = {
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  title: string | null;
};

export type SheetValuesResult = {
  spreadsheetId: string;
  range: string | null;
  majorDimension: string | null;
  values: unknown[][];
};

export type SheetWriteResult = {
  spreadsheetId: string | null;
  updatedRange: string | null;
  updatedRows: number | null;
  updatedColumns: number | null;
  updatedCells: number | null;
};
