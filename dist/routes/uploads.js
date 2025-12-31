"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const Upload_1 = require("../models/Upload");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
// POST /api/uploads (multipart form)
router.post('/', auth_1.requireAuth, upload.fields([{ name: 'file' }, { name: 'thumbnail' }]), async (req, res) => {
    // For now just accept files and return placeholder URLs. Integrate with Google Drive or S3 later.
    const files = req.files || {};
    const file = files.file && files.file[0];
    const thumbnail = files.thumbnail && files.thumbnail[0];
    const fileUrl = file ? `/uploads/${file.filename}` : undefined;
    const thumbnailUrl = thumbnail ? `/uploads/${thumbnail.filename}` : undefined;
    const record = await Upload_1.Upload.create({ user: req.userId, filename: file?.originalname || 'unknown', fileUrl, thumbnailUrl });
    res.json({ data: record });
});
// GET /api/uploads
router.get('/', auth_1.requireAuth, async (req, res) => {
    const items = await Upload_1.Upload.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ data: items });
});
exports.default = router;
