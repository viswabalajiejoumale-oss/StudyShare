"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const mongoose_1 = require("mongoose");
const noteSchema = new mongoose_1.Schema({
    title: { type: String },
    content: { type: String },
    subject: { type: String },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    googleDriveId: { type: String },
    fileUrl: { type: String },
    thumbnailUrl: { type: String }
}, { timestamps: true });
exports.Note = (0, mongoose_1.model)('Note', noteSchema);
