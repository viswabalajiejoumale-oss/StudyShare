"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Comment_1 = require("../models/Comment");
const router = (0, express_1.Router)();
// GET /api/notes/:id/comments
router.get('/:id/comments', async (req, res) => {
    const comments = await Comment_1.Comment.find({ note: req.params.id }).sort({ createdAt: -1 });
    res.json({ data: comments });
});
// POST /api/notes/:id/comments
router.post('/:id/comments', auth_1.requireAuth, async (req, res) => {
    const { content } = req.body;
    if (!content)
        return res.status(400).json({ error: 'Missing content' });
    const comment = await Comment_1.Comment.create({ note: req.params.id, user: req.userId, content });
    res.json({ data: comment });
});
// DELETE /api/comments/:id
router.delete('/comment/:id', auth_1.requireAuth, async (req, res) => {
    await Comment_1.Comment.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
});
exports.default = router;
