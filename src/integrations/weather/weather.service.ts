import { openWeatherRequest } from "./weather.client.js";
import {
  currentWeatherInputSchema,
  forecastWeatherInputSchema,
} from "./weather.schema.js";
import type {
  CurrentWeatherInput,
  ForecastResult,
  ForecastWeatherInput,
  WeatherResult,
} from "./weather.types.js";

type OpenWeatherItem = {
  name?: string;
  dt?: number;
  main?: {
    temp?: number;
    feels_like?: number;
    humidity?: number;
    pressure?: number;
  };
  wind?: {
    speed?: number;
  };
  weather?: Array<{ description?: string }>;
  sys?: {
    country?: string;
  };
};

function locationQuery(city: string, countryCode?: string) {
  return countryCode ? `${city},${countryCode}` : city;
}

function mapWeather(item: OpenWeatherItem, fallbackLocation: string): WeatherResult {
  return {
    location: item.name ?? fallbackLocation,
    country: item.sys?.country ?? null,
    temperature: item.main?.temp ?? null,
    feelsLike: item.main?.feels_like ?? null,
    humidity: item.main?.humidity ?? null,
    pressure: item.main?.pressure ?? null,
    windSpeed: item.wind?.speed ?? null,
    description: item.weather?.[0]?.description ?? null,
    observedAt: item.dt ? new Date(item.dt * 1000).toISOString() : null,
  };
}

export async function getCurrentWeather(
  input: CurrentWeatherInput,
): Promise<WeatherResult> {
  const validatedInput = currentWeatherInputSchema.parse(input);
  const query = locationQuery(validatedInput.city, validatedInput.countryCode);
  const response = await openWeatherRequest<OpenWeatherItem>("/weather", {
    q: query,
    units: validatedInput.units,
    lang: validatedInput.lang,
  });

  return mapWeather(response, validatedInput.city);
}

export async function getWeatherForecast(
  input: ForecastWeatherInput,
): Promise<ForecastResult> {
  const validatedInput = forecastWeatherInputSchema.parse(input);
  const query = locationQuery(validatedInput.city, validatedInput.countryCode);
  const response = await openWeatherRequest<{
    city?: { name?: string; country?: string };
    list?: OpenWeatherItem[];
  }>("/forecast", {
    q: query,
    units: validatedInput.units,
    lang: validatedInput.lang,
    cnt: validatedInput.count,
  });

  return {
    location: response.city?.name ?? validatedInput.city,
    country: response.city?.country ?? null,
    items: (response.list ?? []).map((item) => mapWeather(item, response.city?.name ?? validatedInput.city)),
  };
}
