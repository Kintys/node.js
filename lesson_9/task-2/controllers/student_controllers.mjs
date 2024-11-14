import StudentDBService from "../modules/student/StudentDBService.mjs";

class StudentControllers {
    static async renderStudentsList(req, res) {
        try {
            const studentList = await StudentDBService.getStudentsList({});
            res.render("/student/studentList", {
                students: studentList,
            });
        } catch (error) {
            res.send(error.message).status(401);
        }
    }
    static createStudentForm(req, res) {
        res.render("student/student-register");
    }
    static async addNewToStudentList(req, res) {
        try {
            const newStudent = req.body;
            await StudentDBService.addStudent(newStudent);
            res.redirect("/");
        } catch (error) {
            res.send(error.message).status(401);
        }
    }
}

export default StudentControllers;
