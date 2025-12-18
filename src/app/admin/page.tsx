'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatOrderId } from '@/lib/utils';
import { 
  Users, 
  User,
  ShoppingCart, 
  Package, 
  Settings, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Download,
  Upload,
  Send,
  CheckCircle,
  XCircle,
  X,
  Shield,
  Database,
  Info,
  DollarSign,
  TrendingUp,
  BarChart3,
  LogOut,
  RefreshCw,
  Key,
  PieChart as PieChartIcon
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

// Payment Methods Settings Component
function PaymentMethodsSettings({ showNotification }: { showNotification: (message: string, type: 'success' | 'error') => void }) {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMethod, setEditingMethod] = useState<any>(null);
  const [newMethod, setNewMethod] = useState({
    id: '',
    name: '',
    logo: '',
    number: '',
    accountName: '',
    phoneNumber: '',
    isActive: true
  });
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch payment methods
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.settings.paymentMethods || []);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      showNotification('Failed to load payment methods', 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteOrder = async () => {
    if (!deletingOrderId) return;
    
    try {
      const updatedMethods = paymentMethods.filter(method => method.id !== deletingOrderId);
      await updatePaymentMethods(updatedMethods);
      showNotification('Payment method deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      showNotification('Failed to delete payment method', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeletingOrderId(null);
    }
  };

  const confirmAcceptPayment = async () => {
    if (!pendingOrder) return;
    
    try {
      const token = localStorage.getItem('admin-token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];

      if (!token) {
        showNotification('Authentication required. Please login again.', 'error');
        return;
      }

      const response = await fetch(`/api/admin/orders/${pendingOrder.fullId}/accept-payment`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        showNotification('Payment accepted successfully', 'success');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to accept payment', 'error');
      }
    } catch (error) {
      console.error('Error accepting payment:', error);
      showNotification('Failed to accept payment', 'error');
    } finally {
      setShowAcceptModal(false);
      setPendingOrder(null);
    }
  };

  const confirmRejectPayment = async () => {
    if (!pendingOrder) return;
    
    try {
      const token = localStorage.getItem('admin-token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];

      if (!token) {
        showNotification('Authentication required. Please login again.', 'error');
        return;
      }

      const response = await fetch(`/api/admin/orders/${pendingOrder.fullId}/reject-payment`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        showNotification('Payment rejected successfully', 'success');
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to reject payment', 'error');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      showNotification('Failed to reject payment', 'error');
    } finally {
      setShowRejectModal(false);
      setPendingOrder(null);
    }
  };

  const updatePaymentMethods = async (methods: any[]) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethods: methods }),
      });

      if (response.ok) {
        setPaymentMethods(methods);
        showNotification('Payment methods updated successfully', 'success');
        return true;
      } else {
        showNotification('Failed to update payment methods', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error updating payment methods:', error);
      showNotification('Failed to update payment methods', 'error');
      return false;
    }
  };

  const handleSaveEdit = async () => {
    if (!editingMethod.name || !editingMethod.number || !editingMethod.accountName || !editingMethod.phoneNumber) {
      showNotification('All fields are required', 'error');
      return;
    }

    const updatedMethods = paymentMethods.map(method => 
      method.id === editingMethod.id ? editingMethod : method
    );

    const success = await updatePaymentMethods(updatedMethods);
    if (success) {
      setEditingMethod(null);
    }
  };

  const handleToggleActive = async (methodId: string) => {
    const updatedMethods = paymentMethods.map(method => 
      method.id === methodId ? { ...method, isActive: !method.isActive } : method
    );
    await updatePaymentMethods(updatedMethods);
  };

  const handleAddNew = async () => {
    if (!newMethod.name || !newMethod.number || !newMethod.accountName || !newMethod.phoneNumber) {
      showNotification('All fields are required', 'error');
      return;
    }

    const methodId = newMethod.name.toLowerCase().replace(/\s+/g, '') + Date.now();
    const methodToAdd = { ...newMethod, id: methodId };
    
    const updatedMethods = [...paymentMethods, methodToAdd];
    const success = await updatePaymentMethods(updatedMethods);
    
    if (success) {
      setNewMethod({
        id: '',
        name: '',
        logo: '',
        number: '',
        accountName: '',
        phoneNumber: '',
        isActive: true
      });
      setShowAddModal(false);
    }
  };

  const handleDelete = async (methodId: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      const updatedMethods = paymentMethods.filter(method => method.id !== methodId);
      await updatePaymentMethods(updatedMethods);
    }
  };

  const handleEdit = (method: any) => {
    setEditingMethod({ ...method });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-neon-cyan" />
        <span className="ml-2">Loading payment methods...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-400">Manage payment methods and bank account numbers</p>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-neon-cyan text-primary-dark px-4 py-2 rounded-lg hover:bg-neon-cyan/80 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </button>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div key={method.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
            {editingMethod?.id === method.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Payment Method Name</label>
                    <input
                      type="text"
                      value={editingMethod.name}
                      onChange={(e) => setEditingMethod({ ...editingMethod, name: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Logo/Emoji</label>
                    <input
                      type="text"
                      value={editingMethod.logo}
                      onChange={(e) => setEditingMethod({ ...editingMethod, logo: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                      placeholder="💳"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={editingMethod.number}
                      onChange={(e) => setEditingMethod({ ...editingMethod, number: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Account Name</label>
                    <input
                      type="text"
                      value={editingMethod.accountName}
                      onChange={(e) => setEditingMethod({ ...editingMethod, accountName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingMethod.phoneNumber || ''}
                    onChange={(e) => setEditingMethod({ ...editingMethod, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                    placeholder="09123456789"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingMethod(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-neon-cyan text-primary-dark rounded-lg hover:bg-neon-cyan/80 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{method.logo}</span>
                  <div>
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-gray-400">{method.number}</p>
                    <p className="text-xs text-gray-500">{method.accountName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(method.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      method.isActive 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {method.isActive ? 'Active' : 'Inactive'}
                  </button>
                  <button
                    onClick={() => handleEdit(method)}
                    className="p-2 text-gray-400 hover:text-neon-cyan transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-primary-secondary rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-neon-cyan">Add New Payment Method</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Payment Method Name</label>
                <input
                  type="text"
                  value={newMethod.name}
                  onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                  placeholder="KBZ Pay"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Logo/Emoji</label>
                <input
                  type="text"
                  value={newMethod.logo}
                  onChange={(e) => setNewMethod({ ...newMethod, logo: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                  placeholder="💳"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Account Number</label>
                <input
                  type="text"
                  value={newMethod.number}
                  onChange={(e) => setNewMethod({ ...newMethod, number: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                  placeholder="09123456789"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Account Name</label>
                <input
                  type="text"
                  value={newMethod.accountName}
                  onChange={(e) => setNewMethod({ ...newMethod, accountName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                  placeholder="Kage VPN Store"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newMethod.phoneNumber}
                  onChange={(e) => setNewMethod({ ...newMethod, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                  placeholder="09123456789"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-neon-cyan text-primary-dark rounded-lg hover:bg-neon-cyan/80 transition-colors"
              >
                Add Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary-secondary rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-red-400">Confirm Delete</h3>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300">Are you sure you want to delete this order?</p>
              <p className="text-red-400 text-sm mt-2">This action cannot be undone.</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-primary-secondary rounded-xl p-6 max-w-md w-full mx-4 border border-red-500/30"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Delete Order</h3>
                <p className="text-gray-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300">
                Are you sure you want to delete this order? All associated data will be permanently removed.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingOrderId(null);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteOrder}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Order
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Accept Payment Confirmation Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-primary-secondary rounded-xl p-6 max-w-md w-full mx-4 border border-green-500/30"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Accept Payment</h3>
                <p className="text-gray-400 text-sm">Confirm payment approval</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300">
                Are you sure you want to accept this payment? This will mark the order as verified and ready for delivery.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowAcceptModal(false);
                  setPendingOrder(null);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAcceptPayment}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Payment
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Payment Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-primary-secondary rounded-xl p-6 max-w-md w-full mx-4 border border-red-500/30"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Reject Payment</h3>
                <p className="text-gray-400 text-sm">This action will cancel the order</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300">
                Are you sure you want to reject this payment? This will mark the order as cancelled and notify the customer.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowRejectModal(false);
                  setPendingOrder(null);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRejectPayment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Payment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}


function OrdersManagement({ searchTerm, setSearchTerm, showNotification }: { 
  searchTerm: string; 
  setSearchTerm: (term: string) => void;
  showNotification: (message: string, type: 'success' | 'error') => void;
}) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [deliveringOrder, setDeliveringOrder] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [vpnCredentials, setVpnCredentials] = useState({
    username: '',
    password: '',
    serverInfo: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchTerm]);

  const confirmDeleteOrder = async () => {
    if (!deletingOrderId) return;
    
    try {
      const token = localStorage.getItem('admin-token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];

      if (!token) {
        showNotification('Authentication required. Please login again.', 'error');
        return;
      }

      const response = await fetch(`/api/admin/orders/${deletingOrderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        showNotification('Order deleted successfully', 'success');
        fetchOrders();
      } else {
        showNotification('Failed to delete order', 'error');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      showNotification('Failed to delete order', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeletingOrderId(null);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Get auth token from localStorage or cookies
      const token = localStorage.getItem('admin-token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];

      if (!token) {
        showNotification('Authentication required. Please login again.', 'error');
        return;
      }

      const url = `/api/admin/orders?page=${currentPage}&limit=10&search=${searchTerm}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          showNotification('Session expired. Please login again.', 'error');
          return;
        }
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.orders || !Array.isArray(data.orders)) {
        console.error('Invalid orders data structure:', data);
        showNotification('Invalid data received from server', 'error');
        return;
      }

      const transformedOrders = data.orders.map((order: any) => ({
        id: formatOrderId(order._id),
        fullId: order._id,
        // Customer info: prefer user; fallback to payment sender
        customer: order.userId?.name || order.paymentId?.senderName || 'Unknown',
        // Show email if available; otherwise show phone from payment
        email: order.userId?.email || order.paymentId?.senderPhone || 'N/A',
        product: order.items?.[0]?.name || 'Multiple Items',
        amount: order.total.toLocaleString(),
        status: order.status === 'payment_submitted' ? 'Pending' : 
                order.status === 'completed' ? 'Completed' : 
                order.status === 'verified' ? 'Verified' : 
                order.status === 'cancelled' ? 'Cancelled' : 'Pending',
        date: new Date(order.orderDate).toLocaleDateString(),
        items: order.items,
        paymentInfo: order.paymentId ? {
          transactionId: order.paymentId.transactionId,
          paymentScreenshot: order.paymentId.paymentScreenshot,
          paymentMethod: order.paymentId.paymentMethod,
          senderName: order.paymentId.senderName,
          senderPhone: order.paymentId.senderPhone,
          status: order.paymentId.status
        } : null
      }));
      
      setOrders(transformedOrders);
      setTotalPages(data.totalPages);
      
      if (transformedOrders.length === 0) {
        showNotification('No orders found', 'error');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showNotification('Failed to load orders. Please check your connection and try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-400 bg-green-400/20';
      case 'Pending': return 'text-orange-400 bg-orange-400/20';
      case 'Verified': return 'text-blue-400 bg-blue-400/20';
      case 'Cancelled': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleEditOrder = (order: any) => {
    setEditingOrder({ ...order });
    setShowEditModal(true);
  };

  const handleDeliverVPN = (order: any) => {
    setDeliveringOrder(order);
    setVpnCredentials({
      username: '',
      password: '',
      serverInfo: '',
      expiryDate: ''
    });
    setShowDeliverModal(true);
  };

  const handleAcceptPayment = async (order: any) => {
    setPendingOrder(order);
    setShowAcceptModal(true);
  };

  const confirmAcceptPayment = async () => {
    if (!pendingOrder) return;
    
    try {
      const token = localStorage.getItem('admin-token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];

      if (!token) {
        showNotification('Authentication required. Please login again.', 'error');
        return;
      }

      const response = await fetch(`/api/admin/orders/${pendingOrder.fullId}/accept-payment`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        showNotification('Payment accepted successfully', 'success');
        fetchOrders();
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to accept payment', 'error');
      }
    } catch (error) {
      console.error('Error accepting payment:', error);
      showNotification('Failed to accept payment', 'error');
    } finally {
      setShowAcceptModal(false);
      setPendingOrder(null);
    }
  };

  const handleRejectPayment = async (order: any) => {
    setPendingOrder(order);
    setShowRejectModal(true);
  };

  const confirmRejectPayment = async () => {
    if (!pendingOrder) return;
    
    try {
      const token = localStorage.getItem('admin-token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];

      if (!token) {
        showNotification('Authentication required. Please login again.', 'error');
        return;
      }

      const response = await fetch(`/api/admin/orders/${pendingOrder.fullId}/reject-payment`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        showNotification('Payment rejected successfully', 'success');
        fetchOrders();
      } else {
        const errorData = await response.json();
        showNotification(errorData.message || 'Failed to reject payment', 'error');
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      showNotification('Failed to reject payment', 'error');
    } finally {
      setShowRejectModal(false);
      setPendingOrder(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setDeletingOrderId(orderId);
    setShowDeleteModal(true);
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;
    
    try {
      const token = localStorage.getItem('admin-token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];

      if (!token) {
        showNotification('Authentication required. Please login again.', 'error');
        return;
      }

      const response = await fetch(`/api/admin/orders/${editingOrder.fullId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editingOrder.status,
        }),
      });

      if (response.ok) {
        showNotification('Order updated successfully', 'success');
        setShowEditModal(false);
        setEditingOrder(null);
        fetchOrders();
      } else {
        showNotification('Failed to update order', 'error');
      }
    } catch (error) {
      showNotification('Error updating order', 'error');
    }
  };

  const handleDeliverCredentials = async () => {
    if (!deliveringOrder || !vpnCredentials.username || !vpnCredentials.password || 
        !vpnCredentials.serverInfo || !vpnCredentials.expiryDate) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      const response = await fetch(`/api/admin/orders/${deliveringOrder.fullId}/deliver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vpnCredentials,
          customerEmail: deliveringOrder.email,
        }),
      });

      if (response.ok) {
        showNotification('VPN credentials delivered successfully', 'success');
        setShowDeliverModal(false);
        setDeliveringOrder(null);
        setVpnCredentials({
          username: '',
          password: '',
          serverInfo: '',
          expiryDate: ''
        });
        fetchOrders();
      } else {
        showNotification('Failed to deliver credentials', 'error');
      }
    } catch (error) {
      showNotification('Error delivering credentials', 'error');
    }
  };

  const handleDeliverVPNCredentials = async () => {
    try {
      const token = localStorage.getItem('admin-token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];

      if (!token) {
        showNotification('Authentication required. Please login again.', 'error');
        return;
      }

      const response = await fetch('/api/admin/deliver-vpn', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: deliveringOrder.fullId,
          vpnCredentials: vpnCredentials,
        }),
      });
      
      if (response.ok) {
        setShowDeliverModal(false);
        setDeliveringOrder(null);
        setVpnCredentials({
          username: '',
          password: '',
          serverInfo: '',
          expiryDate: ''
        });
        fetchOrders(); // Refresh the list
        showNotification('VPN credentials delivered successfully', 'success');
      } else {
        const data = await response.json();
        showNotification(data.error || 'Failed to deliver VPN credentials', 'error');
      }
    } catch (error) {
      console.error('Error delivering VPN credentials:', error);
      showNotification('Error delivering VPN credentials', 'error');
    }
  };

  return (
    <div suppressHydrationWarning>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold mb-2">Orders Management</h1>
          <p className="text-gray-300">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-primary-secondary border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan"
            />
          </div>
          <button 
            onClick={fetchOrders}
            className="flex items-center px-4 py-2 bg-neon-cyan text-primary-dark rounded-lg hover:bg-neon-blue transition-colors"
            title="Refresh Orders"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Orders
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-neon-cyan text-primary-dark rounded-lg hover:bg-neon-blue transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-primary-secondary rounded-xl p-6 border border-gray-700"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold">Customer</th>
                <th className="text-left py-3 px-4 font-semibold">Product</th>
                <th className="text-left py-3 px-4 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 font-semibold">Receipt ID</th>
                <th className="text-left py-3 px-4 font-semibold">Receipt</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index} className="border-b border-gray-800">
                    <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                    <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                    <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                    <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                    <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                    <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                    <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                    <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                    <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                  </tr>
                ))
              ) : (
                orders.map((order) => (
                  <tr key={order.fullId} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-mono text-neon-cyan">{order.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-gray-400">{order.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{order.product}</td>
                    <td className="py-3 px-4 font-semibold">{order.amount} Ks</td>
                    <td className="py-3 px-4 text-gray-400">
                      {order.paymentInfo?.transactionId ? (
                        <div className="font-mono text-sm text-neon-cyan">
                          {order.paymentInfo.transactionId}
                        </div>
                      ) : (
                        <span className="text-yellow-400 text-xs">Payment Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {order.paymentInfo?.paymentScreenshot ? (
                        <button
                          onClick={() => window.open(order.paymentInfo.paymentScreenshot, '_blank')}
                          className="text-blue-400 hover:text-blue-300 underline text-sm flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          View Receipt
                        </button>
                      ) : order.paymentInfo ? (
                        <span className="text-orange-400 text-xs">No Screenshot</span>
                      ) : (
                        <span className="text-yellow-400 text-xs">No Receipt</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{order.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditOrder(order)}
                          className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"
                          title="Edit Order"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {order.status === 'Pending' && order.paymentInfo && (
                          <>
                            <button 
                              onClick={() => handleAcceptPayment(order)}
                              className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"
                              title="Accept Payment"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleRejectPayment(order)}
                              className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                              title="Reject Payment"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {(order.status === 'Verified' || order.status === 'Pending') && (
                          <button 
                            onClick={() => handleDeliverVPN(order)}
                            className="p-2 text-purple-400 hover:bg-purple-400/20 rounded-lg transition-colors"
                            title="Deliver VPN Credentials"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteOrder(order.fullId)}
                          className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </motion.div>

      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary-secondary rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-neon-cyan">Order Details</h3>
              <button 
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Order ID</label>
                  <p className="font-mono text-neon-cyan">{selectedOrder.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <p className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Customer</label>
                  <p>{selectedOrder.customer}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p>{selectedOrder.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Product</label>
                  <p>{selectedOrder.product}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Amount</label>
                  <p className="font-semibold">{selectedOrder.amount} Ks</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Date</label>
                  <p>{selectedOrder.date}</p>
                </div>
              </div>
              
              {/* Payment Information Section */}
              {selectedOrder.paymentInfo && (
                <div className="mt-6 p-4 bg-primary-dark rounded-lg border border-gray-600">
                  <h4 className="text-lg font-semibold text-neon-cyan mb-4">Payment Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Payment Method</label>
                      <p className="font-medium">{selectedOrder.paymentInfo.paymentMethod || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Transaction ID</label>
                      <p className="font-mono text-neon-cyan">{selectedOrder.paymentInfo.transactionId || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Sender Name</label>
                      <p>{selectedOrder.paymentInfo.senderName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Sender Phone</label>
                      <p>{selectedOrder.paymentInfo.senderPhone || 'N/A'}</p>
                    </div>
                  </div>
                  {selectedOrder.paymentInfo.paymentScreenshot && (
                    <div className="mt-4">
                      <label className="text-sm text-gray-400">Payment Screenshot</label>
                      <div className="mt-2">
                        <img 
                          src={selectedOrder.paymentInfo.paymentScreenshot} 
                          alt="Payment Screenshot" 
                          className="max-w-full h-auto max-h-64 rounded-lg border border-gray-600"
                          onClick={() => window.open(selectedOrder.paymentInfo.paymentScreenshot, '_blank')}
                          style={{ cursor: 'pointer' }}
                        />
                        <p className="text-xs text-gray-400 mt-1">Click to view full size</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <label className="text-sm text-gray-400">Items</label>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="bg-gray-800/50 p-3 rounded-lg">
                        <div className="flex justify-between">
                          <span>{item.name}</span>
                          <span>{item.price?.toLocaleString()} Ks</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          Quantity: {item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary-secondary rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-neon-cyan">Edit Order</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Order ID</label>
                <p className="font-mono text-neon-cyan">{editingOrder.id}</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Status</label>
                <select 
                  value={editingOrder.status}
                  onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                >
                  <option value="Pending" className="bg-gray-800 text-white">Pending</option>
                  <option value="Verified" className="bg-gray-800 text-white">Verified</option>
                  <option value="Completed" className="bg-gray-800 text-white">Completed</option>
                  <option value="Cancelled" className="bg-gray-800 text-white">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Customer</label>
                <p>{editingOrder.customer}</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <p className="font-semibold">{editingOrder.amount} Ks</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateOrder}
                className="px-4 py-2 bg-neon-cyan text-primary-dark rounded-lg hover:bg-neon-blue transition-colors"
              >
                Update Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VPN Delivery Modal */}
      {showDeliverModal && deliveringOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary-secondary rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-neon-cyan">Deliver VPN Credentials</h3>
              <button 
                onClick={() => setShowDeliverModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Order ID</label>
                <p className="font-mono text-neon-cyan">{deliveringOrder.id}</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Customer</label>
                <p>{deliveringOrder.customer}</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">VPN Username</label>
                <input
                  type="text"
                  value={vpnCredentials.username}
                  onChange={(e) => setVpnCredentials({...vpnCredentials, username: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                  placeholder="Enter VPN username"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">VPN Password</label>
                <input
                  type="text"
                  value={vpnCredentials.password}
                  onChange={(e) => setVpnCredentials({...vpnCredentials, password: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                  placeholder="Enter VPN password"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Server Information</label>
                <textarea
                  value={vpnCredentials.serverInfo}
                  onChange={(e) => setVpnCredentials({...vpnCredentials, serverInfo: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                  placeholder="Server IP, port, protocol, etc."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Expiry Date</label>
                <input
                  type="date"
                  value={vpnCredentials.expiryDate}
                  onChange={(e) => setVpnCredentials({...vpnCredentials, expiryDate: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowDeliverModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeliverVPNCredentials}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Deliver VPN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Payment Confirmation Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-primary-secondary rounded-xl p-6 max-w-md w-full mx-4 border border-green-500/30"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Accept Payment</h3>
                <p className="text-gray-400 text-sm">Confirm payment approval</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300">
                Are you sure you want to accept this payment? This will mark the order as verified and ready for delivery.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowAcceptModal(false);
                  setPendingOrder(null);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAcceptPayment}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Accept Payment
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reject Payment Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-primary-secondary rounded-xl p-6 max-w-md w-full mx-4 border border-red-500/30"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Reject Payment</h3>
                <p className="text-gray-400 text-sm">This action will cancel the order</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300">
                Are you sure you want to reject this payment? This will mark the order as cancelled and notify the customer.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => {
                  setShowRejectModal(false);
                  setPendingOrder(null);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRejectPayment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Payment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Products Management Component
function ProductsManagement({ showNotification }: { showNotification: (message: string, type: 'success' | 'error') => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    provider: '',
    duration: '',
    price: '',
    description: '',
    features: [''],
    category: 'Premium',
    isActive: true,
    logo: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // token ကို localStorage + cookie နှစ်ခုစလုံးကနေ fallback နည်းလမ်းနဲ့ယူမယ်
      const token =
          localStorage.getItem('admin-token') ||
          document.cookie.split('; ').find(r => r.startsWith('admin-token='))?.split('=')[1];

      if (!token) {
        showNotification('Authentication လိုအပ်ပါတယ်။ Admin Login ပြန်ဝင်ပါ။', 'error');
        setProducts([]);
        return;
      }

      const response = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        console.error('Error fetching products:', response.status, response.statusText);
        showNotification('Products မယူနိုင်ပါ — Authentication ကို စစ်ပါ', 'error');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotification('Network error ဖြစ်နေပါတယ်', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const token =
          localStorage.getItem('admin-token') ||
          document.cookie.split('; ').find(r => r.startsWith('admin-token='))?.split('=')[1];

      if (!token) {
        showNotification('Authentication လိုအပ်ပါတယ်။ Admin Login ပြန်ဝင်ပါ။', 'error');
        return;
      }

      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        features: newProduct.features.filter(f => f.trim() !== '')
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewProduct({
          name: '',
          provider: '',
          duration: '',
          price: '',
          description: '',
          features: [''],
          category: 'Premium',
          isActive: true,
          logo: ''
        });
        fetchProducts();
        showNotification('Product အောင်မြင်စွာထည့်လိုက်ပါတယ်', 'success');
      } else {
        showNotification('Product သတ်မှတ်မှု ပြုလုပ်၍မရပါ', 'error');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      showNotification('Error adding product', 'error');
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct({
      ...product,
      price: product.price.toString(),
      features: product.features || ['']
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const token =
          localStorage.getItem('admin-token') ||
          document.cookie.split('; ').find(r => r.startsWith('admin-token='))?.split('=')[1];

      if (!token) {
        showNotification('Authentication လိုအပ်ပါတယ်။ Admin Login ပြန်ဝင်ပါ။', 'error');
        return;
      }

      const productData = {
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        features: editingProduct.features.filter((f: string) => f.trim() !== '')
      };

      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingProduct._id,
          ...productData
        }),
      });

      if (response.ok) {
        setShowEditModal(false);
        setEditingProduct(null);
        fetchProducts();
        showNotification('Product အောင်မြင်စွာ ပြင်ဆင်ပြီးပါပြီ', 'success');
      } else {
        showNotification('Product ပြင်ဆင်၍မရပါ', 'error');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showNotification('Error updating product', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Delete ခြင်းကို အတည်ပြုမလား?')) return;
    
    try {
      const token =
          localStorage.getItem('admin-token') ||
          document.cookie.split('; ').find(r => r.startsWith('admin-token='))?.split('=')[1];

      if (!token) {
        showNotification('Authentication လိုအပ်ပါတယ်။ Admin Login ပြန်ဝင်ပါ။', 'error');
        return;
      }

      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        fetchProducts();
        showNotification('Product ဖျက်လို့ အောင်မြင်ပါတယ်', 'success');
      } else {
        showNotification('Product ဖျက်၍မရပါ', 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('Error deleting product', 'error');
    }
  };

  const addFeatureField = (isNewProduct = true) => {
    if (isNewProduct) {
      setNewProduct({
        ...newProduct,
        features: [...newProduct.features, '']
      });
    } else {
      setEditingProduct({
        ...editingProduct,
        features: [...editingProduct.features, '']
      });
    }
  };

  const updateFeature = (index: number, value: string, isNewProduct = true) => {
    if (isNewProduct) {
      const updatedFeatures = [...newProduct.features];
      updatedFeatures[index] = value;
      setNewProduct({
        ...newProduct,
        features: updatedFeatures
      });
    } else {
      const updatedFeatures = [...editingProduct.features];
      updatedFeatures[index] = value;
      setEditingProduct({
        ...editingProduct,
        features: updatedFeatures
      });
    }
  };

  const removeFeature = (index: number, isNewProduct = true) => {
    if (isNewProduct) {
      const updatedFeatures = newProduct.features.filter((_, i) => i !== index);
      setNewProduct({
        ...newProduct,
        features: updatedFeatures.length > 0 ? updatedFeatures : ['']
      });
    } else {
      const updatedFeatures = editingProduct.features.filter((_: any, i: number) => i !== index);
      setEditingProduct({
        ...editingProduct,
        features: updatedFeatures.length > 0 ? updatedFeatures : ['']
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold mb-2">Products Management</h1>
          <p className="text-gray-300">Manage VPN products and pricing</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-neon-cyan text-primary-dark rounded-lg hover:bg-neon-blue transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-primary-secondary rounded-xl p-6 border border-gray-700"
      >
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Provider</th>
                  <th className="text-left py-3 px-4 font-semibold">Duration</th>
                  <th className="text-left py-3 px-4 font-semibold">Price</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4">{product.provider}</td>
                    <td className="py-3 px-4">{product.duration}</td>
                    <td className="py-3 px-4 font-semibold">{product.price.toLocaleString()} Ks</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.isActive ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-300 text-center py-12">
            No products found. Add your first product to get started.
          </p>
        )}
      </motion.div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary-secondary rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-neon-cyan">Add New Product</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                    placeholder="e.g., ExpressVPN Premium"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Provider</label>
                  <input
                    type="text"
                    value={newProduct.provider}
                    onChange={(e) => setNewProduct({...newProduct, provider: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                    placeholder="e.g., ExpressVPN"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Duration</label>
                  <select
                    value={newProduct.duration}
                    onChange={(e) => setNewProduct({...newProduct, duration: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="" className="bg-gray-800 text-white">Select Duration</option>
                    <option value="1 Month" className="bg-gray-800 text-white">1 Month</option>
                    <option value="3 Months" className="bg-gray-800 text-white">3 Months</option>
                    <option value="6 Months" className="bg-gray-800 text-white">6 Months</option>
                    <option value="12 Months" className="bg-gray-800 text-white">12 Months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price (Ks)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                    placeholder="15000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Category</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                >
                  <option value="Premium" className="bg-gray-800 text-white">Premium</option>
                  <option value="Standard" className="bg-gray-800 text-white">Standard</option>
                  <option value="Basic" className="bg-gray-800 text-white">Basic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Logo URL</label>
                <input
                  type="text"
                  value={newProduct.logo}
                  onChange={(e) => setNewProduct({...newProduct, logo: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  placeholder="https://icon2.cleanpng.com/20180613/xrg/aa738sihu.webp"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Local ပုံများ: /images/expressvpn-logo.png သို့မဟုတ် External links: https://example.com/logo.png
                </p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  rows={3}
                  placeholder="Product description..."
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Features</label>
                {newProduct.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value, true)}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                      placeholder="Feature description"
                    />
                    {newProduct.features.length > 1 && (
                      <button
                        onClick={() => removeFeature(index, true)}
                        className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addFeatureField(true)}
                  className="text-neon-cyan hover:text-white text-sm"
                >
                  + Add Feature
                </button>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newProduct.isActive}
                  onChange={(e) => setNewProduct({...newProduct, isActive: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm text-gray-400">Active Product</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddProduct}
                className="px-4 py-2 bg-neon-cyan text-primary-dark rounded-lg hover:bg-neon-blue transition-colors"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary-secondary rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-neon-cyan">Edit Product</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Provider</label>
                  <input
                    type="text"
                    value={editingProduct.provider}
                    onChange={(e) => setEditingProduct({...editingProduct, provider: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Duration</label>
                  <select
                    value={editingProduct.duration}
                    onChange={(e) => setEditingProduct({...editingProduct, duration: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="1 Month">1 Month</option>
                    <option value="3 Months">3 Months</option>
                    <option value="6 Months">6 Months</option>
                    <option value="12 Months">12 Months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Price (Ks)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                >
                  <option value="Premium">Premium</option>
                  <option value="Standard">Standard</option>
                  <option value="Basic">Basic</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Logo URL</label>
                <input
                  type="text"
                  value={editingProduct.logo || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, logo: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  placeholder="https://icon2.cleanpng.com/20180613/xrg/aa738sihu.webp"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Local ပုံများ: /images/expressvpn-logo.png သို့မဟုတ် External links: https://example.com/logo.png
                </p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Description</label>
                <textarea
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-2">Features</label>
                {editingProduct.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value, false)}
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-neon-cyan"
                    />
                    {editingProduct.features.length > 1 && (
                      <button
                        onClick={() => removeFeature(index, false)}
                        className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addFeatureField(false)}
                  className="text-neon-cyan hover:text-white text-sm"
                >
                  + Add Feature
                </button>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editingProduct.isActive}
                  onChange={(e) => setEditingProduct({...editingProduct, isActive: e.target.checked})}
                  className="mr-2"
                />
                <label htmlFor="editIsActive" className="text-sm text-gray-400">Active Product</label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button 
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateProduct}
                className="px-4 py-2 bg-neon-cyan text-primary-dark rounded-lg hover:bg-neon-blue transition-colors"
              >
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Users Management Component
function UsersManagement({ showNotification }: { showNotification: (message: string, type: 'success' | 'error') => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'user',
    isActive: true
  });
  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch(`/api/admin/users?page=${currentPage}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setTotalPages(data.totalPages || 1);
      } else {
        console.error('Error fetching users:', response.status, response.statusText);
        showNotification('Failed to fetch users. Please check your authentication.', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Network error while fetching users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: selectedUser._id,
          ...editForm
        }),
      });

      if (response.ok) {
        await fetchUsers();
        setShowEditModal(false);
        showNotification('User updated successfully!', 'success');
      } else {
        showNotification('Failed to update user', 'error');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showNotification('Error updating user', 'error');
    }
  };

  const handleChangePassword = (user: any) => {
    setSelectedUser(user);
    setPasswordForm({
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordModal(true);
  };

  const handleUpdatePassword = async () => {
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      showNotification('Please fill in all password fields', 'error');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: selectedUser._id,
          action: 'changePassword',
          newPassword: passwordForm.newPassword
        }),
      });

      if (response.ok) {
        setShowPasswordModal(false);
        setPasswordForm({ newPassword: '', confirmPassword: '' });
        showNotification('Password updated successfully!', 'success');
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'Failed to update password', 'error');
      }
    } catch (err) {
      console.error('Error updating password:', err);
      showNotification('Error updating password', 'error');
    }
  };

  const handleDeleteUser = async (user: any) => {
    if (user.role === 'admin') {
      showNotification('Cannot delete admin users', 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('admin-token');
        const response = await fetch('/api/admin/users', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: user._id
          }),
        });

        if (response.ok) {
          await fetchUsers();
          showNotification('User deleted successfully!', 'success');
        } else {
          showNotification('Failed to delete user', 'error');
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        showNotification('Error deleting user', 'error');
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold mb-2">Users Management</h1>
          <p className="text-gray-300">Manage customer accounts and permissions</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-primary-secondary rounded-xl p-6 border border-gray-700"
      >
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading users...</p>
          </div>
        ) : users.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Joined</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-3 px-4 font-medium">{user.name}</td>
                      <td className="py-3 px-4 text-gray-300">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'admin' ? 'text-purple-400 bg-purple-400/20' : 'text-blue-400 bg-blue-400/20'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isActive ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewUser(user)}
                            className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                            title="View User Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleChangePassword(user)}
                            className="p-2 text-yellow-400 hover:bg-yellow-400/20 rounded-lg transition-colors"
                            title="Change Password"
                          >
                            <Key className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                            title="Delete User"
                            disabled={user.role === 'admin'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-300 text-center py-12">
            No users found.
          </p>
        )}
      </motion.div>

      {/* View User Modal */}
      <AnimatePresence>
        {showViewModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-primary-secondary rounded-xl p-6 max-w-md w-full border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">User Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Name</label>
                  <p className="text-white font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <p className="text-white">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Role</label>
                  <p className="text-white capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <p className={`font-medium ${selectedUser.isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Joined Date</label>
                  <p className="text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Last Updated</label>
                  <p className="text-white">{new Date(selectedUser.updatedAt || selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-primary-secondary rounded-xl p-6 max-w-md w-full border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Edit User</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Status</label>
                  <select
                    value={editForm.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'active' })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="flex-1 px-4 py-2 bg-neon-cyan text-black rounded-lg hover:bg-neon-cyan/80 transition-colors font-semibold"
                >
                  Update User
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Change Password</h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    User: {selectedUser?.name}
                  </label>
                  <p className="text-sm text-gray-400">{selectedUser?.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePassword}
                  className="flex-1 px-4 py-2 bg-neon-cyan text-black rounded-lg hover:bg-neon-cyan/80 transition-colors font-semibold"
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Define types for dashboard data
interface DashboardStat {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

interface DashboardOrder {
  id: string;
  fullId: string;
  customer: string;
  email: string;
  product: string;
  amount: string;
  status: string;
  date: string;
  items: any[];
  paymentInfo?: {
    transactionId?: string;
    paymentScreenshot?: string;
  };
}

interface SalesData {
  name: string;
  sales: number;
}

interface ProductData {
  name: string;
  value: number;
  fill: string;
  [key: string]: any; // Add index signature for chart compatibility
}

// Remove static mock data - now using dynamic API data
export default function AdminDashboard(props: { params: any; searchParams: any }) {
  const { adminUser, loading: authLoading, isAdmin, adminLogout } = useAdminAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isClient, setIsClient] = useState(false);
  const { toasts, success, error, warning, info, removeToast } = useToast();
  
  // Settings state
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [backupLoading, setBackupLoading] = useState(false);
  const [showAdminPasswordModal, setShowAdminPasswordModal] = useState(false);
  const [adminPasswordForm, setAdminPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Promo banner settings state
  const [promoBannerText, setPromoBannerText] = useState('🔥 Buy 1 Year Plan – Get 1 Month Free 🔥 Limited Time Offer! 🔥 Buy 1 Year Plan – Get 1 Month Free 🔥');
  const [promoBannerEnabled, setPromoBannerEnabled] = useState(true);
  const [promoBannerSaving, setPromoBannerSaving] = useState(false);
  
  // Content management states
  const [heroTitle, setHeroTitle] = useState('Secure Your Internet with Kage VPN Store');
  const [heroSubtitle, setHeroSubtitle] = useState('Buy ExpressVPN, NordVPN, and more — fast, safe, and local.');
  const [featuresTitle, setFeaturesTitle] = useState('Why Choose Kage VPN Store?');
  const [featuresSubtitle, setFeaturesSubtitle] = useState('We provide the best VPN services with unmatched quality and support.');
  const [productsTitle, setProductsTitle] = useState('Premium VPN Plans');
  const [productsSubtitle, setProductsSubtitle] = useState('Choose from our selection of premium VPN services');
  const [testimonialsTitle, setTestimonialsTitle] = useState('What Our Customers Say');
  const [testimonialsSubtitle, setTestimonialsSubtitle] = useState('Hear from our satisfied customers about their experience.');
  const [aboutUsText, setAboutUsText] = useState('We are Myanmar\'s trusted VPN key provider, offering premium VPN services at affordable prices with instant delivery and 24/7 support.');
  const [termsOfServiceText, setTermsOfServiceText] = useState('By using our services, you agree to our terms and conditions. Please read carefully before making a purchase.');
  const [privacyPolicyText, setPrivacyPolicyText] = useState('We respect your privacy and are committed to protecting your personal information. This policy explains how we collect and use your data.');
  const [refundPolicyText, setRefundPolicyText] = useState('We offer refunds within 7 days of purchase if the VPN key is not working. Please contact our support team for assistance.');
  const [faqContent, setFaqContent] = useState('Frequently asked questions and answers about our VPN services, delivery process, and support.');
  const [footerText, setFooterText] = useState('© 2024 Kage VPN Store. All rights reserved. Premium VPN keys at your fingertips.');
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    telegram: '',
    viber: '',
    whatsapp: ''
  });
  const [contentSaving, setContentSaving] = useState(false);
  
  const [dashboardData, setDashboardData] = useState<{
    stats: DashboardStat[];
    orders: DashboardOrder[];
    salesData: SalesData[];
    productData: ProductData[];
    loading: boolean;
  }>({
    stats: [],
    orders: [],
    salesData: [],
    productData: [],
    loading: true
  });

  // Notification management
  const showNotification = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      success('Success', message);
    } else {
      error('Error', message);
    }
  };

  const hideNotification = () => {
    // No longer needed with toast notifications
  };

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check authentication and admin role with additional security
  useEffect(() => {
    if (isClient && !authLoading) {
      if (!adminUser) {
        // Clear any potentially stale data
        localStorage.removeItem('admin-user');
        localStorage.removeItem('admin-token');
        router.push('/admin/login');
        return;
      }
      if (!isAdmin) {
        // Log unauthorized access attempt
        console.warn('Unauthorized admin access attempt by user:', adminUser.email);
        router.push('/');
        return;
      }
      
      // Verify token is still valid by making a test API call
      const verifyToken = async () => {
        try {
          const token = localStorage.getItem('admin-token');
          if (!token) {
            throw new Error('No token found');
          }
          
          // Use a simpler endpoint for token verification instead of stats
          const response = await fetch('/api/admin/verify', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('Token verification failed');
          }
        } catch (error) {
          console.warn('Token verification failed, redirecting to login:', error);
          localStorage.removeItem('admin-user');
          localStorage.removeItem('admin-token');
          router.push('/admin/login'); // Redirect to admin login instead of regular login
        }
      };
      
      // Only verify token if we have admin user data and admin role
      if (adminUser && isAdmin) {
        verifyToken();
      }
    }
  }, [adminUser, authLoading, isAdmin, router, isClient]);

  // Fetch dashboard data from API
  useEffect(() => {
    if (isClient && adminUser && isAdmin) {
      fetchDashboardData();
    }
  }, [adminUser, isAdmin, isClient]);

  const fetchDashboardData = async () => {
    try {
      // Get auth token from localStorage or cookies
      const token = localStorage.getItem('admin-token') || document.cookie
        .split('; ')
        .find(row => row.startsWith('admin-token='))
        ?.split('=')[1];

      if (!token) {
        console.error('No admin token found for dashboard stats');
        showNotification('Authentication required. Please login again.', 'error');
        return;
      }

      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        
        // Transform API data to match component structure
        const transformedStats = [
          { 
            title: 'Total Orders', 
            value: data.stats.totalOrders.toLocaleString(), 
            change: '+12%', 
            icon: ShoppingCart, 
            color: 'text-blue-400' 
          },
          { 
            title: 'Revenue', 
            value: `${data.stats.totalRevenue.toLocaleString()} MMK`, 
            change: '+8%', 
            icon: DollarSign, 
            color: 'text-green-400' 
          },
          { 
            title: 'Active Users', 
            value: data.stats.activeUsers.toLocaleString(), 
            change: '+15%', 
            icon: Users, 
            color: 'text-purple-400' 
          },
          { 
            title: 'Total Products', 
            value: data.stats.totalProducts.toLocaleString(), 
            change: '+5%', 
            icon: TrendingUp, 
            color: 'text-orange-400' 
          },
        ];

        // Transform monthly sales data
        const transformedSalesData = data.monthlySales?.map((item: any) => ({
          name: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' }),
          sales: item.sales
        })) || [];

        // Transform product data
        const transformedProductData = data.productStats?.map((item: any, index: number) => ({
          name: item._id,
          value: item.count,
          fill: ['#00f5ff', '#0099ff', '#6666ff', '#ff6666', '#66ff66'][index] || '#cccccc'
        })) || [];

        // Transform orders data
        const transformedOrders = data.recentOrders?.map((order: any) => ({
          id: formatOrderId(order._id),
          fullId: order._id,
          customer: order.userId?.name || 'Unknown',
          email: order.userId?.email || 'N/A',
          product: order.items?.[0]?.name || 'Multiple Items',
          amount: `${order.total?.toLocaleString() || '0'} MMK`,
          status: order.status === 'payment_submitted' ? 'Pending' : 
                  order.status === 'completed' ? 'Completed' : 
                  order.status === 'verified' ? 'Verified' : 'Pending',
          date: new Date(order.orderDate || order.createdAt).toLocaleDateString(),
          items: order.items || [],
          paymentInfo: order.paymentId ? {
            transactionId: order.paymentId.transactionId,
            paymentScreenshot: order.paymentId.paymentScreenshot,
            paymentMethod: order.paymentId.paymentMethod,
            senderName: order.paymentId.senderName,
            senderPhone: order.paymentId.senderPhone,
            status: order.paymentId.status
          } : null
        })) || [];

        setDashboardData({
          stats: transformedStats,
          orders: transformedOrders,
          salesData: transformedSalesData,
          productData: transformedProductData,
          loading: false
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-400 bg-green-400/20';
      case 'Pending': return 'text-orange-400 bg-orange-400/20';
      case 'Verified': return 'text-blue-400 bg-blue-400/20';
      case 'Cancelled': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const filteredOrders = dashboardData.orders.filter(order =>
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Settings handler functions
  const handleMaintenanceToggle = async () => {
    try {
      const newMaintenanceMode = !maintenanceMode;
      console.log('Toggling maintenance mode to:', newMaintenanceMode);
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({
          maintenanceMode: newMaintenanceMode
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Maintenance mode update response:', data);
        setMaintenanceMode(newMaintenanceMode);
        showNotification(
          `Maintenance mode ${newMaintenanceMode ? 'enabled' : 'disabled'} successfully`,
          'success'
        );
      } else {
        const errorData = await response.json();
        console.error('Failed to update maintenance mode:', errorData);
        throw new Error('Failed to update maintenance mode');
      }
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      showNotification('Failed to update maintenance mode', 'error');
    }
  };

  const handleAutoBackupToggle = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({
          autoBackup: !autoBackup
        })
      });

      if (response.ok) {
        setAutoBackup(!autoBackup);
        showNotification(
          `Auto backup ${!autoBackup ? 'enabled' : 'disabled'} successfully`,
          'success'
        );
      } else {
        throw new Error('Failed to update auto backup setting');
      }
    } catch (error) {
      showNotification('Failed to update auto backup setting', 'error');
    }
  };

  const handleEmailNotificationToggle = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({
          emailNotifications: !emailNotifications
        })
      });

      if (response.ok) {
        setEmailNotifications(!emailNotifications);
        showNotification(
          `Email notifications ${!emailNotifications ? 'enabled' : 'disabled'} successfully`,
          'success'
        );
      } else {
        throw new Error('Failed to update email notification setting');
      }
    } catch (error) {
      showNotification('Failed to update email notification setting', 'error');
    }
  };

  const handleSessionTimeoutChange = async (newTimeout: string) => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({
          sessionTimeout: newTimeout
        })
      });

      if (response.ok) {
        setSessionTimeout(newTimeout);
        showNotification('Session timeout updated successfully', 'success');
      } else {
        throw new Error('Failed to update session timeout');
      }
    } catch (error) {
      showNotification('Failed to update session timeout', 'error');
    }
  };

  const handleChangeAdminPassword = async () => {
    if (!adminPasswordForm.currentPassword || !adminPasswordForm.newPassword || !adminPasswordForm.confirmPassword) {
      showNotification('Please fill in all password fields', 'error');
      return;
    }

    if (adminPasswordForm.newPassword !== adminPasswordForm.confirmPassword) {
      showNotification('New passwords do not match', 'error');
      return;
    }

    if (adminPasswordForm.newPassword.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('admin-token');
      const response = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: adminPasswordForm.currentPassword,
          newPassword: adminPasswordForm.newPassword
        }),
      });

      if (response.ok) {
        setShowAdminPasswordModal(false);
        setAdminPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showNotification('Admin password updated successfully!', 'success');
      } else {
        const errorData = await response.json();
        showNotification(errorData.error || 'Failed to update password', 'error');
      }
    } catch (err) {
      console.error('Error updating admin password:', err);
      showNotification('Error updating password', 'error');
    }
  };

  const handleManualBackup = async () => {
    setBackupLoading(true);
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        showNotification(`Backup created successfully: ${result.filename || 'backup.json'}`, 'success');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create backup');
      }
    } catch (error) {
      showNotification(`Failed to create backup: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setBackupLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear the database? This action cannot be undone and will delete all data except admin accounts.'
    );
    
    if (!confirmed) return;

    const confirmation = window.prompt(
      'This is your final warning. All orders, users (except admins), and products will be permanently deleted. Type "CLEAR" to confirm:'
    );
    
    if (confirmation !== 'CLEAR') {
      showNotification('Database clear cancelled', 'error');
      return;
    }

    try {
      const response = await fetch('/api/admin/clear-database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({ confirmation: 'CLEAR' })
      });

      if (response.ok) {
        const result = await response.json();
        showNotification(
          `Database cleared successfully. Deleted: ${result.deletedCounts?.orders || 0} orders, ${result.deletedCounts?.users || 0} users, ${result.deletedCounts?.products || 0} products`,
          'success'
        );
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to clear database');
      }
    } catch (error) {
      showNotification(`Failed to clear database: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  // Promo banner handler functions
  const handlePromoBannerToggle = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({
          promoBannerEnabled: !promoBannerEnabled
        })
      });

      if (response.ok) {
        setPromoBannerEnabled(!promoBannerEnabled);
        showNotification(
          `Promo banner ${!promoBannerEnabled ? 'enabled' : 'disabled'} successfully`,
          'success'
        );
      } else {
        throw new Error('Failed to update promo banner setting');
      }
    } catch (error) {
      showNotification('Failed to update promo banner setting', 'error');
    }
  };

  const handleSavePromoBanner = async () => {
    if (!promoBannerText.trim()) {
      showNotification('Please enter banner text', 'error');
      return;
    }

    setPromoBannerSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({
          promoBannerText: promoBannerText.trim(),
          promoBannerEnabled: promoBannerEnabled
        })
      });

      if (response.ok) {
        showNotification('Promo banner updated successfully', 'success');
      } else {
        throw new Error('Failed to update promo banner');
      }
    } catch (error) {
      showNotification('Failed to update promo banner', 'error');
    } finally {
      setPromoBannerSaving(false);
    }
  };

  const handleSaveContent = async () => {
    setContentSaving(true);
    try {
      console.log('Saving content with data:', {
        heroTitle,
        heroSubtitle,
        featuresTitle,
        featuresSubtitle,
        productsTitle,
        productsSubtitle,
        testimonialsTitle,
        testimonialsSubtitle
      });
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
        },
        body: JSON.stringify({
          heroTitle,
          heroSubtitle,
          featuresTitle,
          featuresSubtitle,
          productsTitle,
          productsSubtitle,
          testimonialsTitle,
          testimonialsSubtitle,
          aboutUsText,
          termsOfServiceText,
          privacyPolicyText,
          refundPolicyText,
          faqContent,
          footerText,
          socialLinks
        })
      });

      if (response.ok) {
        showNotification('Site content updated successfully', 'success');
      } else {
        throw new Error('Failed to update site content');
      }
    } catch (error) {
      showNotification('Failed to update site content', 'error');
    } finally {
      setContentSaving(false);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin-token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const settings = data.settings;
          
          // Load promo banner settings
          if (settings.promoBannerText) {
            setPromoBannerText(settings.promoBannerText);
          }
          if (settings.promoBannerEnabled !== undefined) {
            setPromoBannerEnabled(settings.promoBannerEnabled);
          }
          
          // Load maintenance mode setting
          console.log('Maintenance mode from settings:', settings.maintenanceMode);
          setMaintenanceMode(settings.maintenanceMode === true);
          
          // Load content management settings
          console.log('Loading admin settings:', settings);
          console.log('Features Title from settings:', settings.featuresTitle);
          console.log('Products Title from settings:', settings.productsTitle);
          console.log('Testimonials Title from settings:', settings.testimonialsTitle);
          if (settings.heroTitle) setHeroTitle(settings.heroTitle);
          if (settings.heroSubtitle) setHeroSubtitle(settings.heroSubtitle);
          if (settings.featuresTitle) setFeaturesTitle(settings.featuresTitle);
          if (settings.featuresSubtitle) setFeaturesSubtitle(settings.featuresSubtitle);
          if (settings.productsTitle) setProductsTitle(settings.productsTitle);
          if (settings.productsSubtitle) setProductsSubtitle(settings.productsSubtitle);
          if (settings.testimonialsTitle) setTestimonialsTitle(settings.testimonialsTitle);
          if (settings.testimonialsSubtitle) setTestimonialsSubtitle(settings.testimonialsSubtitle);
          if (settings.aboutUsText) setAboutUsText(settings.aboutUsText);
          if (settings.termsOfServiceText) setTermsOfServiceText(settings.termsOfServiceText);
          if (settings.privacyPolicyText) setPrivacyPolicyText(settings.privacyPolicyText);
          if (settings.refundPolicyText) setRefundPolicyText(settings.refundPolicyText);
          if (settings.faqContent) setFaqContent(settings.faqContent);
          if (settings.footerText) setFooterText(settings.footerText);
          if (settings.socialLinks) setSocialLinks(settings.socialLinks);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    if (isClient && adminUser && isAdmin) {
      loadSettings();
    }
  }, [isClient, adminUser, isAdmin]);

  // Show loading screen while checking authentication
  if (!isClient || authLoading) {
    return (
      <div className="min-h-screen bg-primary-dark text-white flex items-center justify-center" suppressHydrationWarning>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized access message
  if (!adminUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-primary-dark text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-orbitron font-bold mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">
            You don't have permission to access this admin area. Please contact an administrator if you believe this is an error.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-neon-cyan text-primary-dark rounded-lg hover:bg-neon-blue transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-primary-dark text-white">
        <div className="flex">
        {/* Enhanced Sidebar */}
        <div className="w-72 bg-primary-secondary border-r border-gray-700 min-h-screen shadow-2xl">
          <div className="p-6">
            {/* Admin Header */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-neon-cyan mr-2" />
                <Link href="/" className="text-2xl font-orbitron font-bold text-neon-cyan">
                  Kage VPN
                </Link>
              </div>
              <div className="bg-neon-cyan/10 border border-neon-cyan/20 rounded-lg p-3">
                <p className="text-neon-cyan text-sm font-semibold">Admin Dashboard</p>
                <p className="text-gray-400 text-xs" suppressHydrationWarning>Welcome, {adminUser?.name}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-3">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                Main Menu
              </div>
              
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'dashboard' 
                    ? 'bg-neon-cyan text-primary-dark shadow-lg shadow-neon-cyan/20' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                <span className="font-medium">Dashboard</span>
                {activeTab === 'dashboard' && (
                  <div className="ml-auto w-2 h-2 bg-primary-dark rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'orders' 
                    ? 'bg-neon-cyan text-primary-dark shadow-lg shadow-neon-cyan/20' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <ShoppingCart className="h-5 w-5 mr-3" />
                <span className="font-medium">Orders</span>
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {dashboardData.orders.length}
                </span>
                {activeTab === 'orders' && (
                  <div className="ml-2 w-2 h-2 bg-primary-dark rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'products' 
                    ? 'bg-neon-cyan text-primary-dark shadow-lg shadow-neon-cyan/20' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <PieChartIcon className="h-5 w-5 mr-3" />
                <span className="font-medium">Products</span>
                {activeTab === 'products' && (
                  <div className="ml-auto w-2 h-2 bg-primary-dark rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === 'users' 
                    ? 'bg-neon-cyan text-primary-dark shadow-lg shadow-neon-cyan/20' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Users className="h-5 w-5 mr-3" />
                <span className="font-medium">Users</span>
                {activeTab === 'users' && (
                  <div className="ml-auto w-2 h-2 bg-primary-dark rounded-full"></div>
                )}
              </button>

              {/* Management Section */}
              <div className="pt-6">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Management
                </div>
                
                <Link
                  href="/admin/messages"
                  className="w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                >
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span className="font-medium">Support Inbox</span>
                </Link>

                <Link
                  href="/admin/profile"
                  className="w-full flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                >
                  <User className="h-5 w-5 mr-3" />
                  <span className="font-medium">Admin Profile</span>
                </Link>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === 'settings' 
                      ? 'bg-neon-cyan text-primary-dark shadow-lg shadow-neon-cyan/20' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  <span className="font-medium">Settings</span>
                  {activeTab === 'settings' && (
                    <div className="ml-auto w-2 h-2 bg-primary-dark rounded-full"></div>
                  )}
                </button>
              </div>

              {/* System Status */}
              <div className="pt-6">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">System Online</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">All services running</p>
                </div>
              </div>

              {/* Logout Button */}
              <div className="pt-6">
                <button
                  onClick={() => {
                    adminLogout();
                    router.push('/admin/login');
                  }}
                  className="w-full flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-orbitron font-bold mb-2">Dashboard</h1>
                <p className="text-gray-300">Welcome back! Here's what's happening with your VPN store.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardData.loading ? (
                  // Loading skeleton
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-primary-secondary rounded-xl p-6 border border-gray-700 animate-pulse">
                      <div className="h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="h-8 bg-gray-600 rounded mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  ))
                ) : (
                  dashboardData.stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-primary-secondary rounded-xl p-6 border border-gray-700 hover:border-neon-cyan/50 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg bg-gray-800 ${stat.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-gray-400 text-sm">{stat.title}</p>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Sales Chart */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-primary-secondary rounded-xl p-6 border border-gray-700"
                >
                  <h3 className="text-xl font-orbitron font-bold mb-6">Sales Overview</h3>
                  {dashboardData.loading ? (
                    <div className="h-[300px] bg-gray-700 rounded animate-pulse"></div>
                  ) : dashboardData.salesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dashboardData.salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="name" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#00f5ff" 
                          strokeWidth={3}
                          dot={{ fill: '#00f5ff', strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>No sales data available</p>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Product Distribution */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-primary-secondary rounded-xl p-6 border border-gray-700"
                >
                  <h3 className="text-xl font-orbitron font-bold mb-6">Product Distribution</h3>
                  {dashboardData.loading ? (
                    <div className="h-[300px] bg-gray-700 rounded animate-pulse"></div>
                  ) : dashboardData.productData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dashboardData.productData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                        >
                          {dashboardData.productData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>No product data available</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Recent Orders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-primary-secondary rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-orbitron font-bold">Recent Orders</h3>
                  <Link
                    href="#"
                    onClick={() => setActiveTab('orders')}
                    className="text-neon-cyan hover:text-neon-blue transition-colors"
                  >
                    View All
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold">Product</th>
                        <th className="text-left py-3 px-4 font-semibold">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold">Receipt ID</th>
                        <th className="text-left py-3 px-4 font-semibold">Receipt</th>
                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 font-semibold">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.loading ? (
                        // Loading skeleton for table rows
                        Array.from({ length: 5 }).map((_, index) => (
                          <tr key={index} className="border-b border-gray-800">
                            <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                            <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                            <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                            <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                            <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                            <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                            <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                            <td className="py-3 px-4"><div className="h-4 bg-gray-600 rounded animate-pulse"></div></td>
                          </tr>
                        ))
                      ) : (
                        dashboardData.orders.slice(0, 5).map((order) => (
                          <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="py-3 px-4 font-mono text-neon-cyan">{order.id}</td>
                            <td className="py-3 px-4">{order.customer}</td>
                            <td className="py-3 px-4">{order.product}</td>
                            <td className="py-3 px-4 font-semibold">{order.amount} Ks</td>
                            <td className="py-3 px-4 text-gray-400">
                              {order.paymentInfo?.transactionId ? (
                                <div className="font-mono text-sm">
                                  {order.paymentInfo.transactionId}
                                </div>
                              ) : (
                                <span className="text-yellow-400 text-xs">Payment Pending</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {order.paymentInfo?.paymentScreenshot ? (
                                <button
                                  onClick={() => window.open(order.paymentInfo?.paymentScreenshot, '_blank')}
                                  className="text-blue-400 hover:text-blue-300 underline text-sm flex items-center gap-1"
                                >
                                  <Eye className="h-3 w-3" />
                                  View Receipt
                                </button>
                              ) : (
                                <span className="text-gray-500 text-xs">No Receipt</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-400">{order.date}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'orders' && (
            <OrdersManagement searchTerm={searchTerm} setSearchTerm={setSearchTerm} showNotification={showNotification} />
          )}

          {activeTab === 'products' && (
            <ProductsManagement showNotification={showNotification} />
          )}

          {activeTab === 'users' && (
            <UsersManagement showNotification={showNotification} />
          )}

          {activeTab === 'settings' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-orbitron font-bold mb-2">Settings</h1>
                <p className="text-gray-300">Manage system settings and configurations</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* System Settings */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary-secondary rounded-xl p-6 border border-gray-700"
                >
                  <h2 className="text-xl font-semibold mb-4 text-neon-cyan">System Settings</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Maintenance Mode</h3>
                        <p className="text-sm text-gray-400">Enable maintenance mode for system updates</p>
                      </div>
                      <button 
                        onClick={() => handleMaintenanceToggle()}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          maintenanceMode 
                            ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                            : 'bg-gray-600 hover:bg-neon-cyan hover:text-primary-dark'
                        }`}
                      >
                        {maintenanceMode ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Auto Backup</h3>
                        <p className="text-sm text-gray-400">Automatic database backup every 24 hours</p>
                      </div>
                      <button 
                        onClick={() => handleAutoBackupToggle()}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          autoBackup 
                            ? 'bg-neon-cyan text-primary-dark' 
                            : 'bg-gray-600 hover:bg-neon-cyan hover:text-primary-dark'
                        }`}
                      >
                        {autoBackup ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-400">Send email notifications for new orders</p>
                      </div>
                      <button 
                        onClick={() => handleEmailNotificationToggle()}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          emailNotifications 
                            ? 'bg-neon-cyan text-primary-dark' 
                            : 'bg-gray-600 hover:bg-neon-cyan hover:text-primary-dark'
                        }`}
                      >
                        {emailNotifications ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Payment Methods Settings */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-primary-secondary rounded-xl p-6 border border-gray-700"
                >
                  <h2 className="text-xl font-semibold mb-4 text-neon-cyan">Payment Methods Management</h2>
                  <PaymentMethodsSettings showNotification={showNotification} />
                </motion.div>

                {/* Site Content Settings */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-primary-secondary rounded-xl p-6 border border-gray-700"
                >
                  <h2 className="text-xl font-semibold mb-4 text-neon-cyan">Site Content Settings</h2>
                  <div className="space-y-6">
                    {/* Promo Banner Section */}
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Promo Banner</h3>
                      <p className="text-sm text-gray-400 mb-4">Manage the promotional banner on the home page</p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Enable Banner</span>
                          <button 
                            onClick={() => handlePromoBannerToggle()}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              promoBannerEnabled 
                                ? 'bg-neon-cyan text-primary-dark' 
                                : 'bg-gray-600 hover:bg-neon-cyan hover:text-primary-dark'
                            }`}
                          >
                            {promoBannerEnabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Banner Text
                          </label>
                          <textarea
                            value={promoBannerText}
                            onChange={(e) => setPromoBannerText(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan resize-none"
                            rows={2}
                            placeholder="Enter promotional banner text..."
                          />
                        </div>
                        <button 
                          onClick={() => handleSavePromoBanner()}
                          disabled={promoBannerSaving}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                        >
                          {promoBannerSaving ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Banner'
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Hero Section */}
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Hero Section</h3>
                      <p className="text-sm text-gray-400 mb-4">Main title and subtitle on the home page</p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Hero Title
                          </label>
                          <input
                            type="text"
                            value={heroTitle}
                            onChange={(e) => setHeroTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                            placeholder="Enter hero title..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Hero Subtitle
                          </label>
                          <textarea
                            value={heroSubtitle}
                            onChange={(e) => setHeroSubtitle(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan resize-none"
                            rows={2}
                            placeholder="Enter hero subtitle..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Features Section */}
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Features Section</h3>
                      <p className="text-sm text-gray-400 mb-4">Home page features section content</p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Features Title
                          </label>
                          <input
                            type="text"
                            value={featuresTitle}
                            onChange={(e) => setFeaturesTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                            placeholder="Enter features title..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Features Subtitle
                          </label>
                          <textarea
                            value={featuresSubtitle}
                            onChange={(e) => setFeaturesSubtitle(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan resize-none"
                            rows={2}
                            placeholder="Enter features subtitle..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Products Section */}
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Products Section</h3>
                      <p className="text-sm text-gray-400 mb-4">Home page products section content</p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Products Title
                          </label>
                          <input
                            type="text"
                            value={productsTitle}
                            onChange={(e) => setProductsTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                            placeholder="Enter products title..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Products Subtitle
                          </label>
                          <textarea
                            value={productsSubtitle}
                            onChange={(e) => setProductsSubtitle(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan resize-none"
                            rows={2}
                            placeholder="Enter products subtitle..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Testimonials Section */}
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Testimonials Section</h3>
                      <p className="text-sm text-gray-400 mb-4">Home page testimonials section content</p>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Testimonials Title
                          </label>
                          <input
                            type="text"
                            value={testimonialsTitle}
                            onChange={(e) => setTestimonialsTitle(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                            placeholder="Enter testimonials title..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Testimonials Subtitle
                          </label>
                          <textarea
                            value={testimonialsSubtitle}
                            onChange={(e) => setTestimonialsSubtitle(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan resize-none"
                            rows={2}
                            placeholder="Enter testimonials subtitle..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* About Us Section */}
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">About Us</h3>
                      <p className="text-sm text-gray-400 mb-4">About us page content</p>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          About Us Text
                        </label>
                        <textarea
                          value={aboutUsText}
                          onChange={(e) => setAboutUsText(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan resize-none"
                          rows={4}
                          placeholder="Enter about us content..."
                        />
                      </div>
                    </div>

                    {/* Legal Pages */}
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Legal Pages</h3>
                      <p className="text-sm text-gray-400 mb-4">Terms, Privacy, and Refund policy content</p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Terms of Service
                          </label>
                          <textarea
                            value={termsOfServiceText}
                            onChange={(e) => setTermsOfServiceText(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan resize-none"
                            rows={3}
                            placeholder="Enter terms of service..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Privacy Policy
                          </label>
                          <textarea
                            value={privacyPolicyText}
                            onChange={(e) => setPrivacyPolicyText(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan resize-none"
                            rows={3}
                            placeholder="Enter privacy policy..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Refund Policy
                          </label>
                          <textarea
                            value={refundPolicyText}
                            onChange={(e) => setRefundPolicyText(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan resize-none"
                            rows={3}
                            placeholder="Enter refund policy..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">FAQ Content</h3>
                      <p className="text-sm text-gray-400 mb-4">Frequently asked questions content</p>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          FAQ Content
                        </label>
                        <textarea
                          value={faqContent}
                          onChange={(e) => setFaqContent(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan resize-none"
                          rows={4}
                          placeholder="Enter FAQ content..."
                        />
                      </div>
                    </div>

                    {/* Footer Section */}
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Footer Content</h3>
                      <p className="text-sm text-gray-400 mb-4">Footer text and social media links</p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Footer Text
                          </label>
                          <textarea
                            value={footerText}
                            onChange={(e) => setFooterText(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan resize-none"
                            rows={2}
                            placeholder="Enter footer text..."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Facebook URL
                            </label>
                            <input
                              type="url"
                              value={socialLinks.facebook}
                              onChange={(e) => setSocialLinks({...socialLinks, facebook: e.target.value})}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                              placeholder="https://facebook.com/..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Telegram URL
                            </label>
                            <input
                              type="url"
                              value={socialLinks.telegram}
                              onChange={(e) => setSocialLinks({...socialLinks, telegram: e.target.value})}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                              placeholder="https://t.me/..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Viber URL
                            </label>
                            <input
                              type="url"
                              value={socialLinks.viber}
                              onChange={(e) => setSocialLinks({...socialLinks, viber: e.target.value})}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                              placeholder="viber://..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              WhatsApp URL
                            </label>
                            <input
                              type="url"
                              value={socialLinks.whatsapp}
                              onChange={(e) => setSocialLinks({...socialLinks, whatsapp: e.target.value})}
                              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                              placeholder="https://wa.me/..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Save All Content Button */}
                    <div className="flex justify-end">
                      <button 
                        onClick={() => handleSaveContent()}
                        disabled={contentSaving}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                      >
                        {contentSaving ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          'Save All Content'
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Security Settings */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-primary-secondary rounded-xl p-6 border border-gray-700"
                >
                  <h2 className="text-xl font-semibold mb-4 text-neon-cyan">Security Settings</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Change Admin Password</h3>
                      <p className="text-sm text-gray-400 mb-4">Update your admin password for better security</p>
                      <button 
                        onClick={() => setShowAdminPasswordModal(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Change Password
                      </button>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-400 mb-4">Enable 2FA for additional security</p>
                      <button className="bg-gray-600 hover:bg-neon-cyan hover:text-primary-dark px-4 py-2 rounded-lg transition-colors">
                        Setup 2FA
                      </button>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Session Timeout</h3>
                      <p className="text-sm text-gray-400 mb-4">Auto logout after inactivity</p>
                      <select 
                        value={sessionTimeout}
                        onChange={(e) => handleSessionTimeoutChange(e.target.value)}
                        className="bg-gray-700 text-white px-3 py-2 rounded-lg"
                      >
                        <option className="bg-gray-700 text-white">30 minutes</option>
                        <option className="bg-gray-700 text-white">1 hour</option>
                        <option className="bg-gray-700 text-white">2 hours</option>
                        <option className="bg-gray-700 text-white">Never</option>
                      </select>
                    </div>
                  </div>
                </motion.div>

                {/* Database Settings */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-primary-secondary rounded-xl p-6 border border-gray-700"
                >
                  <h2 className="text-xl font-semibold mb-4 text-neon-cyan">Database Management</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Database Status</h3>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-green-400">Connected</span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Manual Backup</h3>
                      <p className="text-sm text-gray-400 mb-4">Create a manual backup of the database</p>
                      <button 
                        onClick={() => handleManualBackup()}
                        disabled={backupLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center"
                      >
                        {backupLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Backup'
                        )}
                      </button>
                    </div>
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <h3 className="font-medium mb-2 text-red-400">Danger Zone</h3>
                      <p className="text-sm text-gray-400 mb-4">Clear all data (irreversible action)</p>
                      <button 
                        onClick={() => handleClearDatabase()}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Clear Database
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Application Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-primary-secondary rounded-xl p-6 border border-gray-700"
                >
                  <h2 className="text-xl font-semibold mb-4 text-neon-cyan">Application Info</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Version:</span>
                          <p className="font-medium">v1.0.0</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Environment:</span>
                          <p className="font-medium">{process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Last Updated:</span>
                          <p className="font-medium">{new Date().toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Uptime:</span>
                          <p className="font-medium">24h 15m</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">System Resources</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Memory Usage:</span>
                          <span>45%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-neon-cyan h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">CPU Usage:</span>
                          <span>23%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
                   )}
          </div>
        </div>
      </div>

      {/* Admin Password Change Modal */}
      <AnimatePresence>
        {showAdminPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-primary-secondary rounded-xl p-6 w-full max-w-md mx-4 border border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-neon-cyan">Change Admin Password</h3>
                <button
                  onClick={() => setShowAdminPasswordModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={adminPasswordForm.currentPassword}
                    onChange={(e) => setAdminPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={adminPasswordForm.newPassword}
                    onChange={(e) => setAdminPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={adminPasswordForm.confirmPassword}
                    onChange={(e) => setAdminPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAdminPasswordModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangeAdminPassword}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Admin Password Change Modal */}
      <AnimatePresence>
        {showAdminPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Change Admin Password</h3>
                <button
                  onClick={() => setShowAdminPasswordModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={adminPasswordForm.currentPassword}
                    onChange={(e) => setAdminPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={adminPasswordForm.newPassword}
                    onChange={(e) => setAdminPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={adminPasswordForm.confirmPassword}
                    onChange={(e) => setAdminPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-neon-cyan"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowAdminPasswordModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangeAdminPassword}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}