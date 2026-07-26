import { google } from "googleapis";
import type { Credentials } from "google-auth-library";
import { createGoogleOAuthClient } from "../../auth/google.js";

export function createCalendarClient(tokens: Credentials) {
  const auth = createGoogleOAuthClient();
  auth.setCredentials(tokens);

  return google.calendar({
    version: "v3",
    auth,
  });
}
