import MongooseCRUDManager from "../MongooseCRUDManager.mjs";
import Student from "./Student.mjs";

// class StudentDBService extends MongooseCRUDManager {
//     static async getList(filter) {
//         try {
//             const res = await super.getList(filter);
//             return res;
//         } catch (error) {
//             return error.message;
//         }
//     }
//     static async create(data) {
//         try {
//             await super.create(data);
//         } catch (error) {
//             return error.message;
//         }
//     }
// }
class StudentDBService {
    static async addStudent(data) {
        try {
            const newItem = new Student.model(data);
            return await newItem.save();
        } catch (error) {
            throw new Error("Error creating data: " + error.message);
        }
    }
}
export default StudentDBService;
