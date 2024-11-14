import mongoose from "mongoose";
import { seminarSchema } from "../seminar/Seminar.mjs";
import { studentSchema } from "../student/Student.mjs";
import { config } from "../../config/default.mjs";
const { Schema } = mongoose;

const coursesSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name must be at most 50 characters long"],
        trim: true,
    },
    lifeTime: {
        type: Date,
        required: true,
    },
    students: [studentSchema],
    seminars: [seminarSchema],
});

coursesSchema.statics.checkDatabaseExists = async () => {
    const databases = await mongoose.connection.listDatabases();
    return databases.databases.some((db) => db.name === config.dbName);
};
coursesSchema.statics.checkCollectionExists = async function () {
    if (await this.checkDatabaseExists()) {
        const collections = await mongoose.connection.db.listCollections({ name: "courses" }).toArray();
        return collections.length > 0;
    }
    return false;
};
const Courses = mongoose.model("Courses", coursesSchema);
export default Courses;
