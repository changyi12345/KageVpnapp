'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  Download,
  ArrowLeft,
  User,
  Calendar,
  DollarSign,
  FileText,
  AlertTriangle,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/Toast';

interface Payment {
  _id: string;
  orderId: {
    _id: string;
    orderId: string;
    userId: {
      name: string;
      email: string;
    };
    total: number;
    status: string;
  };
  paymentMethod: string;
  transactionId: string;
  senderName: string;
  senderPhone: string;
  amount: number;
  proofImage: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  verificationNotes?: string;
}

export default function AdminPaymentsPage() {
  const { adminUser, isAdmin, loading: authLoading } = useAdminAuth();
  const router = useRouter();
  const { toasts, removeToast, success, error } = useToast();
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (!authLoading && (!adminUser || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [adminUser, isAdmin, authLoading, router]);

  // Fetch payments
  useEffect(() => {
    if (adminUser && isAdmin) {
      fetchPayments();
    }
  }, [adminUser, isAdmin, currentPage, statusFilter, searchTerm]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: statusFilter,
        search: searchTerm,
      });

      const token = localStorage.getItem('admin-token');
      const response = await fetch(`/api/admin/payments?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
        setTotalPages(data.totalPages || 1);
      } else {
        error('Error', 'Payment များ ရယူ၍မရပါ');
      }
    } catch (err) {
      error('Error', 'Network error ဖြစ်နေပါတယ်');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId: string, status: 'approved' | 'rejected') => {
    try {
      setProcessingPayment(paymentId);
      
      const response = await fetch('/api/admin/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          status,
          notes: verificationNotes,
        }),
      });

      if (response.ok) {
        success(
          'Payment Verified',
          `Payment ${status === 'approved' ? 'approved' : 'rejected'} successfully`
        );
        setShowModal(false);
        setSelectedPayment(null);
        setVerificationNotes('');
        fetchPayments();
      } else {
        const data = await response.json();
        error('Verification Failed', data.error);
      }
    } catch (err) {
      error('Error', 'Network error ဖြစ်နေပါတယ်');
    } finally {
      setProcessingPayment(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MMK',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (authLoading || !adminUser || !isAdmin) {
    return (
      <div className="min-h-screen bg-primary-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Removed global styled-jsx rule that hid nav */}
      {/* 
      <style jsx global>{`
        nav[class*="sticky top-0"] {
          display: none !important;
        }
      `}</style>
      */}
      <div className="min-h-screen bg-primary-dark text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link
                href="/admin"
                className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-orbitron font-bold">Payment Management</h1>
                <p className="text-gray-300">Verify and manage payment submissions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-neon-cyan" />
              <span className="text-neon-cyan font-semibold">Admin Panel</span>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-primary-secondary rounded-xl p-6 border border-gray-700 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by transaction ID, sender name, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                >
                  <option value="all" className="bg-gray-800 text-white">All Status</option>
                  <option value="pending" className="bg-gray-800 text-white">Pending</option>
                  <option value="approved" className="bg-gray-800 text-white">Approved</option>
                  <option value="rejected" className="bg-gray-800 text-white">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-primary-secondary rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Payment Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-4 bg-gray-600 rounded animate-pulse"></div>
                        </td>
                      </tr>
                    ))
                  ) : payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                        <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No payments found</p>
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-800/30">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-neon-cyan">
                              {payment.transactionId}
                            </p>
                            <p className="text-sm text-gray-400">
                              {payment.paymentMethod}
                            </p>
                            <p className="text-sm text-gray-400">
                              Order: {payment.orderId.orderId}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{payment.senderName}</p>
                            <p className="text-sm text-gray-400">{payment.senderPhone}</p>
                            <p className="text-sm text-gray-400">{payment.orderId.userId?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{formatCurrency(payment.amount)}</p>
                            <p className="text-sm text-gray-400">
                              Order: {formatCurrency(payment.orderId.total)}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm">
                            {new Date(payment.submittedAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-400">
                            {new Date(payment.submittedAt).toLocaleTimeString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setShowModal(true);
                            }}
                            className="inline-flex items-center px-3 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Review Modal */}
        {showModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-primary-secondary rounded-xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-orbitron font-bold">Payment Review</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Payment Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-neon-cyan">Payment Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Transaction ID:</span>
                          <span className="font-medium">{selectedPayment.transactionId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment Method:</span>
                          <span>{selectedPayment.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Amount:</span>
                          <span className="font-medium">{formatCurrency(selectedPayment.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sender Name:</span>
                          <span>{selectedPayment.senderName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Sender Phone:</span>
                          <span>{selectedPayment.senderPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          {getStatusBadge(selectedPayment.status)}
                        </div>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-neon-cyan">Order Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Order ID:</span>
                          <span className="font-medium">{selectedPayment.orderId.orderId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Customer:</span>
                          <span>{selectedPayment.orderId.userId?.name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span>{selectedPayment.orderId.userId?.email || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Order Total:</span>
                          <span className="font-medium">{formatCurrency(selectedPayment.orderId.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Proof */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-neon-cyan">Payment Proof</h3>
                    {selectedPayment.proofImage ? (
                      <div className="border border-gray-600 rounded-lg overflow-hidden">
                        <img
                          src={selectedPayment.proofImage}
                          alt="Payment Proof"
                          className="w-full h-64 object-cover"
                        />
                        <div className="p-3 bg-gray-800/50">
                          <a
                            href={selectedPayment.proofImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-neon-cyan hover:text-neon-blue transition-colors"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Full Image
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-gray-600 rounded-lg p-8 text-center text-gray-400">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No payment proof uploaded</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Notes */}
                {selectedPayment.status === 'pending' && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Verification Notes (Optional)
                    </label>
                    <textarea
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      placeholder="Add notes about this payment verification..."
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:border-transparent"
                    />
                  </div>
                )}

                {/* Previous Verification Info */}
                {selectedPayment.verifiedAt && (
                  <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                    <h4 className="font-medium mb-2">Verification History</h4>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>Verified at: {new Date(selectedPayment.verifiedAt).toLocaleString()}</p>
                      {selectedPayment.verificationNotes && (
                        <p>Notes: {selectedPayment.verificationNotes}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {selectedPayment.status === 'pending' && (
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={() => handleVerifyPayment(selectedPayment._id, 'approved')}
                      disabled={processingPayment === selectedPayment._id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {processingPayment === selectedPayment._id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Approve Payment
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleVerifyPayment(selectedPayment._id, 'rejected')}
                      disabled={processingPayment === selectedPayment._id}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {processingPayment === selectedPayment._id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 mr-2" />
                          Reject Payment
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </>
  );
}