import { z } from "zod";

export const driveConnectionParamsSchema = z.object({
  connectionId: z.string().min(1),
});

export const driveFileParamsSchema = driveConnectionParamsSchema.extend({
  fileId: z.string().min(1),
});

export const listDriveFilesInputSchema = z.object({
  query: z.string().trim().optional(),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  pageToken: z.string().trim().min(1).optional(),
  orderBy: z.string().trim().optional(),
});

export const createDriveFolderInputSchema = z.object({
  name: z.string().trim().min(1),
  parentId: z.string().trim().min(1).optional(),
});
