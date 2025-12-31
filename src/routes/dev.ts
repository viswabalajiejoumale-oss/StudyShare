import { Router } from 'express';
import { Note } from '../models/Note';

const router = Router();

// POST /api/_seed/notes - development-only endpoint
router.post('/_seed/notes', async (req, res) => {
  const { notes } = req.body;
  try {
    const inserted = await Note.insertMany(notes);
    res.json({ data: inserted });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;