import pool from "../../../../../db/connectDB.mjs";
import MySQLCRUDManager from "../MySQLCRUDManager.mjs";
import bcrypt from "bcryptjs";
import { v1 as uuidv1, parse as uuidParse, stringify as uuidStringify } from "uuid";

class UsersDBService extends MySQLCRUDManager {
    async getUsersWithoutPassword() {
        try {
            const [columns] = await pool.query(`
                SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = 'users'  AND TABLE_SCHEMA = 'exclusive_db' AND COLUMN_NAME != 'password';
            `);
            const columnNames = columns.map((col) => `\`${col.COLUMN_NAME}\``).join(", ");

            const [rows] = await pool.query(`SELECT ${columnNames} FROM users;`);

            return rows.map((row) => ({
                ...row,
                _id: uuidStringify(row._id),
            }));
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    }
    async createNewAccountWithEmail(user) {
        try {
            const newPassWithHash = await this.getHashPassword(user.password ?? "");
            const timeBaseUuid = uuidv1();
            const result = super.create(
                {
                    _id: timeBaseUuid,
                    ...user,
                    password: newPassWithHash,
                },
                "password"
            );

            return result;
        } catch (error) {
            return error;
        }
    }
    async createNewAccountWithGoogleProfile(user) {
        const timeBaseUuid = uuidv1();
        const result = await super.create({
            _id: timeBaseUuid,
            ...user,
        });
        return result;
    }
    async findUserByEmail(filters) {
        try {
            const result = await super.findOne(filters);
            if (!result) return false;
            return result;
        } catch (error) {
            return error;
        }
    }
    async getUserProfileByIdWithOutPassword(id) {
        try {
            const result = await super.findOne(id, "password");
            return result;
        } catch (error) {}
    }
    async getHashPassword(password) {
        if (!password) throw new Error("password it's not correct");
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

export default new UsersDBService(pool, "users");
