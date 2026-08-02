import { getStoredGoogleConnection } from "../../auth/tokenStore.js";
import { createSheetsClient } from "./sheets.client.js";
import {
  appendSheetValuesInputSchema,
  createSpreadsheetInputSchema,
  getSheetValuesInputSchema,
  updateSheetValuesInputSchema,
} from "./sheets.schema.js";
import type {
  AppendSheetValuesInput,
  CreateSpreadsheetInput,
  GetSheetValuesInput,
  SheetValuesResult,
  SheetWriteResult,
  SpreadsheetResult,
  UpdateSheetValuesInput,
} from "./sheets.types.js";

async function getSheets(connectionId: string) {
  const connection = await getStoredGoogleConnection(connectionId);

  if (!connection) {
    throw new Error("Google connection not found");
  }

  return createSheetsClient(connection.tokens);
}

export async function createSpreadsheet(
  connectionId: string,
  input: CreateSpreadsheetInput,
): Promise<SpreadsheetResult> {
  const validatedInput = createSpreadsheetInputSchema.parse(input);
  const sheets = await getSheets(connectionId);
  const response = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: validatedInput.title },
      sheets: validatedInput.sheets?.map((title) => ({ properties: { title } })),
    },
  } as Record<string, unknown>);

  return {
    spreadsheetId: response.data.spreadsheetId ?? null,
    spreadsheetUrl: response.data.spreadsheetUrl ?? null,
    title: response.data.properties?.title ?? null,
  };
}

export async function getSheetValues(
  connectionId: string,
  spreadsheetId: string,
  input: GetSheetValuesInput,
): Promise<SheetValuesResult> {
  const validatedInput = getSheetValuesInputSchema.parse(input);
  const sheets = await getSheets(connectionId);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: validatedInput.range,
    majorDimension: validatedInput.majorDimension,
  });

  return {
    spreadsheetId,
    range: response.data.range ?? null,
    majorDimension: response.data.majorDimension ?? null,
    values: response.data.values ?? [],
  };
}

export async function updateSheetValues(
  connectionId: string,
  spreadsheetId: string,
  input: UpdateSheetValuesInput,
): Promise<SheetWriteResult> {
  const validatedInput = updateSheetValuesInputSchema.parse(input);
  const sheets = await getSheets(connectionId);
  const response = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: validatedInput.range,
    valueInputOption: validatedInput.valueInputOption,
    requestBody: {
      majorDimension: validatedInput.majorDimension,
      values: validatedInput.values,
    },
  });

  return {
    spreadsheetId: response.data.spreadsheetId ?? null,
    updatedRange: response.data.updatedRange ?? null,
    updatedRows: response.data.updatedRows ?? null,
    updatedColumns: response.data.updatedColumns ?? null,
    updatedCells: response.data.updatedCells ?? null,
  };
}

export async function appendSheetValues(
  connectionId: string,
  spreadsheetId: string,
  input: AppendSheetValuesInput,
): Promise<SheetWriteResult> {
  const validatedInput = appendSheetValuesInputSchema.parse(input);
  const sheets = await getSheets(connectionId);
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: validatedInput.range,
    valueInputOption: validatedInput.valueInputOption,
    requestBody: {
      majorDimension: validatedInput.majorDimension,
      values: validatedInput.values,
    },
  });

  return {
    spreadsheetId: response.data.spreadsheetId ?? null,
    updatedRange: response.data.updates?.updatedRange ?? null,
    updatedRows: response.data.updates?.updatedRows ?? null,
    updatedColumns: response.data.updates?.updatedColumns ?? null,
    updatedCells: response.data.updates?.updatedCells ?? null,
  };
}
