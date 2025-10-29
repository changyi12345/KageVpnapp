import mongoose, { Document, Schema } from 'mongoose';

export interface IPaymentMethod {
  id: string;
  name: string;
  logo: string;
  number: string;
  accountName: string;
  phoneNumber: string;
  isActive: boolean;
}

export interface ISettings extends Document {
  paymentMethods: IPaymentMethod[];
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  promoBannerText: string;
  promoBannerEnabled: boolean;
  maintenanceMode: boolean;
  // Site Content
  heroTitle: string;
  heroSubtitle: string;
  featuresTitle: string;
  featuresSubtitle: string;
  productsTitle: string;
  productsSubtitle: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  aboutUsText: string;
  termsOfServiceText: string;
  privacyPolicyText: string;
  refundPolicyText: string;
  faqContent: string;
  // Footer Content
  footerText: string;
  socialLinks: {
    facebook?: string;
    telegram?: string;
    viber?: string;
    whatsapp?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const SettingsSchema = new Schema<ISettings>({
  paymentMethods: [PaymentMethodSchema],
  siteName: {
    type: String,
    default: 'Kage VPN Store',
  },
  siteDescription: {
    type: String,
    default: 'Premium VPN Services',
  },
  contactEmail: {
    type: String,
    default: 'support@kagevpn.com',
  },
  contactPhone: {
    type: String,
    default: '09123456789',
  },
  promoBannerText: {
    type: String,
    default: '🔥 Buy 1 Year Plan – Get 1 Month Free 🔥 Limited Time Offer! 🔥 Buy 1 Year Plan – Get 1 Month Free 🔥',
  },
  promoBannerEnabled: {
    type: Boolean,
    default: true,
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  // Site Content
  heroTitle: {
    type: String,
    default: 'Secure Your Internet with Kage VPN Store',
  },
  heroSubtitle: {
    type: String,
    default: 'Buy ExpressVPN, NordVPN, and more — fast, safe, and local.',
  },
  featuresTitle: {
    type: String,
    default: 'Why Choose Kage VPN Store?',
  },
  featuresSubtitle: {
    type: String,
    default: 'We provide the best VPN services with unmatched quality and support.',
  },
  productsTitle: {
    type: String,
    default: 'Premium VPN Plans',
  },
  productsSubtitle: {
    type: String,
    default: 'Choose from our selection of premium VPN services',
  },
  testimonialsTitle: {
    type: String,
    default: 'What Our Customers Say',
  },
  testimonialsSubtitle: {
    type: String,
    default: 'Hear from our satisfied customers about their experience.',
  },
  aboutUsText: {
    type: String,
    default: 'We are Myanmar\'s trusted VPN key provider, offering premium VPN services at affordable prices with instant delivery and 24/7 support.',
  },
  termsOfServiceText: {
    type: String,
    default: 'By using our services, you agree to our terms and conditions. Please read carefully before making a purchase.',
  },
  privacyPolicyText: {
    type: String,
    default: 'We respect your privacy and are committed to protecting your personal information. This policy explains how we collect and use your data.',
  },
  refundPolicyText: {
    type: String,
    default: 'We offer refunds within 7 days of purchase if the VPN key is not working. Please contact our support team for assistance.',
  },
  faqContent: {
    type: String,
    default: 'Frequently asked questions and answers about our VPN services, delivery process, and support.',
  },
  footerText: {
    type: String,
    default: '© 2024 Kage VPN Store. All rights reserved. Premium VPN keys at your fingertips.',
  },
  socialLinks: {
    facebook: {
      type: String,
      default: '',
    },
    telegram: {
      type: String,
      default: '',
    },
    viber: {
      type: String,
      default: '',
    },
    whatsapp: {
      type: String,
      default: '',
    },
  },
}, {
  timestamps: true,
});

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);