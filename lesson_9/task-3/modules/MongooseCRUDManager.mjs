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
                } else if (typeof field === "object" && field.populateField) {
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
    async getById(id, populateFields = []) {
        try {
            let query = this.model.findById(id);
            populateFields.forEach((field) => {
                query = query.populate(field);
            });
            return await query.exec();
        } catch (error) {
            throw new Error("Error finding data by id: " + error.message);
        }
    }
    async update(id, data) {
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
        } catch (error) {
            throw new Error("Error updating data: " + error.message);
        }
    }
    async findOne(filters = {}, projection = null, populateFields = []) {
        try {
            let query = this.model.findOne(filters, projection);
            populateFields.forEach((field) => {
                if (typeof field === "string") {
                    // Якщо поле передано як рядок
                    query = query.populate(field);
                } else if (
                    typeof field === "object" &&
                    field.fieldForPopulation &&
                    field.requiredFieldsFromTargetObject
                ) {
                    // Якщо передано об'єкт з полем для заповнення та запитуваними полями
                    query = query.populate(field.fieldForPopulation, field.requiredFieldsFromTargetObject);
                }
            });
            return await query.exec();
        } catch (error) {
            throw new Error("Error finding data by id: " + error.message);
        }
    }
}

export default MongooseCRUDManager;
