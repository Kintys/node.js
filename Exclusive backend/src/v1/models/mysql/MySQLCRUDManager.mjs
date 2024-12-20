import config from "../../../../config/default.mjs";
class MySQLCRUDManager {
    constructor(pool, module) {
        this.pool = pool;
        this.module = module;
    }
    async getList() {
        try {
            const [rows] = await this.pool.query(`SELECT * FROM ${this.module};`);
            return rows;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

    async create(data, projections) {
        try {
            const sql = `INSERT INTO ${this.module} SET ? ;`;
            const saveResult = await this.pool.query(sql, data);
            if (saveResult.affectedRows === 0) {
                throw new Error("INSERT INTO");
            }
            const result = await this.findOne({ _id: data._id });
            return result;
        } catch (error) {
            console.error("Error saving data:", error);
            return null;
        }
    }

    async getById(id) {
        try {
            const sql = `SELECT * FROM ${this.module} WHERE _id = ?`;
            const [rows] = await this.pool.query(sql, [id]);
            return rows[0] || null;
        } catch (error) {
            console.error("Error fetching data by ID:", error);
            return null;
        }
    }

    async update(id, data) {
        try {
            const sql = `UPDATE ${this.module} SET ? WHERE _id = ?`;
            const [result] = await this.pool.query(sql, [data, id]);
            if (result.affectedRows === 0) {
                return null;
            }
            return { id, ...data };
        } catch (error) {
            console.error("Error updating data:", error);
            return null;
        }
    }

    async deleteById(id) {
        try {
            const sql = `DELETE FROM ${this.module} WHERE _id = ?`;
            const [result] = await this.pool.query(sql, [id]);
            if (result.affectedRows === 0) {
                return null;
            }
            return { id };
        } catch (error) {
            console.error("Error deleting data:", error);
            return null;
        }
    }
    async findOne(params, projections) {
        try {
            const allowedColumns = await this.getColumnsNameFromTable(projections);
            const columnName = Object.keys(params)[0];
            if (!allowedColumns.includes(columnName)) throw new Error(`Invalid column name: ${columnName}`);

            const sql = `SELECT ${allowedColumns} FROM ${this.module} WHERE ${columnName} = ? LIMIT 1`;

            const values = [`${params[columnName]}`];
            const [result] = await this.pool.query(sql, values);

            if (result.length === 0) {
                return false;
            }

            return result[0];
        } catch (error) {
            return error;
        }
    }

    async getColumnsNameFromTable(excludedColumn = null) {
        try {
            const query = `
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ? 
            ${excludedColumn ? "AND COLUMN_NAME != ?" : ""};
        `;
            const values = excludedColumn
                ? [this.module, config.db.mysql.database, excludedColumn]
                : [this.module, config.db.mysql.database];

            const [columns] = await this.pool.query(query, values);

            return columns.map((col) => col.COLUMN_NAME);
        } catch (error) {
            console.error("Error in getColumnNameFromTable:", error.message);
            throw error;
        }
    }
}
export default MySQLCRUDManager;
