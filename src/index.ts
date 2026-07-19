// src/index.ts
import express from "express";
import dotenv from "dotenv";
// import { getGoogleAuthUrl, exchangeGoogleCode } from "./auth/google.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.listen(3000, () => {
  console.log(`VERA running on http://localhost:${PORT}`);
});
