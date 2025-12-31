import { Router } from 'express';
import { Profile } from '../models/Profile';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/profiles
router.get('/', async (req, res) => {
  const profiles = await Profile.find().sort({ createdAt: -1 });
  res.json({ data: profiles });
});

// GET /api/profiles/:userId
router.get('/:userId', async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.userId });
  if (!profile) return res.status(404).json({ error: 'Not found' });
  res.json({ data: profile });
});

// PUT /api/profiles/:userId
router.put('/:userId', requireAuth, async (req: AuthRequest, res) => {
  if (req.userId !== req.params.userId) return res.status(403).json({ error: 'Not allowed' });
  const updated = await Profile.findOneAndUpdate({ user: req.params.userId }, req.body, { new: true, upsert: true });
  res.json({ data: updated });
});

export default router;