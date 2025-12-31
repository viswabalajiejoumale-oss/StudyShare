import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Like } from '../models/Like';

const router = Router();

// POST /api/notes/:id/like
router.post('/:id/like', requireAuth, async (req: AuthRequest, res) => {
  try {
    const like = await Like.create({ note: req.params.id, user: req.userId });
    res.json({ data: like });
  } catch (err: any) {
    // Unique index may throw
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/notes/:id/like
router.delete('/:id/like', requireAuth, async (req: AuthRequest, res) => {
  await Like.findOneAndDelete({ note: req.params.id, user: req.userId });
  res.json({ ok: true });
});

// GET /api/likes - optional ?noteId= or ?userId=
router.get('/', async (req, res) => {
  const { noteId, userId } = req.query as any;
  const q: any = {};
  if (noteId) q.note = noteId;
  if (userId) q.user = userId;
  const items = await Like.find(q);
  res.json({ data: items });
});

export default router;