import { slackRequest } from "./slack.client.js";
import {
  listSlackChannelsInputSchema,
  listSlackMessagesInputSchema,
  postSlackMessageInputSchema,
} from "./slack.schema.js";
import type {
  ListSlackChannelsInput,
  ListSlackMessagesInput,
  PostSlackMessageInput,
  SlackChannel,
  SlackMessage,
  SlackPagedResult,
  SlackPostMessageResult,
} from "./slack.types.js";

type SlackResponseMetadata = {
  next_cursor?: string;
};

export async function listSlackChannels(
  input: ListSlackChannelsInput = {},
): Promise<SlackPagedResult<SlackChannel>> {
  const validatedInput = listSlackChannelsInputSchema.parse(input);
  const response = await slackRequest<{
    channels?: Array<{
      id?: string;
      name?: string;
      is_archived?: boolean;
      is_private?: boolean;
    }>;
    response_metadata?: SlackResponseMetadata;
  }>("conversations.list", {
    limit: validatedInput.limit,
    cursor: validatedInput.cursor,
    exclude_archived: validatedInput.excludeArchived,
  });

  return {
    items: (response.channels ?? []).map((channel) => ({
      id: channel.id ?? "",
      name: channel.name ?? null,
      isArchived: channel.is_archived ?? false,
      isPrivate: channel.is_private ?? false,
    })),
    nextCursor: response.response_metadata?.next_cursor || null,
  };
}

export async function listSlackMessages(
  channelId: string,
  input: ListSlackMessagesInput = {},
): Promise<SlackPagedResult<SlackMessage>> {
  const validatedInput = listSlackMessagesInputSchema.parse(input);
  const response = await slackRequest<{
    messages?: Array<{
      type?: string;
      user?: string;
      text?: string;
      ts?: string;
      thread_ts?: string;
    }>;
    response_metadata?: SlackResponseMetadata;
  }>("conversations.history", {
    channel: channelId,
    limit: validatedInput.limit,
    cursor: validatedInput.cursor,
    latest: validatedInput.latest,
    oldest: validatedInput.oldest,
  });

  return {
    items: (response.messages ?? []).map((message) => ({
      type: message.type ?? null,
      user: message.user ?? null,
      text: message.text ?? null,
      ts: message.ts ?? "",
      threadTs: message.thread_ts ?? null,
    })),
    nextCursor: response.response_metadata?.next_cursor || null,
  };
}

export async function postSlackMessage(
  input: PostSlackMessageInput,
): Promise<SlackPostMessageResult> {
  const validatedInput = postSlackMessageInputSchema.parse(input);
  const response = await slackRequest<{
    channel?: string;
    ts?: string;
    message?: unknown;
  }>("chat.postMessage", {
    channel: validatedInput.channelId,
    text: validatedInput.text,
    thread_ts: validatedInput.threadTs,
  });

  return {
    channel: response.channel ?? null,
    ts: response.ts ?? null,
    message: response.message ?? null,
  };
}
