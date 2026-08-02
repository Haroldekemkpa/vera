import { tool } from "langchain";
import { z } from "zod";

import {
  getCurrentWeather,
  getWeatherForecast,
} from "../integrations/weather/weather.service.js";
import { toToolResult } from "./toolResult.js";

const weatherBaseSchema = {
  city: z.string().trim().min(1),
  countryCode: z.string().trim().length(2).optional(),
  units: z.enum(["standard", "metric", "imperial"]).default("metric"),
  lang: z.string().trim().min(2).max(5).optional(),
};

export const getCurrentWeatherTool = tool(
  (input) => toToolResult(() => getCurrentWeather(input)),
  {
    name: "get_current_weather",
    description: "Get current weather for a city.",
    schema: z.object(weatherBaseSchema),
  },
);

export const getWeatherForecastTool = tool(
  (input) => toToolResult(() => getWeatherForecast(input)),
  {
    name: "get_weather_forecast",
    description: "Get weather forecast for a city.",
    schema: z.object({
      ...weatherBaseSchema,
      count: z.number().int().min(1).max(40).default(8),
    }),
  },
);

export const weatherTools = [
  getCurrentWeatherTool,
  getWeatherForecastTool,
];
