import { Schema, model, Document, Types } from 'mongoose';

export interface INote extends Document {
  title?: string;
  content?: string;
  subject?: string;
  user: Types.ObjectId;
  googleDriveId?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>({
  title: { type: String },
  content: { type: String },
  subject: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  googleDriveId: { type: String },
  fileUrl: { type: String },
  thumbnailUrl: { type: String }
}, { timestamps: true });

export const Note = model<INote>('Note', noteSchema);
