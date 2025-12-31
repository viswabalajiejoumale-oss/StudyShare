import { Router } from 'express';
import multer from 'multer';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { Upload } from '../models/Upload';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/uploads (multipart form)
router.post('/', requireAuth, upload.fields([{ name: 'file' }, { name: 'thumbnail' }]), async (req: AuthRequest, res) => {
  // For now just accept files and return placeholder URLs. Integrate with Google Drive or S3 later.
  const files: any = req.files || {};
  const file = files.file && files.file[0];
  const thumbnail = files.thumbnail && files.thumbnail[0];
  const fileUrl = file ? `/uploads/${file.filename}` : undefined;
  const thumbnailUrl = thumbnail ? `/uploads/${thumbnail.filename}` : undefined;
  const record = await Upload.create({ user: req.userId, filename: file?.originalname || 'unknown', fileUrl, thumbnailUrl });
  res.json({ data: record });
});

// GET /api/uploads
router.get('/', requireAuth, async (req: AuthRequest, res) => {
  const items = await Upload.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json({ data: items });
});

export default router;