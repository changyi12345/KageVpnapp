import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { userId, currentPassword, newPassword } = await request.json();
    
    if (!userId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'လိုအပ်သော အချက်အလက်များ ဖြည့်ပါ' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'စကားဝှက်သည် အနည်းဆုံး ၆ လုံးရှိရပါမည်' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'အသုံးပြုသူ မတွေ့ရှိပါ' },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'လက်ရှိ စကားဝှက် မှားနေပါတယ်' },
        { status: 400 }
      );
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await User.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });

    return NextResponse.json({
      message: 'စကားဝှက် ပြောင်းလဲခြင်း အောင်မြင်ပါတယ်',
    });

  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Server error ဖြစ်နေပါတယ်' },
      { status: 500 }
    );
  }
}