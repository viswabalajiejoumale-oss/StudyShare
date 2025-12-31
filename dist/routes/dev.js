"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Note_1 = require("../models/Note");
const router = (0, express_1.Router)();
// POST /api/_seed/notes - development-only endpoint
router.post('/_seed/notes', async (req, res) => {
    const { notes } = req.body;
    try {
        const inserted = await Note_1.Note.insertMany(notes);
        res.json({ data: inserted });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.default = router;
