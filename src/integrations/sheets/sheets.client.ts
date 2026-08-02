import { google } from "googleapis";
import type { Credentials } from "google-auth-library";
import { createGoogleOAuthClient } from "../../auth/google.js";

export function createSheetsClient(tokens: Credentials) {
  const auth = createGoogleOAuthClient();
  auth.setCredentials(tokens);

  return google.sheets({
    version: "v4",
    auth,
  });
}
