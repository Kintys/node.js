import SeminarDBServices from "../modules/seminar/SeminarDBServices.mjs";
import StudentDBService from "../modules/student/StudentDBService.mjs";

class SeminarControllers {
    static async renderSeminarForm(req, res) {
        try {
            const students = await StudentDBService.getStudents();
            res.render("seminar/seminarForm", {
                students,
            });
        } catch (error) {
            res.send(error.message);
        }
    }
    static async registerSeminar(req, res) {
        try {
            const newSeminar = req.body;
            await SeminarDBServices.create(newSeminar);
            res.redirect("/");
        } catch (error) {
            res.send(error.message).status(401);
        }
    }
}
export default SeminarControllers;
