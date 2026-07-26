import { Router } from "express";
import {
  exchangeGoogleCode,
  getGoogleAuthUrl,
  getGoogleUserInfo,
} from "./google.js";
import {
  consumeOAuthState,
  createOAuthState,
  listGoogleConnections,
  saveGoogleTokens,
} from "./tokenStore.js";

export const authRouter = Router();

authRouter.get("/google", async (_req, res, next) => {
  try {
    const state = await createOAuthState();
    res.redirect(getGoogleAuthUrl(state));
  } catch (error) {
    next(error);
  }
});

authRouter.get("/google/callback", async (req, res, next) => {
  try {
    const { code, state, error } = req.query;

    if (typeof error === "string") {
      return res.status(400).json({
        message: "Google OAuth failed",
        error,
      });
    }

    if (typeof code !== "string") {
      return res.status(400).json({
        message: "Missing Google OAuth code",
      });
    }

    if (typeof state !== "string" || !(await consumeOAuthState(state))) {
      return res.status(400).json({
        message: "Invalid or expired OAuth state",
      });
    }

    const tokens = await exchangeGoogleCode(code);
    const googleUser = await getGoogleUserInfo(tokens);
    const connectionId = await saveGoogleTokens(tokens, googleUser);

    return res.json({
      message: "Google account connected",
      connectionId,
      email: googleUser.email,
      hasAccessToken: Boolean(tokens.access_token),
      hasRefreshToken: Boolean(tokens.refresh_token),
      expiryDate: tokens.expiry_date ?? null,
      scopes: tokens.scope?.split(" ") ?? [],
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get("/google/connections", async (_req, res, next) => {
  try {
    res.json({
      connections: await listGoogleConnections(),
    });
  } catch (error) {
    next(error);
  }
});
