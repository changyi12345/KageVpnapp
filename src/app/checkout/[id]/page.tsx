'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check, CreditCard, Phone, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

const products = {
  '1': { name: 'ExpressVPN', duration: '1 Month', price: '15,000' },
  '2': { name: 'ExpressVPN', duration: '6 Months', price: '75,000' },
  '3': { name: 'ExpressVPN', duration: '12 Months', price: '120,000' },
  '4': { name: 'NordVPN', duration: '1 Month', price: '12,000' },
  '5': { name: 'NordVPN', duration: '6 Months', price: '45,000' },
  '6': { name: 'NordVPN', duration: '12 Months', price: '80,000' },
  '7': { name: 'Surfshark', duration: '1 Month', price: '10,000' },
  '8': { name: 'Surfshark', duration: '6 Months', price: '35,000' },
  '9': { name: 'Surfshark', duration: '12 Months', price: '60,000' },
};

export default function CheckoutPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = products[productId as keyof typeof products];
  const { isAuthenticated, loading, user } = useAuth();
  const { error, success, toasts, removeToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bank: '',
  });

  // Fetch payment methods from database
  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      error('Sign in required', 'Please log in to continue');
      setTimeout(() => {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }, 2000);
    }
  }, [isAuthenticated, loading, error]);

  const fetchPaymentMethods = async () => {
    try {
      setLoadingMethods(true);
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        const activeMethods = data.settings?.paymentMethods?.filter((method: any) => method.isActive) || [];
        setPaymentMethods(activeMethods);
      } else {
        // Fallback to hardcoded methods if API fails
        setPaymentMethods([
          { 
            id: 'kpay', 
            name: 'KBZPay',
            number: '09123456789',
            accountName: 'Kage VPN Store',
            phoneNumber: '09123456789'
          },
          { 
            id: 'wavepay', 
            name: 'WavePay',
            number: '09987654321',
            accountName: 'Kage VPN Store',
            phoneNumber: '09987654321'
          },
          { 
            id: 'ayapay', 
            name: 'AYA Pay',
            number: '09456789123',
            accountName: 'Kage VPN Store',
            phoneNumber: '09456789123'
          },
          { 
            id: 'cbpay', 
            name: 'CB Pay',
            number: '09789123456',
            accountName: 'Kage VPN Store',
            phoneNumber: '09789123456'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Fallback to hardcoded methods
      setPaymentMethods([
        { 
          id: 'kpay', 
          name: 'KBZPay',
          number: '09123456789',
          accountName: 'Kage VPN Store',
          phoneNumber: '09123456789'
        },
        { 
          id: 'wavepay', 
          name: 'WavePay',
          number: '09987654321',
          accountName: 'Kage VPN Store',
          phoneNumber: '09987654321'
        },
        { 
          id: 'ayapay', 
          name: 'AYA Pay',
          number: '09456789123',
          accountName: 'Kage VPN Store',
          phoneNumber: '09456789123'
        },
        { 
          id: 'cbpay', 
          name: 'CB Pay',
          number: '09789123456',
          accountName: 'Kage VPN Store',
          phoneNumber: '09789123456'
        }
      ]);
    } finally {
      setLoadingMethods(false);
    }
  };

  // Update form data when user info is available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
      }));
    }
  }, [user]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render checkout if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 mb-4">Please sign in</p>
          <p className="text-sm text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.bank) {
      error('Missing information', 'Name, email, phone and payment method are required');
      return;
    }

    try {
      // Create order with customer and payment information
      const orderData = {
        userId: user?._id || 'guest',
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        paymentMethod: formData.bank,
        items: [{
          id: productId,
          name: product.name,
          price: parseInt(product.price.replace(',', '')),
          duration: product.duration,
          quantity: 1
        }],
        total: parseInt(product.price.replace(',', '')),
        status: 'pending_payment'
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('user-token') || ''}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        // Store order ID and redirect to payment page
        const orderId = result.orderId;
        success('Order placed successfully', 'Redirecting to payment page...');
        setTimeout(() => {
          window.location.href = `/payment/${orderId}`;
        }, 1500);
      } else {
        error('Order submission failed', result.error || 'Please try again');
        error('Network error', 'Please check your internet and try again');
      }
    } catch (err) {
      const orderError = err as Error;
      console.error('Order creation error:', orderError);
      error('Choose a payment method', 'Please select a payment method');
    }
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        error('Missing information', 'Name, email and phone are required');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.bank) {
        error('Payment Information', 'Choose payment method');
        return;
      }
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-primary-dark text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products" className="text-neon-cyan hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/products"
            className="flex items-center text-gray-300 hover:text-neon-cyan transition-colors"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Back to Products
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                    step <= currentStep
                      ? 'bg-neon-cyan text-primary-dark'
                      : 'bg-primary-secondary text-gray-400'
                  }`}
                >
                  {step < currentStep ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${
                      step < currentStep ? 'bg-neon-cyan' : 'bg-primary-secondary'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-300">
                Step {currentStep} of 3: {
                  currentStep === 1 ? 'Fill Information' :
                  currentStep === 2 ? 'Payment Information' :
                  'Confirm Order'
                }
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-primary-secondary rounded-xl p-4 sm:p-6 border border-gray-700 lg:sticky lg:top-24">
              <h3 className="text-lg sm:text-xl font-orbitron font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm sm:text-base">Product:</span>
                  <span className="font-semibold text-sm sm:text-base">{product.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm sm:text-base">Duration:</span>
                  <span className="font-semibold text-sm sm:text-base">{product.duration}</span>
                </div>
                <div className="border-t border-gray-600 pt-3 sm:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-semibold">Total:</span>
                    <span className="text-xl sm:text-2xl font-bold text-neon-cyan">{product.price} Ks</span>
                  </div>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-primary-dark rounded-lg border border-gray-600">
                <h4 className="font-semibold mb-2 text-neon-cyan text-sm sm:text-base">Payment Instructions:</h4>
                <ol className="text-xs sm:text-sm text-gray-300 space-y-1">
                  <li>1. Choose your payment method</li>
                  <li>2. Transfer the exact amount</li>
                  <li>3. Submit your order</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-primary-secondary rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-700">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-orbitron font-bold mb-4 sm:mb-6">Personal Information</h2>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <User className="inline h-4 w-4 mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-primary-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-colors text-sm sm:text-base"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Mail className="inline h-4 w-4 mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-primary-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-colors text-sm sm:text-base"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <Phone className="inline h-4 w-4 mr-2" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-primary-dark border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-colors text-sm sm:text-base"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-orbitron font-bold mb-4 sm:mb-6">Payment Information</h2>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <CreditCard className="inline h-4 w-4 mr-2" />
                          Select Payment Method
                        </label>
                        <select
                          name="bank"
                          value={formData.bank}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-primary-dark border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors text-sm sm:text-base"
                        >
                          <option value="" className="bg-primary-dark text-white">Choose payment method</option>
                          {loadingMethods ? (
                            <option value="" className="bg-primary-dark text-white">Loading...</option>
                          ) : (
                            paymentMethods.map((method) => (
                              <option key={method.id} value={method.name} className="bg-primary-dark text-white">
                                {method.name}
                              </option>
                            ))
                          )}
                        </select>
                      </div>

                      {/* Payment Method Details */}
                      {formData.bank && (
                        <div className="bg-primary-dark rounded-lg p-3 sm:p-4 border border-gray-600">
                          <h3 className="text-base sm:text-lg font-semibold mb-3 text-neon-cyan">Payment Details</h3>
                          {(() => {
                            const selectedMethod = paymentMethods.find(method => method.name === formData.bank);
                            if (selectedMethod) {
                              return (
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-gray-400 text-sm sm:text-base">Account Name: </span>
                                    <span className="font-semibold text-white text-sm sm:text-base">{selectedMethod.accountName}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 text-sm sm:text-base">Account Number: </span>
                                    <span className="font-semibold text-white text-sm sm:text-base">{selectedMethod.number}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-400 text-sm sm:text-base">Phone Number: </span>
                                    <span className="font-semibold text-white text-sm sm:text-base">{selectedMethod.phoneNumber}</span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-yellow-300 mt-3">
                                    Please transfer the exact amount to the above account. After payment, proceed to submit your order.
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          })()} 
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-orbitron font-bold mb-4 sm:mb-6">Confirm Your Order</h2>
                    
                    <div className="space-y-4 bg-primary-dark rounded-lg p-4 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-gray-400 text-xs sm:text-sm">Name</p>
                          <p className="font-semibold text-sm sm:text-base">{formData.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs sm:text-sm">Email</p>
                          <p className="font-semibold text-sm sm:text-base">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs sm:text-sm">Phone</p>
                          <p className="font-semibold text-sm sm:text-base">{formData.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs sm:text-sm">Payment Method</p>
                          <p className="font-semibold text-sm sm:text-base">{formData.bank}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                      <p className="text-yellow-300 text-xs sm:text-sm">
                        <strong>Important:</strong> Please ensure all information is correct. 
                        Your VPN key will be sent to the provided email address after payment verification.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6 sm:mt-8">
                  {currentStep > 1 && (
                    <motion.button
                      type="button"
                      onClick={prevStep}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors text-sm sm:text-base"
                    >
                      Previous
                    </motion.button>
                  )}
                  
                  <div className="ml-auto">
                    {currentStep < 3 ? (
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300 text-sm sm:text-base"
                      >
                        Next Step
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300 text-sm sm:text-base"
                      >
                        Submit Order
                      </motion.button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-primary-secondary rounded-xl p-6 sm:p-8 max-w-md w-full border border-neon-cyan"
          >
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neon-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-6 w-6 sm:h-8 sm:w-8 text-primary-dark" />
              </div>
              <h3 className="text-xl sm:text-2xl font-orbitron font-bold mb-4">Order Submitted!</h3>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Your order has been received. We'll verify your payment and send the VPN key to your email within 24 hours.
              </p>
              <Link
                href="/orders"
                className="inline-block w-full bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold py-2 sm:py-3 rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300 text-sm sm:text-base"
              >
                View Orders
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}