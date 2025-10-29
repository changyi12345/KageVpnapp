// Admin password reset script
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

async function resetAdminPassword() {
  try {
    await connectDB();
    
    const adminEmail = 'admin@kagevpn.com';
    const newPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123'; // Use env var or default
    
    console.log('⚠️  WARNING: Using default password. Please change it after first login!');
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Find and update admin user
    const admin = await User.findOneAndUpdate(
      { email: adminEmail, role: 'admin' },
      { password: hashedPassword },
      { new: true }
    );
    
    if (admin) {
      console.log('✅ Admin password reset successfully');
      console.log('📧 Email: admin@kagevpn.com');
      console.log('🔑 New Password: admin123');
      console.log('⚠️ Please change this password after login');
    } else {
      console.log('❌ Admin user not found');
      console.log('Creating new admin account...');
      
      // Create new admin if not exists
      const adminData = {
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true
      };
      
      await User.create(adminData);
      console.log('✅ New admin account created');
      console.log('📧 Email: admin@kagevpn.com');
      console.log('🔑 Password: admin123');
    }
  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

resetAdminPassword();