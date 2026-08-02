import { Router } from "express";
import { listChannels, listMessages, postMessage } from "./slack.controller.js";

export const slackRouter = Router();

slackRouter.get("/channels", listChannels);
slackRouter.get("/channels/:channelId/messages", listMessages);
slackRouter.post("/messages", postMessage);
