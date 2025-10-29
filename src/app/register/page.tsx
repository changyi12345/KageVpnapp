'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { LoadingButton } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const { toasts, removeToast, success, error } = useToast();
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        error('Passwords do not match', 'Passwords must be the same');
        return;
      }

      if (!formData.agreeToTerms) {
        error('Terms required', 'Please accept the terms and conditions');
        return;
      }

      if (formData.password.length < 6) {
        error('Password too short', 'Password must be at least 6 characters');
        return;
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        success('Registration successful', 'Welcome to Kage VPN!');
        success('Login successful', `Welcome ${formData.name}!`);
        
        // Automatically log in the user after successful registration
        const loginResult = await login(formData.email, formData.password);
        
        if (loginResult.success) {
          success('Login successful', `Welcome ${formData.name}!`);
          
          // Redirect to home page instead of profile
          setTimeout(() => {
            router.push('/');
          }, 1500);
        } else {
          // If auto-login fails, redirect to login page
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } else {
        error('Registration failed', data.error);
      }
    } catch (err) {
      error('Registration failed', 'A network error occurred');
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
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-6 sm:space-y-8"
      >
        <div className="text-center">
          <Link href="/" className="text-2xl sm:text-3xl font-orbitron font-bold text-neon-cyan">
            Kage VPN
          </Link>
          <h2 className="mt-4 sm:mt-6 text-xl sm:text-2xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            Or{' '}
            <Link
              href="/login"
              className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 sm:mt-8 space-y-4 sm:space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 border border-primary-secondary rounded-lg bg-primary-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-colors text-sm sm:text-base"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 border border-primary-secondary rounded-lg bg-primary-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-colors text-sm sm:text-base"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-3 border border-primary-secondary rounded-lg bg-primary-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-colors text-sm sm:text-base"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="block w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-3 border border-primary-secondary rounded-lg bg-primary-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-colors text-sm sm:text-base"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start sm:items-center">
            <input
              id="agreeToTerms"
              name="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-primary-secondary rounded bg-primary-dark mt-0.5 sm:mt-0 flex-shrink-0"
            />
            <label htmlFor="agreeToTerms" className="ml-2 block text-xs sm:text-sm text-gray-300">
              I agree to the{' '}
              <Link href="/terms" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <LoadingButton
              type="submit"
              loading={isLoading}
              className="group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-primary-dark bg-neon-cyan hover:bg-neon-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              Create account
            </LoadingButton>
          </div>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-neon-cyan hover:text-neon-cyan/80 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
      
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}