import MongooseCRUDManager from "../MongooseCRUDManager.mjs";
import Student from "./Student.mjs";

class StudentDBService {
    static async getStudents(filter = {}) {
        try {
            const res = await Student.find(filter, { name: 1 });
            return res;
        } catch (error) {
            return error.message;
        }
    }
    static async addStudent(data) {
        try {
            const newItem = new Student(data);
            return await newItem.save();
        } catch (error) {
            throw new Error("Error creating data: " + error.message);
        }
    }
}
export default StudentDBService;
