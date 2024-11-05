import Owner from "./OwnerCar.mjs";

class OwnerDBService {
    static async getList() {
        return await Owner.find({}).exec();
        // try {
        //     const exists = await Owner.checkCollectionExists();
        //     if (exists) {
        //         return await Owner.find({}).exec();
        //     }
        //     return [];
        // } catch (error) {
        //     return error;
        // }
    }
    static async create(data) {
        const owner = new Owner(data);
        return await owner.save();
    }
    static async getById(id) {
        return await Owner.findById(id);
    }
    static async update(id, data) {
        return await Owner.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }
    static async deleteById(id) {
        return await Owner.findByIdAndDelete(id);
    }
}
export default OwnerDBService;
