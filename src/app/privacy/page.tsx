'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, UserCheck, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';

const privacySections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      'Personal information you provide when creating an account or making a purchase',
      'Payment information processed securely through our payment partners',
      'Communication records when you contact our support team',
      'Technical information such as IP address and browser type for security purposes'
    ]
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      'To process your VPN account purchases and deliver services',
      'To provide customer support and respond to your inquiries',
      'To prevent fraud and ensure the security of our platform',
      'To improve our services and user experience',
      'To comply with legal obligations when required'
    ]
  },
  {
    icon: Lock,
    title: 'Data Protection',
    content: [
      'All personal data is encrypted using industry-standard encryption',
      'We implement strict access controls and security measures',
      'Payment information is processed through PCI-compliant payment processors',
      'Regular security audits and updates to protect your information',
      'Data is stored on secure servers with backup and recovery systems'
    ]
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: [
      'Right to access your personal information we hold',
      'Right to correct or update your personal information',
      'Right to request deletion of your personal data',
      'Right to withdraw consent for data processing',
      'Right to data portability and to receive your data'
    ]
  }
];

export default function PrivacyPage() {
  const [privacyContent, setPrivacyContent] = useState('');

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
          if (data.settings && data.settings.privacyPolicyText) {
            setPrivacyContent(data.settings.privacyPolicyText);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen bg-primary-dark text-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Shield className="h-16 w-16 text-neon-cyan mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
              Privacy <span className="text-neon-cyan">Policy</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Your privacy is our priority. Learn how we collect, use, and protect your information.
            </p>
            <div className="text-sm text-gray-400">
              Last updated: January 2024
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-primary-secondary/30 rounded-2xl p-8 border border-primary-secondary"
          >
            <h2 className="text-2xl font-orbitron font-bold mb-4 text-neon-cyan">
              Our Commitment to Privacy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              At Kage VPN Store, we understand that privacy is fundamental to your trust in our services. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website and use our services. We are committed to protecting your privacy 
              and ensuring the security of your personal information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Content */}
      {privacyContent ? (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-primary-secondary/30 rounded-2xl p-8 border border-primary-secondary"
            >
              <div className="prose prose-invert max-w-none">
                <div 
                  className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: privacyContent }}
                />
              </div>
            </motion.div>
          </div>
        </section>
      ) : (
        <>
      {/* Privacy Sections */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {privacySections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-secondary/20 rounded-xl p-8 border border-primary-secondary hover:border-neon-cyan/50 transition-colors"
              >
                <div className="flex items-center mb-6">
                  {React.createElement(section.icon, { className: "h-8 w-8 text-neon-cyan mr-4" })}
                  <h3 className="text-2xl font-orbitron font-bold">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-neon-cyan rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Third Party Services */}
      <section className="py-16 bg-primary-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-orbitron font-bold mb-8 text-center">
              Third-Party <span className="text-neon-cyan">Services</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-primary-dark/50 rounded-xl p-6 border border-primary-secondary">
                <h3 className="text-xl font-semibold mb-4 text-neon-cyan">Payment Processors</h3>
                <p className="text-gray-300 mb-4">
                  We use trusted payment processors like KBZPay, WavePay, and AYA Pay to handle transactions securely.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Payment data is encrypted and processed securely</li>
                  <li>• We do not store your payment card information</li>
                  <li>• All processors are PCI DSS compliant</li>
                </ul>
              </div>
              <div className="bg-primary-dark/50 rounded-xl p-6 border border-primary-secondary">
                <h3 className="text-xl font-semibold mb-4 text-neon-cyan">VPN Providers</h3>
                <p className="text-gray-300 mb-4">
                  We partner with reputable VPN providers to deliver premium accounts to our customers.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Account details are securely transmitted</li>
                  <li>• Provider privacy policies also apply</li>
                  <li>• We verify all provider credentials</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Data Retention */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-orbitron font-bold mb-8">
              Data <span className="text-neon-cyan">Retention</span>
            </h2>
            <div className="bg-primary-secondary/20 rounded-xl p-8 border border-primary-secondary">
              <p className="text-gray-300 leading-relaxed mb-6">
                We retain your personal information only for as long as necessary to provide our services 
                and fulfill the purposes outlined in this privacy policy. When you request account deletion, 
                we will permanently remove your personal data within 30 days, except where we are required 
                to retain certain information for legal or regulatory purposes.
              </p>
              <div className="flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-400 mr-2" />
                <span className="text-sm text-gray-400">
                  Some data may be retained for fraud prevention and legal compliance
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-br from-primary-secondary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-orbitron font-bold mb-8">
              Questions About <span className="text-neon-cyan">Privacy?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              If you have any questions about this Privacy Policy or our data practices, 
              please don't hesitate to contact us.
            </p>
            <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-6 inline-block">
              <p className="text-neon-cyan font-semibold mb-2">Privacy Officer</p>
              <p className="text-gray-300">privacy@kagevpnstore.com</p>
              <p className="text-gray-300">+95 9 123 456 789</p>
            </div>
          </motion.div>
        </div>
      </section>
        </>
      )}
    </div>
  );
}