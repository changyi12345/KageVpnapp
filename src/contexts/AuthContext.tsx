'use client';

import React, { createContext, useState, useEffect, useRef, useContext } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    console.log('AuthContext useEffect initializing...');
    // Initialize user from localStorage on mount
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('user-token');
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('Found saved user in localStorage:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('user-token');
        setUser(null);
      }
    } else {
      console.log('No saved user or token found in localStorage');
      setUser(null);
    }
    setLoading(false);

    // Listen for storage changes (for cross-tab sync and manual updates)
    const handleStorageChange = (e?: StorageEvent) => {
      console.log('Storage change detected', e?.key);
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('user-token');
      
      if (savedUser && savedToken) {
        try {
          const parsedUser = JSON.parse(savedUser);
          console.log('Storage change - setting user:', parsedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('user');
          localStorage.removeItem('user-token');
          setUser(null);
        }
      } else {
        console.log('Storage change - no user found, setting null');
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom storage events (for same-tab updates)
    const handleCustomStorageEvent = () => {
      console.log('Custom storage event detected');
      handleStorageChange();
    };
    
    window.addEventListener('storage', handleCustomStorageEvent);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleCustomStorageEvent);
    };
  }, []);

  async function login(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('AuthContext login success:', data.user);
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Store user token in localStorage for API calls
        if (data.token) {
          localStorage.setItem('user-token', data.token);
          console.log('Token stored in localStorage:', data.token.substring(0, 20) + '...');
        }
        
        // Trigger storage event for immediate state sync
        window.dispatchEvent(new Event('storage'));
        console.log('Storage event dispatched from AuthContext');
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('auth-token'); // Clear regular user auth token
      localStorage.removeItem('user-token'); // Clear user-specific token
      localStorage.removeItem('admin-token'); // Clear admin-specific token
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      <>{children}</>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}