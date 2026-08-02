import type { z } from "zod";
import type {
  currentWeatherInputSchema,
  forecastWeatherInputSchema,
} from "./weather.schema.js";

export type CurrentWeatherInput = z.input<typeof currentWeatherInputSchema>;
export type ForecastWeatherInput = z.input<typeof forecastWeatherInputSchema>;

export type WeatherResult = {
  location: string;
  country: string | null;
  temperature: number | null;
  feelsLike: number | null;
  humidity: number | null;
  pressure: number | null;
  windSpeed: number | null;
  description: string | null;
  observedAt: string | null;
};

export type ForecastResult = {
  location: string;
  country: string | null;
  items: WeatherResult[];
};
