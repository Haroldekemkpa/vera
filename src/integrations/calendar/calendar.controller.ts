import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import {
  calendarConnectionParamsSchema,
  calendarEventParamsSchema,
  listCalendarEventsInputSchema,
} from "./calendar.schema.js";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvent,
  listCalendarEvents,
  updateCalendarEvent,
} from "./calendar.service.js";

function handleCalendarError(error: unknown, res: Response) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid Calendar request",
      issues: error.issues,
    });
  }

  throw error;
}

function getCalendarId(req: Request) {
  return typeof req.query.calendarId === "string" && req.query.calendarId
    ? req.query.calendarId
    : "primary";
}

function handleControllerError(error: unknown, res: Response, next: NextFunction) {
  try {
    handleCalendarError(error, res);
  } catch (handledError) {
    next(handledError);
  }
}

export async function listEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId } = calendarConnectionParamsSchema.parse(req.params);
    const input = listCalendarEventsInputSchema.parse(req.query);

    res.json(await listCalendarEvents(connectionId, input));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function getEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId, eventId } = calendarEventParamsSchema.parse(req.params);
    res.json(await getCalendarEvent(connectionId, getCalendarId(req), eventId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function createEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId } = calendarConnectionParamsSchema.parse(req.params);
    res.status(201).json(await createCalendarEvent(connectionId, req.body));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function updateEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId, eventId } = calendarEventParamsSchema.parse(req.params);
    res.json(await updateCalendarEvent(connectionId, eventId, req.body));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const { connectionId, eventId } = calendarEventParamsSchema.parse(req.params);
    res.json(await deleteCalendarEvent(connectionId, getCalendarId(req), eventId));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}
