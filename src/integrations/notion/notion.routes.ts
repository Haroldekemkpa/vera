import { Router } from "express";
import { createPage, getPage, queryDatabase, search } from "./notion.controller.js";

export const notionRouter = Router();

notionRouter.get("/search", search);
notionRouter.get("/pages/:pageId", getPage);
notionRouter.post("/pages", createPage);
notionRouter.post("/databases/:databaseId/query", queryDatabase);
