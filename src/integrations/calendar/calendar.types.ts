import type { z } from "zod";
import type {
  createCalendarEventInputSchema,
  listCalendarEventsInputSchema,
  updateCalendarEventInputSchema,
} from "./calendar.schema.js";

export type ListCalendarEventsInput = z.input<typeof listCalendarEventsInputSchema>;
export type CreateCalendarEventInput = z.input<typeof createCalendarEventInputSchema>;
export type UpdateCalendarEventInput = z.input<typeof updateCalendarEventInputSchema>;

export type CalendarEventResult = {
  id: string | null;
  status: string | null;
  htmlLink: string | null;
  summary: string | null;
  description: string | null;
  location: string | null;
  start: unknown;
  end: unknown;
  attendees: unknown;
};

export type ListCalendarEventsResult = {
  events: CalendarEventResult[];
  nextPageToken: string | null;
};
