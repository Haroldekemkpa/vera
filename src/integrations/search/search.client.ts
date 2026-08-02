function getTavilyApiKey() {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    throw new Error("Missing required environment variable: TAVILY_API_KEY");
  }

  return apiKey;
}

export async function tavilyRequest<T>(body: Record<string, unknown>): Promise<T> {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: getTavilyApiKey(),
      ...body,
    }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data === "object" && data && "error" in data
      ? String(data.error)
      : "Tavily search request failed";

    throw new Error(message);
  }

  return data as T;
}
