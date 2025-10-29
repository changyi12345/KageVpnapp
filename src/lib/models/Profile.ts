import mongoose, { Document, Schema } from 'mongoose';

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  avatar?: string;
  dateOfBirth?: Date;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
    currency: string;
  };
  subscription?: {
    plan: string;
    status: 'active' | 'inactive' | 'expired';
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    zipCode: { type: String, trim: true },
  },
  avatar: {
    type: String,
    default: null,
  },
  dateOfBirth: {
    type: Date,
  },
  preferences: {
    newsletter: {
      type: Boolean,
      default: true,
    },
    notifications: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: 'en',
    },
    currency: {
      type: String,
      default: 'USD',
    },
  },
  subscription: {
    plan: {
      type: String,
      enum: ['basic', 'premium', 'enterprise'],
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'inactive',
    },
    startDate: Date,
    endDate: Date,
    autoRenew: {
      type: Boolean,
      default: false,
    },
  },
}, {
  timestamps: true,
});

export default mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);