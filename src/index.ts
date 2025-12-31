import express from 'express';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { MONGODB_URI, PORT } from './config';
import authRoutes from './routes/auth';
import notesRoutes from './routes/notes';
import devRoutes from './routes/dev';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
import likesRoutes from './routes/likes';
import profilesRoutes from './routes/profiles';
import adminRoutes from './routes/admin';
import ratingsRoutes from './routes/ratings';
import commentsRoutes from './routes/comments';
import uploadsRoutes from './routes/uploads';
import driveRoutes from './routes/drive';

app.use('/api', likesRoutes);
app.use('/api', devRoutes);
app.use('/api', ratingsRoutes);
app.use('/api', commentsRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/drive-upload', driveRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/admin', adminRoutes);

// Serve uploaded files directly (development use)
app.use('/uploads', express.static('uploads'));

server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
});

export default server;
