'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { LoadingButton } from '@/components/ui/LoadingSpinner';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const { toasts, removeToast, success, error } = useToast();
  const { adminUser, isAdmin, loading: authLoading, adminLogin } = useAdminAuth();
  const router = useRouter();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (!authLoading && adminUser && isAdmin) {
      router.push('/admin');
    }
  }, [adminUser, isAdmin, router, authLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      const result = await adminLogin(formData.email, formData.password);

      if (result.success) {
        success('Admin Login အောင်မြင်ပါတယ်', `ကြိုဆိုပါတယ်!`);
        
        // Small delay to ensure state is updated, then redirect
        setTimeout(() => {
          router.push('/admin');
        }, 100);
      } else {
        error('Admin Login မအောင်မြင်ပါ', result.error || 'Unknown error');
      }
    } catch (err) {
      error('Admin Login မအောင်မြင်ပါ', 'Network error ဖြစ်နေပါတယ်');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="admin-login-page">
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-6 sm:space-y-8"
      >
        <div className="text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <Shield className="h-10 w-10 sm:h-12 sm:w-12 text-neon-cyan mr-3" />
            <Link href="/" className="text-2xl sm:text-3xl font-orbitron font-bold text-neon-cyan">
              Kage VPN
            </Link>
          </div>
          <h2 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-bold text-white">
            Admin Dashboard Login
          </h2>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            Admin credentials လိုအပ်ပါတယ်
          </p>
          <div className="mt-3 sm:mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <p className="text-orange-400 text-xs sm:text-sm">
              ⚠️ Admin access only - Unauthorized access is prohibited
            </p>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
          onSubmit={handleSubmit}
          suppressHydrationWarning
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all"
                  placeholder="admin@kagevpn.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-all"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-gray-600 rounded bg-gray-800"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
            </div>
          </div>

          <div>
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-primary-dark bg-neon-cyan hover:bg-neon-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan transition-all duration-200"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Shield className="h-5 w-5 text-primary-dark group-hover:text-primary-dark" />
              </span>
              Access Admin Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </LoadingButton>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-neon-cyan transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.form>

        {/* Default Admin Credentials Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-gray-800/30 border border-gray-700 rounded-lg"
        >
          <h3 className="text-sm font-medium text-gray-300 mb-2">Default Admin Credentials:</h3>
          <div className="text-xs text-gray-400 space-y-1">
            <p>📧 Email: admin@kagevpn.com</p>
            <p>🔑 Password: admin123</p>
            <p className="text-orange-400 mt-2">⚠️ Please change default password after first login</p>
          </div>
        </motion.div>
      </motion.div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </div>
  );
}