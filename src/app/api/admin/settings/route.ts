import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Require admin authentication
    try {
      const admin = requireAdmin(request);
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
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
      await settings.save();
    }

    return NextResponse.json({ 
      settings: {
        ...settings.toObject(),
        maintenanceMode: settings.maintenanceMode || false
      }
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Settings များ ရယူ၍မရပါ' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    // Require admin authentication
    try {
      const admin = requireAdmin(request);
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { 
      paymentMethods, 
      siteName, 
      siteDescription, 
      contactEmail, 
      contactPhone, 
      promoBannerText, 
      promoBannerEnabled,
      maintenanceMode,
      heroTitle,
      heroSubtitle,
      featuresTitle,
      featuresSubtitle,
      productsTitle,
      productsSubtitle,
      testimonialsTitle,
      testimonialsSubtitle,
      aboutUsText,
      termsOfServiceText,
      privacyPolicyText,
      refundPolicyText,
      faqContent,
      footerText,
      socialLinks
    } = body;

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }

    // Update settings
    if (paymentMethods) settings.paymentMethods = paymentMethods;
    if (siteName) settings.siteName = siteName;
    if (siteDescription) settings.siteDescription = siteDescription;
    if (contactEmail) settings.contactEmail = contactEmail;
    if (contactPhone) settings.contactPhone = contactPhone;
    if (promoBannerText !== undefined) settings.promoBannerText = promoBannerText;
    if (promoBannerEnabled !== undefined) settings.promoBannerEnabled = promoBannerEnabled;
    if (maintenanceMode !== undefined) {
      console.log('Updating maintenanceMode to:', maintenanceMode);
      settings.maintenanceMode = maintenanceMode;
    }
    
    // Content Management Updates
    if (heroTitle !== undefined) settings.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) settings.heroSubtitle = heroSubtitle;
    if (featuresTitle !== undefined) settings.featuresTitle = featuresTitle;
    if (featuresSubtitle !== undefined) settings.featuresSubtitle = featuresSubtitle;
    if (productsTitle !== undefined) settings.productsTitle = productsTitle;
    if (productsSubtitle !== undefined) settings.productsSubtitle = productsSubtitle;
    if (testimonialsTitle !== undefined) settings.testimonialsTitle = testimonialsTitle;
    if (testimonialsSubtitle !== undefined) settings.testimonialsSubtitle = testimonialsSubtitle;
    if (aboutUsText !== undefined) settings.aboutUsText = aboutUsText;
    if (termsOfServiceText !== undefined) settings.termsOfServiceText = termsOfServiceText;
    if (privacyPolicyText !== undefined) settings.privacyPolicyText = privacyPolicyText;
    if (refundPolicyText !== undefined) settings.refundPolicyText = refundPolicyText;
    if (faqContent !== undefined) settings.faqContent = faqContent;
    if (footerText !== undefined) settings.footerText = footerText;
    if (socialLinks !== undefined) settings.socialLinks = socialLinks;

    await settings.save();
    console.log('Settings saved successfully, maintenanceMode:', settings.maintenanceMode);

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings 
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Settings update လုပ်၍မရပါ' },
      { status: 500 }
    );
  }
}