import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import { requireAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();
    
    // Require user authentication
    let user;
    try {
      user = requireAuth(request);
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { orderId } = await params;

    const order = await Order.findById(orderId);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Ensure the authenticated user can only access their own orders
    if (order.userId.toString() !== user.userId) {
      return NextResponse.json({ error: 'You are not allowed to view another user’s order' }, { status: 403 });
    }

    return NextResponse.json({
      message: 'Order found',
      order,
    });

  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}