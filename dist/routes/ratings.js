"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Rating_1 = require("../models/Rating");
const router = (0, express_1.Router)();
// POST /api/notes/:id/rating
router.post('/:id/rating', auth_1.requireAuth, async (req, res) => {
    const { rating } = req.body;
    if (typeof rating !== 'number')
        return res.status(400).json({ error: 'Invalid rating' });
    try {
        const updated = await Rating_1.Rating.findOneAndUpdate({ note: req.params.id, user: req.userId }, { rating }, { upsert: true, new: true });
        res.json({ data: updated });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// GET /api/ratings - optional ?noteId= or ?userId=
router.get('/', async (req, res) => {
    const { noteId, userId } = req.query;
    const q = {};
    if (noteId)
        q.note = noteId;
    if (userId)
        q.user = userId;
    const items = await Rating_1.Rating.find(q);
    res.json({ data: items });
});
exports.default = router;
