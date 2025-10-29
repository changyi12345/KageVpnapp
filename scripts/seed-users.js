// User accounts တွေ database မှာ ထည့်ရန် script
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

// Sample users data
const sampleUsers = [
  {
    name: 'Aung Aung',
    email: 'aung@example.com',
    password: 'password123',
    role: 'user',
    isActive: true
  },
  {
    name: 'Thida Myint',
    email: 'thida@example.com',
    password: 'password123',
    role: 'user',
    isActive: true
  },
  {
    name: 'Kyaw Zin',
    email: 'kyaw@example.com',
    password: 'password123',
    role: 'user',
    isActive: true
  },
  {
    name: 'Mya Mya',
    email: 'mya@example.com',
    password: 'password123',
    role: 'user',
    isActive: true
  },
  {
    name: 'Zaw Win',
    email: 'zaw@example.com',
    password: 'password123',
    role: 'user',
    isActive: true
  }
];

async function seedUsers() {
  try {
    await connectDB();
    
    // Clear existing users (except admin)
    await User.deleteMany({ role: 'user' });
    console.log('Existing users cleared');
    
    // Hash passwords and insert users
    const usersWithHashedPasswords = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );
    
    const insertedUsers = await User.insertMany(usersWithHashedPasswords);
    console.log(`${insertedUsers.length} users inserted successfully`);
    
    console.log('Sample users:');
    insertedUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ID: ${user._id}`);
    });
    
    return insertedUsers;
    
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers };