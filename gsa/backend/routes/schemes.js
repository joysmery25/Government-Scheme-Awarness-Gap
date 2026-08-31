const express = require('express');
const fs = require('fs');
const path = require('path');
const Scheme = require('../models/Scheme');
const router = express.Router();

const loadFallbackSchemes = () => {
    const filePath = path.join(__dirname, '../data/schemes.json');
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// GET all schemes (with optional search and filters)
router.get('/', async (req, res) => {
    try {
        const { search, gov, category, occupation } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { schemeName: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } }
            ];
        }
        if (gov) {
            query.schemeType = gov;
        }
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }
        if (occupation) {
            query.eligibility = { $regex: occupation, $options: 'i' };
        }

        let schemes = await Scheme.find(query).sort({ lastUpdated: -1 });
        if ((!schemes || schemes.length === 0) && Object.keys(query).length === 0) {
            schemes = loadFallbackSchemes();
        }
        if (!schemes) schemes = [];
        res.status(200).json(schemes);
    } catch (error) {
        console.error('[SCHEMES ERROR]', error.message);
        const schemes = loadFallbackSchemes();
        return res.status(200).json(schemes);
    }
});

// GET scheme by ID
router.get('/:id', async (req, res) => {
    try {
        let scheme = null;
        try {
            scheme = await Scheme.findById(req.params.id);
        } catch (searchError) {
            // ignore invalid ObjectId
        }

        if (!scheme) {
            const fallbackSchemes = loadFallbackSchemes();
            scheme = fallbackSchemes.find(s => s.id === req.params.id || s._id === req.params.id);
        }
        if (!scheme) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(scheme);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST new scheme (Admin only ideally, but keeping simple for now)
router.post('/', async (req, res) => {
    try {
        const scheme = new Scheme(req.body);
        await scheme.save();
        res.status(201).json(scheme);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update scheme
router.put('/:id', async (req, res) => {
    try {
        const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!scheme) return res.status(404).json({ error: 'Not found' });
        res.status(200).json(scheme);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE scheme
router.delete('/:id', async (req, res) => {
    try {
        const scheme = await Scheme.findByIdAndDelete(req.params.id);
        if (!scheme) return res.status(404).json({ error: 'Not found' });
        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
