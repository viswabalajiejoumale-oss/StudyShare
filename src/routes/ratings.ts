import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Rating } from '../models/Rating';

const router = Router();

// POST /api/notes/:id/rating
router.post('/:id/rating', requireAuth, async (req: AuthRequest, res) => {
  const { rating } = req.body;
  if (typeof rating !== 'number') return res.status(400).json({ error: 'Invalid rating' });
  try {
    const updated = await Rating.findOneAndUpdate({ note: req.params.id, user: req.userId }, { rating }, { upsert: true, new: true });
    res.json({ data: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/ratings - optional ?noteId= or ?userId=
router.get('/', async (req, res) => {
  const { noteId, userId } = req.query as any;
  const q: any = {};
  if (noteId) q.note = noteId;
  if (userId) q.user = userId;
  const items = await Rating.find(q);
  res.json({ data: items });
});

export default router;