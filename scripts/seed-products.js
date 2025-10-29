// Product တွေ database မှာ ထည့်ရန် script
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

// Product Schema
const ProductSchema = new mongoose.Schema({
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
    required: true,
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

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Sample products data
const sampleProducts = [
  {
    name: 'ExpressVPN Premium Account',
    provider: 'ExpressVPN',
    duration: '1 Month',
    price: 15000,
    originalPrice: 20000,
    features: [
      '3000+ servers in 94 countries',
      'Ultra-fast speeds',
      '24/7 customer support',
      'No activity logs',
      '5 simultaneous connections'
    ],
    category: 'Premium',
    isActive: true,
    stock: 50,
    logo: 'https://seeklogo.com/images/E/expressvpn-logo-7A5A5F5F5F-seeklogo.com.png',
    rating: 5
  },
  {
    name: 'ExpressVPN Premium Account',
    provider: 'ExpressVPN',
    duration: '6 Months',
    price: 75000,
    originalPrice: 100000,
    features: [
      '3000+ servers in 94 countries',
      'Ultra-fast speeds',
      '24/7 customer support',
      'No activity logs',
      '5 simultaneous connections'
    ],
    category: 'Premium',
    isActive: true,
    stock: 30,
    logo: 'https://seeklogo.com/images/E/expressvpn-logo-7A5A5F5F5F-seeklogo.com.png',
    rating: 5
  },
  {
    name: 'ExpressVPN Premium Account',
    provider: 'ExpressVPN',
    duration: '1 Year',
    price: 120000,
    originalPrice: 180000,
    features: [
      '3000+ servers in 94 countries',
      'Ultra-fast speeds',
      '24/7 customer support',
      'No activity logs',
      '5 simultaneous connections'
    ],
    category: 'Premium',
    isActive: true,
    stock: 20,
    logo: 'https://seeklogo.com/images/E/expressvpn-logo-7A5A5F5F5F-seeklogo.com.png',
    rating: 5
  },
  {
    name: 'NordVPN Premium Account',
    provider: 'NordVPN',
    duration: '1 Month',
    price: 12000,
    originalPrice: 18000,
    features: [
      '5400+ servers in 59 countries',
      'Double VPN encryption',
      'CyberSec ad blocker',
      'No logs policy',
      '6 simultaneous connections'
    ],
    category: 'Premium',
    isActive: true,
    stock: 40,
    logo: 'https://seeklogo.com/images/N/nordvpn-logo-B1B4F8E5F5-seeklogo.com.png',
    rating: 4.8
  },
  {
    name: 'NordVPN Premium Account',
    provider: 'NordVPN',
    duration: '6 Months',
    price: 60000,
    originalPrice: 90000,
    features: [
      '5400+ servers in 59 countries',
      'Double VPN encryption',
      'CyberSec ad blocker',
      'No logs policy',
      '6 simultaneous connections'
    ],
    category: 'Premium',
    isActive: true,
    stock: 25,
    logo: 'https://seeklogo.com/images/N/nordvpn-logo-B1B4F8E5F5-seeklogo.com.png',
    rating: 4.8
  },
  {
    name: 'NordVPN Premium Account',
    provider: 'NordVPN',
    duration: '1 Year',
    price: 100000,
    originalPrice: 150000,
    features: [
      '5400+ servers in 59 countries',
      'Double VPN encryption',
      'CyberSec ad blocker',
      'No logs policy',
      '6 simultaneous connections'
    ],
    category: 'Premium',
    isActive: true,
    stock: 15,
    logo: 'https://seeklogo.com/images/N/nordvpn-logo-B1B4F8E5F5-seeklogo.com.png',
    rating: 4.8
  },
  {
    name: 'Surfshark Premium Account',
    provider: 'Surfshark',
    duration: '1 Month',
    price: 10000,
    originalPrice: 15000,
    features: [
      '3200+ servers in 65 countries',
      'Unlimited simultaneous connections',
      'CleanWeb ad blocker',
      'No logs policy',
      'MultiHop feature'
    ],
    category: 'Standard',
    isActive: true,
    stock: 60,
    logo: 'https://iconduck.com/api/icons/1959/download?format=png&size=256',
    rating: 4.7
  },
  {
    name: 'Surfshark Premium Account',
    provider: 'Surfshark',
    duration: '6 Months',
    price: 50000,
    originalPrice: 75000,
    features: [
      '3200+ servers in 65 countries',
      'Unlimited simultaneous connections',
      'CleanWeb ad blocker',
      'No logs policy',
      'MultiHop feature'
    ],
    category: 'Standard',
    isActive: true,
    stock: 35,
    logo: 'https://iconduck.com/api/icons/1959/download?format=png&size=256',
    rating: 4.7
  },
  {
    name: 'Surfshark Premium Account',
    provider: 'Surfshark',
    duration: '1 Year',
    price: 80000,
    originalPrice: 120000,
    features: [
      '3200+ servers in 65 countries',
      'Unlimited simultaneous connections',
      'CleanWeb ad blocker',
      'No logs policy',
      'MultiHop feature'
    ],
    category: 'Standard',
    isActive: true,
    stock: 20,
    logo: 'https://iconduck.com/api/icons/1959/download?format=png&size=256',
    rating: 4.7
  },
  {
    name: 'CyberGhost Premium Account',
    provider: 'CyberGhost',
    duration: '1 Month',
    price: 8000,
    originalPrice: 12000,
    features: [
      '7000+ servers in 91 countries',
      'Streaming optimized servers',
      'Ad blocker included',
      'No logs policy',
      '7 simultaneous connections'
    ],
    category: 'Standard',
    isActive: true,
    stock: 45,
    logo: 'https://seeklogo.com/images/C/cyberghost-vpn-logo-B1B4F8E5F5-seeklogo.com.png',
    rating: 4.6
  }
];

async function seedProducts() {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Existing products cleared');
    
    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`${insertedProducts.length} products inserted successfully`);
    
    console.log('Sample products:');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} (${product.duration}) - ${product.price} Ks`);
    });
    
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeding function
if (require.main === module) {
  seedProducts();
}

module.exports = { seedProducts };