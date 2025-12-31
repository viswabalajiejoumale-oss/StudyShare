"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Like_1 = require("../models/Like");
const router = (0, express_1.Router)();
// POST /api/notes/:id/like
router.post('/:id/like', auth_1.requireAuth, async (req, res) => {
    try {
        const like = await Like_1.Like.create({ note: req.params.id, user: req.userId });
        res.json({ data: like });
    }
    catch (err) {
        // Unique index may throw
        res.status(400).json({ error: err.message });
    }
});
// DELETE /api/notes/:id/like
router.delete('/:id/like', auth_1.requireAuth, async (req, res) => {
    await Like_1.Like.findOneAndDelete({ note: req.params.id, user: req.userId });
    res.json({ ok: true });
});
// GET /api/likes - optional ?noteId= or ?userId=
router.get('/', async (req, res) => {
    const { noteId, userId } = req.query;
    const q = {};
    if (noteId)
        q.note = noteId;
    if (userId)
        q.user = userId;
    const items = await Like_1.Like.find(q);
    res.json({ data: items });
});
exports.default = router;
