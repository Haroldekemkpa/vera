import type { z } from "zod";
import type {
  listSlackChannelsInputSchema,
  listSlackMessagesInputSchema,
  postSlackMessageInputSchema,
} from "./slack.schema.js";

export type ListSlackChannelsInput = z.input<typeof listSlackChannelsInputSchema>;
export type ListSlackMessagesInput = z.input<typeof listSlackMessagesInputSchema>;
export type PostSlackMessageInput = z.input<typeof postSlackMessageInputSchema>;

export type SlackChannel = {
  id: string;
  name: string | null;
  isArchived: boolean;
  isPrivate: boolean;
};

export type SlackMessage = {
  type: string | null;
  user: string | null;
  text: string | null;
  ts: string;
  threadTs: string | null;
};

export type SlackPagedResult<T> = {
  items: T[];
  nextCursor: string | null;
};

export type SlackPostMessageResult = {
  channel: string | null;
  ts: string | null;
  message: unknown;
};
