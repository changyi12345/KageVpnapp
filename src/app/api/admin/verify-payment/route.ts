import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import { requireAdmin } from '@/lib/auth';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const admin = requireAdmin(request);
    
    const { paymentId, status, notes } = await request.json();
    
    if (!paymentId || !status) {
      return NextResponse.json(
        { error: 'Payment ID နှင့် status လိုအပ်ပါတယ်' },
        { status: 400 }
      );
    }

    // Find the payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // Normalize statuses to match schema and Order enum
    const paymentStatus = status === 'approved' ? 'verified' : status; // 'approved' → 'verified'
    const orderStatus = status === 'approved' ? 'verified' : status === 'rejected' ? 'cancelled' : 'verified';

    await Payment.findByIdAndUpdate(paymentId, {
      status: paymentStatus,
      verifiedAt: new Date(),
      verifiedBy: admin.userId,
      verificationNotes: notes
    });

    // Load order and ensure we have user email
    const order = await Order.findById(payment.orderId).populate('userId', 'email name');
    if (order) {
      await Order.findByIdAndUpdate(order._id, { status: orderStatus }, { new: true });

      if (status === 'approved') {
        try {
          const customerEmail = (order.userId as any)?.email;
          if (customerEmail) {
            await sendOrderConfirmationEmail(customerEmail, { orderId: order._id, total: order.total });
          }
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
        }
      }
    }

    return NextResponse.json({ message: 'Payment verification completed', paymentId, status: paymentStatus });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Server error ဖြစ်နေပါတယ်' }, { status: 500 });
  }
}