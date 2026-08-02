import { tool } from "langchain";
import { z } from "zod";

import {
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvent,
  listCalendarEvents,
  updateCalendarEvent,
} from "../integrations/calendar/calendar.service.js";
import { toToolResult } from "./toolResult.js";

const calendarDateTimeSchema = z.object({
  dateTime: z.string().datetime().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  timeZone: z.string().trim().min(1).optional(),
});

const calendarEventInputSchema = {
  calendarId: z.string().trim().min(1).default("primary"),
  summary: z.string().trim().min(1),
  description: z.string().optional(),
  location: z.string().optional(),
  start: calendarDateTimeSchema,
  end: calendarDateTimeSchema,
  attendees: z.array(z.object({ email: z.string().email() })).optional(),
};

export const listCalendarEventsTool = tool(
  ({ connectionId, ...input }) => toToolResult(() => listCalendarEvents(connectionId, input)),
  {
    name: "list_calendar_events",
    description: "List Google Calendar events.",
    schema: z.object({
      connectionId: z.string().min(1),
      calendarId: z.string().trim().min(1).default("primary"),
      query: z.string().trim().optional(),
      timeMin: z.string().datetime().optional(),
      timeMax: z.string().datetime().optional(),
      maxResults: z.number().int().min(1).max(250).default(10),
      pageToken: z.string().trim().min(1).optional(),
      singleEvents: z.boolean().default(true),
      orderBy: z.enum(["startTime", "updated"]).default("startTime"),
    }),
  },
);

export const getCalendarEventTool = tool(
  ({ connectionId, calendarId, eventId }) =>
    toToolResult(() => getCalendarEvent(connectionId, calendarId, eventId)),
  {
    name: "get_calendar_event",
    description: "Get a Google Calendar event by id.",
    schema: z.object({
      connectionId: z.string().min(1),
      calendarId: z.string().trim().min(1).default("primary"),
      eventId: z.string().min(1),
    }),
  },
);

export const createCalendarEventTool = tool(
  ({ connectionId, ...input }) => toToolResult(() => createCalendarEvent(connectionId, input)),
  {
    name: "create_calendar_event",
    description: "Create a Google Calendar event.",
    schema: z.object({
      connectionId: z.string().min(1),
      ...calendarEventInputSchema,
    }),
  },
);

export const updateCalendarEventTool = tool(
  ({ connectionId, eventId, ...input }) =>
    toToolResult(() => updateCalendarEvent(connectionId, eventId, input)),
  {
    name: "update_calendar_event",
    description: "Update a Google Calendar event.",
    schema: z.object({
      connectionId: z.string().min(1),
      eventId: z.string().min(1),
      calendarId: z.string().trim().min(1).default("primary"),
      summary: z.string().trim().min(1).optional(),
      description: z.string().optional(),
      location: z.string().optional(),
      start: calendarDateTimeSchema.optional(),
      end: calendarDateTimeSchema.optional(),
      attendees: z.array(z.object({ email: z.string().email() })).optional(),
    }),
  },
);

export const deleteCalendarEventTool = tool(
  ({ connectionId, calendarId, eventId }) =>
    toToolResult(() => deleteCalendarEvent(connectionId, calendarId, eventId)),
  {
    name: "delete_calendar_event",
    description: "Delete a Google Calendar event.",
    schema: z.object({
      connectionId: z.string().min(1),
      calendarId: z.string().trim().min(1).default("primary"),
      eventId: z.string().min(1),
    }),
  },
);

export const calendarTools = [
  listCalendarEventsTool,
  getCalendarEventTool,
  createCalendarEventTool,
  updateCalendarEventTool,
  deleteCalendarEventTool,
];
