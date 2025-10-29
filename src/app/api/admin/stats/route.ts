import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Ensure Payment model is registered
    if (!Payment) {
      throw new Error('Payment model not loaded');
    }
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    console.log('Fetching admin stats...'); // Debug log
    
    // Get total orders
    const totalOrders = await Order.countDocuments();
    console.log('Total orders:', totalOrders); // Debug log
    
    // Get total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    console.log('Total revenue:', totalRevenue); // Debug log
    
    // Get active users (all users since isActive field might not exist)
    const activeUsers = await User.countDocuments();
    console.log('Active users:', activeUsers); // Debug log
    
    // Get total products (all products since isActive field might not exist)
    const totalProducts = await Product.countDocuments();
    console.log('Total products:', totalProducts); // Debug log
    
    // Get monthly sales data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          sales: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    console.log('Monthly sales data:', monthlySales); // Debug log
    
    // Get product distribution
    const productStats = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          count: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    console.log('Product stats:', productStats); // Debug log
    
    // Get recent orders
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .populate('paymentId')
      .sort({ createdAt: -1 })
      .limit(10);
    console.log('Recent orders count:', recentOrders.length); // Debug log

    const result = {
      stats: {
        totalOrders,
        totalRevenue,
        activeUsers,
        totalProducts,
      },
      monthlySales,
      productStats,
      recentOrders,
    };
    
    console.log('Final result:', JSON.stringify(result, null, 2)); // Debug log
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}