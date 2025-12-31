import dotenv from 'dotenv';
dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/googlefrontend';
export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
export const PORT = Number(process.env.PORT || 4000);
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
export const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
// The frontend client URL (e.g., http://localhost:5173)
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
// OAuth callback (defaults to this server's callback)
export const GOOGLE_OAUTH_CALLBACK = process.env.GOOGLE_OAUTH_CALLBACK || `http://localhost:${PORT}/api/auth/google/callback`;
