import { tool } from "langchain";
import { z } from "zod";

import {
  createDriveFolder,
  deleteDriveFile,
  getDriveFile,
  listDriveFiles,
} from "../integrations/drive/drive.service.js";
import { toToolResult } from "./toolResult.js";

export const listDriveFilesTool = tool(
  ({ connectionId, ...input }) => toToolResult(() => listDriveFiles(connectionId, input)),
  {
    name: "list_drive_files",
    description: "List or search Google Drive files.",
    schema: z.object({
      connectionId: z.string().min(1),
      query: z.string().trim().optional(),
      pageSize: z.number().int().min(1).max(100).default(10),
      pageToken: z.string().trim().min(1).optional(),
      orderBy: z.string().trim().optional(),
    }),
  },
);

export const getDriveFileTool = tool(
  ({ connectionId, fileId }) => toToolResult(() => getDriveFile(connectionId, fileId)),
  {
    name: "get_drive_file",
    description: "Get Google Drive file metadata.",
    schema: z.object({
      connectionId: z.string().min(1),
      fileId: z.string().min(1),
    }),
  },
);

export const createDriveFolderTool = tool(
  ({ connectionId, ...input }) => toToolResult(() => createDriveFolder(connectionId, input)),
  {
    name: "create_drive_folder",
    description: "Create a Google Drive folder.",
    schema: z.object({
      connectionId: z.string().min(1),
      name: z.string().trim().min(1),
      parentId: z.string().trim().min(1).optional(),
    }),
  },
);

export const deleteDriveFileTool = tool(
  ({ connectionId, fileId }) => toToolResult(() => deleteDriveFile(connectionId, fileId)),
  {
    name: "delete_drive_file",
    description: "Delete a Google Drive file.",
    schema: z.object({
      connectionId: z.string().min(1),
      fileId: z.string().min(1),
    }),
  },
);

export const driveTools = [
  listDriveFilesTool,
  getDriveFileTool,
  createDriveFolderTool,
  deleteDriveFileTool,
];
