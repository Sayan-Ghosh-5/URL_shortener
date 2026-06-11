const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.use('/api', urlRoutes);

// Redirect route with click tracking
app.get('/:code', async (req, res) => {
    const { code } = req.params;
    try {
        // Increment click count
        await db.query('UPDATE urls SET click_count = click_count + 1 WHERE short_code = ?', [code]);

        // Fetch the original URL
        const [rows] = await db.query('SELECT original_url FROM urls WHERE short_code = ?', [code]);

        if (rows.length > 0) {
            res.redirect(rows[0].original_url);
        } else {
            res.status(404).send('URL not found');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
