"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleapis_1 = require("googleapis");
const User_1 = require("../models/User");
const Profile_1 = require("../models/Profile");
const config_1 = require("../config");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    const { email, password, displayName } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Missing email or password' });
    try {
        const existing = await User_1.User.findOne({ email });
        if (existing)
            return res.status(400).json({ error: 'Email already exists' });
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.User.create({ email, passwordHash });
        await Profile_1.Profile.create({ user: user._id, displayName });
        const token = jsonwebtoken_1.default.sign({ sub: user._id.toString() }, config_1.JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user._id, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Server error' });
    }
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Missing email or password' });
    try {
        const user = await User_1.User.findOne({ email });
        if (!user)
            return res.status(400).json({ error: 'Invalid credentials' });
        const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!ok)
            return res.status(400).json({ error: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ sub: user._id.toString() }, config_1.JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: user._id, email: user.email } });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Server error' });
    }
});
// GET /api/auth/me
router.get('/me', auth_1.requireAuth, async (req, res) => {
    try {
        const user = await User_1.User.findById(req.userId).select('-passwordHash');
        const profile = user ? await Profile_1.Profile.findOne({ user: user._id }) : null;
        res.json({ user, profile });
    }
    catch (err) {
        res.status(500).json({ error: err.message || 'Server error' });
    }
});
// GET /api/auth/google - redirect to Google OAuth
router.get('/google', (req, res) => {
    if (!config_1.GOOGLE_CLIENT_ID || !config_1.GOOGLE_CLIENT_SECRET)
        return res.status(500).json({ error: 'Google OAuth not configured' });
    const oauth2Client = new googleapis_1.google.auth.OAuth2(config_1.GOOGLE_CLIENT_ID, config_1.GOOGLE_CLIENT_SECRET, config_1.GOOGLE_OAUTH_CALLBACK);
    const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: ['profile', 'email'] });
    res.redirect(url);
});
// GET /api/auth/google/callback
router.get('/google/callback', async (req, res) => {
    try {
        const code = req.query.code;
        if (!code)
            return res.status(400).send('Missing code');
        const oauth2Client = new googleapis_1.google.auth.OAuth2(config_1.GOOGLE_CLIENT_ID, config_1.GOOGLE_CLIENT_SECRET, config_1.GOOGLE_OAUTH_CALLBACK);
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const oauth2 = googleapis_1.google.oauth2({ auth: oauth2Client, version: 'v2' });
        const { data } = await oauth2.userinfo.get();
        const email = data.email;
        const name = data.name;
        const picture = data.picture;
        if (!email)
            return res.status(400).send('Failed to get email from provider');
        let user = await User_1.User.findOne({ email });
        if (!user) {
            user = await User_1.User.create({ email, passwordHash: '' });
            await Profile_1.Profile.create({ user: user._id, displayName: name || undefined, avatarUrl: picture || undefined });
        }
        else {
            // ensure profile exists
            const profile = await Profile_1.Profile.findOne({ user: user._id });
            if (!profile)
                await Profile_1.Profile.create({ user: user._id, displayName: name || undefined, avatarUrl: picture || undefined });
        }
        const token = jsonwebtoken_1.default.sign({ sub: user._id.toString() }, config_1.JWT_SECRET, { expiresIn: '30d' });
        // Post message back to opener window and close. If no opener, redirect with token param.
        const html = `<!doctype html>
      <html>
        <body>
          <script>
            (function(){
              const token = ${JSON.stringify(token)};
              const origin = ${JSON.stringify(config_1.CLIENT_URL)};
              try {
                if (window.opener) {
                  window.opener.postMessage({ type: 'oauth', token }, origin);
                  window.close();
                } else {
                  window.location = origin + '/?token=' + encodeURIComponent(token);
                }
              } catch (err) {
                window.location = origin + '/?token=' + encodeURIComponent(token);
              }
            })();
          </script>
        </body>
      </html>`;
        res.send(html);
    }
    catch (err) {
        console.error('Google OAuth callback error', err);
        res.status(500).send('OAuth error');
    }
});
exports.default = router;
