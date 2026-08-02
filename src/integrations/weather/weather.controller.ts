import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import {
  currentWeatherInputSchema,
  forecastWeatherInputSchema,
} from "./weather.schema.js";
import { getCurrentWeather, getWeatherForecast } from "./weather.service.js";

function handleControllerError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Invalid Weather request",
      issues: error.issues,
    });
  }

  next(error);
}

export async function currentWeather(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await getCurrentWeather(currentWeatherInputSchema.parse(req.query)));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}

export async function weatherForecast(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await getWeatherForecast(forecastWeatherInputSchema.parse(req.query)));
  } catch (error) {
    handleControllerError(error, res, next);
  }
}
