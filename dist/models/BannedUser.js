"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannedUser = void 0;
const mongoose_1 = require("mongoose");
const bannedSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bannedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});
exports.BannedUser = (0, mongoose_1.model)('BannedUser', bannedSchema);
