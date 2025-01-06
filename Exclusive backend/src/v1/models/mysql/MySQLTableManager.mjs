class MySQLTableManager {
    constructor(pool, schema) {
        this.pool = pool;
        this.schema = schema;
    }

    async getTablesWithColumn(columnName) {
        try {
            const [tables] = await this.pool.execute(
                `SELECT TABLE_NAME 
                FROM information_schema.columns 
                WHERE TABLE_SCHEMA = ? AND COLUMN_NAME = ?`,
                [this.schema, columnName]
            );
            return tables;
        } catch (error) {
            console.error("Error retrieving the list of tables:", error);
            throw error;
        }
    }

    async findIdInTables(tables, idToFind) {
        for (const table of tables) {
            const tableName = table.TABLE_NAME;

            try {
                const [rows] = await this.pool.execute(`SELECT * FROM \`${tableName}\` WHERE _id = ? LIMIT 1`, [
                    idToFind,
                ]);

                if (rows.length > 0) {
                    return tableName;
                }
            } catch (error) {
                console.error(`Error checking table ${tableName}:`, error);
            }
        }

        console.log(`ID ${idToFind} not found in any table.`);
        return null;
    }

    async findTableById(columnName, idToFind) {
        try {
            const tables = await this.getTablesWithColumn(columnName);
            if (tables.length === 0) {
                console.log(`No tables found with column: ${columnName}`);
                return null;
            }

            return await this.findIdInTables(tables, idToFind);
        } catch (error) {
            console.error("Error executing the query:", error);
            throw error;
        }
    }
}
export default MySQLTableManager;
