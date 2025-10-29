import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import mongoose from 'mongoose';
import { getUserFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get user ID from JWT token or user-id header (for backward compatibility)
    let userId: string | null = null;
    
    // Try to get user from JWT token first
    const user = getUserFromRequest(request);
    if (user) {
      userId = user.userId;
    } else {
      // Fallback to user-id header for backward compatibility
      userId = request.headers.get('user-id');
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - User ID required' },
        { status: 401 }
      );
    }

    // Convert userId string to ObjectId for proper MongoDB query
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const orders = await Order.find({ userId: userObjectId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ userId: userObjectId });

    // Calculate user statistics
    const stats = await Order.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          }
        }
      }
    ]);

    const userStats = stats[0] || { totalOrders: 0, totalSpent: 0, completedOrders: 0 };

    return NextResponse.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      stats: userStats,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}