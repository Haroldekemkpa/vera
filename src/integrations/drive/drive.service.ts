import { getStoredGoogleConnection } from "../../auth/tokenStore.js";
import { createDriveClient } from "./drive.client.js";
import {
  createDriveFolderInputSchema,
  listDriveFilesInputSchema,
} from "./drive.schema.js";
import type {
  CreateDriveFolderInput,
  DriveFileResult,
  ListDriveFilesInput,
  ListDriveFilesResult,
} from "./drive.types.js";

const driveFileFields =
  "id,name,mimeType,webViewLink,iconLink,parents,createdTime,modifiedTime,size";

async function getDrive(connectionId: string) {
  const connection = await getStoredGoogleConnection(connectionId);

  if (!connection) {
    throw new Error("Google connection not found");
  }

  return createDriveClient(connection.tokens);
}

function mapDriveFile(file: {
  id?: string | null;
  name?: string | null;
  mimeType?: string | null;
  webViewLink?: string | null;
  iconLink?: string | null;
  parents?: string[] | null;
  createdTime?: string | null;
  modifiedTime?: string | null;
  size?: string | null;
}): DriveFileResult {
  return {
    id: file.id ?? null,
    name: file.name ?? null,
    mimeType: file.mimeType ?? null,
    webViewLink: file.webViewLink ?? null,
    iconLink: file.iconLink ?? null,
    parents: file.parents ?? [],
    createdTime: file.createdTime ?? null,
    modifiedTime: file.modifiedTime ?? null,
    size: file.size ?? null,
  };
}

export async function listDriveFiles(
  connectionId: string,
  input: ListDriveFilesInput = {},
): Promise<ListDriveFilesResult> {
  const validatedInput = listDriveFilesInputSchema.parse(input);
  const drive = await getDrive(connectionId);
  const params: Record<string, unknown> = {
    pageSize: validatedInput.pageSize,
    fields: `nextPageToken, files(${driveFileFields})`,
  };

  if (validatedInput.query) params.q = validatedInput.query;
  if (validatedInput.pageToken) params.pageToken = validatedInput.pageToken;
  if (validatedInput.orderBy) params.orderBy = validatedInput.orderBy;

  const response = await drive.files.list(params);

  return {
    files: (response.data.files ?? []).map(mapDriveFile),
    nextPageToken: response.data.nextPageToken ?? null,
  };
}

export async function getDriveFile(
  connectionId: string,
  fileId: string,
): Promise<DriveFileResult> {
  const drive = await getDrive(connectionId);
  const response = await drive.files.get({
    fileId,
    fields: driveFileFields,
  });

  return mapDriveFile(response.data);
}

export async function createDriveFolder(
  connectionId: string,
  input: CreateDriveFolderInput,
): Promise<DriveFileResult> {
  const validatedInput = createDriveFolderInputSchema.parse(input);
  const drive = await getDrive(connectionId);
  const requestBody: { name: string; mimeType: string; parents?: string[] } = {
    name: validatedInput.name,
    mimeType: "application/vnd.google-apps.folder",
  };

  if (validatedInput.parentId) {
    requestBody.parents = [validatedInput.parentId];
  }

  const response = await drive.files.create({
    requestBody,
    fields: driveFileFields,
  });

  return mapDriveFile(response.data);
}

export async function deleteDriveFile(connectionId: string, fileId: string) {
  const drive = await getDrive(connectionId);

  await drive.files.delete({ fileId });

  return { deleted: true };
}
