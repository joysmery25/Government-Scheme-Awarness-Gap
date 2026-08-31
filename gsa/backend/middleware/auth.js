const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

/**
 * Protect routes – requires a valid Bearer token.
 * Sets req.user = { id, role }
 */
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized – no token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

/**
 * Optional auth – attaches req.user if token present, but does NOT block
 * unauthenticated requests. Perfect for public routes that benefit from
 * knowing who is logged in.
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        } catch {
            // token invalid – treat as guest
            req.user = null;
        }
    } else {
        req.user = null;
    }
    next();
};

/**
 * Admin only – must call protect() first.
 */
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

module.exports = { protect, optionalAuth, adminOnly };
