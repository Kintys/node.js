import { Router } from "express";
import SeminarControllers from "../controllers/seminar_controllers.mjs";
const router = Router();

/* GET home page. */

router.get("/", SeminarControllers.renderSeminarForm);
router.post("/", SeminarControllers.registerSeminar);

export default router;
