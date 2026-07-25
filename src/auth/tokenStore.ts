import crypto from "node:crypto";
import type { Credentials } from "google-auth-library";

type StoredOAuthToken = {
  provider: "google";
  tokens: Credentials;
  connectedAt: Date;
};

const pendingStates = new Set<string>();
const connectedTokens = new Map<string, StoredOAuthToken>();

export function createOAuthState() {
  const state = crypto.randomBytes(32).toString("hex");
  pendingStates.add(state);

  return state;
}

export function consumeOAuthState(state: string) {
  const exists = pendingStates.delete(state);

  return exists;
}

export function saveGoogleTokens(tokens: Credentials) {
  const connectionId = crypto.randomUUID();

  connectedTokens.set(connectionId, {
    provider: "google",
    tokens,
    connectedAt: new Date(),
  });

  return connectionId;
}

export function getStoredGoogleConnection(connectionId: string) {
  const connection = connectedTokens.get(connectionId);

  if (connection?.provider !== "google") {
    return null;
  }

  return connection;
}

export function listGoogleConnections() {
  return [...connectedTokens.entries()].map(([id, connection]) => ({
    id,
    provider: connection.provider,
    connectedAt: connection.connectedAt,
    hasAccessToken: Boolean(connection.tokens.access_token),
    hasRefreshToken: Boolean(connection.tokens.refresh_token),
    expiryDate: connection.tokens.expiry_date ?? null,
    scopes: connection.tokens.scope?.split(" ") ?? [],
  }));
}
