import { Router } from 'express';
import { User } from '../models/User';
import { BannedUser } from '../models/BannedUser';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/admin/users
router.get('/users', requireAuth, async (req: AuthRequest, res) => {
  // In a fuller implementation we'd check admin role
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ data: users });
});

// GET /api/admin/banned
router.get('/banned', requireAuth, async (req: AuthRequest, res) => {
  const banned = await BannedUser.find().sort({ createdAt: -1 });
  res.json({ data: banned });
});

// POST /api/admin/ban
router.post('/ban', requireAuth, async (req: AuthRequest, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  await BannedUser.create({ user: userId, bannedBy: req.userId });
  res.json({ ok: true });
});

// DELETE /api/admin/ban/:userId
router.delete('/ban/:userId', requireAuth, async (req: AuthRequest, res) => {
  await BannedUser.findOneAndDelete({ user: req.params.userId });
  res.json({ ok: true });
});

export default router;