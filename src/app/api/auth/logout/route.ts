import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken, setTokenBlacklistChecker } from '@/lib/auth';

// Token blacklist for invalidated tokens (in production, use Redis or database)
const tokenBlacklist = new Set<string>();
// Wire the blacklist function to auth verification
setTokenBlacklistChecker((token: string) => tokenBlacklist.has(token));

export async function POST(request: NextRequest) {
  try {
    // Get and verify the current token
    const token = getTokenFromRequest(request);
    
    if (token) {
      try {
        // Verify token is valid before blacklisting
        const decoded = verifyToken(token);
        
        // Add token to blacklist to prevent reuse
        tokenBlacklist.add(token);
        
        // Log logout for security monitoring (check if decoded is valid)
        if (decoded && typeof decoded === 'object' && 'email' in decoded) {
          console.log(`User logged out: ${decoded.email} at ${new Date().toISOString()}`);
        } else {
          console.log(`Token logged out at ${new Date().toISOString()}`);
        }
      } catch (error) {
        // Token is already invalid, but still proceed with logout
        console.log('Invalid token during logout, proceeding with cleanup');
      }
    }

    // Create response with security headers and clear cookie
    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Clear the auth-token cookie with secure settings
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.kagevpn.com' : undefined
    });

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}