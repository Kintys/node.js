import CoursesDBServices from "../modules/course/CoursesDBServices.mjs";
import SeminarDBServices from "../modules/seminar/SeminarDBServices.mjs";
import StudentDBService from "../modules/student/StudentDBService.mjs";

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
            const seminars = await SeminarDBServices.getList({}, { responsiblePerson: 0 });
            res.render("courses/coursesForm", {
                students,
                seminars,
            });
        } catch (error) {
            res.send(error.message).status(401);
        }
    }
    static async registerCourse(req, res) {
        try {
            const newData = req.body;
            await CoursesDBServices.create(newData);
            res.redirect("/");
        } catch (error) {
            res.send(error.message).status(401);
        }
    }
}

export default CoursesControllers;
