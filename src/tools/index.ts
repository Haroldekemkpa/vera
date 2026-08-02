export * from "./calendar.tools.js";
export * from "./drive.tools.js";
export * from "./gmail.tools.js";
export * from "./notion.tools.js";
export * from "./search.tools.js";
export * from "./sheets.tools.js";
export * from "./slack.tools.js";
export * from "./weather.tools.js";

import { calendarTools } from "./calendar.tools.js";
import { driveTools } from "./drive.tools.js";
import { gmailTools } from "./gmail.tools.js";
import { notionTools } from "./notion.tools.js";
import { searchTools } from "./search.tools.js";
import { sheetsTools } from "./sheets.tools.js";
import { slackTools } from "./slack.tools.js";
import { weatherTools } from "./weather.tools.js";

export const tools = [
  ...gmailTools,
  ...calendarTools,
  ...driveTools,
  ...sheetsTools,
  ...slackTools,
  ...notionTools,
  ...weatherTools,
  ...searchTools,
];
