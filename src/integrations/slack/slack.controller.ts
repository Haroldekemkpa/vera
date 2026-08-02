import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import {
  listSlackChannelsInputSchema,
  listSlackMessagesInputSchema,
  slackChannelParamsSchema,
} from "./slack.schema.js";
import {
  listSlackChannels,
  listSlackMessages,
  postSlackMessage,
} from "./slack.service.js";

function handleControllerError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid Slack request",
      issues: error.issues,
    });
  }

  next(error);
}

export async function listChannels(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await listSlackChannels(listSlackChannelsInputSchema.parse(req.query)));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function listMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const { channelId } = slackChannelParamsSchema.parse(req.params);
    res.json(await listSlackMessages(channelId, listSlackMessagesInputSchema.parse(req.query)));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function postMessage(req: Request, res: Response, next: NextFunction) {
  try {
    res.status(201).json(await postSlackMessage(req.body));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}
