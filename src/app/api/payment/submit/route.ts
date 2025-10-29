import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = requireAuth(request);
    const contentType = request.headers.get('content-type') || '';
    let orderId: string, paymentMethod: string, transactionId: string, senderName: string, senderPhone: string, amount: number | undefined, paymentScreenshot: string | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      orderId = String(formData.get('orderId') || '');
      paymentMethod = String(formData.get('paymentMethod') || '');
      transactionId = String(formData.get('transactionId') || '');
      senderName = String(formData.get('senderName') || '');
      senderPhone = String(formData.get('senderPhone') || '');
      amount = formData.get('amount') ? Number(formData.get('amount')) : undefined;
      paymentScreenshot = formData.get('paymentScreenshot') ? String(formData.get('paymentScreenshot')) : undefined;
    } else {
      const body = await request.json();
      ({ orderId, paymentMethod, transactionId, senderName, senderPhone, amount, paymentScreenshot } = body);
    }

    if (!orderId || !paymentMethod || !transactionId || !senderName || !senderPhone) {
      return NextResponse.json({ error: 'Please fill the required fields' }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Ensure only order owner can submit payment
    if (order.userId.toString() !== user.userId) {
      return NextResponse.json({ error: 'This is not your order' }, { status: 403 });
    }

    if (order.paymentId) {
      return NextResponse.json({ error: 'Payment already submitted for this order' }, { status: 400 });
    }

    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) {
      return NextResponse.json({ error: 'Transaction ID already exists. Please use a unique transaction ID.' }, { status: 400 });
    }

    const newPayment = new Payment({
      orderId,
      userId: order.userId.toString(),
      paymentMethod,
      transactionId,
      senderName,
      senderPhone,
      amount: amount || order.total,
      paymentScreenshot,
      status: 'pending_verification',
      submittedAt: new Date(),
    });

    await newPayment.save();
    console.log('Payment saved:', newPayment);

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(orderId, {
      status: 'payment_submitted',
      paymentId: newPayment._id,
    }, { new: true });
    
    console.log('Order updated:', updatedOrder);

    return NextResponse.json({
      message: 'Payment submitted successfully',
      paymentId: newPayment._id,
      transactionId: transactionId,
    }, { status: 201 });
  } catch (error) {
    console.error('Payment submission error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}