'use client';

import { motion } from 'framer-motion';
import { FileText, Scale, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const termsSections = [
  {
    icon: CheckCircle,
    title: 'Acceptance of Terms',
    content: [
      'By accessing and using Kage VPN Store, you accept and agree to be bound by these Terms of Service',
      'If you do not agree to these terms, you may not use our services',
      'We reserve the right to update these terms at any time with notice to users',
      'Continued use of our services constitutes acceptance of any changes'
    ]
  },
  {
    icon: FileText,
    title: 'Service Description',
    content: [
      'Kage VPN Store provides VPN account purchasing and delivery services',
      'We act as a marketplace connecting customers with premium VPN providers',
      'All VPN accounts are sourced from legitimate, authorized providers',
      'Service availability may vary based on provider stock and regional restrictions'
    ]
  },
  {
    icon: Scale,
    title: 'User Responsibilities',
    content: [
      'You must provide accurate and complete information when making purchases',
      'You are responsible for maintaining the confidentiality of your account credentials',
      'You must not use our services for any illegal or unauthorized purposes',
      'You agree to comply with all applicable laws and regulations',
      'You must not attempt to circumvent our security measures or systems'
    ]
  },
  {
    icon: XCircle,
    title: 'Prohibited Activities',
    content: [
      'Reselling or redistributing purchased VPN accounts without authorization',
      'Using our services to engage in fraudulent or deceptive practices',
      'Attempting to hack, disrupt, or damage our systems or services',
      'Violating intellectual property rights of VPN providers or third parties',
      'Creating multiple accounts to circumvent purchase limits or restrictions'
    ]
  }
];

const paymentTerms = [
  {
    title: 'Payment Processing',
    description: 'All payments are processed securely through authorized payment partners including KBZPay, WavePay, and AYA Pay.'
  },
  {
    title: 'Pricing',
    description: 'Prices are displayed in Myanmar Kyat (MMK) and may change without notice. Current prices apply at time of purchase.'
  },
  {
    title: 'Payment Verification',
    description: 'Orders require payment verification before VPN account delivery. This process typically takes 5-30 minutes.'
  },
  {
    title: 'Failed Payments',
    description: 'Failed or incomplete payments will result in order cancellation. Refunds will be processed according to our refund policy.'
  }
];

export default function TermsPage() {
  const [termsContent, setTermsContent] = useState('');

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
          if (data.settings && data.settings.termsOfServiceText) {
            setTermsContent(data.settings.termsOfServiceText);
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
            <Scale className="h-16 w-16 text-neon-cyan mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
              Terms of <span className="text-neon-cyan">Service</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Please read these terms carefully before using our services. 
              They govern your use of Kage VPN Store.
            </p>
            <div className="text-sm text-gray-400">
              Effective Date: January 1, 2024 | Last Updated: January 2024
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Terms Content */}
      {termsContent && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-primary-secondary/30 rounded-2xl p-8 border border-primary-secondary"
            >
              <div 
                className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: termsContent }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Default content when no custom terms content is available */}
      {!termsContent && (
        <>
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
                  Welcome to Kage VPN Store
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  These Terms of Service ("Terms") govern your use of the Kage VPN Store website 
                  and services operated by Kage VPN Store ("we," "us," or "our"). By accessing 
                  or using our service, you agree to be bound by these Terms. If you disagree 
                  with any part of these terms, then you may not access the service.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Terms Sections */}
          <section className="py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid gap-8">
                {termsSections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-primary-secondary/20 rounded-xl p-8 border border-primary-secondary hover:border-neon-cyan/50 transition-colors"
                  >
                    <div className="flex items-center mb-6">
                      <section.icon className="h-8 w-8 text-neon-cyan mr-4" />
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

          {/* Payment Terms */}
          <section className="py-16 bg-primary-secondary/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-orbitron font-bold mb-12 text-center">
              Payment <span className="text-neon-cyan">Terms</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {paymentTerms.map((term, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-primary-dark/50 rounded-xl p-6 border border-primary-secondary"
                >
                  <h3 className="text-xl font-semibold mb-4 text-neon-cyan">{term.title}</h3>
                  <p className="text-gray-300">{term.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Payment Terms */}
      <section className="py-16 bg-primary-secondary/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-orbitron font-bold mb-12 text-center">
              Payment <span className="text-neon-cyan">Terms</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {paymentTerms.map((term, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-primary-dark/50 rounded-xl p-6 border border-primary-secondary"
                >
                  <h3 className="text-xl font-semibold mb-4 text-neon-cyan">{term.title}</h3>
                  <p className="text-gray-300">{term.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Service Availability */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-orbitron font-bold mb-8 text-center">
              Service <span className="text-neon-cyan">Availability</span>
            </h2>
            <div className="bg-primary-secondary/20 rounded-xl p-8 border border-primary-secondary">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <Clock className="h-12 w-12 text-neon-cyan mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">24/7 Availability</h3>
                  <p className="text-gray-300 text-sm">Our platform is available around the clock</p>
                </div>
                <div>
                  <AlertCircle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Maintenance</h3>
                  <p className="text-gray-300 text-sm">Scheduled maintenance with advance notice</p>
                </div>
                <div>
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">99.9% Uptime</h3>
                  <p className="text-gray-300 text-sm">Reliable service with minimal downtime</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Limitation of Liability */}
      <section className="py-16 bg-primary-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-orbitron font-bold mb-8 text-center">
              Limitation of <span className="text-neon-cyan">Liability</span>
            </h2>
            <div className="bg-primary-dark/50 rounded-xl p-8 border border-primary-secondary">
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-white">Service Disclaimer:</strong> Kage VPN Store provides VPN accounts "as is" 
                  and makes no warranties regarding the performance or availability of third-party VPN services.
                </p>
                <p>
                  <strong className="text-white">Limitation:</strong> Our liability is limited to the amount paid for 
                  the specific service that gave rise to the claim, not to exceed the purchase price.
                </p>
                <p>
                  <strong className="text-white">Third-Party Services:</strong> We are not responsible for the actions, 
                  policies, or performance of third-party VPN providers or payment processors.
                </p>
                <p>
                  <strong className="text-white">Force Majeure:</strong> We are not liable for delays or failures 
                  caused by circumstances beyond our reasonable control.
                </p>
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
              Questions About <span className="text-neon-cyan">Terms?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              If you have any questions about these Terms of Service, please contact us.
            </p>
            <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-6 inline-block">
              <p className="text-neon-cyan font-semibold mb-2">Legal Department</p>
              <p className="text-gray-300">legal@kagevpnstore.com</p>
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