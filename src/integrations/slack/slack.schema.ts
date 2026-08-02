import { z } from "zod";

export const slackChannelParamsSchema = z.object({
  channelId: z.string().min(1),
});

export const slackMessageParamsSchema = slackChannelParamsSchema.extend({
  ts: z.string().min(1),
});

export const listSlackChannelsInputSchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(100),
  cursor: z.string().trim().min(1).optional(),
  excludeArchived: z.coerce.boolean().default(true),
});

export const postSlackMessageInputSchema = z.object({
  channelId: z.string().trim().min(1),
  text: z.string().min(1),
  threadTs: z.string().trim().min(1).optional(),
});

export const listSlackMessagesInputSchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(20),
  cursor: z.string().trim().min(1).optional(),
  latest: z.string().trim().min(1).optional(),
  oldest: z.string().trim().min(1).optional(),
});
