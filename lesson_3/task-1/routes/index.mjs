import { Router } from "express";
const router = Router();

/* GET home page. */
import TimeControllers from "../controllers/timeControllers.mjs";

// Задача 1. Розробити додаток з такими маршрутами:
// season повертає пору року
// day повертає поточний день
// time повертає час дня (ранок, обід, вечеря)

router.get("/season", TimeControllers.renderSeasonPage);

router.get("/day", TimeControllers.renderDayPage);

router.get("/time", TimeControllers.renderTimePage);

export default router;
