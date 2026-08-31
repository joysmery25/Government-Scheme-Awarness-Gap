const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { protect } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';

// ─── Helper ───────────────────────────────────────────────────────────────────
function signToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// ─── UNIFIED REGISTER  (User OR Admin) ────────────────────────────────────────
// POST /api/auth/register
// Body: { fullName, email, password, phoneNumber?, role: 'User'|'Admin' }
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, role } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'fullName, email, and password are required.' });
        }

        const accountRole = role === 'Admin' ? 'Admin' : 'User';

        if (accountRole === 'Admin') {
            // ── Admin Registration ──
            const exists = await Admin.findOne({ email });
            if (exists) return res.status(409).json({ error: 'Admin with this email already exists.' });

            const hashed = await bcrypt.hash(password, 10);
            const admin = await new Admin({ fullName, email, password: hashed }).save();
            console.log(`[REGISTER] New admin registered: ${email}`);
            return res.status(201).json({ message: 'Admin registered successfully.', role: 'Admin' });
        } else {
            // ── User Registration ──
            const exists = await User.findOne({ email });
            if (exists) return res.status(409).json({ error: 'User with this email already exists.' });

            const hashed = await bcrypt.hash(password, 10);
            const user = await new User({ fullName, email, password: hashed, phoneNumber }).save();
            console.log(`[REGISTER] New user registered: ${email}`);
            return res.status(201).json({ message: 'User registered successfully.', role: 'User' });
        }
    } catch (err) {
        console.error('[REGISTER ERROR]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Keep old routes for backward compatibility
router.post('/admin-register', async (req, res) => {
    req.body.role = 'Admin';
    // proxy through unified register
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) return res.status(400).json({ error: 'Missing required fields' });
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(409).json({ error: 'Admin already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ fullName, email, password: hashedPassword });
        await newAdmin.save();
        console.log(`[REGISTER] New admin registered: ${email}`);
        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ─── USER LOGIN ───────────────────────────────────────────────────────────────
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'No account found with this email.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Incorrect password.' });

        const token = signToken({ id: user._id, role: 'User' });
        console.log(`[LOGIN] User logged in: ${email}`);
        res.status(200).json({
            token,
            user: { id: user._id, fullName: user.fullName, email: user.email, role: 'User' }
        });
    } catch (err) {
        console.error('[LOGIN ERROR]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ─── ADMIN LOGIN ──────────────────────────────────────────────────────────────
// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ error: 'No admin account found with this email.' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ error: 'Incorrect password.' });

        const token = signToken({ id: admin._id, role: 'Admin' });
        console.log(`[LOGIN] Admin logged in: ${email}`);
        res.status(200).json({
            token,
            admin: { id: admin._id, fullName: admin.fullName, email: admin.email, role: 'Admin' }
        });
    } catch (err) {
        console.error('[ADMIN LOGIN ERROR]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ─── GOOGLE OAUTH ─────────────────────────────────────────────────────────────
// POST /api/auth/google
// Body: { credential }   ← the raw credential JWT from Google
//   OR: { email, fullName, googleId }  ← fallback for frontend-decoded info
router.post('/google', async (req, res) => {
    try {
        let googleEmail, googleName, googleId;

        const { credential, email, fullName, googleId: gid } = req.body;

        if (credential && GOOGLE_CLIENT_ID) {
            try {
                // ── Proper server-side verification ──
                const client = new OAuth2Client(GOOGLE_CLIENT_ID);
                const ticket = await client.verifyIdToken({
                    idToken: credential,
                    audience: GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                googleEmail = payload.email;
                googleName = payload.name;
                googleId = payload.sub;
                console.log(`[GOOGLE AUTH] Verified token for: ${googleEmail}`);
            } catch (verifyError) {
                console.warn('[GOOGLE AUTH] Server-side token verification failed, falling back to decoded payload.', verifyError.message);
            }
        }

        if (!googleEmail && credential) {
            const decodedFallback = jwt.decode(credential);
            if (decodedFallback) {
                googleEmail = decodedFallback.email;
                googleName = decodedFallback.name;
                googleId = decodedFallback.sub;
                console.log(`[GOOGLE AUTH] Decoded credential fallback for: ${googleEmail}`);
            }
        }

        if (!googleEmail && email) {
            // ── Fallback: frontend already decoded the JWT ──
            googleEmail = email;
            googleName = fullName;
            googleId = gid;
            console.log(`[GOOGLE AUTH] Frontend-decoded token for: ${googleEmail}`);
        }

        if (!googleEmail) {
            return res.status(400).json({ error: 'Google credential or email is required.' });
        }

        // Find or create the user
        let user = await User.findOne({ email: googleEmail });
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-12);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            user = await new User({
                fullName: googleName,
                email: googleEmail,
                password: hashedPassword,
                googleId
            }).save();
            console.log(`[GOOGLE AUTH] New user auto-created: ${googleEmail}`);
        } else if (!user.googleId) {
            // Link Google ID to existing account
            user.googleId = googleId;
            await user.save();
        }

        const token = signToken({ id: user._id, role: 'User' });
        res.status(200).json({
            token,
            user: { id: user._id, fullName: user.fullName, email: user.email, role: 'User' }
        });
    } catch (err) {
        console.error('[GOOGLE AUTH ERROR]', err.message);
        res.status(401).json({ error: 'Google authentication failed. ' + err.message });
    }
});

// ─── GET PROFILE (protected) ──────────────────────────────────────────────────
// GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
    try {
        let profile = null;
        if (req.user.role === 'Admin') {
            profile = await Admin.findById(req.user.id).select('-password');
        } else {
            profile = await User.findById(req.user.id).select('-password');
        }
        if (!profile) return res.status(404).json({ error: 'Profile not found' });
        res.status(200).json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── UPDATE PROFILE (protected, users only) ───────────────────────────────────
// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
    try {
        if (req.user.role !== 'User') {
            return res.status(403).json({ error: 'Only users can update their profile here.' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { profile: req.body.profile, fullName: req.body.fullName, phoneNumber: req.body.phoneNumber } },
            { new: true }
        ).select('-password');
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
// POST /api/auth/logout  (JWT is stateless; client just discards token)
router.post('/logout', (req, res) => {
    console.log('[LOGOUT] User logged out');
    res.status(200).json({ message: 'Logged out successfully.' });
});

module.exports = router;
