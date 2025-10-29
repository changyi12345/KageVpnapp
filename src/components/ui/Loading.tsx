'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function Loading({ size = 'md', text, className = '' }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="flex items-center"
      >
        <Loader2 className={`${sizeClasses[size]} text-neon-cyan`} />
      </motion.div>
      {text && (
        <span className="ml-2 text-gray-300 text-sm">{text}</span>
      )}
    </div>
  );
}

export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`inline-block ${className}`}
    >
      <Loader2 className="h-4 w-4 text-neon-cyan" />
    </motion.div>
  );
}

export function LoadingOverlay({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-primary-dark border border-primary-secondary rounded-lg p-6 flex flex-col items-center">
        <Loading size="lg" />
        <p className="mt-4 text-gray-300">{text}</p>
      </div>
    </div>
  );
}

// Loading Skeleton Component
interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`bg-primary-secondary rounded ${className}`}
        />
      ))}
    </>
  );
}

// Loading Button Component
interface LoadingButtonProps {
  loading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export function LoadingButton({ 
  loading, 
  children, 
  onClick, 
  disabled, 
  className = '',
  type = 'button'
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`relative inline-flex items-center justify-center px-6 py-3 bg-neon-cyan text-primary-dark font-semibold rounded-xl hover:bg-neon-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${className}`}
    >
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="absolute left-4"
        >
          <Loader2 className="h-4 w-4" />
        </motion.div>
      )}
      <span className={loading ? 'ml-6' : ''}>
        {children}
      </span>
    </button>
  );
}