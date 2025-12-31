"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const BannedUser_1 = require("../models/BannedUser");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET /api/admin/users
router.get('/users', auth_1.requireAuth, async (req, res) => {
    // In a fuller implementation we'd check admin role
    const users = await User_1.User.find().sort({ createdAt: -1 });
    res.json({ data: users });
});
// GET /api/admin/banned
router.get('/banned', auth_1.requireAuth, async (req, res) => {
    const banned = await BannedUser_1.BannedUser.find().sort({ createdAt: -1 });
    res.json({ data: banned });
});
// POST /api/admin/ban
router.post('/ban', auth_1.requireAuth, async (req, res) => {
    const { userId } = req.body;
    if (!userId)
        return res.status(400).json({ error: 'Missing userId' });
    await BannedUser_1.BannedUser.create({ user: userId, bannedBy: req.userId });
    res.json({ ok: true });
});
// DELETE /api/admin/ban/:userId
router.delete('/ban/:userId', auth_1.requireAuth, async (req, res) => {
    await BannedUser_1.BannedUser.findOneAndDelete({ user: req.params.userId });
    res.json({ ok: true });
});
exports.default = router;
