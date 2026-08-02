function getWeatherApiKey() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing required environment variable: OPENWEATHER_API_KEY");
  }

  return apiKey;
}

export async function openWeatherRequest<T>(
  path: string,
  params: Record<string, string | number | undefined>,
): Promise<T> {
  const searchParams = new URLSearchParams();
  searchParams.set("appid", getWeatherApiKey());

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5${path}?${searchParams.toString()}`,
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data === "object" && data && "message" in data
      ? String(data.message)
      : "OpenWeather request failed";

    throw new Error(message);
  }

  return data as T;
}
