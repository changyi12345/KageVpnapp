import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function generateOrderId(): string {
  return 'KVS-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Format order ID consistently across admin and user interfaces
export function formatOrderId(orderId: string): string {
  if (!orderId) return 'N/A';
  
  // If it's already formatted with prefix, return as is
  if (orderId.includes('-')) {
    return orderId.toUpperCase();
  }
  
  // For MongoDB ObjectId, take last 8 characters and add prefix
  const shortId = orderId.slice(-8).toUpperCase();
  return `KVS-${shortId}`;
}