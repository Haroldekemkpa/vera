import { google } from "googleapis";
import type { Credentials } from "google-auth-library";

const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REDIRECT_URI",
] as const;

function getRequiredEnv(name: (typeof requiredEnvVars)[number]) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const googleOAuthScopes = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/spreadsheets",
];

export function createGoogleOAuthClient() {
  return new google.auth.OAuth2(
    getRequiredEnv("GOOGLE_CLIENT_ID"),
    getRequiredEnv("GOOGLE_CLIENT_SECRET"),
    getRequiredEnv("GOOGLE_REDIRECT_URI"),
  );
}

export function getGoogleAuthUrl(state: string) {
  const oauthClient = createGoogleOAuthClient();

  return oauthClient.generateAuthUrl({
    access_type: "offline",
    include_granted_scopes: true,
    prompt: "consent",
    scope: googleOAuthScopes,
    state,
  });
}

export async function exchangeGoogleCode(code: string): Promise<Credentials> {
  const oauthClient = createGoogleOAuthClient();
  const { tokens } = await oauthClient.getToken(code);

  return tokens;
}

export async function getGoogleUserInfo(tokens: Credentials) {
  const oauthClient = createGoogleOAuthClient();
  oauthClient.setCredentials(tokens);

  const oauth2 = google.oauth2({
    version: "v2",
    auth: oauthClient,
  });
  const response = await oauth2.userinfo.get();

  if (!response.data.email) {
    throw new Error("Google account did not return an email address");
  }

  return {
    id: response.data.id ?? response.data.email,
    email: response.data.email,
    name: response.data.name ?? null,
    avatarUrl: response.data.picture ?? null,
  };
}
