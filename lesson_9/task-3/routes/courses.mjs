import { Router } from "express";
import CoursesControllers from "../controllers/courses_controllers.mjs";
import { checkSchema } from "express-validator";
import CourseValidator from "../validators/courseValidator.mjs";

const router = Router();

router.get("/", CoursesControllers.renderCoursesList);
router.get("/form", CoursesControllers.createForm);

router.post("/form", checkSchema(CourseValidator.courseSchema), CoursesControllers.registerCourse);

export default router;
