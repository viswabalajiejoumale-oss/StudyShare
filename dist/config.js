"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_OAUTH_CALLBACK = exports.CLIENT_URL = exports.GOOGLE_DRIVE_FOLDER_ID = exports.GOOGLE_REFRESH_TOKEN = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.PORT = exports.JWT_SECRET = exports.MONGODB_URI = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/googlefrontend';
exports.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
exports.PORT = Number(process.env.PORT || 4000);
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
exports.GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
exports.GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
// The frontend client URL (e.g., http://localhost:5173)
exports.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
// OAuth callback (defaults to this server's callback)
exports.GOOGLE_OAUTH_CALLBACK = process.env.GOOGLE_OAUTH_CALLBACK || `http://localhost:${exports.PORT}/api/auth/google/callback`;
