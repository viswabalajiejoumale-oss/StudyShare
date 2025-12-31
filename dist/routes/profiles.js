"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Profile_1 = require("../models/Profile");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/profiles
router.get('/', async (req, res) => {
    const profiles = await Profile_1.Profile.find().sort({ createdAt: -1 });
    res.json({ data: profiles });
});
// GET /api/profiles/:userId
router.get('/:userId', async (req, res) => {
    const profile = await Profile_1.Profile.findOne({ user: req.params.userId });
    if (!profile)
        return res.status(404).json({ error: 'Not found' });
    res.json({ data: profile });
});
// PUT /api/profiles/:userId
router.put('/:userId', auth_1.requireAuth, async (req, res) => {
    if (req.userId !== req.params.userId)
        return res.status(403).json({ error: 'Not allowed' });
    const updated = await Profile_1.Profile.findOneAndUpdate({ user: req.params.userId }, req.body, { new: true, upsert: true });
    res.json({ data: updated });
});
exports.default = router;
