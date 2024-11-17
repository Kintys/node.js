import CoursesDBServices from "../modules/course/CoursesDBServices.mjs";
import StudentDBService from "../modules/student/StudentDBService.mjs";
import { validationResult } from "express-validator";
class CoursesControllers {
    static async renderCoursesList(req, res) {
        try {
            const coursesList = await CoursesDBServices.getList();
            res.render("courses/coursesList", {
                coursesList,
            });
        } catch (error) {
            res.send(error.message).status(401);
        }
    }
    static async createForm(req, res) {
        try {
            const students = await StudentDBService.getStudents({});
            res.render("courses/coursesForm", {
                students,
                errors: [],
                course: null,
            });
        } catch (error) {
            res.send(error.message).status(401);
        }
    }
    static async registerCourse(req, res) {
        const errors = validationResult(req);
        try {
            const students = await StudentDBService.getStudents({});
            const newData = req.body;
            if (!errors.isEmpty()) {
                res.render("courses/coursesForm", {
                    students,
                    errors: errors.array(),
                    course: newData,
                });
                return;
            }
            await CoursesDBServices.create(newData);
            res.redirect("/");
        } catch (error) {
            res.send(error.message).status(401);
        }
    }
}

export default CoursesControllers;
