'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import { LoadingButton } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const { toasts, removeToast, success, error } = useToast();
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/';
      
      // If user is admin, redirect to admin panel
      if (user?.role === 'admin') {
        router.replace('/admin');
      } else {
        router.replace(redirectTo);
      }
    }
  }, [isAuthenticated, loading, user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login page - successful response:', data);
        success('Login successful', `Welcome back ${data.user.name}!`);
        
        // Store user data in localStorage (in production, use proper session management)
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Login page - stored user in localStorage:', data.user);
        
        // Store auth token in localStorage for user API calls
        if (data.token) {
          localStorage.setItem('user-token', data.token);
          console.log('Login page - stored token in localStorage');
        }
        
        // Dispatch storage event to trigger AuthContext update immediately
        window.dispatchEvent(new Event('storage'));
        console.log('Login page - dispatched storage event');
        
        // Get redirect URL from query params or default
        const redirectTo = searchParams.get('redirect') || '/profile';
        console.log('Login page - redirecting to:', redirectTo);
        
        // Redirect based on user role
        setTimeout(() => {
          if (data.user.role === 'admin') {
            console.log('Login page - redirecting admin to /admin');
            router.push('/admin');
          } else {
            // Redirect regular users to home page instead of profile
            console.log('Login page - redirecting user to home');
            router.push('/');
          }
        }, 1500);
      } else {
        console.log('Login page - failed response:', data);
        error('Login failed', data.error);
      }
    } catch (err) {
      error('Login failed', 'A network error occurred');
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

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if user is already authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-gray-400 text-sm sm:text-base">
            Or{' '}
            <Link
              href="/register"
              className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
            >
              create a new account
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
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-3 border border-primary-secondary rounded-lg bg-primary-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent transition-colors text-sm sm:text-base"
                  placeholder="Enter your password"
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
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-neon-cyan focus:ring-neon-cyan border-primary-secondary rounded bg-primary-dark"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="text-neon-cyan hover:text-neon-cyan/80 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <LoadingButton
              type="submit"
              isLoading={isLoading}
              className="group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-primary-dark bg-neon-cyan hover:bg-neon-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan transition-colors"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </span>
              Sign in
            </LoadingButton>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="text-neon-cyan hover:text-neon-cyan/80 transition-colors font-medium"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
      
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>}>
      <LoginForm />
    </Suspense>
  );
}