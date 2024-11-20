import { Router } from "express";
import CoursesControllers from "../controllers/courses_controllers.mjs";
import { checkSchema } from "express-validator";
import CourseValidator from "../validators/courseValidator.mjs";
import { ensureAuthenticated } from "../middleware/auth.mjs";

const router = Router();

router.get("/", ensureAuthenticated, CoursesControllers.renderCoursesList);
router.get("/form", ensureAuthenticated, CoursesControllers.createForm);

router.post("/form", ensureAuthenticated, checkSchema(CourseValidator.courseSchema), CoursesControllers.registerCourse);

export default router;
