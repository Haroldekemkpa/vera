import type {
  GmailAttachmentSummary,
  GmailHeaderMap,
  GmailMessage,
  GmailMessageSummary,
  ValidatedSendEmailInput,
} from "./gmail.types.js";

function escapeHeaderValue(value: string) {
  return value.replaceAll("\r", "").replaceAll("\n", " ");
}

export function encodeBase64Url(value: string) {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value.replaceAll("-", "+").replaceAll("_", "/"), "base64")
    .toString("utf8");
}

function formatAddressList(addresses: string[]) {
  return addresses.map(escapeHeaderValue).join(", ");
}

export function mapSendEmailInputToRawMessage(
  input: ValidatedSendEmailInput,
  extraHeaders: GmailHeaderMap = {},
) {
  const headers = [
    `To: ${formatAddressList(input.to)}`,
    `Subject: ${escapeHeaderValue(input.subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: 7bit",
  ];

  if (input.cc?.length) {
    headers.splice(1, 0, `Cc: ${formatAddressList(input.cc)}`);
  }

  if (input.bcc?.length) {
    headers.splice(1, 0, `Bcc: ${formatAddressList(input.bcc)}`);
  }

  if (input.replyTo) {
    headers.splice(1, 0, `Reply-To: ${escapeHeaderValue(input.replyTo)}`);
  }

  for (const [name, value] of Object.entries(extraHeaders)) {
    headers.splice(1, 0, `${escapeHeaderValue(name)}: ${escapeHeaderValue(value)}`);
  }

  return encodeBase64Url(`${headers.join("\r\n")}\r\n\r\n${input.body}`);
}

export function mapGmailMessageSummary(
  message: { id?: string | null; threadId?: string | null },
): GmailMessageSummary | null {
  if (!message.id) {
    return null;
  }

  return {
    id: message.id,
    threadId: message.threadId ?? null,
    snippet: null,
    labelIds: [],
  };
}

function getHeaders(payload: { headers?: Array<{ name?: string | null; value?: string | null }> } | null | undefined) {
  const headers: GmailHeaderMap = {};

  for (const header of payload?.headers ?? []) {
    if (header.name && header.value) {
      headers[header.name.toLowerCase()] = header.value;
    }
  }

  return headers;
}

function collectPayloadParts(
  part: {
    mimeType?: string | null;
    filename?: string | null;
    body?: { data?: string | null; attachmentId?: string | null; size?: number | null } | null;
    parts?: unknown[] | null;
  } | null | undefined,
  bodies: { text: string[]; html: string[] },
  attachments: GmailAttachmentSummary[],
) {
  if (!part) {
    return;
  }

  const filename = part.filename ?? "";
  const body = part.body;

  if (filename && body?.attachmentId) {
    attachments.push({
      id: body.attachmentId,
      filename,
      mimeType: part.mimeType ?? null,
      size: body.size ?? null,
    });
  } else if (body?.data && part.mimeType === "text/plain") {
    bodies.text.push(decodeBase64Url(body.data));
  } else if (body?.data && part.mimeType === "text/html") {
    bodies.html.push(decodeBase64Url(body.data));
  }

  for (const child of part.parts ?? []) {
    collectPayloadParts(
      child as Parameters<typeof collectPayloadParts>[0],
      bodies,
      attachments,
    );
  }
}

export function mapGmailMessage(message: {
  id?: string | null;
  threadId?: string | null;
  snippet?: string | null;
  labelIds?: string[] | null;
  historyId?: string | null;
  internalDate?: string | null;
  payload?: (Parameters<typeof collectPayloadParts>[0] & {
    headers?: Array<{ name?: string | null; value?: string | null }>;
  }) | undefined;
}): GmailMessage {
  if (!message.id) {
    throw new Error("Gmail message is missing an id");
  }

  const headers = getHeaders(message.payload);
  const bodies = { text: [] as string[], html: [] as string[] };
  const attachments: GmailAttachmentSummary[] = [];

  collectPayloadParts(message.payload, bodies, attachments);

  return {
    id: message.id,
    threadId: message.threadId ?? null,
    snippet: message.snippet ?? null,
    labelIds: message.labelIds ?? [],
    historyId: message.historyId ?? null,
    internalDate: message.internalDate ?? null,
    headers,
    subject: headers.subject ?? null,
    from: headers.from ?? null,
    to: headers.to ?? null,
    cc: headers.cc ?? null,
    date: headers.date ?? null,
    textBody: bodies.text.join("\n") || null,
    htmlBody: bodies.html.join("\n") || null,
    attachments,
  };
}
