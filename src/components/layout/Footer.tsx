'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Mail, Facebook, Shield, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [footerText, setFooterText] = useState('Your trusted source for premium VPN accounts. Fast, secure, and reliable access to global content.');
  const [socialLinks, setSocialLinks] = useState([
    { icon: MessageCircle, href: 'https://t.me/kagevpn', label: 'Telegram' },
    { icon: Mail, href: 'mailto:info@kagevpn.com', label: 'Email' },
    { icon: Facebook, href: 'https://facebook.com/kagevpn', label: 'Facebook' },
  ]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.settings) {
            if (data.settings.footerText) {
              setFooterText(data.settings.footerText);
            }
            
            // Update social links with dynamic data
            const updatedSocialLinks = [
              { 
                icon: MessageCircle, 
                href: data.settings.telegramLink || 'https://t.me/kagevpn', 
                label: 'Telegram' 
              },
              { 
                icon: Mail, 
                href: `mailto:${data.settings.emailLink || 'info@kagevpn.com'}`, 
                label: 'Email' 
              },
              { 
                icon: Facebook, 
                href: data.settings.facebookLink || 'https://facebook.com/kagevpn', 
                label: 'Facebook' 
              },
            ];
            
            // Add additional social links if they exist
            if (data.settings.viberLink) {
              updatedSocialLinks.push({
                icon: MessageCircle,
                href: data.settings.viberLink,
                label: 'Viber'
              });
            }
            
            if (data.settings.whatsappLink) {
              updatedSocialLinks.push({
                icon: MessageCircle,
                href: data.settings.whatsappLink,
                label: 'WhatsApp'
              });
            }
            
            setSocialLinks(updatedSocialLinks);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Refund Policy', href: '/refund' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Order Status', href: '/orders' },
      { label: 'FAQ', href: '/faq' },
    ],
    products: [
      { label: 'ExpressVPN', href: '/products?filter=expressvpn' },
      { label: 'NordVPN', href: '/products?filter=nordvpn' },
      { label: 'Surfshark', href: '/products?filter=surfshark' },
      { label: 'All Products', href: '/products' },
    ],
  };

  const features = [
    { icon: Shield, text: 'Secure & Private' },
    { icon: Zap, text: 'Fast Delivery' },
    { icon: Globe, text: 'Global Access' },
  ];

  return (
    <footer className="bg-primary-dark border-t border-primary-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-orbitron font-bold text-neon-cyan mb-4 block">
              Kage VPN
            </Link>
            <p className="text-gray-400 mb-6">
              {footerText}
            </p>
            
            {/* Features */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center text-sm text-gray-300"
                >
                  <feature.icon className="h-4 w-4 text-neon-cyan mr-2" />
                  {feature.text}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-cyan transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-cyan transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-cyan transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-secondary mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-400 hover:text-neon-cyan transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © {currentYear} Kage VPN Store. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}