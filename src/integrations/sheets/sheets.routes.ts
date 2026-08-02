import { Router } from "express";
import {
  appendValues,
  createSheet,
  getValues,
  updateValues,
} from "./sheets.controller.js";

export const sheetsRouter = Router();

sheetsRouter.post("/:connectionId/spreadsheets", createSheet);
sheetsRouter.get("/:connectionId/spreadsheets/:spreadsheetId/values", getValues);
sheetsRouter.put("/:connectionId/spreadsheets/:spreadsheetId/values", updateValues);
sheetsRouter.post("/:connectionId/spreadsheets/:spreadsheetId/values:append", appendValues);
