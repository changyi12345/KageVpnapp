'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';
import { Shield, User, Mail, Lock, Save, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';
import Link from 'next/link';

export default function AdminProfilePage() {
  const { adminUser, isAdmin } = useAdminAuth();
  const router = useRouter();
  const { toasts, removeToast, success, error } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!adminUser || !isAdmin) {
      router.push('/admin/login');
      return;
    }
    setName(adminUser.name || '');
    setEmail(adminUser.email || '');
    setLoading(false);
  }, [adminUser, isAdmin, router]);

  const handleSaveProfile = async () => {
    if (!adminUser) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('admin-token');
      const res = await fetch(`/api/admin/users/${adminUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to update profile');
      }

      const updatedUser = { ...adminUser, name, email };
      localStorage.setItem('admin-user', JSON.stringify(updatedUser));
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'admin-user',
          newValue: JSON.stringify(updatedUser),
          storageArea: localStorage,
        })
      );

      success('Profile Updated', 'Admin profile updated successfully.');
    } catch (e: any) {
      error('Update Failed', e.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      error('Missing fields', 'ကျန်ရှိရာ field များဖြည့်ပါ');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('Mismatch', 'New password နှစ်ခု မတူပါ');
      return;
    }
    if (newPassword.length < 6) {
      error('Too short', 'Password အနည်းဆုံး ၆ လုံး');
      return;
    }

    setChangingPwd(true);
    try {
      const token = localStorage.getItem('admin-token');
      const res = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      success('Password Changed', 'စကားဝှက် ပြောင်းလဲပြီးပါပြီ');
    } catch (e: any) {
      error('Failed', e.message || 'Error changing password');
    } finally {
      setChangingPwd(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse text-gray-400">Loading admin profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-neon-cyan" />
          <h1 className="text-2xl font-orbitron font-bold">Admin Profile</h1>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 bg-neon-cyan text-primary-dark px-4 py-2 rounded-md hover:bg-neon-blue transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Account Information */}
      <div className="bg-primary-secondary border border-gray-700 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-2">Account Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <input
                className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none focus:border-neon-cyan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Admin Name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <input
                className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none focus:border-neon-cyan"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                type="email"
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="mt-4 inline-flex items-center gap-2 bg-neon-cyan text-primary-dark px-4 py-2 rounded-md hover:bg-neon-blue transition disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Change Password */}
      <div className="bg-primary-secondary border border-gray-700 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-2">Change Password</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Current Password</label>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-400" />
              <input
                className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none focus:border-neon-cyan"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type="password"
                placeholder="••••••"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">New Password</label>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-400" />
              <input
                className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none focus:border-neon-cyan"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type="password"
                placeholder="At least 6 characters"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-400" />
              <input
                className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 outline-none focus:border-neon-cyan"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Repeat new password"
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleChangePassword}
          disabled={changingPwd}
          className="mt-4 inline-flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition disabled:opacity-50"
        >
          {changingPwd ? 'Changing...' : 'Change Password'}
        </button>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}