'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Globe, Star, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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

interface HomeProduct extends Product {
  popular?: boolean;
}

const fallbackProducts: HomeProduct[] = [
  {
    _id: '1',
    name: 'ExpressVPN',
    provider: 'ExpressVPN',
    duration: '1 Month',
    price: 15000,
    logo: '🛡️',
    features: ['Ultra-fast speeds', '94 countries', '24/7 support'],
    category: 'Premium' as const,
    rating: 4.8,
    isActive: true,
    stock: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    popular: false,
  },
  {
    _id: '2',
    name: 'NordVPN',
    provider: 'NordVPN',
    duration: '6 Months',
    price: 45000,
    logo: '🔒',
    features: ['Double VPN', '59 countries', 'CyberSec'],
    category: 'Premium' as const,
    rating: 4.9,
    isActive: true,
    stock: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    popular: true,
  },
  {
    _id: '3',
    name: 'Surfshark',
    provider: 'Surfshark',
    duration: '12 Months',
    price: 80000,
    logo: '🦈',
    features: ['Unlimited devices', '65 countries', 'CleanWeb'],
    category: 'Premium' as const,
    rating: 4.7,
    isActive: true,
    stock: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    popular: false,
  },
];

const testimonials = [
  {
    name: 'Aung Kyaw',
    rating: 5,
    comment: 'Fast delivery and working perfectly! Highly recommended.',
  },
  {
    name: 'Thida Win',
    rating: 5,
    comment: 'Great service, got my VPN key within minutes.',
  },
  {
    name: 'Min Khant',
    rating: 5,
    comment: 'Affordable prices and excellent customer support.',
  },
];

export default function HomePage(props: { params: any; searchParams: any }) {
  const [allProducts, setAllProducts] = useState<HomeProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<HomeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [promoBannerText, setPromoBannerText] = useState('🔥 Buy 1 Year Plan – Get 1 Month Free 🔥 Limited Time Offer! 🔥 Buy 1 Year Plan – Get 1 Month Free 🔥');
  const [promoBannerEnabled, setPromoBannerEnabled] = useState(true);
  const [heroTitle, setHeroTitle] = useState('Secure Your Internet with Kage VPN Store');
  const [heroSubtitle, setHeroSubtitle] = useState('Buy ExpressVPN, NordVPN, and more — fast, safe, and local.');
  const [featuresTitle, setFeaturesTitle] = useState('Why Choose Kage VPN Store?');
  const [featuresSubtitle, setFeaturesSubtitle] = useState('We provide the best VPN services with unmatched quality and support.');
  const [productsTitle, setProductsTitle] = useState('Premium VPN Plans');
  const [productsSubtitle, setProductsSubtitle] = useState('Choose from our selection of premium VPN services');
  const [testimonialsTitle, setTestimonialsTitle] = useState('What Our Customers Say');
  const [testimonialsSubtitle, setTestimonialsSubtitle] = useState('Hear from our satisfied customers about their experience.');
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          // The API returns { products: [...], totalPages, currentPage, total, categories }
          const products = data.products || [];
          // Convert Product[] to HomeProduct[] and add popular property
          const homeProducts: HomeProduct[] = products.map((product: Product) => ({
            ...product,
            popular: product.category === 'Premium'
          }));
          setAllProducts(homeProducts);
          // Display first 3 products initially
          setDisplayedProducts(homeProducts.slice(0, 3));
        } else {
          setAllProducts(fallbackProducts);
          setDisplayedProducts(fallbackProducts.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts(fallbackProducts);
        setDisplayedProducts(fallbackProducts.slice(0, 3));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log('Fetching settings from /api/settings...');
        const response = await fetch('/api/settings', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        console.log('Settings response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Settings data received:', data);
          
          if (data.settings) {
            // Check for maintenance mode first
            if (data.settings.maintenanceMode) {
              window.location.href = '/maintenance';
              return;
            }
            
            console.log('Current promoBannerText:', promoBannerText);
            console.log('New promoBannerText from API:', data.settings.promoBannerText);
            console.log('promoBannerEnabled from API:', data.settings.promoBannerEnabled);
            console.log('Raw settings object:', JSON.stringify(data.settings, null, 2));
            
            setPromoBannerText(data.settings.promoBannerText);
            setPromoBannerEnabled(data.settings.promoBannerEnabled);
            setHeroTitle(data.settings.heroTitle || 'Secure Your Internet with Kage VPN Store');
            setHeroSubtitle(data.settings.heroSubtitle || 'Buy ExpressVPN, NordVPN, and more — fast, safe, and local.');
            setFeaturesTitle(data.settings.featuresTitle || 'Why Choose Kage VPN Store?');
            setFeaturesSubtitle(data.settings.featuresSubtitle || 'We provide the best VPN services with unmatched quality and support.');
            setProductsTitle(data.settings.productsTitle || 'Premium VPN Plans');
            setProductsSubtitle(data.settings.productsSubtitle || 'Choose from our selection of premium VPN services');
            setTestimonialsTitle(data.settings.testimonialsTitle || 'What Our Customers Say');
            setTestimonialsSubtitle(data.settings.testimonialsSubtitle || 'Hear from our satisfied customers about their experience.');
            setSettingsLoaded(true);
            
            // Force a re-render by updating the DOM
            console.log('Settings loaded:', {
              featuresTitle: data.settings.featuresTitle,
              productsTitle: data.settings.productsTitle,
              testimonialsTitle: data.settings.testimonialsTitle
            });
            setTimeout(() => {
              console.log('Settings updated, promoBannerText is now:', data.settings.promoBannerText);
              console.log('State values after update:', {
                promoBannerText,
                promoBannerEnabled,
                heroTitle,
                featuresTitle,
                productsTitle,
                testimonialsTitle
              });
            }, 100);
          }
        } else {
          console.error('Failed to fetch settings, status:', response.status);
          const errorText = await response.text();
          console.error('Error response body:', errorText);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        console.error('Error details:', (error as Error).message, (error as Error).stack);
        // Use default values if fetch fails
      }
    };

    fetchSettings();
  }, []);

  // Auto-rotate products every 2 minutes (120000ms)
  useEffect(() => {
    if (allProducts.length <= 3) return; // No need to rotate if 3 or fewer products

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 3) % allProducts.length;
        const nextProducts = [];
        
        // Get next 3 products, wrapping around if necessary
        for (let i = 0; i < 3; i++) {
          const productIndex = (nextIndex + i) % allProducts.length;
          nextProducts.push(allProducts[productIndex]);
        }
        
        setDisplayedProducts(nextProducts);
        return nextIndex;
      });
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [allProducts]);

  return (
    <div suppressHydrationWarning className="min-h-screen bg-primary-dark text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/10 to-neon-blue/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-orbitron font-bold mb-4 sm:mb-6 px-4">
              {heroTitle.includes('Kage VPN Store') ? (
                <>
                  {heroTitle.split('Kage VPN Store')[0]}
                  <span className="text-neon-cyan">Kage VPN Store</span>
                  {heroTitle.split('Kage VPN Store')[1]}
                </>
              ) : (
                heroTitle
              )}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              {heroSubtitle}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/products"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark font-semibold rounded-lg hover:shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300 text-sm sm:text-base"
              >
                Shop Now
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Promo Banner */}
      {promoBannerEnabled && settingsLoaded && (
        <section className="py-2 sm:py-4 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 overflow-hidden">
          <motion.div
            key={promoBannerText}
            animate={{ x: [-1000, 1000] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap"
          >
            <span className="text-sm sm:text-lg font-semibold text-neon-cyan px-4">
              {promoBannerText}
            </span>
          </motion.div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold mb-4">
              {featuresTitle}
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-4 px-4">
              {featuresSubtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-4 sm:p-6 rounded-lg bg-primary-light/20 border border-neon-cyan/20"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary-dark" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-300 text-sm sm:text-base">Premium VPN services with military-grade encryption to protect your online privacy.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-4 sm:p-6 rounded-lg bg-primary-light/20 border border-neon-cyan/20"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-primary-dark" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-300 text-sm sm:text-base">Instant delivery and activation of your VPN accounts with 24/7 customer support.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-4 sm:p-6 rounded-lg bg-primary-light/20 border border-neon-cyan/20"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-primary-dark" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-300 text-sm sm:text-base">Competitive pricing on all premium VPN services with local payment options.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VPN Products */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold mb-4">
              {productsTitle}
            </h2>
            <p className="text-gray-300 text-base sm:text-lg mb-4 px-4">
              {productsSubtitle}
            </p>
            {allProducts.length > 3 && (
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-gray-400">
                <span>Showing {Math.floor(currentIndex / 3) + 1} of {Math.ceil(allProducts.length / 3)} sets</span>
                <div className="flex space-x-2">
                  {Array.from({ length: Math.ceil(allProducts.length / 3) }).map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        Math.floor(currentIndex / 3) === index ? 'bg-neon-cyan' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-neon-cyan text-center">Auto-rotating every 2 minutes</span>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-primary-secondary rounded-xl p-6 border border-gray-700 animate-pulse">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-600 rounded w-20 mx-auto"></div>
                  </div>
                  <div className="text-center mb-6">
                    <div className="h-8 bg-gray-600 rounded w-24 mx-auto"></div>
                  </div>
                  <div className="space-y-3 mb-8">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="h-4 bg-gray-600 rounded"></div>
                    ))}
                  </div>
                  <div className="h-12 bg-gray-600 rounded"></div>
                </div>
              ))
            ) : (
              displayedProducts.map((product, index) => {
                const isPopular = product.popular || product.category === 'Premium';
                const logoDisplay = product.logo && (product.logo.startsWith('/images/') || product.logo.startsWith('http')) 
                  ? (
                    <img 
                      src={product.logo} 
                      alt={`${product.name} logo`} 
                      className="w-16 h-16 object-contain mx-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallbackSpan = target.parentElement?.querySelector('.fallback-emoji') as HTMLSpanElement;
                        if (fallbackSpan) {
                          fallbackSpan.style.display = 'block';
                        }
                      }}
                    />
                  ) : null;

                return (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -10 }}
                    className={`relative bg-primary-secondary rounded-xl p-6 border ${
                      isPopular 
                        ? 'border-neon-cyan shadow-lg shadow-neon-cyan/25' 
                        : 'border-gray-700 hover:border-neon-cyan/50'
                    } transition-all duration-300`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <div className="mb-4 flex justify-center items-center h-16">
                        {logoDisplay}
                        <span className={`text-4xl fallback-emoji ${logoDisplay ? 'hidden' : 'block'}`}>
                          {product.logo || '🔐'}
                        </span>
                      </div>
                      <h3 className="text-2xl font-orbitron font-bold mb-2">{product.name}</h3>
                      <p className="text-gray-300">{product.duration}</p>
                    </div>

                    <div className="text-center mb-6">
                      <span className="text-3xl font-bold text-neon-cyan">{product.price.toLocaleString()}</span>
                      <span className="text-gray-300 ml-1">Ks</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-gray-300">
                          <Check className="h-5 w-5 text-neon-cyan mr-3" />
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
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-orbitron font-bold mb-4">
              {testimonialsTitle}
            </h2>
            {testimonialsSubtitle && (
              <p className="text-gray-300 text-base sm:text-lg mb-4 px-4">
                {testimonialsSubtitle}
              </p>
            )}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-primary-dark rounded-xl p-4 sm:p-6 border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">"{testimonial.comment}"</p>
                <p className="font-semibold text-neon-cyan text-sm sm:text-base">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Chat Button */}
      <motion.div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button className="bg-gradient-to-r from-neon-cyan to-neon-blue text-primary-dark p-3 sm:p-4 rounded-full shadow-lg hover:shadow-neon-cyan/25 transition-all duration-300">
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 4.975 0 11.111c0 3.497 1.745 6.616 4.472 8.652L4.086 24l4.772-2.498C10.125 21.852 11.055 22 12 22c6.626 0 12-4.975 12-11.111C24 4.975 18.626 0 12 0z"/>
          </svg>
        </button>
      </motion.div>
    </div>
  );
}
