import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // In a real application, you would get the user ID from the session/token
    // For now, we'll use a header (this is just for demonstration)
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Please sign in' }, { status: 401 });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Your account is disabled' }, { status: 403 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}