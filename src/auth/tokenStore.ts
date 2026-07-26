import crypto from "node:crypto";
import type { Credentials } from "google-auth-library";
import { prisma } from "../db/prisma.js";
import { decryptToken, encryptToken } from "./tokenCrypto.js";

type GoogleUserInfo = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
};

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

function getTokenExpiryDate(tokens: Credentials) {
  return tokens.expiry_date ? new Date(tokens.expiry_date) : null;
}

function getTokenScopes(tokens: Credentials) {
  return tokens.scope?.split(" ").filter(Boolean) ?? [];
}

export async function saveGoogleTokens(
  tokens: Credentials,
  googleUser: GoogleUserInfo,
) {
  const user = await prisma.user.upsert({
    where: { email: googleUser.email },
    create: {
      email: googleUser.email,
      name: googleUser.name,
      avatarUrl: googleUser.avatarUrl,
    },
    update: {
      name: googleUser.name,
      avatarUrl: googleUser.avatarUrl,
    },
  });

  const existingAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId: googleUser.id,
      },
    },
  });

  const tokenData = {
    provider: "google",
    providerAccountId: googleUser.id,
    accessToken: tokens.access_token ? encryptToken(tokens.access_token) : null,
    tokenType: tokens.token_type ?? null,
    scopes: getTokenScopes(tokens),
    expiresAt: getTokenExpiryDate(tokens),
    userId: user.id,
  };

  const account = await prisma.oAuthAccount.upsert({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId: googleUser.id,
      },
    },
    create: {
      ...tokenData,
      refreshToken: tokens.refresh_token ? encryptToken(tokens.refresh_token) : null,
    },
    update: {
      ...tokenData,
      refreshToken: tokens.refresh_token
        ? encryptToken(tokens.refresh_token)
        : (existingAccount?.refreshToken ?? null),
    },
  });

  return account.id;
}

export async function getStoredGoogleConnection(connectionId: string) {
  const account = await prisma.oAuthAccount.findFirst({
    where: {
      id: connectionId,
      provider: "google",
    },
  });

  if (!account) {
    return null;
  }

  const tokens: Credentials = {
    access_token: account.accessToken ? decryptToken(account.accessToken) : null,
    refresh_token: account.refreshToken ? decryptToken(account.refreshToken) : null,
    token_type: account.tokenType,
    scope: account.scopes.join(" "),
    expiry_date: account.expiresAt?.getTime() ?? null,
  };

  return {
    provider: "google" as const,
    connectedAt: account.createdAt,
    tokens,
  };
}

export async function listGoogleConnections() {
  const accounts = await prisma.oAuthAccount.findMany({
    where: { provider: "google" },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  return accounts.map((account) => ({
    id: account.id,
    provider: account.provider,
    providerAccountId: account.providerAccountId,
    userId: account.userId,
    email: account.user.email,
    name: account.user.name,
    connectedAt: account.createdAt,
    updatedAt: account.updatedAt,
    hasAccessToken: Boolean(account.accessToken),
    hasRefreshToken: Boolean(account.refreshToken),
    expiryDate: account.expiresAt?.getTime() ?? null,
    scopes: account.scopes,
  }));
}
