import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  provider: string;
  duration: string;
  price: number;
  originalPrice?: number;
  features: string[];
  category: 'Premium' | 'Standard';
  isActive: boolean;
  stock: number;
  logo: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  provider: {
    type: String,
    required: [true, 'Provider is required'],
    trim: true,
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  features: [{
    type: String,
    trim: true,
  }],
  category: {
    type: String,
    enum: ['Premium', 'Standard'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  logo: {
    type: String,
    required: false,
    default: '',
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);