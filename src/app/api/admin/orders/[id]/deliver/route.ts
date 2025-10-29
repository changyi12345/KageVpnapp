import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import { requireAdmin } from '@/lib/auth';
import { sendVPNCredentialsEmail } from '@/lib/email';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    let admin;
    try {
      admin = requireAdmin(request);
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { vpnCredentials } = await request.json();

    if (!vpnCredentials) {
      return NextResponse.json(
        { error: 'VPN credentials လိုအပ်ပါတယ်' },
        { status: 400 }
      );
    }
    
    // Find the order by _id
    const order = await Order.findById(id)
      .populate('userId', 'name email')
      .populate('paymentId');
    
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    
    // Check if order is in verified status
    if (order.status !== 'verified') {
      return NextResponse.json(
        { error: 'Order must be verified before delivery' },
        { status: 400 }
      );
    }
    
    // Update order with VPN credentials and mark as completed
    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      {
        status: 'completed',
        vpnCredentials: {
          username: vpnCredentials.username,
          password: vpnCredentials.password,
          serverInfo: vpnCredentials.serverInfo || 'VPN Server Details',
          expiryDate: vpnCredentials.expiryDate,
          code: vpnCredentials.code,
          deliveredAt: new Date(),
          deliveredBy: (admin as any).userId || (admin as any).id || 'admin'
        }
      },
      { new: true }
    )
    .populate('userId', 'name email').populate('paymentId');
    
    // Send email notification to customer
    try {
      if (updatedOrder && updatedOrder.userId && updatedOrder.userId.email) {
        await sendVPNCredentialsEmail(updatedOrder.userId.email, vpnCredentials, {
          orderId: updatedOrder._id,
          customerName: updatedOrder.userId.name,
          total: updatedOrder.total
        });
        console.log('VPN credentials email sent successfully to:', updatedOrder.userId.email);
      }
    } catch (emailError) {
      console.error('Failed to send VPN credentials email:', emailError);
      // Don't fail the entire operation if email fails
    }
    
    return NextResponse.json({
      message: 'VPN credentials delivered successfully',
      order: updatedOrder
    });
    
  } catch (error) {
    console.error('Error delivering VPN:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}