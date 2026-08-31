require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/gsa';

// ─── Middleware ────────────────────────────────────────────────────────────────
// HTTP request logger
app.use(morgan('dev'));

// CORS – allow requests from the Vite dev server
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/schemes', require('./routes/schemes'));
app.use('/api/users', require('./routes/users'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/eligibility', require('./routes/eligibility'));

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('[ERROR]', err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ─── Database + Start ─────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Failed to connect to MongoDB', err);
    });
