"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Note_1 = require("../models/Note");
const Like_1 = require("../models/Like");
const Rating_1 = require("../models/Rating");
const Profile_1 = require("../models/Profile");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/notes
router.get('/', async (req, res) => {
    const { subject, q, limit = 20, offset = 0 } = req.query;
    const query = {};
    if (subject)
        query.subject = subject;
    if (q)
        query.$or = [{ title: new RegExp(q, 'i') }, { content: new RegExp(q, 'i') }];
    const notes = await Note_1.Note.find(query).sort({ createdAt: -1 }).skip(Number(offset)).limit(Number(limit));
    const noteIds = notes.map(n => n._id);
    const userIds = notes.map(n => n.user);
    // Aggregate likes count
    const likesAgg = await Like_1.Like.aggregate([
        { $match: { note: { $in: noteIds } } },
        { $group: { _id: '$note', count: { $sum: 1 } } }
    ]);
    // Aggregate ratings avg
    const ratingsAgg = await Rating_1.Rating.aggregate([
        { $match: { note: { $in: noteIds } } },
        { $group: { _id: '$note', avg: { $avg: '$rating' } } }
    ]);
    const profiles = await Profile_1.Profile.find({ user: { $in: userIds } });
    const profilesMap = profiles.reduce((acc, p) => {
        acc[p.user.toString()] = p;
        return acc;
    }, {});
    const likesMap = likesAgg.reduce((acc, it) => { acc[it._id.toString()] = it.count; return acc; }, {});
    const ratingsMap = ratingsAgg.reduce((acc, it) => { acc[it._id.toString()] = it.avg; return acc; }, {});
    const enriched = notes.map(n => ({
        ...n.toObject(),
        profiles: profilesMap[n.user.toString()] || null,
        likes_count: likesMap[n._id.toString()] || 0,
        avg_rating: ratingsMap[n._id.toString()] || 0,
    }));
    res.json({ data: enriched });
});
// GET /api/notes/:id
router.get('/:id', async (req, res) => {
    const note = await Note_1.Note.findById(req.params.id);
    if (!note)
        return res.status(404).json({ error: 'Not found' });
    res.json({ data: note });
});
// POST /api/notes
router.post('/', auth_1.requireAuth, async (req, res) => {
    const { title, content, subject, fileUrl, thumbnailUrl } = req.body;
    const note = await Note_1.Note.create({ title, content, subject, user: req.userId, fileUrl, thumbnailUrl });
    res.json({ data: note });
});
// PUT /api/notes/:id
router.put('/:id', auth_1.requireAuth, async (req, res) => {
    const note = await Note_1.Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ data: note });
});
// POST /api/notes/:id/increment-download
router.post('/:id/increment-download', async (req, res) => {
    try {
        const note = await Note_1.Note.findByIdAndUpdate(req.params.id, { $inc: { download_count: 1 } }, { new: true });
        res.json({ data: note });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// DELETE /api/notes/:id
router.delete('/:id', auth_1.requireAuth, async (req, res) => {
    await Note_1.Note.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
});
exports.default = router;
