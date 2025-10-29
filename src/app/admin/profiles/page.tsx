'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, User, Mail, Phone, MapPin, Calendar, Edit, Trash2 } from 'lucide-react';

interface Profile {
  _id: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
  } | null;
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
  preferences?: {
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

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      // Get admin token from localStorage for authentication
      const adminToken = localStorage.getItem('admin-token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add Authorization header if admin token exists
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }
      
      // This would be a new API endpoint for admin to fetch all profiles
      const response = await fetch('/api/admin/profiles', {
        method: 'GET',
        headers,
      });
      
      if (response.ok) {
        const data = await response.json();
        // Make sure we're setting an array
        setProfiles(Array.isArray(data.profiles) ? data.profiles : []);
      } else {
        console.error('Failed to fetch profiles:', response.status);
        setProfiles([]);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = Array.isArray(profiles) ? profiles.filter(profile => {
    const matchesSearch = 
      profile.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && profile.subscription?.status === 'active') ||
      (filterStatus === 'inactive' && (!profile.subscription || profile.subscription.status !== 'active'));
    
    return matchesSearch && matchesFilter;
  }) : [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">User Profiles</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          >
            <option value="all" className="bg-white text-gray-900">All Profiles</option>
            <option value="active" className="bg-white text-gray-900">Active Subscribers</option>
            <option value="inactive" className="bg-white text-gray-900">Inactive Users</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Profiles</p>
                <p className="text-2xl font-bold text-gray-900">{profiles.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <User className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(profiles) ? profiles.filter(p => p.subscription?.status === 'active').length : 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Newsletter Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(profiles) ? profiles.filter(p => p.preferences?.newsletter).length : 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Complete Profiles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(profiles) ? profiles.filter(p => p.address?.country && p.phone).length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profiles Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preferences
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProfiles.map((profile) => (
                <tr key={profile._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {profile.firstName} {profile.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{profile.userId?.email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{profile.phone || 'N/A'}</div>
                    <div className="text-sm text-gray-500">
                      {profile.preferences?.language?.toUpperCase() || 'EN'} | {profile.preferences?.currency || 'USD'}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {profile.address?.city || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {profile.address?.country || 'N/A'}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {profile.subscription ? (
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          profile.subscription.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {profile.subscription.status}
                        </span>
                        <div className="text-sm text-gray-500 mt-1 capitalize">
                          {profile.subscription.plan}
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        No subscription
                      </span>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {profile.preferences?.newsletter && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Newsletter
                        </span>
                      )}
                      {profile.preferences?.notifications && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Notifications
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No profiles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria.' : 'No user profiles available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}