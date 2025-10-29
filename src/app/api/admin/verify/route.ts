import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // This will throw an error if not authenticated or not admin
    const admin = requireAdmin(request);
    
    return NextResponse.json({
      success: true,
      user: {
        userId: admin.userId,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin verification failed:', error);
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
}