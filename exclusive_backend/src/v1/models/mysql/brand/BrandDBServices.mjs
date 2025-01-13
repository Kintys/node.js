import _config from "../../../../../config/default.mjs";
import pool from "../../../../../db/connectDB.mjs";
import MySQLCRUDManager from "../MySQLCRUDManager.mjs";

class BrandsDBServices extends MySQLCRUDManager {}
export default new BrandsDBServices(pool, "brands");
