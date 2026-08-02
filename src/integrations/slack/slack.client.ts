function getSlackToken() {
  const token = process.env.SLACK_BOT_TOKEN;

  if (!token) {
    throw new Error("Missing required environment variable: SLACK_BOT_TOKEN");
  }

  return token;
}

export async function slackRequest<T>(
  method: string,
  body?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`https://slack.com/api/${method}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSlackToken()}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body ?? {}),
  });
  const data = await response.json() as { ok?: boolean; error?: string };

  if (!response.ok || data.ok === false) {
    throw new Error(data.error ?? "Slack request failed");
  }

  return data as T;
}
