import pool from "../../../../../config/default.mjs";
import MySQLCRUDManager from "../MySQLCRUDManager.mjs";
import bcrypt from "bcryptjs";
import { v1 as uuidv1, parse as uuidParse, stringify as uuidStringify } from "uuid";

class UsersDBService extends MySQLCRUDManager {
    async unParseId(userData) {
        delete userData["password"];
        return { ...userData, _id: uuidStringify(userData._id) };
    }

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
            const binaryUuid = Buffer.from(uuidParse(timeBaseUuid));
            const result = super.create(
                {
                    _id: binaryUuid,
                    ...user,
                    password: newPassWithHash,
                },
                "password"
            );

            return await this.unParseId(result);
        } catch (error) {
            return error;
        }
    }
    async createNewAccountWithGoogleProfile(user) {
        const timeBaseUuid = uuidv1();
        const binaryUuid = Buffer.from(uuidParse(timeBaseUuid));
        const result = super.create({
            _id: binaryUuid,
            ...user,
        });

        return await this.unParseId(result);
    }
    async findUserByEmail(filters) {
        try {
            const result = await super.findOne(filters);
            if (!result) return false;
            return await this.unParseId(result);
        } catch (error) {
            return error;
        }
    }
    async getUserProfileByIdWithOutPassword(id) {
        try {
            if (!id) throw new Error("Id is not correct");
            const binaryUuid = Buffer.from(uuidParse(id));
            const result = await super.findOne(binaryUuid, "password");

            return this.unParseId(result);
        } catch (error) {}
    }
    async getHashPassword(password) {
        if (!password) throw new Error("password it's not correct");
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

export default new UsersDBService(pool, "users");
