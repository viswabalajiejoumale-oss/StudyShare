import { Schema, model, Document, Types } from 'mongoose';

export interface IBannedUser extends Document {
  user: Types.ObjectId;
  bannedBy?: Types.ObjectId;
  createdAt: Date;
}

const bannedSchema = new Schema<IBannedUser>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bannedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export const BannedUser = model<IBannedUser>('BannedUser', bannedSchema);