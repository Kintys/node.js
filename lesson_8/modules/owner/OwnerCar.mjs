import mongoose, { Schema } from "mongoose";

const ownerCarSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
    },
});

// ownerCarSchema.statics.checkDatabaseExists = async function () {
//     const databases = await mongoose.connection.listDatabases();
//     return databases.databases.some((db) => db.name === config.dbName);
// };

// ownerCarSchema.statics.checkCollectionExists = async function () {
//     if (await this.checkDatabaseExists()) {
//         const collections = await mongoose.connection.db.listCollections({ name: "owners" }).toArray();
//         return collections.length > 0;
//     }
//     return false;
// };
const Owner = mongoose.model("Owner", ownerCarSchema);
export default Owner;
