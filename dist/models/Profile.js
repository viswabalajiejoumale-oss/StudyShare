"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const mongoose_1 = require("mongoose");
const profileSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    displayName: { type: String },
    avatarUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});
exports.Profile = (0, mongoose_1.model)('Profile', profileSchema);
