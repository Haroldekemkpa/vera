import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import {
  driveConnectionParamsSchema,
  driveFileParamsSchema,
  listDriveFilesInputSchema,
} from "./drive.schema.js";
import {
  createDriveFolder,
  deleteDriveFile,
  getDriveFile,
  listDriveFiles,
} from "./drive.service.js";

function handleDriveError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid Drive request",
      issues: error.issues,
    });
  }

  throw error;
}

function handleControllerError(error: unknown, res: Response, next: NextFunction) {
  try {
    handleDriveError(error, res);
  } catch (handledError) {
    next(handledError);
  }
}

export async function listFiles(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId } = driveConnectionParamsSchema.parse(req.params);
    const input = listDriveFilesInputSchema.parse(req.query);

    res.json(await listDriveFiles(connectionId, input));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function getFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId, fileId } = driveFileParamsSchema.parse(req.params);
    res.json(await getDriveFile(connectionId, fileId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function createFolder(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId } = driveConnectionParamsSchema.parse(req.params);
    res.status(201).json(await createDriveFolder(connectionId, req.body));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function deleteFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId, fileId } = driveFileParamsSchema.parse(req.params);
    res.json(await deleteDriveFile(connectionId, fileId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}
