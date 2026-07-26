import { Router } from "express";
import {
  createGmailDraft,
  getGmailAttachment,
  getGmailMessage,
  listGmailMessages,
  replyToGmailMessage,
  sendGmailDraft,
  sendGmailMessage,
} from "./gmail.controller.js";

export const gmailRouter = Router();

gmailRouter.get("/:connectionId/messages", listGmailMessages);
gmailRouter.get("/:connectionId/messages/:messageId", getGmailMessage);
gmailRouter.get(
  "/:connectionId/messages/:messageId/attachments/:attachmentId",
  getGmailAttachment,
);
gmailRouter.post("/:connectionId/messages/send", sendGmailMessage);
gmailRouter.post("/:connectionId/messages/reply", replyToGmailMessage);
gmailRouter.post("/:connectionId/drafts", createGmailDraft);
gmailRouter.post("/:connectionId/drafts/send", sendGmailDraft);
