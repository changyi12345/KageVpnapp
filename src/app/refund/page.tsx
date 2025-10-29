'use client';

import { motion } from 'framer-motion';
import { RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';

const refundPolicies = [
  {
    icon: CheckCircle,
    title: 'Eligible for Refund',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20',
    items: [
      'VPN account not delivered within 24 hours of payment verification',
      'VPN account credentials are invalid or non-functional',
      'Duplicate charges for the same order',
      'Technical issues preventing account activation',
      'Service not as described in product listing'
    ]
  },
  {
    icon: XCircle,
    title: 'Not Eligible for Refund',
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20',
    items: [
      'Change of mind after successful account delivery',
      'VPN account suspended due to violation of provider terms',
      'Customer provided incorrect contact information',
      'Refund requested after 7 days of account delivery',
      'Account shared or resold to third parties'
    ]
  },
  {
    icon: AlertTriangle,
    title: 'Special Conditions',
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/20',
    items: [
      'Partial refunds may apply for partially used subscription periods',
      'Promotional or discounted purchases may have different refund terms',
      'Bulk orders may require additional verification for refunds',
      'Refunds for payment method issues handled case-by-case',
      'Provider policy changes may affect refund eligibility'
    ]
  }
];

const refundProcess = [
  {
    step: 1,
    title: 'Submit Request',
    description: 'Contact our support team with your order details and reason for refund',
    icon: '📝'
  },
  {
    step: 2,
    title: 'Verification',
    description: 'We verify your order and check refund eligibility within 24 hours',
    icon: '🔍'
  },
  {
    step: 3,
    title: 'Processing',
    description: 'Approved refunds are processed within 3-5 business days',
    icon: '⚙️'
  },
  {
    step: 4,
    title: 'Completion',
    description: 'Refund amount is credited back to your original payment method',
    icon: '✅'
  }
];

export default function RefundPage() {
  const [refundContent, setRefundContent] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setRefundContent(data.settings?.refundPolicyText || '');
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
            <RefreshCw className="h-16 w-16 text-neon-cyan mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
              Refund <span className="text-neon-cyan">Policy</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              We stand behind our services. Learn about our fair and transparent refund policy.
            </p>
            <div className="text-sm text-gray-400">
              Policy effective from January 1, 2024
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Content */}
      {refundContent && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-primary-secondary/30 rounded-2xl p-8 border border-primary-secondary"
            >
              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: refundContent.replace(/\n/g, '<br>') }} />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Default content when no custom refund content is available */}
      {!refundContent && (
        <>
      {/* Quick Overview */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-primary-secondary/30 rounded-2xl p-8 border border-primary-secondary"
          >
            <h2 className="text-2xl font-orbitron font-bold mb-6 text-neon-cyan text-center">
              Refund Policy Overview
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Clock className="h-12 w-12 text-neon-cyan mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">7-Day Window</h3>
                <p className="text-gray-300 text-sm">Refund requests must be made within 7 days of purchase</p>
              </div>
              <div>
                <CreditCard className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Full Refund</h3>
                <p className="text-gray-300 text-sm">100% refund for eligible cases with valid reasons</p>
              </div>
              <div>
                <CheckCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Quick Process</h3>
                <p className="text-gray-300 text-sm">Refunds processed within 3-5 business days</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Refund Policies */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-orbitron font-bold mb-4">
              Refund <span className="text-neon-cyan">Eligibility</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Understanding when refunds are available and what conditions apply
            </p>
          </motion.div>

          <div className="grid gap-8">
            {refundPolicies.map((policy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`${policy.bgColor} rounded-xl p-8 border ${policy.borderColor}`}
              >
                <div className="flex items-center mb-6">
                  <policy.icon className={`h-8 w-8 ${policy.color} mr-4`} />
                  <h3 className="text-2xl font-orbitron font-bold">{policy.title}</h3>
                </div>
                <ul className="space-y-3">
                  {policy.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className={`w-2 h-2 ${policy.color.replace('text-', 'bg-')} rounded-full mt-2 mr-3 flex-shrink-0`}></div>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Process */}
      <section className="py-16 bg-primary-secondary/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-orbitron font-bold mb-4">
              Refund <span className="text-neon-cyan">Process</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple steps to request and receive your refund
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {refundProcess.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-dark/50 rounded-xl p-6 border border-primary-secondary text-center relative"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-neon-cyan text-primary-dark rounded-full flex items-center justify-center font-bold text-sm">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neon-cyan">{step.title}</h3>
                <p className="text-gray-300 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Method Specific */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-orbitron font-bold mb-8 text-center">
              Payment Method <span className="text-neon-cyan">Refunds</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-primary-secondary/20 rounded-xl p-6 border border-primary-secondary">
                <h3 className="text-xl font-semibold mb-4 text-neon-cyan">Mobile Wallets</h3>
                <div className="space-y-3 text-gray-300">
                  <p><strong>KBZPay:</strong> 1-3 business days</p>
                  <p><strong>WavePay:</strong> 1-3 business days</p>
                  <p><strong>AYA Pay:</strong> 2-4 business days</p>
                  <p><strong>CB Pay:</strong> 2-4 business days</p>
                </div>
              </div>
              <div className="bg-primary-secondary/20 rounded-xl p-6 border border-primary-secondary">
                <h3 className="text-xl font-semibold mb-4 text-neon-cyan">Bank Transfers</h3>
                <div className="space-y-3 text-gray-300">
                  <p><strong>Local Banks:</strong> 3-5 business days</p>
                  <p><strong>International:</strong> 5-7 business days</p>
                  <p><strong>Processing:</strong> Additional verification may be required</p>
                  <p><strong>Fees:</strong> Bank charges may apply</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-16 bg-primary-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-orbitron font-bold mb-8 text-center">
              Important <span className="text-neon-cyan">Notes</span>
            </h2>
            <div className="bg-primary-dark/50 rounded-xl p-8 border border-primary-secondary">
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-orange-400 mr-3 mt-1 flex-shrink-0" />
                  <p>
                    <strong className="text-white">Documentation Required:</strong> Please provide order ID, 
                    payment proof, and detailed reason for refund request.
                  </p>
                </div>
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                  <p>
                    <strong className="text-white">Processing Time:</strong> Refund processing begins after 
                    verification is complete and may take additional time based on payment method.
                  </p>
                </div>
                <div className="flex items-start">
                  <CreditCard className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
                  <p>
                    <strong className="text-white">Currency Exchange:</strong> Refunds are processed in the 
                    original currency. Exchange rate fluctuations may affect the final amount.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact for Refunds */}
      <section className="py-16 bg-gradient-to-br from-primary-secondary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-orbitron font-bold mb-8">
              Need a <span className="text-neon-cyan">Refund?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Contact our support team to start your refund request process.
            </p>
            <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-6 inline-block">
              <p className="text-neon-cyan font-semibold mb-2">Refund Support</p>
              <p className="text-gray-300">refunds@kagevpnstore.com</p>
              <p className="text-gray-300">+95 9 123 456 789</p>
              <p className="text-sm text-gray-400 mt-2">Available 24/7 for refund requests</p>
            </div>
          </motion.div>
        </div>
      </section>
        </>
      )}
    </div>
  );
}