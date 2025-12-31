"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
const mongoose_1 = require("mongoose");
const uploadSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    fileUrl: { type: String },
    thumbnailUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});
exports.Upload = (0, mongoose_1.model)('Upload', uploadSchema);
