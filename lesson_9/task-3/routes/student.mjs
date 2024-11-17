import { Router } from "express";
import StudentControllers from "../controllers/student_controllers.mjs";
import { checkSchema } from "express-validator";
import StudentValidator from "../validators/studentValidator.mjs";

const router = Router();

/* GET home page. */
router.get("/", StudentControllers.createStudentForm);

router.post("/", checkSchema(StudentValidator.studentSchema), StudentControllers.addNewToStudentList);

export default router;
