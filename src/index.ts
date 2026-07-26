// src/index.ts
import express from "express";
import dotenv from "dotenv";
import { apiRouter } from "./routes.js";

dotenv.config();
const PORT = Number(process.env.PORT ?? 3000);
const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", apiRouter);

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const message = error instanceof Error ? error.message : "Unknown error";

    res.status(500).json({
      message: "Internal server error",
      error: message,
    });
  },
);

app.listen(PORT, () => {
  console.log(`VERA running on http://localhost:${PORT}`);
});
