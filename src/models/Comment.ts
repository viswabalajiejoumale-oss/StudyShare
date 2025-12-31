import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  note: Types.ObjectId;
  user: Types.ObjectId;
  content: string;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  note: { type: Schema.Types.ObjectId, ref: 'Note', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Comment = model<IComment>('Comment', commentSchema);
