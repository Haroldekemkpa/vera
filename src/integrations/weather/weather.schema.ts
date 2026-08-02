import { z } from "zod";

export const weatherUnitsSchema = z.enum(["standard", "metric", "imperial"]);

export const currentWeatherInputSchema = z.object({
  city: z.string().trim().min(1),
  countryCode: z.string().trim().length(2).optional(),
  units: weatherUnitsSchema.default("metric"),
  lang: z.string().trim().min(2).max(5).optional(),
});

export const forecastWeatherInputSchema = currentWeatherInputSchema.extend({
  count: z.coerce.number().int().min(1).max(40).default(8),
});
