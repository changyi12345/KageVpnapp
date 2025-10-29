import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email နှင့် Password လိုအပ်ပါတယ်' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!user) {
      return NextResponse.json(
        { error: 'အကောင့် မတွေ့ရှိပါ' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access လိုအပ်ပါတယ်။ သင်သည် admin မဟုတ်ပါ။' },
        { status: 403 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'အကောင့်ကို ပိတ်ထားပါတယ်' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email သို့မဟုတ် Password မှားနေပါတယ်' },
        { status: 401 }
      );
    }

    // Generate token with additional security
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        type: 'admin',
        sessionId: Date.now().toString(),
        sub: user._id.toString(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60),
        iss: 'vpnkey-admin',
        aud: 'vpnkey-users'
      },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
      { algorithm: 'HS256' }
    );

    // Return user data (excluding password) and token
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    // Create response with user data
    const response = NextResponse.json({
      message: 'Admin login အောင်မြင်ပါတယ်',
      user: userData,
      token: token, // Include token in response for frontend storage
    });

    // Set secure HTTP-only cookie for admin authentication
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
      sameSite: 'strict', // CSRF protection
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      path: '/', // Available for entire site
      domain: process.env.NODE_ENV === 'production' ? '.kagevpn.com' : undefined // Set domain in production
    });

    // Add security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Server error ဖြစ်နေပါတယ်' },
      { status: 500 }
    );
  }
}