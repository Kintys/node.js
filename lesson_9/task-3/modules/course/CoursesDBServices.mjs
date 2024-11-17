import MongooseCRUDManager from "../MongooseCRUDManager.mjs";
import Courses from "./Course.mjs";

class CoursesBDServices extends MongooseCRUDManager {
    async getList(filter) {
        try {
            const results = await super.getList(filter || {}, null, [
                {
                    populateField: "students",
                    targetFieldsForPopulate: "name",
                },
                "seminars",
            ]);
            return results;
        } catch (error) {
            return error.message;
        }
    }
    async addNewSeminar(id, data) {
        try {
            const course = await super.getById(id);
            course.seminars.push(data);
            const res = await super.update(id, course);
        } catch (error) {
            return error.message;
        }
    }
}

export default new CoursesBDServices(Courses);
