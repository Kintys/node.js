import { Router } from "express";
import StudentControllers from "../controllers/student_controllers.mjs";
const router = Router();

/* GET home page. */
router.get("/", StudentControllers.createStudentForm);

router.post("/", StudentControllers.addNewToStudentList);

export default router;
