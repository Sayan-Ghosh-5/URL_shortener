# LinkShrink - Premium URL Shortener

A modern, full-stack URL shortener built with Node.js, Express, SQLite, and Vanilla HTML/CSS/JS.

## Features

- **Shorten URLs**: Instantly generate short, shareable links.
- **QR Codes**: Automatic QR code generation for every link.
- **Premium UI**: sleek, responsive design with glassmorphism.
- **Persistent Storage**: Uses SQLite for easy, file-based data storage.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Server**:
    ```bash
    node backend/server.js
    ```

3.  **Access App**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `backend/`: Server logic, database config, and routes.
- `frontend/`: UI code (HTML, CSS, JS) and assets.
- `urls.db`: SQLite database file (created automatically).
