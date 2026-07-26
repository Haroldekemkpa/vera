import { getStoredGoogleConnection } from "../../auth/tokenStore.js";
import { createGmailClient } from "./gmail.client.js";
import {
  mapGmailMessage,
  mapGmailMessageSummary,
  mapSendEmailInputToRawMessage,
} from "./gmail.mapper.js";
import {
  createDraftInputSchema,
  listMessagesInputSchema,
  replyEmailInputSchema,
  sendEmailInputSchema,
  sendDraftInputSchema,
} from "./gmail.schema.js";
import {
  type CreateDraftInput,
  type CreateDraftResult,
  type GmailAttachment,
  type GmailMessage,
  type ListMessagesInput,
  type ListMessagesResult,
  type ReplyEmailInput,
  type SendEmailInput,
  type SendEmailResult,
  type SendDraftInput,
} from "./gmail.types.js";

type GmailMessageApiResponse = {
  data: {
    id?: string | null;
    threadId?: string | null;
    labelIds?: string[] | null;
    snippet?: string | null;
    historyId?: string | null;
    internalDate?: string | null;
    payload?: Parameters<typeof mapGmailMessage>[0]["payload"];
  };
};

async function getGmail(connectionId: string) {
  const connection = await getStoredGoogleConnection(connectionId);

  if (!connection) {
    throw new Error("Google connection not found");
  }

  return createGmailClient(connection.tokens);
}

function extractEmailAddresses(header: string | null) {
  if (!header) {
    return [];
  }

  return header
    .split(",")
    .map((recipient) => {
      const match = recipient.match(/<([^>]+)>/);
      return (match?.[1] ?? recipient).trim();
    })
    .filter(Boolean);
}

export async function sendEmail(
  connectionId: string,
  input: SendEmailInput,
): Promise<SendEmailResult> {
  const validatedInput = sendEmailInputSchema.parse(input);
  const gmail = await getGmail(connectionId);
  const raw = mapSendEmailInputToRawMessage(validatedInput);

  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  return {
    id: response.data.id ?? null,
    threadId: response.data.threadId ?? null,
    labelIds: response.data.labelIds ?? [],
  };
}

export async function listMessages(
  connectionId: string,
  input: ListMessagesInput = {},
): Promise<ListMessagesResult> {
  const validatedInput = listMessagesInputSchema.parse(input);
  const gmail = await getGmail(connectionId);
  const params: Record<string, unknown> = {
    userId: "me",
    maxResults: validatedInput.maxResults,
    includeSpamTrash: validatedInput.includeSpamTrash,
  };

  if (validatedInput.query) {
    params.q = validatedInput.query;
  }

  if (validatedInput.labelIds) {
    params.labelIds = validatedInput.labelIds;
  }

  if (validatedInput.pageToken) {
    params.pageToken = validatedInput.pageToken;
  }

  const response = await gmail.users.messages.list(params);

  return {
    messages: (response.data.messages ?? [])
      .map(mapGmailMessageSummary)
      .filter((message) => message !== null),
    nextPageToken: response.data.nextPageToken ?? null,
    resultSizeEstimate: response.data.resultSizeEstimate ?? null,
  };
}

export async function getMessage(
  connectionId: string,
  messageId: string,
): Promise<GmailMessage> {
  const gmail = await getGmail(connectionId);
  const response = await gmail.users.messages.get({
    userId: "me",
    id: messageId,
    format: "full",
  }) as GmailMessageApiResponse;

  return mapGmailMessage(response.data);
}

export async function createDraft(
  connectionId: string,
  input: CreateDraftInput,
): Promise<CreateDraftResult> {
  const validatedInput = createDraftInputSchema.parse(input);
  const gmail = await getGmail(connectionId);
  const raw = mapSendEmailInputToRawMessage(validatedInput);

  const response = await gmail.users.drafts.create({
    userId: "me",
    requestBody: {
      message: { raw },
    },
  });

  return {
    id: response.data.id ?? null,
    message: response.data.message
      ? {
          id: response.data.message.id ?? "",
          threadId: response.data.message.threadId ?? null,
          snippet: null,
          labelIds: response.data.message.labelIds ?? [],
        }
      : null,
  };
}

export async function sendDraft(
  connectionId: string,
  input: SendDraftInput,
): Promise<SendEmailResult> {
  const validatedInput = sendDraftInputSchema.parse(input);
  const gmail = await getGmail(connectionId);

  const response = await gmail.users.drafts.send({
    userId: "me",
    requestBody: { id: validatedInput.draftId },
  });

  return {
    id: response.data.id ?? null,
    threadId: response.data.threadId ?? null,
    labelIds: response.data.labelIds ?? [],
  };
}

export async function replyToMessage(
  connectionId: string,
  input: ReplyEmailInput,
): Promise<SendEmailResult> {
  const validatedInput = replyEmailInputSchema.parse(input);
  const original = await getMessage(connectionId, validatedInput.messageId);

  const recipients = new Set<string>();
  const from = original.from;

  if (from) {
    for (const recipient of extractEmailAddresses(from)) {
      recipients.add(recipient);
    }
  }

  if (validatedInput.includeOriginalRecipients) {
    for (const header of [original.to, original.cc]) {
      for (const recipient of extractEmailAddresses(header)) {
        recipients.add(recipient);
      }
    }
  }

  if (!recipients.size) {
    throw new Error("Original message has no reply recipients");
  }

  const subject = original.subject?.toLowerCase().startsWith("re:")
    ? original.subject
    : `Re: ${original.subject ?? ""}`.trim();

  const gmail = await getGmail(connectionId);
  const raw = mapSendEmailInputToRawMessage(
    {
      to: [...recipients],
      subject,
      body: validatedInput.body,
    },
    {
      "In-Reply-To": original.headers["message-id"] ?? original.id,
      References: original.headers.references
        ? `${original.headers.references} ${original.headers["message-id"] ?? original.id}`
        : (original.headers["message-id"] ?? original.id),
    },
  );

  const requestBody: { raw: string; threadId?: string } = { raw };

  if (original.threadId) {
    requestBody.threadId = original.threadId;
  }

  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody,
  }) as GmailMessageApiResponse;

  return {
    id: response.data.id ?? null,
    threadId: response.data.threadId ?? null,
    labelIds: response.data.labelIds ?? [],
  };
}

export async function getAttachment(
  connectionId: string,
  messageId: string,
  attachmentId: string,
): Promise<GmailAttachment> {
  const gmail = await getGmail(connectionId);
  const response = await gmail.users.messages.attachments.get({
    userId: "me",
    messageId,
    id: attachmentId,
  });

  return {
    attachmentId,
    messageId,
    data: response.data.data ?? "",
    size: response.data.size ?? null,
  };
}
