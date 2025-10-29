'use client';

import { motion } from 'framer-motion';
import { Menu, X, User, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/orders', label: 'Orders' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary-dark/90 backdrop-blur-md border-b border-primary-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-orbitron font-bold text-neon-cyan">
              Kage VPN
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-300 hover:text-neon-cyan px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="text-gray-300 hover:text-neon-cyan p-2 rounded-md transition-colors"
              >
                <User className="h-5 w-5" />
              </button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-primary-dark border border-primary-secondary rounded-lg shadow-lg py-2"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-primary-secondary">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-neon-cyan font-medium">{user?.name}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-gray-300 hover:text-neon-cyan hover:bg-primary-secondary/20 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2 text-gray-300 hover:text-neon-cyan hover:bg-primary-secondary/20 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-gray-300 hover:text-neon-cyan hover:bg-primary-secondary/20 transition-colors text-left"
                      >
                        <LogIn className="h-4 w-4 mr-2 rotate-180" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="flex items-center px-4 py-2 text-gray-300 hover:text-neon-cyan hover:bg-primary-secondary/20 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Link>
                      <Link
                        href="/register"
                        className="flex items-center px-4 py-2 text-gray-300 hover:text-neon-cyan hover:bg-primary-secondary/20 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Register
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-neon-cyan p-2 rounded-md transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-secondary/50 rounded-lg mt-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-300 hover:text-neon-cyan block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="border-t border-primary-secondary pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2 border-b border-primary-secondary/50">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-neon-cyan font-medium text-sm">{user?.name}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center text-gray-300 hover:text-neon-cyan px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center text-gray-300 hover:text-neon-cyan px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center text-gray-300 hover:text-neon-cyan px-3 py-2 rounded-md text-base font-medium transition-colors text-left"
                    >
                      <LogIn className="h-5 w-5 mr-2 rotate-180" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center text-gray-300 hover:text-neon-cyan px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center text-gray-300 hover:text-neon-cyan px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5 mr-2" />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}