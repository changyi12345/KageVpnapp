'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-primary-dark text-white flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
            </motion.div>
            
            <h1 className="text-2xl font-orbitron font-bold mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-300 mb-6">
              We encountered an unexpected error. Don't worry, our team has been notified.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-primary-secondary p-4 rounded-lg border border-gray-600">
                <summary className="cursor-pointer text-red-400 font-semibold mb-2">
                  Error Details (Development)
                </summary>
                <pre className="text-xs text-gray-300 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center px-6 py-3 bg-neon-cyan text-primary-dark font-semibold rounded-lg hover:bg-neon-cyan/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </motion.button>

              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center px-6 py-3 bg-primary-secondary text-white font-semibold rounded-lg hover:bg-primary-secondary/80 transition-colors border border-gray-600"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </motion.button>
              </Link>

              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex items-center justify-center px-6 py-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Report Issue
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for handling async errors
export function useErrorHandler() {
  const handleError = (error: Error, errorInfo?: string) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // You can integrate with error reporting services here
    // Example: Sentry, LogRocket, etc.
  };

  return { handleError };
}

// Component for displaying inline errors
interface ErrorMessageProps {
  error: string | Error;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ error, onRetry, className = "" }: ErrorMessageProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 bg-red-500/10 border border-red-500/20 rounded-lg ${className}`}
    >
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-400 font-medium">Error</p>
          <p className="text-gray-300 text-sm mt-1">{errorMessage}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-neon-cyan hover:text-neon-cyan/80 transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}