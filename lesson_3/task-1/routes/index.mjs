import { Router } from "express";
const router = Router();

/* GET home page. */
import TimeControllers from "../controllers/timeControllers.mjs";

router.get("/", TimeControllers.renderMainPage);

router.get("/season", TimeControllers.renderSeasonPage);

router.get("/day", TimeControllers.renderDayPage);

router.get("/time", TimeControllers.renderTimePage);

export default router;
