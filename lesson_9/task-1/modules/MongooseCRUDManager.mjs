class MongooseCRUDManager {
    constructor(model) {
        this.model = model;
    }
    async getList(filter = {}, project = null, populateFields = []) {
        try {
            let query = this.model.find(filter, project);
            for (const field of populateFields) {
                if (typeof field === "string") {
                    query = query.populate(field);
                } else if (typeof field === "object" && field.populateField && field.targetFieldsForPopulate) {
                    query = query.populate(field.populateField, field.targetFieldsForPopulate);
                }
            }
            const results = await query.exec();
            return results.map((doc) => doc.toObject());
        } catch (error) {
            throw new Error("Error retrieving data:" + error.message);
        }
    }
    async create(data) {
        try {
            const newItem = new this.model(data);
            return await newItem.save();
        } catch (error) {
            throw new Error("Error creating data: " + error.message);
        }
    }
}

export default MongooseCRUDManager;
