import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SupportMessage from '@/lib/models/SupportMessage';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const admin = requireAdmin(req);
    const { conversationId, message } = await req.json();

    if (!conversationId || !message?.trim()) {
      return NextResponse.json({ error: 'conversationId နှင့် message လိုအပ်ပါတယ်' }, { status: 400 });
    }

    await SupportMessage.create({
      conversationId,
      sender: 'admin',
      message: message.trim(),
      status: 'read',
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Admin reply error:', e);
    return NextResponse.json({ error: 'Server error ဖြစ်နေပါတယ်' }, { status: 500 });
  }
}