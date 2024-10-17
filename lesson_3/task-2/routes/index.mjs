import { Router } from "express";
const router = Router();

/* GET home page. */
import MyPageControllers from "../controllers/myPageControllers.mjs";
// Задача 2. Розробити серверну частину додатку, який за відповідними маршрутами (“/”, “/coffee”, “/music”) повертає створені HTML документи.

router.get("/", MyPageControllers.renderMainPage);

router.get("/music", MyPageControllers.renderMusicPage);

router.get("/coffee", MyPageControllers.renderCoffeePage);

export default router;
