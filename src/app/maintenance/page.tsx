'use client';

import { motion } from 'framer-motion';
import { Wrench, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-secondary to-primary-dark flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="mb-8"
        >
          <Wrench className="w-24 h-24 text-neon-cyan mx-auto" />
        </motion.div>

        <h1 className="text-4xl font-bold text-white mb-4">
          Maintenance Mode
        </h1>
        
        <p className="text-gray-300 mb-6 text-lg">
          We’re updating the website to serve you better.
        </p>

        <div className="flex items-center justify-center text-neon-cyan mb-8">
          <Clock className="w-5 h-5 mr-2" />
          <span>Please wait a moment...</span>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <p className="text-sm text-gray-400">
            Important notices:
          </p>
          
          <div className="flex flex-col space-y-2 text-sm">
            <a 
              href="tel:09123456789" 
              className="text-neon-cyan hover:text-white transition-colors"
            >
              📞 09-123-456-789
            </a>
            <a 
              href="mailto:support@kagevpn.com" 
              className="text-neon-cyan hover:text-white transition-colors"
            >
              ✉️ support@kagevpn.com
            </a>
          </div>

          <Link 
            href="/admin"
            className="inline-flex items-center text-gray-400 hover:text-neon-cyan transition-colors mt-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Admin Panel
          </Link>
        </motion.div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8 text-xs text-gray-500"
        >
          © 2024 Kage VPN Store
        </motion.div>
      </motion.div>
    </div>
  );
}