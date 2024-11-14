import mongoose from "mongoose";
import config from "../../config/default.mjs";
const { Schema } = mongoose;
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [50, "Name must be at most 50 characters long"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        // minlength: [6, "Password must be at least 6 characters long"],
        // maxlength: [8, "Password must be at most 8characters long"],
        // validate: {
        //     validator: function (v) {
        //         return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
        //     },

        //     message: (props) => "Password must contain at least one letter, one number, and one special character",
        // },
    },
});
userSchema.statics.checkDatabaseExists = async () => {
    const databases = await mongoose.connection.listDatabases();
    return databases.databases.some((db) => db.name === config.dbName);
};
userSchema.statics.checkCollectionExists = async function () {
    if (await this.checkDatabaseExists()) {
        const collections = await mongoose.connection.db.listCollections({ name: "users" }).toArray();
        return collections.length > 0;
    }
    return false;
};
const User = mongoose.model("User", userSchema);
export default User;
