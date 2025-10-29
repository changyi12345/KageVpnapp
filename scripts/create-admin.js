// Admin account ဖန်တီးရန် script
const bcrypt = require('bcryptjs');
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

// User Schema
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

async function createAdmin() {
  try {
    await connectDB();
    
    const adminData = {
      name: 'Admin',
      email: 'admin@kagevpn.com',
      password: await bcrypt.hash('admin123', 12),
      role: 'admin',
      isActive: true
    };
    
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (!existingAdmin) {
      await User.create(adminData);
      console.log('✅ Admin account created successfully');
      console.log('📧 Email: admin@kagevpn.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('⚠️ Admin account already exists');
      console.log('📧 Email: admin@kagevpn.com');
    }
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();