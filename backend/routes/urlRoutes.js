const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const db = require('../config/db');

// POST /api/shorten
router.post('/shorten', (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    // Check if URL already exists (optional optimization, but let's just create new for now or unique)
    // For simplicity, we'll generate a new code every time. 
    // If we wanted to deduplicate, we'd select by original_url first.

    // nanoid v3 is require('nanoid').nanoid, v4+ is import. 
    // Since we are using CommonJS (require), we might need to use dynamic import or fix version.
    // Let's check if nanoid is ESM only. Recent versions are.
    // If nanoid is ESM, we can't require it easily in CJS without dynamic import.
    // I'll use a dynamic import wrapper or just use a simple random string function to avoid ESM issues if installed latest.
    // Actually, let's just write a simple random string generator to be safe and dependency-free for this small part if nanoid fails.
    // But I installed nanoid. Let's try to use it. If it fails, I'll fix.
    // To be safe against ESM issues in CJS, I'll use a custom helper.

    const shortCode = generateShortCode(6);

    const sql = 'INSERT INTO urls (original_url, short_code) VALUES (?, ?)';
    db.run(sql, [originalUrl, shortCode], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ originalUrl, shortCode });
    });
});

// GET /:code (Redirect) - This will be handled in server.js or here? 
// Usually redirect is on root or specific path. Let's put the redirect logic here too if we mount it at root, 
// but usually API routes are /api/... and redirect is /...
// I will separate the redirect route or put it in server.js. 
// Let's keep this file for API routes.

function generateShortCode(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

module.exports = router;
