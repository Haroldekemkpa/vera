import { getStoredGoogleConnection } from "../../auth/tokenStore.js";
import { createCalendarClient } from "./calendar.client.js";
import {
  createCalendarEventInputSchema,
  listCalendarEventsInputSchema,
  updateCalendarEventInputSchema,
} from "./calendar.schema.js";
import type {
  CalendarEventResult,
  CreateCalendarEventInput,
  ListCalendarEventsInput,
  ListCalendarEventsResult,
  UpdateCalendarEventInput,
} from "./calendar.types.js";

async function getCalendar(connectionId: string) {
  const connection = await getStoredGoogleConnection(connectionId);

  if (!connection) {
    throw new Error("Google connection not found");
  }

  return createCalendarClient(connection.tokens);
}

function mapCalendarEvent(event: {
  id?: string | null;
  status?: string | null;
  htmlLink?: string | null;
  summary?: string | null;
  description?: string | null;
  location?: string | null;
  start?: unknown;
  end?: unknown;
  attendees?: unknown;
}): CalendarEventResult {
  return {
    id: event.id ?? null,
    status: event.status ?? null,
    htmlLink: event.htmlLink ?? null,
    summary: event.summary ?? null,
    description: event.description ?? null,
    location: event.location ?? null,
    start: event.start ?? null,
    end: event.end ?? null,
    attendees: event.attendees ?? null,
  };
}

export async function listCalendarEvents(
  connectionId: string,
  input: ListCalendarEventsInput = {},
): Promise<ListCalendarEventsResult> {
  const validatedInput = listCalendarEventsInputSchema.parse(input);
  const calendar = await getCalendar(connectionId);
  const params: Record<string, unknown> = {
    calendarId: validatedInput.calendarId,
    maxResults: validatedInput.maxResults,
    singleEvents: validatedInput.singleEvents,
    orderBy: validatedInput.orderBy,
  };

  if (validatedInput.query) params.q = validatedInput.query;
  if (validatedInput.timeMin) params.timeMin = validatedInput.timeMin;
  if (validatedInput.timeMax) params.timeMax = validatedInput.timeMax;
  if (validatedInput.pageToken) params.pageToken = validatedInput.pageToken;

  const response = await calendar.events.list(params);

  return {
    events: (response.data.items ?? []).map(mapCalendarEvent),
    nextPageToken: response.data.nextPageToken ?? null,
  };
}

export async function getCalendarEvent(
  connectionId: string,
  calendarId: string,
  eventId: string,
): Promise<CalendarEventResult> {
  const calendar = await getCalendar(connectionId);
  const response = await calendar.events.get({ calendarId, eventId });

  return mapCalendarEvent(response.data);
}

export async function createCalendarEvent(
  connectionId: string,
  input: CreateCalendarEventInput,
): Promise<CalendarEventResult> {
  const validatedInput = createCalendarEventInputSchema.parse(input);
  const calendar = await getCalendar(connectionId);
  const requestBody: Record<string, unknown> = {
    summary: validatedInput.summary,
    start: validatedInput.start,
    end: validatedInput.end,
  };

  if (validatedInput.description) requestBody.description = validatedInput.description;
  if (validatedInput.location) requestBody.location = validatedInput.location;
  if (validatedInput.attendees) requestBody.attendees = validatedInput.attendees;

  const response = await calendar.events.insert({
    calendarId: validatedInput.calendarId,
    requestBody,
  } as Record<string, unknown>);

  return mapCalendarEvent(response.data);
}

export async function updateCalendarEvent(
  connectionId: string,
  eventId: string,
  input: UpdateCalendarEventInput,
): Promise<CalendarEventResult> {
  const validatedInput = updateCalendarEventInputSchema.parse(input);
  const calendar = await getCalendar(connectionId);
  const requestBody: Record<string, unknown> = {};

  if (validatedInput.summary) requestBody.summary = validatedInput.summary;
  if (validatedInput.description) requestBody.description = validatedInput.description;
  if (validatedInput.location) requestBody.location = validatedInput.location;
  if (validatedInput.start) requestBody.start = validatedInput.start;
  if (validatedInput.end) requestBody.end = validatedInput.end;
  if (validatedInput.attendees) requestBody.attendees = validatedInput.attendees;

  const response = await calendar.events.patch({
    calendarId: validatedInput.calendarId,
    eventId,
    requestBody,
  } as Record<string, unknown>);

  return mapCalendarEvent(response.data);
}

export async function deleteCalendarEvent(
  connectionId: string,
  calendarId: string,
  eventId: string,
) {
  const calendar = await getCalendar(connectionId);

  await calendar.events.delete({ calendarId, eventId });

  return { deleted: true };
}
