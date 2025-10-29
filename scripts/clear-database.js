const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vpnkey';

async function connectDB() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

// Define schemas (same as in the app)
const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

const PaymentSchema = new mongoose.Schema({
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

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  features: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Create models
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function clearDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    
    console.log('🗑️  Clearing all collections...');
    
    // Clear all collections
    const orderResult = await Order.deleteMany({});
    console.log(`✅ Deleted ${orderResult.deletedCount} orders`);
    
    const paymentResult = await Payment.deleteMany({});
    console.log(`✅ Deleted ${paymentResult.deletedCount} payments`);
    
    // Clear only non-admin users
    const userResult = await User.deleteMany({ role: { $ne: 'admin' } });
    console.log(`✅ Deleted ${userResult.deletedCount} users (kept admin users)`);
    
    const productResult = await Product.deleteMany({});
    console.log(`✅ Deleted ${productResult.deletedCount} products`);
    
    console.log('🎉 Database cleared successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Run: node scripts/seed-products.js');
    console.log('2. Run: node scripts/seed-users.js (optional)');
    console.log('3. Start fresh testing');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  clearDatabase();
}

module.exports = { clearDatabase };