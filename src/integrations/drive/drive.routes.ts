import { Router } from "express";
import {
  createFolder,
  deleteFile,
  getFile,
  listFiles,
} from "./drive.controller.js";

export const driveRouter = Router();

driveRouter.get("/:connectionId/files", listFiles);
driveRouter.get("/:connectionId/files/:fileId", getFile);
driveRouter.post("/:connectionId/folders", createFolder);
driveRouter.delete("/:connectionId/files/:fileId", deleteFile);
