import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEvent,
  listEvents,
  updateEvent,
} from "./calendar.controller.js";

export const calendarRouter = Router();

calendarRouter.get("/:connectionId/events", listEvents);
calendarRouter.get("/:connectionId/events/:eventId", getEvent);
calendarRouter.post("/:connectionId/events", createEvent);
calendarRouter.patch("/:connectionId/events/:eventId", updateEvent);
calendarRouter.delete("/:connectionId/events/:eventId", deleteEvent);
