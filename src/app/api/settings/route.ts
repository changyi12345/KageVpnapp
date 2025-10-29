import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/lib/models/Settings';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    let settings = await Settings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    // Return only public settings (no payment methods for security)
    const publicSettings = {
      siteName: settings.siteName || 'VPN Key Store',
      siteDescription: settings.siteDescription || 'Premium VPN Keys at affordable prices',
      promoBannerText: settings.promoBannerText || '🔥 Buy 1 Year Plan - Get 1 Month Free 🔥 Limited Time Offer! 🔥 Buy 1 Year Plan - Get 1 Month Free 🔥',
      promoBannerEnabled: settings.promoBannerEnabled !== false, // Default to true
      maintenanceMode: settings.maintenanceMode || false,
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      featuresTitle: settings.featuresTitle,
      featuresSubtitle: settings.featuresSubtitle,
      productsTitle: settings.productsTitle,
      productsSubtitle: settings.productsSubtitle,
      testimonialsTitle: settings.testimonialsTitle,
      testimonialsSubtitle: settings.testimonialsSubtitle,
      aboutUsText: settings.aboutUsText,
      termsOfServiceText: settings.termsOfServiceText,
      privacyPolicyText: settings.privacyPolicyText,
      refundPolicyText: settings.refundPolicyText,
      faqContent: settings.faqContent,
      footerText: settings.footerText,
      socialLinks: settings.socialLinks,
    };

    return NextResponse.json({ settings: publicSettings });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json(
      { error: 'Settings များ ရယူ၍မရပါ' },
      { status: 500 }
    );
  }
}