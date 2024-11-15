import mongoose from "mongoose";
// import { seminarSchema } from "../seminar/Seminar.mjs";
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
        type: Number,
        required: true,
    },
    students: {
        type: [Schema.Types.ObjectId],
        ref: "Student",
        required: true,
    },
    // seminars: [seminarSchema],
});

const Courses = mongoose.model("Courses", coursesSchema);
export default Courses;
