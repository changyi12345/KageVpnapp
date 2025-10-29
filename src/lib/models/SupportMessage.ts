import mongoose, { Document, Schema } from 'mongoose';

export interface ISupportMessage extends Document {
  conversationId: string;
  sender: 'user' | 'admin';
  userId?: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  message: string;
  status: 'new' | 'read';
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SupportMessageSchema = new Schema<ISupportMessage>({
  conversationId: { type: String, index: true, required: true },
  sender: { type: String, enum: ['user', 'admin'], required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String },
  email: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read'], default: 'new' },
  ip: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

export default mongoose.models.SupportMessage || mongoose.model<ISupportMessage>('SupportMessage', SupportMessageSchema);