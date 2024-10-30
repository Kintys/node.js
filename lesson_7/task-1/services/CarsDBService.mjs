import Cars from "../modules/cars/Cars.mjs";

class CarsDBService {
    static async getList() {
        try {
            const exists = await Cars.checkCollectionExists();
            if (exists) {
                return await Cars.find({}).exec();
            }
            return [];
        } catch (error) {
            return error;
        }
    }
    static async create(data) {
        const car = new Cars(data);
        return await car.save();
    }
    static async getById(id) {
        return await Cars.findById(id);
    }
    static async update(id, data) {
        return await Cars.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }
    static async deleteById(id) {
        return await Cars.findByIdAndDelete(id);
    }
}
export default CarsDBService;
