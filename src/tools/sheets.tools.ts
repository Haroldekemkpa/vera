import { tool } from "langchain";
import { z } from "zod";

import {
  appendSheetValues,
  createSpreadsheet,
  getSheetValues,
  updateSheetValues,
} from "../integrations/sheets/sheets.service.js";
import { toToolResult } from "./toolResult.js";

const sheetValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

export const createSpreadsheetTool = tool(
  ({ connectionId, ...input }) => toToolResult(() => createSpreadsheet(connectionId, input)),
  {
    name: "create_spreadsheet",
    description: "Create a Google Sheets spreadsheet.",
    schema: z.object({
      connectionId: z.string().min(1),
      title: z.string().trim().min(1),
      sheets: z.array(z.string().trim().min(1)).optional(),
    }),
  },
);

export const getSheetValuesTool = tool(
  ({ connectionId, spreadsheetId, ...input }) =>
    toToolResult(() => getSheetValues(connectionId, spreadsheetId, input)),
  {
    name: "get_sheet_values",
    description: "Read values from a Google Sheets range.",
    schema: z.object({
      connectionId: z.string().min(1),
      spreadsheetId: z.string().min(1),
      range: z.string().trim().min(1),
      majorDimension: z.enum(["ROWS", "COLUMNS"]).default("ROWS"),
    }),
  },
);

export const updateSheetValuesTool = tool(
  ({ connectionId, spreadsheetId, ...input }) =>
    toToolResult(() => updateSheetValues(connectionId, spreadsheetId, input)),
  {
    name: "update_sheet_values",
    description: "Update values in a Google Sheets range.",
    schema: z.object({
      connectionId: z.string().min(1),
      spreadsheetId: z.string().min(1),
      range: z.string().trim().min(1),
      values: z.array(z.array(sheetValueSchema)),
      majorDimension: z.enum(["ROWS", "COLUMNS"]).default("ROWS"),
      valueInputOption: z.enum(["RAW", "USER_ENTERED"]).default("USER_ENTERED"),
    }),
  },
);

export const appendSheetValuesTool = tool(
  ({ connectionId, spreadsheetId, ...input }) =>
    toToolResult(() => appendSheetValues(connectionId, spreadsheetId, input)),
  {
    name: "append_sheet_values",
    description: "Append values to a Google Sheets range.",
    schema: z.object({
      connectionId: z.string().min(1),
      spreadsheetId: z.string().min(1),
      range: z.string().trim().min(1),
      values: z.array(z.array(sheetValueSchema)),
      majorDimension: z.enum(["ROWS", "COLUMNS"]).default("ROWS"),
      valueInputOption: z.enum(["RAW", "USER_ENTERED"]).default("USER_ENTERED"),
    }),
  },
);

export const sheetsTools = [
  createSpreadsheetTool,
  getSheetValuesTool,
  updateSheetValuesTool,
  appendSheetValuesTool,
];
