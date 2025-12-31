import { Schema, model, Document, Types } from 'mongoose';

export interface ILike extends Document {
  note: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>({
  note: { type: Schema.Types.ObjectId, ref: 'Note', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

likeSchema.index({ note: 1, user: 1 }, { unique: true });

export const Like = model<ILike>('Like', likeSchema);
