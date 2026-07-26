import { google } from "googleapis";
import type { Credentials } from "google-auth-library";
import { createGoogleOAuthClient } from "../../auth/google.js";

export function createGmailClient(tokens: Credentials) {
  const auth = createGoogleOAuthClient();
  auth.setCredentials(tokens);

  return google.gmail({
    version: "v1",
    auth,
  });
}
