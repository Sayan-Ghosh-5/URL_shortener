const express = require('express');
const router = express.Router();
const db = require('../config/db');

// POST /api/shorten
router.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL is required' });
    }

    const shortCode = generateShortCode(6);

    try {
        await db.query(
            'INSERT INTO urls (original_url, short_code) VALUES (?, ?)',
            [originalUrl, shortCode]
        );
        res.json({ originalUrl, shortCode });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET /api/analytics
router.get('/analytics', async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT short_code, original_url, click_count, created_at FROM urls ORDER BY click_count DESC LIMIT 10'
        );
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

function generateShortCode(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

module.exports = router;
