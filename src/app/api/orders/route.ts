import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
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
    
    const { items, total, userId, status } = await request.json();

    // Validation
    if (!items || !total || !userId) {
      return NextResponse.json({ error: 'Items, total and userId are required' }, { status: 400 });
    }

    // Ensure the authenticated user can only create orders for themselves
    if (user.userId !== userId) {
      return NextResponse.json({ error: 'You cannot create orders for other users' }, { status: 403 });
    }

    // Create new order
    const newOrder = new Order({
      userId,
      items,
      total,
      status: status || 'pending_payment',
      orderDate: new Date(),
    });

    await newOrder.save();

    return NextResponse.json({
      message: 'Order created successfully',
      orderId: newOrder._id,
      order: newOrder,
    }, { status: 201 });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}