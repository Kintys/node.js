import { Router } from "express";
import SeminarControllers from "../controllers/seminar_controllers.mjs";
import SeminarValidator from "../validators/seminarValidator.mjs";
import { checkSchema } from "express-validator";
const router = Router();

/* GET home page. */

router.get("/:courseId", SeminarControllers.renderSeminarForm);
router.post("/:courseId", checkSchema(SeminarValidator.seminarSchema), SeminarControllers.registerSeminar);

export default router;
