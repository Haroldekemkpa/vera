import { tool } from "langchain";
import { z } from "zod";

import {
  listSlackChannels,
  listSlackMessages,
  postSlackMessage,
} from "../integrations/slack/slack.service.js";
import { toToolResult } from "./toolResult.js";

export const listSlackChannelsTool = tool(
  (input) => toToolResult(() => listSlackChannels(input)),
  {
    name: "list_slack_channels",
    description: "List Slack channels.",
    schema: z.object({
      limit: z.number().int().min(1).max(200).default(100),
      cursor: z.string().trim().min(1).optional(),
      excludeArchived: z.boolean().default(true),
    }),
  },
);

export const listSlackMessagesTool = tool(
  ({ channelId, ...input }) => toToolResult(() => listSlackMessages(channelId, input)),
  {
    name: "list_slack_messages",
    description: "List Slack channel messages.",
    schema: z.object({
      channelId: z.string().min(1),
      limit: z.number().int().min(1).max(200).default(20),
      cursor: z.string().trim().min(1).optional(),
      latest: z.string().trim().min(1).optional(),
      oldest: z.string().trim().min(1).optional(),
    }),
  },
);

export const postSlackMessageTool = tool(
  (input) => toToolResult(() => postSlackMessage(input)),
  {
    name: "post_slack_message",
    description: "Post a message to Slack.",
    schema: z.object({
      channelId: z.string().trim().min(1),
      text: z.string().min(1),
      threadTs: z.string().trim().min(1).optional(),
    }),
  },
);

export const slackTools = [
  listSlackChannelsTool,
  listSlackMessagesTool,
  postSlackMessageTool,
];
