import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    const { id } = await params;
    
    // Find the order
    const order = await Order.findById(id).populate('paymentId');
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    if (!order.paymentId) {
      return NextResponse.json({ message: 'No payment information found for this order' }, { status: 400 });
    }
    
    // Update payment status to rejected
    await Payment.findByIdAndUpdate(order.paymentId._id, {
      status: 'rejected',
      verifiedAt: new Date(),
      verifiedBy: (admin as any).id
    });
    
    // Update order status to cancelled
    await Order.findByIdAndUpdate(order._id, {
      status: 'cancelled'
    });
    
    return NextResponse.json({ 
      message: 'Payment rejected successfully',
      orderId: id 
    });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}