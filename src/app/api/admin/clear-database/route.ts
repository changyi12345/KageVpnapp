import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import Profile from '@/lib/models/Profile';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    // Get confirmation from request body
    const { confirmation } = await request.json();
    
    if (confirmation !== 'CLEAR') {
      return NextResponse.json(
        { error: 'Confirmation required. Please type "CLEAR" to confirm.' },
        { status: 400 }
      );
    }
    
    // Clear all collections except admin users
    const results = await Promise.allSettled([
      Order.deleteMany({}),
      Payment.deleteMany({}),
      Profile.deleteMany({}),
      Product.deleteMany({}),
      User.deleteMany({ role: { $ne: 'admin' } }) // Keep admin users
    ]);
    
    // Count successful deletions
    let deletedCounts = {
      orders: 0,
      payments: 0,
      profiles: 0,
      products: 0,
      users: 0
    };
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const collections = ['orders', 'payments', 'profiles', 'products', 'users'];
        deletedCounts[collections[index] as keyof typeof deletedCounts] = result.value.deletedCount || 0;
      }
    });
    
    return NextResponse.json({
      message: 'Database cleared successfully',
      deletedCounts,
      timestamp: new Date().toISOString(),
      clearedBy: (admin as any).userId || (admin as any).id || 'admin'
    });
    
  } catch (error) {
    console.error('Database clear error:', error);
    return NextResponse.json(
      { error: 'Database clear လုပ်၍မရပါ' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    // Return current database statistics
    const [orderCount, userCount, productCount, paymentCount, profileCount] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: { $ne: 'admin' } }),
      Product.countDocuments(),
      Payment.countDocuments(),
      Profile.countDocuments()
    ]);
    
    return NextResponse.json({
      currentCounts: {
        orders: orderCount,
        users: userCount,
        products: productCount,
        payments: paymentCount,
        profiles: profileCount
      },
      warning: 'This operation will permanently delete all data except admin accounts'
    });
    
  } catch (error) {
    console.error('Database stats error:', error);
    return NextResponse.json(
      { error: 'Database statistics ရယူ၍မရပါ' },
      { status: 500 }
    );
  }
}