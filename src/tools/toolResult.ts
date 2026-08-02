export async function toToolResult<T>(operation: () => Promise<T>) {
  try {
    const data = await operation();

    return JSON.stringify({
      success: true,
      data,
    });
  } catch (error) {
    console.error("LangChain tool error:", error);

    return JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Tool execution failed.",
    });
  }
}
