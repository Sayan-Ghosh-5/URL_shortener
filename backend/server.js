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

// Redirect route
app.get('/:code', (req, res) => {
    const { code } = req.params;
    const sql = 'SELECT original_url FROM urls WHERE short_code = ?';
    db.get(sql, [code], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Server error');
        }
        if (row) {
            res.redirect(row.original_url);
        } else {
            res.status(404).send('URL not found');
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
