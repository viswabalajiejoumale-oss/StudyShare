import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { JWT_SECRET, CLIENT_URL, GOOGLE_OAUTH_CALLBACK, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../config';
import { requireAuth } from '../middleware/auth';

const router = Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });
    await Profile.create({ user: user._id, displayName });
    const token = jwt.sign({ sub: user._id.toString() }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: user._id.toString() }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: any, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    const profile = user ? await Profile.findOne({ user: user._id }) : null;
    res.json({ user, profile });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// GET /api/auth/google - redirect to Google OAuth
router.get('/google', (req, res) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) return res.status(500).json({ error: 'Google OAuth not configured' });
  const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_OAUTH_CALLBACK);
  const url = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: ['profile', 'email'] });
  res.redirect(url);
});

// GET /api/auth/google/callback
router.get('/google/callback', async (req, res) => {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).send('Missing code');

    const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_OAUTH_CALLBACK);
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const { data } = await oauth2.userinfo.get();
    const email = data.email as string | undefined;
    const name = data.name as string | undefined;
    const picture = data.picture as string | undefined;

    if (!email) return res.status(400).send('Failed to get email from provider');

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, passwordHash: '' });
      await Profile.create({ user: user._id, displayName: name || undefined, avatarUrl: picture || undefined });
    } else {
      // ensure profile exists
      const profile = await Profile.findOne({ user: user._id });
      if (!profile) await Profile.create({ user: user._id, displayName: name || undefined, avatarUrl: picture || undefined });
    }

    const token = jwt.sign({ sub: user._id.toString() }, JWT_SECRET, { expiresIn: '30d' });

    // Post message back to opener window and close. If no opener, redirect with token param.
    const html = `<!doctype html>
      <html>
        <body>
          <script>
            (function(){
              const token = ${JSON.stringify(token)};
              const origin = ${JSON.stringify(CLIENT_URL)};
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
  } catch (err: any) {
    console.error('Google OAuth callback error', err);
    res.status(500).send('OAuth error');
  }
});

export default router;
