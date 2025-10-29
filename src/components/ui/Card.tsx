'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'neon';
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, children, ...props }, ref) => {
    const baseClasses = 'rounded-xl border transition-all duration-300';
    
    const variants = {
      default: 'bg-primary-secondary/50 backdrop-blur-sm border-gray-700',
      glass: 'bg-white/5 backdrop-blur-md border-white/10',
      neon: 'bg-primary-secondary/30 border-neon-cyan/30 shadow-lg shadow-neon-cyan/10',
    };

    const hoverClasses = hover ? 'hover:border-neon-cyan/50 hover:shadow-lg hover:shadow-neon-cyan/10' : '';

    const CardComponent = hover ? motion.div : 'div';
    const motionProps = hover ? {
      whileHover: { scale: 1.02, y: -2 },
      transition: { duration: 0.2 }
    } : {};

    return (
      <CardComponent
        ref={ref}
        className={cn(baseClasses, variants[variant], hoverClasses, className)}
        {...motionProps}
        {...(props as any)}
      >
        {children}
      </CardComponent>
    );
  }
);

Card.displayName = 'Card';

export { Card };