'use client';

import React, { createContext, useState, useEffect, useRef, useContext } from 'react';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin';
  isActive: boolean;
  createdAt: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  adminLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    console.log('AdminAuthContext useEffect initializing...');
    // Initialize admin user from localStorage on mount
    const savedAdminUser = localStorage.getItem('admin-user');
    const savedAdminToken = localStorage.getItem('admin-token');
    
    if (savedAdminUser && savedAdminToken) {
      try {
        const parsedAdminUser = JSON.parse(savedAdminUser);
        console.log('Found saved admin user in localStorage:', parsedAdminUser);
        setAdminUser(parsedAdminUser);
      } catch (error) {
        console.error('Error parsing saved admin user:', error);
        localStorage.removeItem('admin-user');
        localStorage.removeItem('admin-token');
        setAdminUser(null);
      }
    } else {
      console.log('No saved admin user or token found in localStorage');
      setAdminUser(null);
    }
    setLoading(false);

    // Listen for admin storage changes (for cross-tab sync)
    const handleAdminStorageChange = (e?: StorageEvent) => {
      // Only handle admin-specific storage changes
      if (e && e.key !== 'admin-user' && e.key !== 'admin-token') {
        return;
      }
      
      console.log('Admin storage change detected', e?.key);
      const savedAdminUser = localStorage.getItem('admin-user');
      const savedAdminToken = localStorage.getItem('admin-token');
      
      if (savedAdminUser && savedAdminToken) {
        try {
          const parsedAdminUser = JSON.parse(savedAdminUser);
          console.log('Admin storage change - setting admin user:', parsedAdminUser);
          setAdminUser(parsedAdminUser);
        } catch (error) {
          console.error('Error parsing saved admin user:', error);
          localStorage.removeItem('admin-user');
          localStorage.removeItem('admin-token');
          setAdminUser(null);
        }
      } else {
        console.log('Admin storage change - no admin user found, setting null');
        setAdminUser(null);
      }
    };

    window.addEventListener('storage', handleAdminStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleAdminStorageChange);
    };
  }, []);

  const adminLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('AdminAuthContext login success:', data.user);
        setAdminUser(data.user);
        localStorage.setItem('admin-user', JSON.stringify(data.user));
        
        // Store admin token in localStorage for API calls
        if (data.token) {
          localStorage.setItem('admin-token', data.token);
          console.log('Admin token stored in localStorage:', data.token.substring(0, 20) + '...');
        }
        
        // Trigger admin storage event for immediate state sync
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'admin-user',
          newValue: JSON.stringify(data.user),
          storageArea: localStorage
        }));
        console.log('Admin storage event dispatched from AdminAuthContext');
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Admin login error in AdminAuthContext:', error);
      return { success: false, error: 'Network error ဖြစ်နေပါတယ်' };
    }
  };

  const adminLogout = async () => {
    try {
      await fetch('/api/auth/admin-logout', { method: 'POST' });
    } catch (error) {
      console.error('Admin logout error:', error);
    } finally {
      setAdminUser(null);
      localStorage.removeItem('admin-user');
      localStorage.removeItem('admin-token');
      
      // Trigger admin storage event for immediate state sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'admin-user',
        newValue: null,
        storageArea: localStorage
      }));
    }
  };

  const value = {
    adminUser,
    adminLogin,
    adminLogout,
    loading,
    isAuthenticated: !!adminUser,
    isAdmin: adminUser?.role === 'admin',
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}