const notionVersion = process.env.NOTION_VERSION ?? "2022-06-28";

function getNotionToken() {
  const token = process.env.NOTION_API_KEY;

  if (!token) {
    throw new Error("Missing required environment variable: NOTION_API_KEY");
  }

  return token;
}

export async function notionRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getNotionToken()}`,
      "Content-Type": "application/json",
      "Notion-Version": notionVersion,
      ...init.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = typeof data === "object" && data && "message" in data
      ? String(data.message)
      : "Notion request failed";

    throw new Error(message);
  }

  return data as T;
}
