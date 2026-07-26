import { google } from "googleapis";
import type { Credentials } from "google-auth-library";
import { createGoogleOAuthClient } from "../../auth/google.js";

export function createDriveClient(tokens: Credentials) {
  const auth = createGoogleOAuthClient();
  auth.setCredentials(tokens);

  return google.drive({
    version: "v3",
    auth,
  });
}
