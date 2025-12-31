import { Schema, model, Document, Types } from 'mongoose';

export interface IUpload extends Document {
  user: Types.ObjectId;
  filename: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  createdAt: Date;
}

const uploadSchema = new Schema<IUpload>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  fileUrl: { type: String },
  thumbnailUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Upload = model<IUpload>('Upload', uploadSchema);
