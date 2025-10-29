'use client';

import { motion } from 'framer-motion';
import { Copy, Eye, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { formatOrderId } from '@/lib/utils';

const statusConfig = {
  pending_payment: {
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/20',
    icon: Clock,
    label: 'Pending Payment',
  },
  payment_submitted: {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20',
    icon: Clock,
    label: 'Payment Submitted',
  },
  verified: {
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20',
    icon: CheckCircle,
    label: 'Verified',
  },
  completed: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
    icon: CheckCircle,
    label: 'Completed',
  },
  cancelled: {
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20',
    icon: XCircle,
    label: 'Cancelled',
  },
};

export default function OrdersPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent('/orders'));
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      console.log('User authenticated, fetching orders...', user);
      fetchOrders();
    } else {
      console.log('Auth state:', { authLoading, isAuthenticated, user: !!user });
    }
  }, [authLoading, isAuthenticated, user]);

  // Separate useEffect for auto-refresh to avoid dependency issues
  useEffect(() => {
    if (!authLoading && isAuthenticated && user && orders.length > 0) {
      const interval = setInterval(() => {
        const hasIncompleteOrders = orders.some(order => 
          (order.status === 'verified' || order.status === 'completed') && !order.vpnCredentials
        );
        
        if (hasIncompleteOrders) {
          fetchOrders(true); // Use refresh mode
        }
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [orders, authLoading, isAuthenticated, user]);

  const fetchOrders = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('Fetching orders for user:', user?._id);
      console.log('User object:', user);
      
      if (!user?._id) {
        console.error('No user ID available');
        setError('Please sign in');
        return;
      }
      
      // Get the JWT token from localStorage
      const token = localStorage.getItem('user-token');
      
      if (!token) {
        console.error('No authentication token found');
        setError('Please sign in');
        return;
      }
      
      const response = await fetch('/api/profile/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch orders');
      }

      const data = await response.json();
      console.log('Orders data:', data);
      setOrders(data.orders || []);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Fetch orders error:', err);
      setError('Orders များ ရယူ၍မရပါ');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  const copyToClipboard = (text: string, orderId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(orderId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-xl">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-primary-dark text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300 mb-4">Please sign in</p>
          <p className="text-sm text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-xl">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-orbitron font-bold mb-4">Error</h3>
          <p className="text-gray-300 mb-8">{error}</p>
          <button
            onClick={() => fetchOrders()}
            className="bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold px-8 py-3 rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-dark text-white">
      {/* Header */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-orbitron font-bold mb-4 px-4">
              Your <span className="text-neon-cyan">Orders</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6 px-4">
              Track your VPN purchases and get your keys
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                fetchOrders(true);
              }}
              disabled={refreshing}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Orders'}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {orders.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-4xl sm:text-6xl mb-4">📦</div>
              <h3 className="text-xl sm:text-2xl font-orbitron font-bold mb-4">No Orders Yet</h3>
              <p className="text-gray-300 mb-6 sm:mb-8 px-4">You haven't made any purchases yet.</p>
              <Link
                href="/products"
                className="inline-block bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
              >
                Shop VPN Plans
              </Link>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {orders.map((order, index) => {
                const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending_payment;
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-primary-secondary rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                      {/* Order Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg sm:text-xl font-orbitron font-bold mb-1">
                              {order.items?.[0]?.name || 'VPN Order'} - {order.items?.[0]?.duration || 'N/A'}
                            </h3>
                            <p className="text-gray-400 text-xs sm:text-sm">Order ID: {formatOrderId(order._id)}</p>
                            <p className="text-gray-400 text-xs sm:text-sm">Date: {new Date(order.orderDate || order.createdAt).toLocaleDateString()}</p>
                            <p className="text-gray-400 text-xs sm:text-sm">Items: {order.items?.length || 0}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-neon-cyan">{order.total?.toLocaleString() || '0'} Ks</p>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-center lg:justify-start">
                        <div className={`flex items-center px-4 py-2 rounded-full ${status.bgColor} ${status.borderColor} border`}>
                          <StatusIcon className={`h-5 w-5 mr-2 ${status.color}`} />
                          <span className={`font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>

                      {/* VPN Key */}
                      <div className="flex items-center justify-center lg:justify-end">
                        {order.vpnCredentials ? (
                          <div className="w-full lg:w-auto">
                            <div className="bg-primary-dark rounded-lg p-4 border border-gray-600">
                              <p className="text-sm text-gray-400 mb-2">VPN Credentials:</p>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400 w-16">Username:</span>
                                  <code className="text-neon-cyan font-mono text-sm bg-gray-800 px-2 py-1 rounded flex-1">
                                    {order.vpnCredentials.username}
                                  </code>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => copyToClipboard(order.vpnCredentials.username, order._id + '-user')}
                                    className="p-1 bg-neon-cyan text-primary-dark rounded hover:bg-neon-blue transition-colors"
                                    title="Copy username"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </motion.button>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400 w-16">Password:</span>
                                  <code className="text-neon-cyan font-mono text-sm bg-gray-800 px-2 py-1 rounded flex-1">
                                    {order.vpnCredentials.password}
                                  </code>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => copyToClipboard(order.vpnCredentials.password, order._id + '-pass')}
                                    className="p-1 bg-neon-cyan text-primary-dark rounded hover:bg-neon-blue transition-colors"
                                    title="Copy password"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </motion.button>
                                </div>
                                {order.vpnCredentials.serverInfo && (
                                  <div className="mt-2">
                                    <span className="text-xs text-gray-400">Server:</span>
                                    <p className="text-sm text-white">{order.vpnCredentials.serverInfo}</p>
                                  </div>
                                )}
                                {order.vpnCredentials.expiryDate && (
                                  <div className="mt-2">
                                    <span className="text-xs text-gray-400">Expires:</span>
                                    <p className="text-sm text-white">{new Date(order.vpnCredentials.expiryDate).toLocaleDateString()}</p>
                                  </div>
                                )}
                              </div>
                              {(copiedKey === order._id + '-user' || copiedKey === order._id + '-pass') && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-green-400 text-sm mt-2"
                                >
                                  ✓ Copied to clipboard!
                                </motion.p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <div className="text-gray-400 mb-2">
                              <Clock className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-sm">
                                {order.status === 'pending_payment' ? 'Complete payment first' :
                                 order.status === 'payment_submitted' ? 'Payment verification in progress' :
                                 'VPN credentials will be delivered soon'}
                              </p>
                              {(order.status === 'verified' || order.status === 'completed') && (
                                <p className="text-xs text-neon-cyan mt-2">
                                  Auto-refreshing every 30 seconds...
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile Layout Adjustments */}
                    <div className="lg:hidden mt-4 pt-4 border-t border-gray-600">
                      <div className="flex justify-between items-center">
                        <div className={`flex items-center px-3 py-1 rounded-full ${status.bgColor} ${status.borderColor} border`}>
                          <StatusIcon className={`h-4 w-4 mr-1 ${status.color}`} />
                          <span className={`text-sm font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        {(order.status === 'pending_payment' || order.status === 'payment_submitted') && (
                          <p className="text-sm text-gray-400">
                            Processing time: 1-24 hours
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-primary-secondary/50 rounded-xl p-8 border border-gray-700"
          >
            <h3 className="text-xl font-orbitron font-bold mb-4 text-center">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">⏱️</div>
                <h4 className="font-semibold mb-2">Processing Time</h4>
                <p className="text-gray-300 text-sm">
                  Orders are typically processed within 1-24 hours after payment verification.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">🔑</div>
                <h4 className="font-semibold mb-2">VPN Key Delivery</h4>
                <p className="text-gray-300 text-sm">
                  Your VPN key will be sent to your email and available in your orders page.
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">💬</div>
                <h4 className="font-semibold mb-2">Support</h4>
                <p className="text-gray-300 text-sm">
                  Contact us on Telegram @kagevpn for any issues or questions.
                </p>
              </div>
            </div>
            <div className="text-center mt-6">
              <Link
                href="/contact"
                className="inline-block bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
              >
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}