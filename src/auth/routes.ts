import { Router } from "express";
import {
  getGoogleConnections,
  handleGoogleCallback,
  redirectToGoogleAuth,
} from "./controller.js";

export const authRouter = Router();

authRouter.get("/google", redirectToGoogleAuth);
authRouter.get("/google/callback", handleGoogleCallback);
authRouter.get("/google/connections", getGoogleConnections);
