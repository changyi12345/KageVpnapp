// Fix payment methods by adding missing phoneNumber field
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

// Settings Schema
const SettingsSchema = new mongoose.Schema({
  paymentMethods: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    logo: { type: String, required: true },
    number: { type: String, required: true },
    accountName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isActive: { type: Boolean, default: true }
  }],
  siteName: { type: String, default: 'Kage VPN' },
  siteDescription: { type: String, default: 'Premium VPN Service' },
  contactEmail: { type: String, default: 'support@kagevpn.com' },
  contactPhone: { type: String, default: '09123456789' }
}, {
  timestamps: true
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

async function fixPaymentMethods() {
  try {
    await connectDB();
    
    console.log('Fixing payment methods...');
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      console.log('No settings found, creating default settings with phoneNumber...');
      settings = new Settings({
        paymentMethods: [
          {
            id: 'kpay',
            name: 'KBZ Pay',
            logo: '💳',
            number: '09123456789',
            accountName: 'Kage VPN Store',
            phoneNumber: '09123456789',
            isActive: true
          },
          {
            id: 'wavepay',
            name: 'Wave Pay',
            logo: '🌊',
            number: '09987654321',
            accountName: 'Kage VPN Store',
            phoneNumber: '09987654321',
            isActive: true
          },
          {
            id: 'ayapay',
            name: 'AYA Pay',
            logo: '🏦',
            number: '09456789123',
            accountName: 'Kage VPN Store',
            phoneNumber: '09456789123',
            isActive: true
          },
          {
            id: 'cbpay',
            name: 'CB Pay',
            logo: '💰',
            number: '09789123456',
            accountName: 'Kage VPN Store',
            phoneNumber: '09789123456',
            isActive: true
          }
        ]
      });
    } else {
      console.log('Found existing settings, updating payment methods...');
      
      // Fix existing payment methods by adding phoneNumber if missing
      if (settings.paymentMethods && settings.paymentMethods.length > 0) {
        settings.paymentMethods = settings.paymentMethods.map(method => {
          if (!method.phoneNumber) {
            // Use the account number as phone number if missing
            method.phoneNumber = method.number || '09123456789';
            console.log(`Added phoneNumber to ${method.name}: ${method.phoneNumber}`);
          }
          return method;
        });
      } else {
        // No payment methods exist, create default ones
        settings.paymentMethods = [
          {
            id: 'kpay',
            name: 'KBZ Pay',
            logo: '💳',
            number: '09123456789',
            accountName: 'Kage VPN Store',
            phoneNumber: '09123456789',
            isActive: true
          },
          {
            id: 'wavepay',
            name: 'Wave Pay',
            logo: '🌊',
            number: '09987654321',
            accountName: 'Kage VPN Store',
            phoneNumber: '09987654321',
            isActive: true
          }
        ];
      }
    }
    
    await settings.save();
    console.log('Payment methods fixed successfully!');
    console.log('Updated payment methods:', settings.paymentMethods.map(m => ({ name: m.name, phoneNumber: m.phoneNumber })));
    
  } catch (error) {
    console.error('Error fixing payment methods:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

fixPaymentMethods();