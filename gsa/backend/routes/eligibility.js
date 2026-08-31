const express = require('express');
const Scheme = require('../models/Scheme');
const User = require('../models/User');
const { optionalAuth } = require('../middleware/auth');
const router = express.Router();

// ─── POST /api/eligibility/check ─────────────────────────────────────────────
// Public route – no login required. If a valid token IS present we also pre-fill
// the user's saved profile as a fallback and optionally persist the latest profile.
router.post('/check', optionalAuth, async (req, res) => {
    try {
        const normalizeField = (value) => {
            if (value === undefined || value === null) return undefined;
            if (Array.isArray(value)) return value.map(item => String(item || '').trim()).filter(Boolean);
            if (typeof value === 'string') return value.trim();
            return value;
        };

        const profile = Object.entries(req.body || {}).reduce((acc, [key, value]) => {
            const normalized = normalizeField(value);
            if (normalized !== undefined && normalized !== null && !(typeof normalized === 'string' && normalized === '')) {
                acc[key] = normalized;
            }
            return acc;
        }, {});

        if (req.user && Object.keys(profile).length === 0) {
            const user = await User.findById(req.user.id);
            if (user && user.profile) {
                Object.entries(user.profile.toObject()).forEach(([key, value]) => {
                    const normalized = normalizeField(value);
                    if (normalized !== undefined && normalized !== null && !(typeof normalized === 'string' && normalized === '')) {
                        profile[key] = normalized;
                    }
                });
            }
        }

        if (!profile || Object.keys(profile).length === 0) {
            return res.status(400).json({ error: 'Please provide at least one profile field to check eligibility.' });
        }

        if (profile.age) profile.age = Number(profile.age);
        if (profile.income) profile.income = Number(profile.income);
        if (profile.categories && !Array.isArray(profile.categories)) profile.categories = [String(profile.categories).trim()];

        const selectedCategories = (profile.categories || []).map(c => String(c).toLowerCase().trim()).filter(Boolean);
        const occupationText = String(profile.occupation || '').toLowerCase().trim();
        const educationText = String(profile.education || '').toLowerCase().trim();
        const stateText = String(profile.state || '').toLowerCase().trim();

        const schemes = await Scheme.find();
        const eligibleSchemes = schemes.filter(scheme => {
            const schemeText = `${scheme.schemeName || ''} ${scheme.description || ''} ${scheme.eligibility || ''} ${scheme.category || ''} ${scheme.schemeType || ''}`.toLowerCase();
            const schemeCategory = String(scheme.category || '').toLowerCase();
            const schemeType = String(scheme.schemeType || '').toLowerCase();

            if (profile.age) {
                const age = Number(profile.age);
                if (scheme.minAge && age < scheme.minAge) return false;
                if (scheme.maxAge && age > scheme.maxAge) return false;

                if (scheme.ageCriteria) {
                    const match = scheme.ageCriteria.match(/(\d+)\s*[-–to]+\s*(\d+)/);
                    if (match) {
                        const [, min, max] = match.map(Number);
                        if (age < min || age > max) return false;
                    }
                }
            }

            if (profile.gender && scheme.eligibility) {
                const el = scheme.eligibility.toLowerCase();
                const g = String(profile.gender).toLowerCase();
                if (g === 'male' && el.includes('women only')) return false;
                if (g === 'female' && el.includes('men only')) return false;
            }

            if (profile.income && scheme.incomeCriteria) {
                const incomeMatch = scheme.incomeCriteria.match(/[\d,]+/g);
                if (incomeMatch) {
                    const limit = parseInt(incomeMatch[incomeMatch.length - 1].replace(/,/g, ''), 10);
                    if (!isNaN(limit) && Number(profile.income) > limit) return false;
                }
            }

            if (stateText && schemeType.includes('state')) {
                if (!stateText.includes('andhra')) return false;
            }

            let positiveMatch = false;

            if (selectedCategories.length > 0) {
                positiveMatch = selectedCategories.some(cat => {
                    if (schemeCategory.includes(cat)) return true;
                    const catTokens = cat.split(/\s+/).filter(Boolean);
                    return catTokens.some(token => schemeText.includes(token));
                });
            }

            if (!positiveMatch && occupationText) {
                positiveMatch = occupationText.split(/\s+/).some(token => schemeText.includes(token));
            }

            if (!positiveMatch && educationText) {
                positiveMatch = educationText.split(/\s+/).some(token => schemeText.includes(token));
            }

            if (!positiveMatch && stateText && schemeType.includes('state')) {
                positiveMatch = stateText.includes('andhra');
            }

            if ((selectedCategories.length > 0 || occupationText || educationText || (stateText && schemeType.includes('state'))) && !positiveMatch) {
                return false;
            }

            return true;
        });

        if (req.user && Object.keys(profile).length > 0) {
            await User.findByIdAndUpdate(req.user.id, { profile }, { new: true });
        }

        console.log(`[ELIGIBILITY] ${eligibleSchemes.length} schemes matched for profile:`, JSON.stringify(profile));
        res.status(200).json(eligibleSchemes);
    } catch (err) {
        console.error('[ELIGIBILITY ERROR]', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
