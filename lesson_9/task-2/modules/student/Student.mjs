import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name must be at most 50 characters long"],
        trim: true,
    },
    age: {
        type: Number,
        required: true,
    },
    averageMark: {
        type: Number,
        required: true,
    },
});
const Student = mongoose.model("Student", studentSchema);
export default Student;
