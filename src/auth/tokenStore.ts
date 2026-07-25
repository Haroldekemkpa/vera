import crypto from "node:crypto";
import type { Credentials } from "google-auth-library";
import { prisma } from "../db/prisma.js";

type StoredOAuthToken = {
  provider: "google";
  tokens: Credentials;
  connectedAt: Date;
};

const connectedTokens = new Map<string, StoredOAuthToken>();

export async function createOAuthState() {
  const state = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.oAuthState.create({
    data: {
      state,
      expiresAt,
    },
  });

  return state;
}

export async function consumeOAuthState(state: string) {
  const record = await prisma.oAuthState.findUnique({
    where: { state },
  });

  if (!record || record.expiresAt < new Date()) {
    return false;
  }

  await prisma.oAuthState.delete({
    where: { state },
  });

  return true;
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
