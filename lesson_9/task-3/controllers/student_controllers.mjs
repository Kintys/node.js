import StudentDBService from "../modules/student/StudentDBService.mjs";

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
            const student = await StudentDBService.getStudents({});
            res.render("student/student-register");
        } catch (error) {
            res.send(error.message).status(401);
        }
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
