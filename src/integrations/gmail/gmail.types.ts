import type { z } from "zod";
import type {
  createDraftInputSchema,
  listMessagesInputSchema,
  replyEmailInputSchema,
  sendDraftInputSchema,
  sendEmailInputSchema,
} from "./gmail.schema.js";

export type SendEmailInput = z.input<typeof sendEmailInputSchema>;
export type ValidatedSendEmailInput = z.infer<typeof sendEmailInputSchema>;

export type ListMessagesInput = z.input<typeof listMessagesInputSchema>;
export type CreateDraftInput = z.input<typeof createDraftInputSchema>;
export type SendDraftInput = z.input<typeof sendDraftInputSchema>;
export type ReplyEmailInput = z.input<typeof replyEmailInputSchema>;

export type EmailSendResult = {
  id: string | null;
  threadId: string | null;
  labelIds: string[];
};

export type SendEmailResult = EmailSendResult;

export type GmailHeaderMap = Record<string, string>;

export type GmailAttachmentSummary = {
  id: string;
  filename: string;
  mimeType: string | null;
  size: number | null;
};

export type GmailMessageSummary = {
  id: string;
  threadId: string | null;
  snippet: string | null;
  labelIds: string[];
};

export type GmailMessage = GmailMessageSummary & {
  historyId: string | null;
  internalDate: string | null;
  headers: GmailHeaderMap;
  subject: string | null;
  from: string | null;
  to: string | null;
  cc: string | null;
  date: string | null;
  textBody: string | null;
  htmlBody: string | null;
  attachments: GmailAttachmentSummary[];
};

export type ListMessagesResult = {
  messages: GmailMessageSummary[];
  nextPageToken: string | null;
  resultSizeEstimate: number | null;
};

export type CreateDraftResult = {
  id: string | null;
  message: GmailMessageSummary | null;
};

export type GmailAttachment = {
  attachmentId: string;
  messageId: string;
  data: string;
  size: number | null;
};
