import CoursesDBServices from "../modules/course/CoursesDBServices.mjs";
import StudentDBService from "../modules/student/StudentDBService.mjs";
import { validationResult } from "express-validator";
class SeminarControllers {
    static async renderSeminarForm(req, res) {
        try {
            const courseId = req.params.courseId;
            const students = await StudentDBService.getStudents();
            res.render("seminar/seminarForm", {
                students,
                courseId,
                seminar: null,
                errors: [],
            });
        } catch (error) {
            res.send(error.message);
        }
    }
    static async registerSeminar(req, res) {
        const errors = validationResult(req);
        try {
            const courseId = req.params.courseId;
            if (!courseId) {
                throw new Error("Course id not found");
            }

            const students = await StudentDBService.getStudents();
            const { theme, lifeTime, description, student } = req.body;
            const newSeminar = { theme, lifeTime, description, student };
            if (!errors.isEmpty()) {
                res.render("seminar/seminarForm", {
                    students,
                    errors: errors.array(),
                    seminar: newSeminar,
                    courseId,
                });
                return;
            }
            await CoursesDBServices.addNewSeminar(courseId, { theme, lifeTime, description });
            res.redirect("/courses");
        } catch (error) {
            res.send(error.message).status(401);
        }
    }
}
export default SeminarControllers;
