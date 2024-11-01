import mongoose from "mongoose";
import config from "../../config/default.mjs";
const { Schema } = mongoose;

const carSchema = new Schema({
    name: {
        type: String,
        required: [true, "Age is required"],
        minlength: [4, "Minimum length is 4 "],
        maxlength: [10, "Maximum length is 10 "],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        minlength: [1, "Minimum is 1$ "],
        // set: (value) => parseInt(value, 10),
        trim: true,
    },
    dataRelease: {
        type: Number,
        required: [true, "Data is required"],
        minlength: [4, "Minimum length is 4"],
        maxlength: [8, "Maximum length is 8"],
        default: Date.now,
        trim: true,
    },
    description: {
        type: String,
        minlength: [10, "Minimum length is 10"],
        trim: true,
    },
    img: {
        type: Buffer,
        required: [true, "Image is required"],
    },
});

carSchema.statics.checkDatabaseExists = async function () {
    const databases = await mongoose.connection.listDatabases();
    return databases.databases.some((db) => db.name === config.dbName);
};

carSchema.statics.checkCollectionExists = async function () {
    if (await this.checkDatabaseExists()) {
        const collections = await mongoose.connection.db.listCollections({ name: "cars" }).toArray();
        return collections.length > 0;
    }
    return false;
};
const Car = mongoose.model("Car", carSchema);

export default Car;
