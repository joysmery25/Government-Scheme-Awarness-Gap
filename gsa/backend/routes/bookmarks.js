const express = require('express');
const Bookmark = require('../models/Bookmark');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ userId: req.user.id }).populate('schemeId');
        res.status(200).json(bookmarks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', protect, async (req, res) => {
    try {
        const { schemeId } = req.body;
        const exists = await Bookmark.findOne({ userId: req.user.id, schemeId });
        if (exists) return res.status(400).json({ error: 'Already bookmarked' });

        const bookmark = new Bookmark({ userId: req.user.id, schemeId });
        await bookmark.save();
        res.status(201).json(bookmark);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        // the ID could be the bookmark ID or scheme ID. Typically it's schemeId from frontend
        await Bookmark.findOneAndDelete({ userId: req.user.id, schemeId: req.params.id });
        res.status(200).json({ message: 'Removed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
