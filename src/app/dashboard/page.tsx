'use client';

import { motion } from 'framer-motion';
import { User, ShoppingBag, Key, Settings, LogOut, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatOrderId } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function UserDashboard() {
  const { user, logout, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent('/dashboard'));
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      fetchUserOrders();
    }
  }, [authLoading, isAuthenticated, user]);

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/profile/orders', {
        headers: {
          'user-id': user?._id || ''
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-gray-300 mb-4">Please sign in</p>
          <p className="text-sm text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-orbitron font-bold mb-2 px-2">
            Welcome back, <span className="text-neon-cyan">{user.name}</span>
          </h1>
          <p className="text-gray-300 px-2 text-sm sm:text-base">Manage your VPN accounts and orders</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-primary-secondary/50 rounded-xl p-4 sm:p-6 border border-gray-700">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-colors ${
                    activeTab === 'orders' 
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  My Orders
                </button>
                
                <button
                  onClick={() => setActiveTab('vpn-keys')}
                  className={`w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-colors ${
                    activeTab === 'vpn-keys' 
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Key className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  VPN Keys
                </button>
                
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-colors ${
                    activeTab === 'profile' 
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  Profile
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg transition-colors ${
                    activeTab === 'settings' 
                      ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  Settings
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-primary-secondary/50 rounded-xl p-6 border border-gray-700">
              
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-orbitron font-bold mb-6">My Orders</h2>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan mx-auto"></div>
                      <p className="text-gray-300 mt-2">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-300">You don’t have any orders yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order._id} className="bg-primary-dark/50 rounded-lg p-4 border border-gray-600">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                              <p className="text-sm text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-neon-cyan">{order.total} Ks</p>
                              <span className={`px-2 py-1 rounded text-xs ${
                                order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                order.status === 'payment_verified' ? 'bg-blue-500/20 text-blue-400' :
                                order.status === 'payment_submitted' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          
                          {order.vpnCredentials && (
                            <div className="mt-4 p-3 bg-gray-800 rounded border">
                              <p className="text-sm text-gray-400 mb-2">VPN Credentials:</p>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-gray-400">Username:</span>
                                  <span className="ml-2 font-mono text-neon-cyan">{order.vpnCredentials.username}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Password:</span>
                                  <span className="ml-2 font-mono text-neon-cyan">{order.vpnCredentials.password}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-orbitron font-bold mb-6">Profile Information</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                        <input
                          type="text"
                          value={user.name}
                          disabled
                          className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white opacity-75"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                          type="email"
                          value={user.email}
                          disabled
                          className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white opacity-75"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-primary-dark/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Complete Your Profile</h3>
                          <p className="text-gray-400 text-sm">Add more details to your profile for better experience</p>
                        </div>
                        <button
                          onClick={() => router.push('/profile')}
                          className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vpn-keys' && (
                <div>
                  <h2 className="text-2xl font-orbitron font-bold mb-6">VPN Keys</h2>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan mx-auto"></div>
                      <p className="text-gray-300 mt-2">Loading VPN keys...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.filter((order: any) => order.vpnCredentials).length === 0 ? (
                        <div className="text-center py-8">
                          <Key className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                          <p className="text-gray-300">You don’t have any orders yet</p>
                          <p className="text-gray-300">You don’t have any VPN keys yet</p>
                          <p className="text-gray-400 text-sm mt-2">You’ll receive keys when an order completes</p>
                        </div>
                      ) : (
                        orders
                          .filter((order: any) => order.vpnCredentials)
                          .map((order: any) => (
                            <div key={order._id} className="bg-primary-dark/50 rounded-lg p-6 border border-gray-600">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="text-lg font-semibold text-white">VPN Account</h3>
                                  <p className="text-sm text-gray-400">Order #{formatOrderId(order._id)}</p>
                                </div>
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                                  Active
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-800 rounded-lg border">
                                  <label className="block text-sm text-gray-400 mb-2">Username</label>
                                  <div className="flex items-center justify-between">
                                    <span className="font-mono text-neon-cyan">{order.vpnCredentials.username}</span>
                                    <button
                                      onClick={() => navigator.clipboard.writeText(order.vpnCredentials.username)}
                                      className="text-gray-400 hover:text-neon-cyan transition-colors"
                                    >
                                      Copy
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="p-4 bg-gray-800 rounded-lg border">
                                  <label className="block text-sm text-gray-400 mb-2">Password</label>
                                  <div className="flex items-center justify-between">
                                    <span className="font-mono text-neon-cyan">••••••••</span>
                                    <button
                                      onClick={() => navigator.clipboard.writeText(order.vpnCredentials.password)}
                                      className="text-gray-400 hover:text-neon-cyan transition-colors"
                                    >
                                      Copy
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              {order.vpnCredentials.serverInfo && (
                                <div className="mt-4 p-4 bg-gray-800 rounded-lg border">
                                  <label className="block text-sm text-gray-400 mb-2">Server Information</label>
                                  <div className="text-sm text-gray-300">
                                    <p>Server: {order.vpnCredentials.serverInfo.server}</p>
                                    <p>Location: {order.vpnCredentials.serverInfo.location}</p>
                                    <p>Protocol: {order.vpnCredentials.serverInfo.protocol}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-orbitron font-bold mb-6">Settings</h2>
                  <div className="space-y-6">
                    
                    <div className="bg-primary-dark/50 rounded-lg p-6 border border-gray-600">
                      <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
                      <div className="space-y-4">
                        <button
                          onClick={() => router.push('/profile')}
                          className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Edit Profile</p>
                              <p className="text-gray-400 text-sm">Update your personal information</p>
                            </div>
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        </button>
                        
                        <button 
                          onClick={() => router.push('/profile')}
                          className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white">Change Password</p>
                              <p className="text-gray-400 text-sm">Update your account password</p>
                            </div>
                            <Shield className="h-5 w-5 text-gray-400" />
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="bg-primary-dark/50 rounded-lg p-6 border border-gray-600">
                      <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white">Email Notifications</p>
                            <p className="text-gray-400 text-sm">Receive updates about your orders</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-cyan/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}