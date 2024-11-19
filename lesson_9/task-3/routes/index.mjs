import express from "express";
import coursesRouter from "./courses.mjs";
import seminarRouter from "./seminar.mjs";
import studentRouter from "./student.mjs";
import mainRouter from "./main.mjs";
import loginRouter from "./login.mjs";
const router = express.Router();

router.use("/student", studentRouter);
router.use("/courses", coursesRouter);
router.use("/seminar", seminarRouter);
router.use("/login", loginRouter);
router.use("/", mainRouter);

export default router;
