import { z } from "zod";

export const gmailConnectionParamsSchema = z.object({
  connectionId: z.string().min(1),
});

export const sendEmailInputSchema = z.object({
  to: z.array(z.string().email()).min(1),
  subject: z.string().trim().min(1),
  body: z.string().min(1),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  replyTo: z.string().email().optional(),
});

export const listMessagesInputSchema = z.object({
  query: z.string().trim().optional(),
  labelIds: z.array(z.string().trim().min(1)).optional(),
  maxResults: z.coerce.number().int().min(1).max(100).default(10),
  pageToken: z.string().trim().min(1).optional(),
  includeSpamTrash: z.coerce.boolean().default(false),
});

export const messageIdParamsSchema = gmailConnectionParamsSchema.extend({
  messageId: z.string().min(1),
});

export const attachmentParamsSchema = messageIdParamsSchema.extend({
  attachmentId: z.string().min(1),
});

export const createDraftInputSchema = sendEmailInputSchema;

export const sendDraftInputSchema = z.object({
  draftId: z.string().min(1),
});

export const replyEmailInputSchema = z.object({
  messageId: z.string().min(1),
  body: z.string().min(1),
  includeOriginalRecipients: z.coerce.boolean().default(true),
});
