import type { z } from "zod";
import type {
  createDriveFolderInputSchema,
  listDriveFilesInputSchema,
} from "./drive.schema.js";

export type ListDriveFilesInput = z.input<typeof listDriveFilesInputSchema>;
export type CreateDriveFolderInput = z.input<typeof createDriveFolderInputSchema>;

export type DriveFileResult = {
  id: string | null;
  name: string | null;
  mimeType: string | null;
  webViewLink: string | null;
  iconLink: string | null;
  parents: string[];
  createdTime: string | null;
  modifiedTime: string | null;
  size: string | null;
};

export type ListDriveFilesResult = {
  files: DriveFileResult[];
  nextPageToken: string | null;
};
