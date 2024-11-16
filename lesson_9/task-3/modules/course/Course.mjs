import mongoose from "mongoose";
const { Schema } = mongoose;

export const seminarSchema = new Schema({
    theme: {
        type: String,
        required: true,
        trim: true,
    },
    lifeTime: {
        type: Number,
        required: true,
    },
    responsiblePerson: {
        type: Schema.Types.ObjectId,
        ref: "Student",
    },
});

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
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },
    ],
    seminars: [seminarSchema],
});

const Courses = mongoose.model("Courses", coursesSchema);
export default Courses;
