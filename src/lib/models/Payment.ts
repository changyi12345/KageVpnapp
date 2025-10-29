import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  orderId: string;
  userId: string;
  paymentMethod: string;
  transactionId: string;
  senderName: string;
  senderPhone: string;
  amount: number;
  paymentScreenshot?: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  submittedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  rejectionReason?: string;
  verificationNotes?: string;
}

const PaymentSchema = new Schema<IPayment>({
  orderId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderPhone: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentScreenshot: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending_verification', 'verified', 'rejected'],
    default: 'pending_verification',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  verifiedAt: {
    type: Date,
  },
  verifiedBy: {
    type: String,
  },
  rejectionReason: {
    type: String,
  },
  verificationNotes: {
    type: String,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);