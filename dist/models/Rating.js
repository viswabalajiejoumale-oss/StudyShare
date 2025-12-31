"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rating = void 0;
const mongoose_1 = require("mongoose");
const ratingSchema = new mongoose_1.Schema({
    note: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Note', required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});
ratingSchema.index({ note: 1, user: 1 }, { unique: true });
exports.Rating = (0, mongoose_1.model)('Rating', ratingSchema);
