'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Settings, Shield, CreditCard, Edit3, Save, X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

interface Profile {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  firstName: string;
  lastName: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  avatar?: string;
  dateOfBirth?: string;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
    currency: string;
  };
  subscription?: {
    plan: string;
    status: 'active' | 'inactive' | 'expired';
    startDate: string;
    endDate: string;
    autoRenew: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { success, error, toasts, removeToast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    dateOfBirth: '',
    preferences: {
      newsletter: true,
      notifications: true,
      language: 'my',
      currency: 'MMK',
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    console.log('Profile page auth check:', { authLoading, isAuthenticated, user: !!user });
    if (!authLoading && !isAuthenticated) {
      console.log('Profile page - redirecting to login, not authenticated');
      router.push('/login?redirect=' + encodeURIComponent('/profile'));
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      fetchProfile();
    }
  }, [authLoading, isAuthenticated, user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/profile?userId=${user._id}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          address: data.address || {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
          },
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
          preferences: data.preferences || {
            newsletter: true,
            notifications: true,
            language: 'my',
            currency: 'MMK',
          },
        });
      } else if (response.status === 404) {
        // Profile doesn't exist, create one with default values
        console.log('Profile not found, will create new one');
        setFormData({
          firstName: user.name?.split(' ')[0] || 'Default',
          lastName: user.name?.split(' ').slice(1).join(' ') || 'User',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
          },
          dateOfBirth: '',
          preferences: {
            newsletter: true,
            notifications: true,
            language: 'my',
            currency: 'MMK',
          },
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const method = profile ? 'PUT' : 'POST';
      const response = await fetch('/api/profile', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          ...formData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditing(false);
        success('Profile updated successfully', 'Your profile information has been saved.');
      } else {
        const errorData = await response.json();
        error('Failed to update profile', errorData.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      error('Failed to update profile', 'Network error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      error('Missing information', 'All password fields are required');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('Passwords do not match', 'New password and confirm password must match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      error('Password too short', 'Password must be at least 6 characters long');
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        success('Password updated', 'Your password has been updated successfully');
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswords({
          current: false,
          new: false,
          confirm: false
        });
      } else {
        error('Password update failed', data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error changing password:', err);
      error('Password update failed', 'Network error occurred');
    } finally {
      setChangingPassword(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object || {}),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-gray-300">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-gray-300 mb-4">Please sign in</p>
          <p className="text-sm text-gray-400">Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark pt-16 sm:pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="bg-primary-secondary/50 rounded-xl p-4 sm:p-6 border border-gray-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-neon-cyan to-neon-purple rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-orbitron font-bold mb-2">
                    {profile ? `${profile.firstName || user.name.split(' ')[0]} ${profile.lastName || user.name.split(' ')[1] || ''}` : user.name}
                  </h1>
                  <p className="text-gray-300 flex items-center text-sm sm:text-base">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email}
                  </p>
                  <p className="text-xs sm:text-sm text-neon-cyan mt-1">
                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
                {editing && (
                  <button
                    onClick={() => setEditing(false)}
                    className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => editing ? handleSave() : setEditing(true)}
                  disabled={saving}
                  className="px-4 sm:px-6 py-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 text-sm sm:text-base"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : editing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-primary-secondary/50 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-orbitron font-bold mb-6 text-neon-cyan">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent disabled:opacity-50 transition-all"
                    placeholder="Enter your first name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent disabled:opacity-50 transition-all"
                    placeholder="Enter your last name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent disabled:opacity-50 transition-all"
                    placeholder="+95 9xxxxxxxxx"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent disabled:opacity-50 transition-all"
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="mt-8">
                <h3 className="text-lg font-orbitron font-semibold text-gray-200 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-neon-cyan" />
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent disabled:opacity-50 transition-all"
                      placeholder="Enter your street address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent disabled:opacity-50 transition-all"
                      placeholder="Yangon"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      State/Region
                    </label>
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent disabled:opacity-50 transition-all"
                      placeholder="Yangon Region"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.address.country}
                      onChange={(e) => handleInputChange('address.country', e.target.value)}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent disabled:opacity-50 transition-all"
                      placeholder="Myanmar"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      ZIP/Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.address.zipCode}
                      onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                      disabled={!editing}
                      className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent disabled:opacity-50 transition-all"
                      placeholder="11181"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            
            {/* Preferences */}
            <div className="bg-primary-secondary/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-orbitron font-bold mb-4 text-neon-cyan flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-primary-dark/50 rounded-lg">
                  <span className="text-gray-300">Newsletter Subscription</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferences.newsletter}
                      onChange={(e) => handleInputChange('preferences.newsletter', e.target.checked)}
                      disabled={!editing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-cyan/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-primary-dark/50 rounded-lg">
                  <span className="text-gray-300">Push Notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferences.notifications}
                      onChange={(e) => handleInputChange('preferences.notifications', e.target.checked)}
                      disabled={!editing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-cyan/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-cyan"></div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={formData.preferences.language}
                    onChange={(e) => handleInputChange('preferences.language', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent disabled:opacity-50 transition-all"
                  >
                    <option value="my" className="bg-primary-dark text-white">Myanmar (MM)</option>
                    <option value="en" className="bg-primary-dark text-white">English</option>
                    <option value="zh" className="bg-primary-dark text-white">Chinese (中文)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.preferences.currency}
                    onChange={(e) => handleInputChange('preferences.currency', e.target.value)}
                    disabled={!editing}
                    className="w-full px-4 py-3 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent disabled:opacity-50 transition-all"
                  >
                    <option value="MMK" className="bg-primary-dark text-white">Myanmar Kyat (MMK)</option>
                    <option value="USD" className="bg-primary-dark text-white">US Dollar (USD)</option>
                    <option value="EUR" className="bg-primary-dark text-white">Euro (EUR)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-primary-secondary/50 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-orbitron font-bold mb-4 text-neon-cyan flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Account Security
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-primary-dark/50 rounded-lg">
                  <div>
                    <span className="text-gray-300 text-sm">Account Status</span>
                    <p className="text-xs text-gray-400">Your account is secure</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                    Active
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-primary-dark/50 rounded-lg">
                  <div>
                    <span className="text-gray-300 text-sm">Two-Factor Auth</span>
                    <p className="text-xs text-gray-400">Add extra security</p>
                  </div>
                  <button className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan rounded-full text-xs hover:bg-neon-cyan/30 transition-colors">
                    Enable
                  </button>
                </div>
                
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Subscription Info */}
            {profile?.subscription && (
              <div className="bg-primary-secondary/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-lg font-orbitron font-bold mb-4 text-neon-cyan flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Subscription
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-primary-dark/50 rounded-lg">
                    <span className="text-gray-300 text-sm">Plan</span>
                    <span className="text-white font-medium capitalize">{profile.subscription.plan}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-primary-dark/50 rounded-lg">
                    <span className="text-gray-300 text-sm">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profile.subscription.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {profile.subscription.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-primary-dark/50 rounded-lg">
                    <span className="text-gray-300 text-sm">Auto Renew</span>
                    <span className="text-white text-sm">
                      {profile.subscription.autoRenew ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-primary-secondary rounded-xl p-6 w-full max-w-md border border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-orbitron font-bold text-neon-cyan">Change Password</h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neon-cyan transition-colors"
                  >
                    {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neon-cyan transition-colors"
                  >
                    {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 pr-12 bg-primary-dark border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-neon-cyan transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="text-xs text-gray-400 bg-primary-dark/50 p-3 rounded-lg">
                <p className="mb-1">Password requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 6 characters long</li>
                  <li>Must be different from current password</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                disabled={changingPassword}
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {changingPassword ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Changing...
                  </div>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}