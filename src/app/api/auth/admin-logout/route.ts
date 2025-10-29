import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create response with security headers
    const response = NextResponse.json({
      message: 'Admin အကောင့်မှ ထွက်ခြင်း အောင်မြင်ပါတယ်'
    });

    // Clear the admin-token cookie with secure settings
    response.cookies.set('admin-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Match login cookie settings
      maxAge: 0, // Expire immediately
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? '.kagevpn.com' : undefined
    });

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');

    return response;

  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { error: 'Server error ဖြစ်နေပါတယ်' },
      { status: 500 }
    );
  }
}