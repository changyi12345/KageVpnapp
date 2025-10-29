import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Import token blacklist check (would be better to use a shared service in production)
let isTokenBlacklisted: ((token: string) => boolean) | null = null;

// Set blacklist checker (called from logout route)
export function setTokenBlacklistChecker(checker: (token: string) => boolean) {
  isTokenBlacklisted = checker;
}

export function checkRateLimit(email: string): { allowed: boolean; remainingAttempts?: number; lockoutTime?: number } {
  const now = Date.now();
  const attempts = loginAttempts.get(email);
  
  if (!attempts) {
    return { allowed: true };
  }
  
  // Reset attempts if lockout period has passed
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(email);
    return { allowed: true };
  }
  
  // Check if max attempts exceeded
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    const remainingLockout = LOCKOUT_DURATION - (now - attempts.lastAttempt);
    return { 
      allowed: false, 
      lockoutTime: Math.ceil(remainingLockout / 1000 / 60) // minutes
    };
  }
  
  return { 
    allowed: true, 
    remainingAttempts: MAX_LOGIN_ATTEMPTS - attempts.count 
  };
}

export function recordLoginAttempt(email: string, success: boolean): void {
  const now = Date.now();
  
  if (success) {
    // Clear attempts on successful login
    loginAttempts.delete(email);
    return;
  }
  
  // Record failed attempt
  const attempts = loginAttempts.get(email) || { count: 0, lastAttempt: 0 };
  attempts.count += 1;
  attempts.lastAttempt = now;
  loginAttempts.set(email, attempts);
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  type?: string;
  sessionId?: string;
  sub?: string;
  iat?: number;
  exp?: number;
}

export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  // Add additional security claims
  const tokenPayload = {
    ...payload,
    iat: Math.floor(Date.now() / 1000), // Issued at
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // Expires in 24 hours
    iss: 'vpnkey-admin', // Issuer
    aud: 'vpnkey-users' // Audience
  };
  
  return jwt.sign(tokenPayload, JWT_SECRET, { 
    algorithm: 'HS256'
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    console.log('Verifying token:', token ? 'Token present' : 'No token');
    
    if (!token) {
      console.log('No token provided');
      return null;
    }

    // Check if token is blacklisted
    if (isTokenBlacklisted && isTokenBlacklisted(token)) {
      console.log('Token is blacklisted');
      return null;
    }
    
    // Verify token with proper options to handle issuer and audience
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'], // Only allow HS256 algorithm
      // Don't verify issuer and audience for now to be more flexible
      ignoreExpiration: false,
      clockTolerance: 30 // Allow 30 seconds clock skew
    }) as JWTPayload;
    
    console.log('Token decoded successfully:', decoded ? 'Success' : 'Failed');
    
    // Additional validation
    if (typeof decoded === 'object' && decoded !== null) {
      const now = Math.floor(Date.now() / 1000);
      
      // Check expiration manually if needed
      if (decoded.exp && decoded.exp < now) {
        console.log('Token has expired');
        return null;
      }
      
      // Ensure required fields are present
      if (!decoded.userId || !decoded.email || !decoded.role) {
        console.log('Token missing required fields');
        return null;
      }
      
      return decoded;
    }
    
    console.log('Token verification failed: Invalid token structure');
    return null;
  } catch (error) {
    console.log('Token verification error:', error);
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  // Check Authorization header
  const authHeader = request.headers.get('authorization');
  console.log('Auth header:', authHeader ? 'Present' : 'Missing');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    console.log('Token from Authorization header:', token ? 'Found' : 'Empty');
    return token;
  }

  const pathname = request.nextUrl?.pathname || new URL(request.url).pathname;
  const isAdminPath = pathname.startsWith('/api/admin');

  // For admin routes, prefer admin-token; for non-admin, prefer user-token
  if (isAdminPath) {
    const adminToken = request.cookies.get('admin-token')?.value;
    console.log('Admin token from cookies:', adminToken ? 'Found' : 'Missing');
    if (adminToken) return adminToken;

    const userToken = request.cookies.get('user-token')?.value;
    console.log('User token from cookies:', userToken ? 'Found' : 'Missing');
    if (userToken) return userToken;
  } else {
    const userToken = request.cookies.get('user-token')?.value;
    console.log('User token from cookies:', userToken ? 'Found' : 'Missing');
    if (userToken) return userToken;

    const adminToken = request.cookies.get('admin-token')?.value;
    console.log('Admin token from cookies (non-admin route):', adminToken ? 'Found' : 'Missing');
    if (adminToken) return adminToken;
  }

  // Fallback to generic auth-token for backward compatibility
  const token = request.cookies.get('auth-token')?.value;
  console.log('Generic auth token from cookies:', token ? 'Found' : 'Missing');
  console.log('All cookies:', request.cookies.getAll().map(c => c.name).join(', '));
  return token || null;
}

export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  return verifyToken(token);
}

export function requireAuth(request: NextRequest): JWTPayload {
  const user = getUserFromRequest(request);
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export function requireAdmin(request: NextRequest): JWTPayload {
  const user = requireAuth(request);
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return user;
}