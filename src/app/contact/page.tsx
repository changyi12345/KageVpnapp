'use client';

import { motion } from 'framer-motion';
import { Mail, MessageCircle, Phone, Send, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-primary-dark text-white">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4">
              Get in <span className="text-neon-cyan">Touch</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions? Need support? We're here to help you 24/7
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-orbitron font-bold mb-8">Contact Information</h2>
            
            <div className="space-y-6">
              {/* Telegram */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-primary-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-neon-cyan/50 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full flex items-center justify-center mr-4">
                    <MessageCircle className="h-6 w-6 text-primary-dark" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Telegram</h3>
                    <p className="text-gray-300">Fastest response time</p>
                  </div>
                </div>
                <p className="text-neon-cyan font-mono">@kagevpn</p>
                <p className="text-gray-400 text-sm mt-2">
                  Get instant support and updates on our Telegram channel
                </p>
                <motion.div
                  className="mt-4"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <a
                    href="https://t.me/kagevpn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
                  >
                    Open Telegram
                    <MessageCircle className="ml-2 h-4 w-4" />
                  </a>
                </motion.div>
              </motion.div>

              {/* Email */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-primary-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-neon-cyan/50 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-primary-dark" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Email</h3>
                    <p className="text-gray-300">For detailed inquiries</p>
                  </div>
                </div>
                <p className="text-neon-cyan font-mono">info@kagevpn.com</p>
                <p className="text-gray-400 text-sm mt-2">
                  We'll respond within 24 hours
                </p>
                <div className="mt-4">
                  <a
                    href="mailto:info@kagevpn.com"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
                  >
                    Send Email
                    <Mail className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </motion.div>

              {/* Facebook */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-primary-secondary/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-neon-cyan/50 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full flex items-center justify-center mr-4">
                    <svg className="h-6 w-6 text-primary-dark" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Facebook</h3>
                    <p className="text-gray-300">Follow for updates</p>
                  </div>
                </div>
                <p className="text-neon-cyan font-mono">Kage VPN Store</p>
                <p className="text-gray-400 text-sm mt-2">
                  Latest news and promotions
                </p>
                <div className="mt-4">
                  <a
                    href="https://facebook.com/kagevpn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
                  >
                    Visit Page
                    <svg className="ml-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-primary-secondary/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
              <h2 className="text-3xl font-orbitron font-bold mb-8">Send us a Message</h2>
              
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300 flex items-center justify-center"
                  >
                    Send Message
                    <Send className="ml-2 h-5 w-5" />
                  </motion.button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-orbitron font-bold mb-2">Message Sent!</h3>
                  <p className="text-gray-300">Thank you for contacting us. We'll get back to you soon.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <a
          href="https://t.me/kagevpn"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark p-4 rounded-full shadow-lg hover:shadow-xl hover:shadow-neon-cyan/25 transition-all duration-300 flex items-center justify-center"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </motion.div>
    </div>
  );
}