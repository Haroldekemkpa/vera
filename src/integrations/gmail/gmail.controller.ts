import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import {
  attachmentParamsSchema,
  gmailConnectionParamsSchema,
  listMessagesInputSchema,
  messageIdParamsSchema,
} from "./gmail.schema.js";
import {
  createDraft,
  getAttachment,
  getMessage,
  listMessages,
  replyToMessage,
  sendDraft,
  sendEmail,
} from "./gmail.service.js";

function handleGmailError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid Gmail request",
      issues: error.issues,
    });
  }

  throw error;
}

function handleControllerError(error: unknown, res: Response, next: NextFunction) {
  try {
    handleGmailError(error, res);
  } catch (handledError) {
    next(handledError);
  }
}

export async function listGmailMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId } = gmailConnectionParamsSchema.parse(req.params);
    const input = listMessagesInputSchema.parse({
      query: req.query.query,
      labelIds:
        typeof req.query.labelIds === "string"
          ? req.query.labelIds.split(",").filter(Boolean)
          : req.query.labelIds,
      maxResults: req.query.maxResults,
      pageToken: req.query.pageToken,
      includeSpamTrash: req.query.includeSpamTrash,
    });

    res.json(await listMessages(connectionId, input));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function getGmailMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId, messageId } = messageIdParamsSchema.parse(req.params);
    res.json(await getMessage(connectionId, messageId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function getGmailAttachment(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId, messageId, attachmentId } =
      attachmentParamsSchema.parse(req.params);

    res.json(await getAttachment(connectionId, messageId, attachmentId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function sendGmailMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId } = gmailConnectionParamsSchema.parse(req.params);
    res.status(201).json(await sendEmail(connectionId, req.body));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function replyToGmailMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId } = gmailConnectionParamsSchema.parse(req.params);
    res.status(201).json(await replyToMessage(connectionId, req.body));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function createGmailDraft(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId } = gmailConnectionParamsSchema.parse(req.params);
    res.status(201).json(await createDraft(connectionId, req.body));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function sendGmailDraft(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId } = gmailConnectionParamsSchema.parse(req.params);
    res.status(201).json(await sendDraft(connectionId, req.body));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}
