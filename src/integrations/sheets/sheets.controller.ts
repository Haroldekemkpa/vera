import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import {
  getSheetValuesInputSchema,
  sheetsConnectionParamsSchema,
  spreadsheetParamsSchema,
} from "./sheets.schema.js";
import {
  appendSheetValues,
  createSpreadsheet,
  getSheetValues,
  updateSheetValues,
} from "./sheets.service.js";

function handleControllerError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid Sheets request",
      issues: error.issues,
    });
  }

  next(error);
}

export async function createSheet(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId } = sheetsConnectionParamsSchema.parse(req.params);
    res.status(201).json(await createSpreadsheet(connectionId, req.body));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function getValues(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId, spreadsheetId } = spreadsheetParamsSchema.parse(req.params);
    const input = getSheetValuesInputSchema.parse(req.query);
    res.json(await getSheetValues(connectionId, spreadsheetId, input));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function updateValues(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId, spreadsheetId } = spreadsheetParamsSchema.parse(req.params);
    res.json(await updateSheetValues(connectionId, spreadsheetId, req.body));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function appendValues(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId, spreadsheetId } = spreadsheetParamsSchema.parse(req.params);
    res.json(await appendSheetValues(connectionId, spreadsheetId, req.body));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}
