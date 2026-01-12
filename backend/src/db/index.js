import pkg from "pg";
import config from "../config/config.js";
const { Pool } = pkg;
import { DBNAME } from "../constants.js";
const pool = new Pool({
  connectionString: config.get('DATABASE_URL'),
  ssl: { rejectUnauthorized: false },
});

const connectDB = async()=>{
    try{
        await pool.query("SELECT 1");
        console.log(`PostgresSQL connected using DATABASE_URL`);
    }
    catch(error){
        console.error('PostgreSQL connection failed',error.message);
        process.exit(1);
    }
}

export {pool};
export default connectDB;