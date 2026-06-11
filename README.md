# LinkShrink - Premium URL Shortener

A modern, full-stack URL shortener built with Node.js, Express, MySQL, and Vanilla HTML/CSS/JS.

## Features

- **Shorten URLs**: Instantly generate short, shareable links.
- **Click Tracking**: Automatically tracks and counts every time a shortened URL is visited.
- **Analytics Dashboard**: Interactive, real-time Chart.js bar chart showing the top 10 most-clicked links.
- **QR Codes**: Automatic QR code generation for every generated link.
- **Premium UI**: Sleek, responsive dark-themed interface with modern glassmorphism styling.
- **MySQL Integration**: Migrated from SQLite to a robust MySQL backend utilizing connection pooling.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL (via `mysql2`)
- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript, Chart.js (via CDN), QRCode.js (via CDN)

## Setup & Installation

### 1. Prerequisites
Make sure you have **MySQL Server** installed and running on your local machine.

### 2. Configure Database Credentials
Open `backend/config/db.js` and set your local MySQL root password on lines 7 and 24:
```javascript
password: 'YOUR_MYSQL_PASSWORD'
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Application
```bash
node backend/server.js
```
The server will automatically:
1. Connect to MySQL.
2. Create the `url_shortener` database if it doesn't exist.
3. Initialize the `urls` table structure.

### 5. Access the App
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema (`urls`)

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| `original_url` | VARCHAR(2048) | NOT NULL | The destination URL |
| `short_code` | VARCHAR(20) | NOT NULL, UNIQUE | The generated short code |
| `click_count` | INT | DEFAULT 0 | Total number of redirects |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp of creation |

## Project Structure

- `backend/`: Server logic, database config, and routes.
- `frontend/`: UI code (HTML, CSS, JS) and assets.
- `urls.db`: SQLite database file (created automatically).
