import User from "./User.mjs";

class UsersDBService {
    static async getList() {
        try {
            const exists = await User.checkCollectionExists();
            if (exists) {
                return await User.find({}).exec();
            }
            return [];
        } catch (error) {
            return error;
        }
    }
    static async create(data) {
        const user = new User(data);
        return await user.save();
    }
    static async getById(id) {
        return await User.findById(id);
    }
    static async update(id, data) {
        return await User.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }
    static async deleteById(id) {
        return await User.findByIdAndDelete(id);
    }
}
export default UsersDBService;
