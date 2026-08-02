import { tool } from "langchain";
import { z } from "zod";

import {
  createDraft,
  getAttachment,
  getMessage,
  listMessages,
  replyToMessage,
  sendDraft,
  sendEmail,
} from "../integrations/gmail/gmail.service.js";
import { toToolResult } from "./toolResult.js";

const connectionIdSchema = {
  connectionId: z.string().min(1).describe("Stored Google connection id."),
};

export const searchGmailMessagesTool = tool(
  ({ connectionId, query, maxResults, labelIds, pageToken, includeSpamTrash }) =>
    toToolResult(() =>
      listMessages(connectionId, {
        query,
        maxResults,
        labelIds,
        pageToken,
        includeSpamTrash,
      }),
    ),
  {
    name: "search_gmail_messages",
    description: "Search or list Gmail messages using Gmail search syntax.",
    schema: z.object({
      ...connectionIdSchema,
      query: z.string().trim().optional().describe("Gmail search query."),
      labelIds: z.array(z.string().trim().min(1)).optional(),
      maxResults: z.number().int().min(1).max(100).default(10),
      pageToken: z.string().trim().min(1).optional(),
      includeSpamTrash: z.boolean().default(false),
    }),
  },
);

export const getGmailMessageTool = tool(
  ({ connectionId, messageId }) => toToolResult(() => getMessage(connectionId, messageId)),
  {
    name: "get_gmail_message",
    description: "Get a full Gmail message by id.",
    schema: z.object({
      ...connectionIdSchema,
      messageId: z.string().min(1),
    }),
  },
);

export const sendGmailEmailTool = tool(
  ({ connectionId, ...input }) => toToolResult(() => sendEmail(connectionId, input)),
  {
    name: "send_gmail_email",
    description: "Send an email through Gmail.",
    schema: z.object({
      ...connectionIdSchema,
      to: z.array(z.string().email()).min(1),
      subject: z.string().trim().min(1),
      body: z.string().min(1),
      cc: z.array(z.string().email()).optional(),
      bcc: z.array(z.string().email()).optional(),
      replyTo: z.string().email().optional(),
    }),
  },
);

export const replyGmailEmailTool = tool(
  ({ connectionId, ...input }) => toToolResult(() => replyToMessage(connectionId, input)),
  {
    name: "reply_gmail_email",
    description: "Reply to an existing Gmail message.",
    schema: z.object({
      ...connectionIdSchema,
      messageId: z.string().min(1),
      body: z.string().min(1),
      includeOriginalRecipients: z.boolean().default(true),
    }),
  },
);

export const createGmailDraftTool = tool(
  ({ connectionId, ...input }) => toToolResult(() => createDraft(connectionId, input)),
  {
    name: "create_gmail_draft",
    description: "Create a Gmail draft.",
    schema: z.object({
      ...connectionIdSchema,
      to: z.array(z.string().email()).min(1),
      subject: z.string().trim().min(1),
      body: z.string().min(1),
      cc: z.array(z.string().email()).optional(),
      bcc: z.array(z.string().email()).optional(),
      replyTo: z.string().email().optional(),
    }),
  },
);

export const sendGmailDraftTool = tool(
  ({ connectionId, draftId }) => toToolResult(() => sendDraft(connectionId, { draftId })),
  {
    name: "send_gmail_draft",
    description: "Send an existing Gmail draft.",
    schema: z.object({
      ...connectionIdSchema,
      draftId: z.string().min(1),
    }),
  },
);

export const getGmailAttachmentTool = tool(
  ({ connectionId, messageId, attachmentId }) =>
    toToolResult(() => getAttachment(connectionId, messageId, attachmentId)),
  {
    name: "get_gmail_attachment",
    description: "Get a Gmail message attachment by attachment id.",
    schema: z.object({
      ...connectionIdSchema,
      messageId: z.string().min(1),
      attachmentId: z.string().min(1),
    }),
  },
);

export const gmailTools = [
  searchGmailMessagesTool,
  getGmailMessageTool,
  sendGmailEmailTool,
  replyGmailEmailTool,
  createGmailDraftTool,
  sendGmailDraftTool,
  getGmailAttachmentTool,
];
