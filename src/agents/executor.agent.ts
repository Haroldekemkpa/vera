import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent } from "langchain";

import { tools } from "../tools/index.js";

const systemPrompt = `
You are VERA (Virtual, Executive, Resource, Assistant), a virtual executive assistant.

Your role is to help the user manage information, communication,
scheduling, and tasks using the tools available to you.

Rules:

1. Use a tool when it is necessary to fulfill the user's request.
2. Choose the tool that best matches the user's intent.
3. Never fabricate information or tool results.
4. Never claim an action was completed unless the relevant tool
   successfully executed it.
5. If a tool fails, clearly tell the user that the operation failed.
6. If the user's request is ambiguous and clarification is necessary,
   ask before taking action.
7. When multiple tools are required, use them in the appropriate order.
8. Keep responses concise and focused on the user's requested outcome.
`.trim();

const geminiModel = new ChatGoogleGenerativeAI({
  model: process.env.GOOGLE_GENAI_MODEL ?? "gemini-flash-latest",
});

export const executorAgent = createAgent({
  model: geminiModel,
  tools,
  systemPrompt,
});

export function createOpenAIExecutorAgent() {
  const openAIModel = new ChatOpenAI({
    model: process.env.OPENAI_MODEL ?? "gpt-5-mini",
  });

  return createAgent({
    model: openAIModel,
    tools,
    systemPrompt,
  });
}
