import { Router, type Response } from "express";
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

export const gmailRouter = Router();

function handleRouteError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid Gmail request",
      issues: error.issues,
    });
  }

  throw error;
}

gmailRouter.get("/:connectionId/messages", async (req, res, next) => {
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
    try {
      handleRouteError(error, res);
    } catch (handledError) {
      next(handledError);
    }
  }
});

gmailRouter.get("/:connectionId/messages/:messageId", async (req, res, next) => {
  try {
    const { connectionId, messageId } = messageIdParamsSchema.parse(req.params);
    res.json(await getMessage(connectionId, messageId));
  } catch (error) {
    try {
      handleRouteError(error, res);
    } catch (handledError) {
      next(handledError);
    }
  }
});

gmailRouter.get(
  "/:connectionId/messages/:messageId/attachments/:attachmentId",
  async (req, res, next) => {
    try {
      const { connectionId, messageId, attachmentId } =
        attachmentParamsSchema.parse(req.params);

      res.json(await getAttachment(connectionId, messageId, attachmentId));
    } catch (error) {
      try {
        handleRouteError(error, res);
      } catch (handledError) {
        next(handledError);
      }
    }
  },
);

gmailRouter.post("/:connectionId/messages/send", async (req, res, next) => {
  try {
    const { connectionId } = gmailConnectionParamsSchema.parse(req.params);
    res.status(201).json(await sendEmail(connectionId, req.body));
  } catch (error) {
    try {
      handleRouteError(error, res);
    } catch (handledError) {
      next(handledError);
    }
  }
});

gmailRouter.post("/:connectionId/messages/reply", async (req, res, next) => {
  try {
    const { connectionId } = gmailConnectionParamsSchema.parse(req.params);
    res.status(201).json(await replyToMessage(connectionId, req.body));
  } catch (error) {
    try {
      handleRouteError(error, res);
    } catch (handledError) {
      next(handledError);
    }
  }
});

gmailRouter.post("/:connectionId/drafts", async (req, res, next) => {
  try {
    const { connectionId } = gmailConnectionParamsSchema.parse(req.params);
    res.status(201).json(await createDraft(connectionId, req.body));
  } catch (error) {
    try {
      handleRouteError(error, res);
    } catch (handledError) {
      next(handledError);
    }
  }
});

gmailRouter.post("/:connectionId/drafts/send", async (req, res, next) => {
  try {
    const { connectionId } = gmailConnectionParamsSchema.parse(req.params);
    res.status(201).json(await sendDraft(connectionId, req.body));
  } catch (error) {
    try {
      handleRouteError(error, res);
    } catch (handledError) {
      next(handledError);
    }
  }
});
