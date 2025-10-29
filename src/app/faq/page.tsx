'use client';

import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, ChevronUp, Search, Shield, CreditCard, Clock, Users, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';

const faqCategories = [
  {
    icon: Shield,
    title: 'VPN Services',
    color: 'text-blue-400'
  },
  {
    icon: CreditCard,
    title: 'Payments',
    color: 'text-green-400'
  },
  {
    icon: Clock,
    title: 'Delivery',
    color: 'text-orange-400'
  },
  {
    icon: Users,
    title: 'Account',
    color: 'text-purple-400'
  }
];

const faqs = [
  {
    category: 'VPN Services',
    question: 'What VPN providers do you offer?',
    answer: 'We offer premium accounts from top VPN providers including ExpressVPN, NordVPN, and Surfshark. All accounts are genuine and sourced directly from authorized providers.'
  },
  {
    category: 'VPN Services',
    question: 'Are the VPN accounts genuine?',
    answer: 'Yes, all our VPN accounts are 100% genuine and sourced from official providers. We guarantee the authenticity and functionality of every account we sell.'
  },
  {
    category: 'VPN Services',
    question: 'Can I use the VPN on multiple devices?',
    answer: 'Yes, most VPN accounts support multiple simultaneous connections. ExpressVPN allows 5 devices, NordVPN allows 6 devices, and Surfshark offers unlimited devices.'
  },
  {
    category: 'VPN Services',
    question: 'What if my VPN account stops working?',
    answer: 'If your VPN account stops working within the subscription period, contact our support team immediately. We provide free replacement or full refund for non-functional accounts.'
  },
  {
    category: 'Payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept various mobile payment methods including KBZPay, WavePay, AYA Pay, CB Pay, and bank transfers. All payments are processed securely through encrypted channels. Available payment methods may vary and are managed by our administrators.'
  },
  {
    category: 'Payments',
    question: 'Is it safe to pay online?',
    answer: 'Yes, all payments are processed through secure, encrypted channels. We use industry-standard security measures and never store your payment information.'
  },
  {
    category: 'Payments',
    question: 'Can I get a receipt for my purchase?',
    answer: 'Yes, you will receive an email receipt immediately after payment confirmation. You can also download receipts from your account dashboard.'
  },
  {
    category: 'Payments',
    question: 'What happens if my payment fails?',
    answer: 'If your payment fails, you can retry the payment or contact our support team. Failed payments do not result in any charges to your account.'
  },
  {
    category: 'Delivery',
    question: 'How quickly will I receive my VPN account?',
    answer: 'Most VPN accounts are delivered within 5-30 minutes after payment verification. During peak hours, delivery may take up to 2 hours.'
  },
  {
    category: 'Delivery',
    question: 'How will I receive my VPN credentials?',
    answer: 'VPN credentials are sent to your registered email address and are also available in your account dashboard. Make sure to check your spam folder.'
  },
  {
    category: 'Delivery',
    question: 'What if I don\'t receive my account details?',
    answer: 'If you don\'t receive your account details within 2 hours, please contact our support team with your order ID. We will investigate and resolve the issue immediately.'
  },
  {
    category: 'Delivery',
    question: 'Can I change my email address after purchase?',
    answer: 'Yes, you can update your email address in your account settings. However, VPN credentials will still be sent to the email used during purchase.'
  },
  {
    category: 'Account',
    question: 'Do I need to create an account to purchase?',
    answer: 'Yes, creating an account helps us track your orders, provide better support, and send you important updates about your VPN accounts.'
  },
  {
    category: 'Account',
    question: 'How can I track my orders?',
    answer: 'You can track all your orders in your account dashboard. You will also receive email notifications about order status updates.'
  },
  {
    category: 'Account',
    question: 'Can I change my account information?',
    answer: 'Yes, you can update your account information including name, email, and phone number from your account settings page.'
  },
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page and enter your email address. You will receive a password reset link within a few minutes.'
  }
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [faqContent, setFaqContent] = useState(faqs);

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
          if (data.settings && data.settings.faqContent) {
            try {
              const dynamicFAQs = JSON.parse(data.settings.faqContent);
              if (Array.isArray(dynamicFAQs) && dynamicFAQs.length > 0) {
                setFaqContent(dynamicFAQs);
              }
            } catch (parseError) {
              console.error('Error parsing FAQ content:', parseError);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQs = faqContent.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            <MessageSquare className="h-16 w-16 text-neon-cyan mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold mb-6">
              Frequently Asked <span className="text-neon-cyan">Questions</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Find quick answers to common questions about our VPN services
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-primary-secondary border border-primary-secondary rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-8 bg-primary-secondary/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              onClick={() => setSelectedCategory('All')}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                selectedCategory === 'All'
                  ? 'bg-neon-cyan text-primary-dark'
                  : 'bg-primary-secondary text-white hover:bg-primary-secondary/80'
              }`}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              All Questions
            </motion.button>
            {faqCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: (index + 1) * 0.1 }}
                  onClick={() => setSelectedCategory(category.title)}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedCategory === category.title
                      ? 'bg-neon-cyan text-primary-dark'
                      : 'bg-primary-secondary text-white hover:bg-primary-secondary/80'
                  }`}
                >
                  <IconComponent className={`h-5 w-5 mr-2 ${category.color}`} />
                  {category.title}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-primary-secondary rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-primary-secondary/80 transition-colors"
                >
                  <div>
                    <span className="text-sm text-neon-cyan font-semibold">{faq.category}</span>
                    <h3 className="text-lg font-semibold text-white mt-1">{faq.question}</h3>
                  </div>
                  {openItems.includes(index) ? (
                    <ChevronUp className="h-5 w-5 text-neon-cyan" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-neon-cyan" />
                  )}
                </button>
                {openItems.includes(index) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <HelpCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No FAQs Found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary-secondary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-orbitron font-bold mb-4">
              Still Have <span className="text-neon-cyan">Questions?</span>
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-neon-cyan text-primary-dark font-semibold rounded-xl hover:bg-neon-cyan/90 transition-colors"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Contact Support
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}