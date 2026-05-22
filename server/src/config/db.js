import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env",
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10
});

const checkConnection = async () => {
    try {
        const connection = await pool.getConnection();

        console.log("Database connection successful");

        connection.release();

    } catch (err) {

        console.error("Database connection failed", err);

        throw err;
    }
};

export { checkConnection, pool };