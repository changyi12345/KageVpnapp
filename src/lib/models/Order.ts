import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: Array<{
    id: string;
    name: string;
    price: number;
    duration: string;
    quantity: number;
  }>;
  total: number;
  status: 'pending_payment' | 'payment_submitted' | 'verified' | 'completed' | 'cancelled';
  paymentId?: mongoose.Types.ObjectId;
  orderDate: Date;
  completedAt?: Date;
  vpnCredentials?: {
    username: string;
    password: string;
    serverInfo?: string;
    expiryDate?: Date;
    deliveredAt?: Date;
    deliveredBy?: string;
    code?: string;
  };
}

const OrderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
  }],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending_payment', 'payment_submitted', 'verified', 'completed', 'cancelled'],
    default: 'pending_payment',
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
  vpnCredentials: {
    username: { type: String },
    password: { type: String },
    code: { type: String },
    serverInfo: { type: String },
    expiryDate: { type: Date },
    deliveredAt: { type: Date },
    deliveredBy: { type: String },
  },
}, {
  timestamps: true,
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);