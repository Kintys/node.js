import { Router } from "express";
import CoursesControllers from "../controllers/courses_controllers.mjs";

const router = Router();

router.get("/", CoursesControllers.renderCoursesList);
router.get("/form", CoursesControllers.createForm);

router.post("/form", CoursesControllers.registerCourse);

export default router;
