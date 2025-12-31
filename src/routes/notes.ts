import { Router } from 'express';
import { Note } from '../models/Note';
import { Like } from '../models/Like';
import { Rating } from '../models/Rating';
import { Profile } from '../models/Profile';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/notes
router.get('/', async (req, res) => {
  const { subject, q, limit = 20, offset = 0 } = req.query as any;
  const query: any = {};
  if (subject) query.subject = subject;
  if (q) query.$or = [ { title: new RegExp(q, 'i') }, { content: new RegExp(q, 'i') } ];
  const notes = await Note.find(query).sort({ createdAt: -1 }).skip(Number(offset)).limit(Number(limit));

  const noteIds = notes.map(n => n._id);
  const userIds = notes.map(n => n.user);

  // Aggregate likes count
  const likesAgg = await Like.aggregate([
    { $match: { note: { $in: noteIds } } },
    { $group: { _id: '$note', count: { $sum: 1 } } }
  ]);

  // Aggregate ratings avg
  const ratingsAgg = await Rating.aggregate([
    { $match: { note: { $in: noteIds } } },
    { $group: { _id: '$note', avg: { $avg: '$rating' } } }
  ]);

  const profiles = await Profile.find({ user: { $in: userIds } });
  const profilesMap = profiles.reduce((acc, p) => {
    acc[p.user.toString()] = p;
    return acc;
  }, {} as Record<string, any>);

  const likesMap = likesAgg.reduce((acc: any, it: any) => { acc[it._id.toString()] = it.count; return acc; }, {});
  const ratingsMap = ratingsAgg.reduce((acc: any, it: any) => { acc[it._id.toString()] = it.avg; return acc; }, {});

  const enriched = notes.map(n => ({
    ...n.toObject(),
    profiles: profilesMap[n.user.toString()] || null,
    likes_count: likesMap[n._id.toString()] || 0,
    avg_rating: ratingsMap[n._id.toString()] || 0,
  }));

  res.json({ data: enriched });
});

// GET /api/notes/:id
router.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) return res.status(404).json({ error: 'Not found' });
  res.json({ data: note });
});

// POST /api/notes
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { title, content, subject, fileUrl, thumbnailUrl } = req.body;
  const note = await Note.create({ title, content, subject, user: req.userId, fileUrl, thumbnailUrl });
  res.json({ data: note });
});

// PUT /api/notes/:id
router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ data: note });
});

// POST /api/notes/:id/increment-download
router.post('/:id/increment-download', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { $inc: { download_count: 1 } }, { new: true });
    res.json({ data: note });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', requireAuth, async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
