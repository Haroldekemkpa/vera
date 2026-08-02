import { Router } from "express";
import { currentWeather, weatherForecast } from "./weather.controller.js";

export const weatherRouter = Router();

weatherRouter.get("/current", currentWeather);
weatherRouter.get("/forecast", weatherForecast);
