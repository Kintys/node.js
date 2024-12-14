import mongoose from "mongoose";

const { Schema } = mongoose;

const brandSchema = new Schema({
    title: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [50, "Name must be at most 50 characters long"],
        trim: true,
    },
});

const Brand = mongoose.model("Brand", brandSchema);
export default Brand;
