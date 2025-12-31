"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// POST /api/drive-upload
router.post('/', async (req, res) => {
    try {
        const { noteId, fileUrl, fileName } = req.body;
        // Replicate existing Supabase function behavior by returning a placeholder drive id and share/preview urls
        const placeholderId = `drive-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        const shareUrl = `https://drive.google.com/file/d/${placeholderId}/view?usp=sharing`;
        const previewUrl = `https://drive.google.com/file/d/${placeholderId}/preview`;
        res.json({ google_drive_id: placeholderId, share_url: shareUrl, preview_url: previewUrl });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Unknown error' });
    }
});
exports.default = router;
