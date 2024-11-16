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
    // static async createNewCourses(data){
    //     try {
    //         await super.create()
    //     } catch (error) {

    //     }
    // }
}
// const CallClass = new CoursesBDServices(Courses);
export default new CoursesBDServices(Courses);
