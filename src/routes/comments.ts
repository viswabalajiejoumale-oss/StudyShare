import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Comment } from '../models/Comment';

const router = Router();

// GET /api/notes/:id/comments
router.get('/:id/comments', async (req, res) => {
  const comments = await Comment.find({ note: req.params.id }).sort({ createdAt: -1 });
  res.json({ data: comments });
});

// POST /api/notes/:id/comments
router.post('/:id/comments', requireAuth, async (req: AuthRequest, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Missing content' });
  const comment = await Comment.create({ note: req.params.id, user: req.userId, content });
  res.json({ data: comment });
});

// DELETE /api/comments/:id
router.delete('/comment/:id', requireAuth, async (req: AuthRequest, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;