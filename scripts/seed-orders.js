// Sample order တွေ database မှာ ထည့်ရန် script
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

// Order Schema
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

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

// Payment Schema
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

const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

// User Schema (for reference)
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

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedOrders() {
  try {
    await connectDB();
    
    // First, create sample users
    const sampleUsers = [
      {
        name: 'Aung Aung',
        email: 'aung@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        isActive: true
      },
      {
        name: 'Mya Mya',
        email: 'mya@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        isActive: true
      },
      {
        name: 'Kyaw Kyaw',
        email: 'kyaw@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        isActive: true
      },
      {
        name: 'Thida Thida',
        email: 'thida@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        isActive: true
      },
      {
        name: 'Zaw Zaw',
        email: 'zaw@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        isActive: true
      }
    ];

    // Clear existing users and orders
    await User.deleteMany({ role: 'user' });
    await Order.deleteMany({});
    await Payment.deleteMany({});
    console.log('Existing users, orders, and payments cleared');

    // Insert sample users
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`${insertedUsers.length} users inserted successfully`);

    // Update sample orders with actual user IDs
    const updatedSampleOrders = [
      {
        userId: insertedUsers[0]._id,
        items: [
          {
            id: 'prod1',
            name: 'ExpressVPN Premium Account',
            price: 15000,
            duration: '1 Month',
            quantity: 1
          }
        ],
        total: 15000,
        status: 'completed',
        orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        userId: insertedUsers[1]._id,
        items: [
          {
            id: 'prod2',
            name: 'NordVPN Premium Account',
            price: 60000,
            duration: '6 Months',
            quantity: 1
          }
        ],
        total: 60000,
        status: 'verified',
        orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        userId: insertedUsers[2]._id,
        items: [
          {
            id: 'prod3',
            name: 'Surfshark Premium Account',
            price: 10000,
            duration: '1 Month',
            quantity: 2
          }
        ],
        total: 20000,
        status: 'payment_submitted',
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        userId: insertedUsers[3]._id,
        items: [
          {
            id: 'prod4',
            name: 'ExpressVPN Premium Account',
            price: 120000,
            duration: '1 Year',
            quantity: 1
          }
        ],
        total: 120000,
        status: 'pending_payment',
        orderDate: new Date(), // Today
      },
      {
        userId: insertedUsers[4]._id,
        items: [
          {
            id: 'prod5',
            name: 'CyberGhost Premium Account',
            price: 8000,
            duration: '1 Month',
            quantity: 3
          }
        ],
        total: 24000,
        status: 'completed',
        orderDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        completedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
      }
    ];
    
    // Insert sample orders
    const insertedOrders = await Order.insertMany(updatedSampleOrders);
    console.log(`${insertedOrders.length} orders inserted successfully`);
    
    // Create sample payment data for some orders
    const samplePayments = [
      {
        orderId: insertedOrders[0]._id.toString(),
        userId: insertedUsers[0]._id.toString(),
        paymentMethod: 'KBZ Pay',
        transactionId: 'KBZ123456789',
        senderName: 'Aung Aung',
        senderPhone: '09123456789',
        amount: 15000,
        paymentScreenshot: '/uploads/receipts/kbz-receipt-1.jpg',
        status: 'verified',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        verifiedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        verifiedBy: 'admin'
      },
      {
        orderId: insertedOrders[1]._id.toString(),
        userId: insertedUsers[1]._id.toString(),
        paymentMethod: 'Wave Money',
        transactionId: 'WAVE987654321',
        senderName: 'Mya Mya',
        senderPhone: '09987654321',
        amount: 60000,
        paymentScreenshot: '/uploads/receipts/wave-receipt-1.jpg',
        status: 'verified',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        verifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        verifiedBy: 'admin'
      },
      {
        orderId: insertedOrders[2]._id.toString(),
        userId: insertedUsers[2]._id.toString(),
        paymentMethod: 'CB Pay',
        transactionId: 'CB555666777',
        senderName: 'Kyaw Kyaw',
        senderPhone: '09555666777',
        amount: 20000,
        paymentScreenshot: '/uploads/receipts/cb-receipt-1.jpg',
        status: 'pending_verification',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        orderId: insertedOrders[4]._id.toString(),
        userId: insertedUsers[4]._id.toString(),
        paymentMethod: 'AYA Pay',
        transactionId: 'AYA111222333',
        senderName: 'Zaw Zaw',
        senderPhone: '09111222333',
        amount: 24000,
        paymentScreenshot: '/uploads/receipts/aya-receipt-1.jpg',
        status: 'verified',
        submittedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        verifiedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
        verifiedBy: 'admin'
      }
    ];
    
    // Insert sample payments
    const insertedPayments = await Payment.insertMany(samplePayments);
    console.log(`${insertedPayments.length} payments inserted successfully`);
    
    // Update orders with payment IDs
    await Order.findByIdAndUpdate(insertedOrders[0]._id, { paymentId: insertedPayments[0]._id });
    await Order.findByIdAndUpdate(insertedOrders[1]._id, { paymentId: insertedPayments[1]._id });
    await Order.findByIdAndUpdate(insertedOrders[2]._id, { paymentId: insertedPayments[2]._id });
    await Order.findByIdAndUpdate(insertedOrders[4]._id, { paymentId: insertedPayments[3]._id });
    
    console.log('Orders updated with payment IDs');
    
    console.log('Sample orders:');
    insertedOrders.forEach(order => {
      console.log(`- Order ${order._id}: ${order.total} Ks (${order.status})`);
    });
    
  } catch (error) {
    console.error('Error seeding orders:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
if (require.main === module) {
  seedOrders();
}

module.exports = { seedOrders };