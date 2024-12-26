import config from "../../../../config/default.mjs";
class MySQLCRUDManager {
    constructor(pool, tableName) {
        this.pool = pool;
        this.tableName = tableName;
    }
    async getList(projections) {
        try {
            const allowedColumns = await this.getColumnsNameFromTable(projections);
            if (!allowedColumns) throw new Error(`Invalid column name: ${allowedColumns}`);

            const [rows] = await this.pool.query(`SELECT ${allowedColumns} FROM ${this.tableName};`);
            return rows;
        } catch (error) {
            console.error("Error fetching data:", error);
            return [];
        }
    }

    async create(data, projections) {
        try {
            const sql = `INSERT INTO ${this.tableName} SET ? ;`;
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

    async getById(id, projections) {
        try {
            if (!id) {
                throw new Error("Invalid ID provided");
            }

            const allowedColumns = await this.getColumnsNameFromTable(projections);
            if (!allowedColumns) throw new Error(`Invalid column name: ${allowedColumns}`);

            const sql = `SELECT ${allowedColumns} FROM ${this.tableName} WHERE _id = ?`;
            const [rows] = await this.pool.query(sql, [id]);

            return rows[0] || null;
        } catch (error) {
            console.error("Error fetching data by ID:", error);
            return null;
        }
    }

    async update(id, data) {
        try {
            const sql = `UPDATE ${this.tableName} SET ? WHERE _id = ?`;
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
            const sql = `DELETE FROM ${this.tableName} WHERE _id = ?`;
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
            const columnName = Object.keys(params)[0];
            const allowedColumns = await this.getColumnsNameFromTable(projections);
            if (!allowedColumns.includes(columnName)) throw new Error(`Invalid column name: ${columnName}`);

            const sql = `SELECT ${allowedColumns} FROM ${this.tableName} WHERE ${columnName} = ? LIMIT 1`;

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

    async getColumnsNameFromTable(excludedColumn = [], tableName) {
        try {
            const currentTableName = tableName ? tableName : this.tableName;

            const notIncludesColumnNames = excludedColumn.map(() => "?").join(", ");
            const query = `
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ? AND COLUMN_NAME != ? 
            ${excludedColumn.length ? `AND COLUMN_NAME NOT IN (${notIncludesColumnNames})` : ""};
        `;
            const values = excludedColumn
                ? [currentTableName, config.db.mysql.database, "pk", ...excludedColumn]
                : [currentTableName, config.db.mysql.database];

            const [columns] = await this.pool.query(query, values);

            return columns.map((col) => col.COLUMN_NAME);
        } catch (error) {
            console.error("Error in getColumnNameFromTable:", error.message);
            throw error;
        }
    }
    async getColumnsCount(excludedColumn = [], tableName) {
        const currentTableName = tableName ? tableName : this.tableName;
        const notIncludesColumnNames = excludedColumn.map(() => "?").join(", ");
        const query = `SELECT COUNT(*) AS column_count
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?
            ${notIncludesColumnNames.length !== 0 ? `AND COLUMN_NAME NOT IN (${notIncludesColumnNames})` : ""};
        `;
        const values =
            notIncludesColumnNames.length !== 0
                ? [currentTableName, config.db.mysql.database, ...excludedColumn]
                : [currentTableName, config.db.mysql.database];

        const [countColumns] = await this.pool.query(query, values);
        const { column_count } = countColumns[0];

        return parseInt(column_count) ?? 0;
    }
}
export default MySQLCRUDManager;
