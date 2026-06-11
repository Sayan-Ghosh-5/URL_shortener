const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root1234',        // Update with your MySQL password
    database: 'url_shortener',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Use promise-based wrapper for async/await support
const db = pool.promise();

// Initialize database and create table if it doesn't exist
async function initializeDatabase() {
    try {
        // Create the database if it doesn't exist
        const tempConnection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root1234'    // Update with your MySQL password
        }).promise();

        await tempConnection.query('CREATE DATABASE IF NOT EXISTS url_shortener');
        await tempConnection.end();

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
