import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { searchInputSchema } from "./search.schema.js";
import { searchWeb } from "./search.service.js";

function handleControllerError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid Search request",
      issues: error.issues,
    });
  }

  next(error);
}

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const input = searchInputSchema.parse(req.method === "GET" ? req.query : req.body);
    res.json(await searchWeb(input));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}
