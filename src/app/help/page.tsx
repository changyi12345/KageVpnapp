'use client';

import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, Phone, Mail, Search, Book, Video, FileText } from 'lucide-react';
import { useState } from 'react';

const helpCategories = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'Learn how to purchase and use VPN accounts',
    articles: [
      'How to create an account',
      'Making your first purchase',
      'Payment methods guide',
      'Account activation process'
    ]
  },
  {
    icon: FileText,
    title: 'Account Management',
    description: 'Manage your orders and account settings',
    articles: [
      'Viewing your order history',
      'Updating account information',
      'Password reset guide',
      'Managing notifications'
    ]
  },
  {
    icon: Video,
    title: 'VPN Setup Guides',
    description: 'Step-by-step VPN configuration tutorials',
    articles: [
      'ExpressVPN setup guide',
      'NordVPN configuration',
      'Surfshark installation',
      'Troubleshooting connections'
    ]
  },
  {
    icon: HelpCircle,
    title: 'Troubleshooting',
    description: 'Solutions to common issues and problems',
    articles: [
      'Payment not processing',
      'VPN not connecting',
      'Account access issues',
      'Performance optimization'
    ]
  }
];

const contactMethods = [
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    availability: '24/7 Available',
    action: 'Start Chat',
    color: 'text-green-400'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Send us detailed questions or issues',
    availability: 'Response within 2 hours',
    action: 'Send Email',
    color: 'text-blue-400'
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Speak directly with our experts',
    availability: 'Mon-Fri 9AM-6PM',
    action: 'Call Now',
    color: 'text-purple-400'
  }
];

const quickLinks = [
  { title: 'Order Status', description: 'Check your order progress' },
  { title: 'Payment Issues', description: 'Resolve payment problems' },
  { title: 'VPN Not Working', description: 'Fix connection issues' },
  { title: 'Refund Request', description: 'Request a refund' },
  { title: 'Account Recovery', description: 'Recover your account' },
  { title: 'Billing Questions', description: 'Billing and payment help' }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-primary-dark text-white">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <HelpCircle className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 text-neon-cyan mx-auto mb-4 sm:mb-6" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold mb-4 sm:mb-6 px-4">
              Help <span className="text-neon-cyan">Center</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Find answers to your questions and get the support you need
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative px-4">
              <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-primary-secondary border border-primary-secondary rounded-xl text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-orbitron font-bold mb-3 sm:mb-4">
              Popular <span className="text-neon-cyan">Topics</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300">Quick access to commonly needed help</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-secondary/30 rounded-xl p-4 sm:p-6 border border-primary-secondary hover:border-neon-cyan/50 transition-colors cursor-pointer group"
              >
                <h3 className="text-lg font-semibold mb-2 group-hover:text-neon-cyan transition-colors">
                  {link.title}
                </h3>
                <p className="text-gray-300 text-sm">{link.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-primary-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-orbitron font-bold mb-4">
              Browse by <span className="text-neon-cyan">Category</span>
            </h2>
            <p className="text-xl text-gray-300">Explore our comprehensive help documentation</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {helpCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-dark/50 rounded-xl p-8 border border-primary-secondary hover:border-neon-cyan/50 transition-colors"
              >
                <div className="flex items-center mb-6">
                  <category.icon className="h-8 w-8 text-neon-cyan mr-4" />
                  <div>
                    <h3 className="text-xl font-orbitron font-bold">{category.title}</h3>
                    <p className="text-gray-300 text-sm">{category.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex} className="flex items-center text-gray-300 hover:text-neon-cyan transition-colors cursor-pointer">
                      <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full mr-3"></div>
                      {article}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-orbitron font-bold mb-4">
              Contact <span className="text-neon-cyan">Support</span>
            </h2>
            <p className="text-xl text-gray-300">Can't find what you're looking for? We're here to help!</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-secondary/20 rounded-xl p-8 border border-primary-secondary text-center hover:border-neon-cyan/50 transition-colors"
              >
                <method.icon className={`h-12 w-12 ${method.color} mx-auto mb-4`} />
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-gray-300 mb-4">{method.description}</p>
                <div className="text-sm text-gray-400 mb-6">{method.availability}</div>
                <button className="bg-neon-cyan text-primary-dark px-6 py-3 rounded-lg font-semibold hover:bg-neon-cyan/90 transition-colors">
                  {method.action}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Self-Service Tools */}
      <section className="py-16 bg-primary-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-orbitron font-bold mb-8 text-center">
              Self-Service <span className="text-neon-cyan">Tools</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-primary-dark/50 rounded-xl p-6 border border-primary-secondary">
                <h3 className="text-xl font-semibold mb-4 text-neon-cyan">Account Dashboard</h3>
                <p className="text-gray-300 mb-4">
                  Access your account dashboard to view orders, update information, and manage your VPN accounts.
                </p>
                <button className="text-neon-cyan hover:text-white transition-colors">
                  Go to Dashboard →
                </button>
              </div>
              <div className="bg-primary-dark/50 rounded-xl p-6 border border-primary-secondary">
                <h3 className="text-xl font-semibold mb-4 text-neon-cyan">Order Tracking</h3>
                <p className="text-gray-300 mb-4">
                  Track your order status and get real-time updates on your VPN account delivery.
                </p>
                <button className="text-neon-cyan hover:text-white transition-colors">
                  Track Order →
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-gradient-to-br from-primary-secondary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-orbitron font-bold mb-8">
              Emergency <span className="text-neon-cyan">Support</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              For urgent issues that require immediate attention
            </p>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 inline-block">
              <p className="text-red-400 font-semibold mb-2">24/7 Emergency Hotline</p>
              <p className="text-white text-xl font-bold">+95 9 999 888 777</p>
              <p className="text-gray-300 text-sm mt-2">For critical account or payment issues only</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}