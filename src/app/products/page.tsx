'use client';

import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AdvancedSearch } from '@/components/ui/SearchBar';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface Product {
  _id: string;
  name: string;
  provider: string;
  duration: string;
  price: number;
  originalPrice?: number;
  features: string[];
  category: 'Premium' | 'Standard';
  isActive: boolean;
  stock: number;
  logo: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

const fallbackProducts: Product[] = [
  // ExpressVPN Products
  {
    _id: '1',
    name: 'ExpressVPN Premium Account',
    provider: 'ExpressVPN',
    duration: '1 Month',
    price: 15000,
    originalPrice: 20000,
    logo: 'https://seeklogo.com/images/E/expressvpn-logo-7A5A5F5F5F-seeklogo.com.png',
    features: ['3000+ servers in 94 countries', 'Ultra-fast speeds', '24/7 customer support', 'No activity logs', '5 simultaneous connections'],
    category: 'Premium' as const,
    rating: 5,
    isActive: true,
    stock: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'ExpressVPN Premium Account',
    provider: 'ExpressVPN',
    duration: '6 Months',
    price: 75000,
    originalPrice: 100000,
    logo: 'https://seeklogo.com/images/E/expressvpn-logo-7A5A5F5F5F-seeklogo.com.png',
    features: ['3000+ servers in 94 countries', 'Ultra-fast speeds', '24/7 customer support', 'No activity logs', '5 simultaneous connections'],
    category: 'Premium' as const,
    rating: 5,
    isActive: true,
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    name: 'ExpressVPN Premium Account',
    provider: 'ExpressVPN',
    duration: '1 Year',
    price: 120000,
    originalPrice: 180000,
    logo: 'https://seeklogo.com/images/E/expressvpn-logo-7A5A5F5F5F-seeklogo.com.png',
    features: ['3000+ servers in 94 countries', 'Ultra-fast speeds', '24/7 customer support', 'No activity logs', '5 simultaneous connections'],
    category: 'Premium' as const,
    rating: 5,
    isActive: true,
    stock: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // NordVPN Products
  {
    _id: '4',
    name: 'NordVPN Premium Account',
    provider: 'NordVPN',
    duration: '1 Month',
    price: 12000,
    originalPrice: 18000,
    logo: 'https://seeklogo.com/images/N/nordvpn-logo-B1B4F8E5F5-seeklogo.com.png',
    features: ['5400+ servers in 59 countries', 'Double VPN encryption', 'CyberSec ad blocker', 'No logs policy', '6 simultaneous connections'],
    category: 'Premium' as const,
    rating: 4.8,
    isActive: true,
    stock: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '5',
    name: 'NordVPN Premium Account',
    provider: 'NordVPN',
    duration: '6 Months',
    price: 60000,
    originalPrice: 90000,
    logo: 'https://seeklogo.com/images/N/nordvpn-logo-B1B4F8E5F5-seeklogo.com.png',
    features: ['5400+ servers in 59 countries', 'Double VPN encryption', 'CyberSec ad blocker', 'No logs policy', '6 simultaneous connections'],
    category: 'Premium' as const,
    rating: 4.8,
    isActive: true,
    stock: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6',
    name: 'NordVPN Premium Account',
    provider: 'NordVPN',
    duration: '1 Year',
    price: 100000,
    originalPrice: 150000,
    logo: 'https://seeklogo.com/images/N/nordvpn-logo-B1B4F8E5F5-seeklogo.com.png',
    features: ['5400+ servers in 59 countries', 'Double VPN encryption', 'CyberSec ad blocker', 'No logs policy', '6 simultaneous connections'],
    category: 'Premium' as const,
    rating: 4.8,
    isActive: true,
    stock: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Surfshark Products
  {
    _id: '7',
    name: 'Surfshark Premium Account',
    provider: 'Surfshark',
    duration: '1 Month',
    price: 10000,
    originalPrice: 15000,
    logo: 'https://iconduck.com/api/icons/1959/download?format=png&size=256',
    features: ['3200+ servers in 65 countries', 'Unlimited simultaneous connections', 'CleanWeb ad blocker', 'No logs policy', 'MultiHop feature'],
    category: 'Standard' as const,
    rating: 4.7,
    isActive: true,
    stock: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '8',
    name: 'Surfshark Premium Account',
    provider: 'Surfshark',
    duration: '6 Months',
    price: 50000,
    originalPrice: 75000,
    logo: 'https://iconduck.com/api/icons/1959/download?format=png&size=256',
    features: ['3200+ servers in 65 countries', 'Unlimited simultaneous connections', 'CleanWeb ad blocker', 'No logs policy', 'MultiHop feature'],
    category: 'Standard' as const,
    rating: 4.7,
    isActive: true,
    stock: 35,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '9',
    name: 'Surfshark Premium Account',
    provider: 'Surfshark',
    duration: '1 Year',
    price: 80000,
    originalPrice: 120000,
    logo: 'https://iconduck.com/api/icons/1959/download?format=png&size=256',
    features: ['3200+ servers in 65 countries', 'Unlimited simultaneous connections', 'CleanWeb ad blocker', 'No logs policy', 'MultiHop feature'],
    category: 'Standard' as const,
    rating: 4.7,
    isActive: true,
    stock: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // CyberGhost Products
  {
    _id: '10',
    name: 'CyberGhost Premium Account',
    provider: 'CyberGhost',
    duration: '1 Month',
    price: 8000,
    originalPrice: 12000,
    logo: 'https://seeklogo.com/images/C/cyberghost-vpn-logo-B1B4F8E5F5-seeklogo.com.png',
    features: ['7000+ servers in 91 countries', 'Streaming optimized servers', 'Ad blocker included', 'No logs policy', '7 simultaneous connections'],
    category: 'Standard' as const,
    rating: 4.6,
    isActive: true,
    stock: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'All',
    priceRange: 'All',
    sortBy: 'name',
    rating: 0
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || fallbackProducts);
        } else {
          console.error('Failed to fetch products');
          setProducts(fallbackProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  


  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         product.duration.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         product.features.some(feature => 
                           feature.toLowerCase().includes(filters.searchTerm.toLowerCase())
                         );
    
    const matchesCategory = filters.category === 'All' || product.category === filters.category;
    
    const matchesPrice = filters.priceRange === 'All' ||
                        (filters.priceRange === 'Low' && product.price < 30000) ||
                        (filters.priceRange === 'Medium' && product.price >= 30000 && product.price < 80000) ||
                        (filters.priceRange === 'High' && product.price >= 80000);
    
    const matchesRating = filters.rating === 0 || product.rating >= filters.rating;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesRating && product.isActive;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-primary-dark pt-20">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold text-white mb-4 sm:mb-6">
              Premium <span className="text-neon-cyan">VPN Accounts</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
              Secure, fast, and reliable VPN accounts from top providers. 
              Get instant access to premium features at unbeatable prices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 sm:py-8 bg-primary-secondary/30">
        <div className="container mx-auto px-4">
          <AdvancedSearch
            searchValue={filters.searchTerm}
            onSearchChange={(value) => setFilters(prev => ({ ...prev, searchTerm: value }))}
            filters={[
              {
                label: 'Category',
                value: filters.category,
                options: [
                  { label: 'All Categories', value: 'All' },
                  { label: 'Premium', value: 'Premium' },
                  { label: 'Standard', value: 'Standard' }
                ],
                onChange: (value) => setFilters(prev => ({ ...prev, category: value }))
              },
              {
                label: 'Price Range',
                value: filters.priceRange,
                options: [
                  { label: 'All Prices', value: 'All' },
                  { label: 'Under 30,000 Ks', value: 'Low' },
                  { label: '30,000 - 80,000 Ks', value: 'Medium' },
                  { label: 'Above 80,000 Ks', value: 'High' }
                ],
                onChange: (value) => setFilters(prev => ({ ...prev, priceRange: value }))
              },
              {
                label: 'Sort By',
                value: filters.sortBy,
                options: [
                  { label: 'Name', value: 'name' },
                  { label: 'Price: Low to High', value: 'price-low' },
                  { label: 'Price: High to Low', value: 'price-high' },
                  { label: 'Rating', value: 'rating' }
                ],
                onChange: (value) => setFilters(prev => ({ ...prev, sortBy: value }))
              }
            ]}
            placeholder="Search VPN or duration..."
            showResults={true}
            resultCount={filteredProducts.length}
            totalCount={products.length}
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
              <p className="text-gray-400 mt-4">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-primary-secondary rounded-xl p-6 border border-primary-accent hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/10"
                >
                  <div className="text-center mb-6">
                    <div className="mb-4 flex justify-center">
                      {product.logo && (product.logo.startsWith('/images/') || product.logo.startsWith('http')) ? (
                        <>
                          <img 
                            src={product.logo} 
                            alt={`${product.provider} logo`}
                            className="h-16 w-auto object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallbackSpan = target.parentElement?.querySelector('.fallback-emoji') as HTMLSpanElement;
                              if (fallbackSpan) {
                                fallbackSpan.style.display = 'block';
                              }
                            }}
                          />
                          <div className="text-4xl fallback-emoji hidden">{product.logo || '🔐'}</div>
                        </>
                      ) : (
                        <div className="text-4xl">{product.logo || '🔐'}</div>
                      )}
                    </div>
                    <h3 className="text-xl font-orbitron font-bold text-white mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 mb-2">{product.duration}</p>
                    <div className="flex items-center justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="text-gray-400 ml-2 text-sm">({product.rating})</span>
                    </div>
                    <div className="text-3xl font-bold text-neon-cyan mb-4">
                      {product.price.toLocaleString()} <span className="text-lg text-gray-400">MMK</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300 text-sm">
                        <Check className="h-4 w-4 text-neon-cyan mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href={`/payment/product/${product._id}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300"
                    >
                      Buy Now
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
      </div>
    </ErrorBoundary>
  );
}