import { z } from "zod";

export const sheetsConnectionParamsSchema = z.object({
  connectionId: z.string().min(1),
});

export const spreadsheetParamsSchema = sheetsConnectionParamsSchema.extend({
  spreadsheetId: z.string().min(1),
});

export const sheetRangeParamsSchema = spreadsheetParamsSchema.extend({
  range: z.string().min(1),
});

export const createSpreadsheetInputSchema = z.object({
  title: z.string().trim().min(1),
  sheets: z.array(z.string().trim().min(1)).optional(),
});

export const getSheetValuesInputSchema = z.object({
  range: z.string().trim().min(1),
  majorDimension: z.enum(["ROWS", "COLUMNS"]).default("ROWS"),
});

export const updateSheetValuesInputSchema = getSheetValuesInputSchema.extend({
  values: z.array(z.array(z.union([z.string(), z.number(), z.boolean(), z.null()]))),
  valueInputOption: z.enum(["RAW", "USER_ENTERED"]).default("USER_ENTERED"),
});

export const appendSheetValuesInputSchema = updateSheetValuesInputSchema;
