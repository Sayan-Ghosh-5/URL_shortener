const mysql = require('mysql2');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Determine pool configuration
let pool;
if (process.env.DATABASE_URL) {
    pool = mysql.createPool(process.env.DATABASE_URL);
} else {
    pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'url_shortener',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

// Use promise-based wrapper for async/await support
const db = pool.promise();

// Initialize database and create table if it doesn't exist
async function initializeDatabase() {
    try {
        // Only attempt to auto-create database if not using a preconfigured cloud DATABASE_URL
        if (!process.env.DATABASE_URL) {
            const tempConnection = mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || ''
            }).promise();

            await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'url_shortener'}\``);
            await tempConnection.end();
        }

        // Create the urls table
        await db.query(`
            CREATE TABLE IF NOT EXISTS urls (
                id INT PRIMARY KEY AUTO_INCREMENT,
                original_url VARCHAR(2048) NOT NULL,
                short_code VARCHAR(20) NOT NULL UNIQUE,
                click_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Connected to MySQL database and table initialized.');
    } catch (err) {
        console.error('Error initializing MySQL database:', err.message);
    }
}

// Run initialization
initializeDatabase();

module.exports = db;
