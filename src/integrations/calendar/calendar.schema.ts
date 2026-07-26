import { z } from "zod";

export const calendarConnectionParamsSchema = z.object({
  connectionId: z.string().min(1),
});

export const calendarEventParamsSchema = calendarConnectionParamsSchema.extend({
  eventId: z.string().min(1),
});

export const listCalendarEventsInputSchema = z.object({
  calendarId: z.string().trim().min(1).default("primary"),
  query: z.string().trim().optional(),
  timeMin: z.string().datetime().optional(),
  timeMax: z.string().datetime().optional(),
  maxResults: z.coerce.number().int().min(1).max(250).default(10),
  pageToken: z.string().trim().min(1).optional(),
  singleEvents: z.coerce.boolean().default(true),
  orderBy: z.enum(["startTime", "updated"]).default("startTime"),
});

const calendarEventDateTimeSchema = z.object({
  dateTime: z.string().datetime().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  timeZone: z.string().trim().min(1).optional(),
}).refine((value) => Boolean(value.dateTime) !== Boolean(value.date), {
  message: "Provide exactly one of dateTime or date",
});

export const createCalendarEventInputSchema = z.object({
  calendarId: z.string().trim().min(1).default("primary"),
  summary: z.string().trim().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  start: calendarEventDateTimeSchema,
  end: calendarEventDateTimeSchema,
  attendees: z.array(z.object({ email: z.string().email() })).optional(),
});

export const updateCalendarEventInputSchema =
  createCalendarEventInputSchema.partial().extend({
    calendarId: z.string().trim().min(1).default("primary"),
  });
