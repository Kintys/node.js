import StudentDBService from "../modules/student/StudentDBService.mjs";
import { validationResult } from "express-validator";
class StudentControllers {
    static async renderStudentsList(req, res) {
        try {
            const studentList = await StudentDBService.getStudents({});
            res.render("/student/studentList", {
                students: studentList,
            });
        } catch (error) {
            res.send(error.message).status(401);
        }
    }
    static async createStudentForm(req, res) {
        try {
            res.render("student/student-register", {
                errors: [],
                student: null,
            });
        } catch (error) {
            res.send(error.message).status(401);
        }
    }
    static async addNewToStudentList(req, res) {
        const errors = validationResult(req);
        try {
            const newStudent = req.body;
            if (!errors.isEmpty()) {
                res.render("student/student-register", {
                    errors: errors.array(),
                    student: newStudent,
                });
                return;
            }
            await StudentDBService.addStudent(newStudent);
            res.redirect("/");
        } catch (error) {
            res.send(error.message).status(401);
        }
    }
}

export default StudentControllers;
