import sqlite3 from "sqlite3";
import dotenv from "dotenv";
dotenv.config();
const dbPath = process.env.DB_PATH || "./database.sqlite";
export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Could not connect to database", err);
    } else {
        console.log("Connected to database");
    }
});

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL, 
    password TEXT NOT NULL,
    reset_token TEXT,
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`);

// Create table for qr codes if it doesn't exist

db.run(`CREATE TABLE IF NOT EXISTS qrcodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    qr_code TEXT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
)`);


export default db;