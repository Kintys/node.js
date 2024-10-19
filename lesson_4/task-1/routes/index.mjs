import { Router } from "express";
import MainController from "../controllers/main_controllers.mjs";
const router = Router();

router.get("/", MainController.renderMainPage);

export default router;
