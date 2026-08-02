import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import {
  notionDatabaseParamsSchema,
  notionPageParamsSchema,
  searchNotionInputSchema,
} from "./notion.schema.js";
import {
  createNotionPage,
  getNotionPage,
  queryNotionDatabase,
  searchNotion,
} from "./notion.service.js";

function handleControllerError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid Notion request",
      issues: error.issues,
    });
  }

  next(error);
}

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await searchNotion(searchNotionInputSchema.parse(req.query)));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function getPage(req: Request, res: Response, next: NextFunction) {
  try {
    const { pageId } = notionPageParamsSchema.parse(req.params);
    res.json(await getNotionPage(pageId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function createPage(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(await createNotionPage(req.body));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function queryDatabase(req: Request, res: Response, next: NextFunction) {
  try {
    const { databaseId } = notionDatabaseParamsSchema.parse(req.params);
    res.json(await queryNotionDatabase(databaseId, req.body));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}
