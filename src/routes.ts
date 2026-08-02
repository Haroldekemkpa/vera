import { Router } from "express";
import { authRouter } from "./auth/routes.js";
import { calendarRouter } from "./integrations/calendar/calendar.routes.js";
import { driveRouter } from "./integrations/drive/drive.routes.js";
import { gmailRouter } from "./integrations/gmail/gmail.routes.js";
import { notionRouter } from "./integrations/notion/notion.routes.js";
import { searchRouter } from "./integrations/search/search.routes.js";
import { sheetsRouter } from "./integrations/sheets/sheets.routes.js";
import { slackRouter } from "./integrations/slack/slack.routes.js";
import { weatherRouter } from "./integrations/weather/weather.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/calendar", calendarRouter);
apiRouter.use("/drive", driveRouter);
apiRouter.use("/gmail", gmailRouter);
apiRouter.use("/notion", notionRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/sheets", sheetsRouter);
apiRouter.use("/slack", slackRouter);
apiRouter.use("/weather", weatherRouter);
