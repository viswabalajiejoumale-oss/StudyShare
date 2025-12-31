import { Schema, model, Document, Types } from 'mongoose';

export interface IRating extends Document {
  note: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  createdAt: Date;
}

const ratingSchema = new Schema<IRating>({
  note: { type: Schema.Types.ObjectId, ref: 'Note', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

ratingSchema.index({ note: 1, user: 1 }, { unique: true });

export const Rating = model<IRating>('Rating', ratingSchema);
