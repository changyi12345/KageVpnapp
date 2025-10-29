import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Check admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let admin;
    try {
      admin = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const adminUser = await User.findById((admin as any).userId || (admin as any).id);
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }
    
    const { currentPassword, newPassword } = await request.json();
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'လက်ရှိ စကားဝှက်နှင့် စကားဝှက်အသစ် လိုအပ်ပါတယ်' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'စကားဝှက်သည် အနည်းဆုံး ၆ လုံးရှိရပါမည်' },
        { status: 400 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, adminUser.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'လက်ရှိ စကားဝှက် မှားနေပါတယ်' },
        { status: 400 }
      );
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update admin password
    await User.findByIdAndUpdate(adminUser._id, {
      password: hashedNewPassword,
    });

    return NextResponse.json({
      message: 'Admin စကားဝှက် ပြောင်းလဲခြင်း အောင်မြင်ပါတယ်',
    });

  } catch (error) {
    console.error('Admin password change error:', error);
    return NextResponse.json(
      { error: 'Server error ဖြစ်နေပါတယ်' },
      { status: 500 }
    );
  }
}