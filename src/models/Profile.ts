import { Schema, model, Document, Types } from 'mongoose';

export interface IProfile extends Document {
  user: Types.ObjectId;
  displayName?: string;
  avatarUrl?: string;
  createdAt: Date;
}

const profileSchema = new Schema<IProfile>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  displayName: { type: String },
  avatarUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Profile = model<IProfile>('Profile', profileSchema);
