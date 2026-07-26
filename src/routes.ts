import { Router } from "express";
import { authRouter } from "./auth/routes.js";
import { calendarRouter } from "./integrations/calendar/calendar.routes.js";
import { driveRouter } from "./integrations/drive/drive.routes.js";
import { gmailRouter } from "./integrations/gmail/gmail.routes.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/calendar", calendarRouter);
apiRouter.use("/drive", driveRouter);
apiRouter.use("/gmail", gmailRouter);
