import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SupportMessage from '@/lib/models/SupportMessage';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const [items, total] = await Promise.all([
      SupportMessage.find({})
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      SupportMessage.countDocuments({})
    ]);

    return NextResponse.json({
      page, limit, total, items,
    });
  } catch (e) {
    console.error('Admin support inbox error:', e);
    return NextResponse.json({ error: 'Server error ဖြစ်နေပါတယ်' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    requireAdmin(req);
    const { id, status } = await req.json();
    if (!id || (status !== 'new' && status !== 'read')) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    await SupportMessage.findByIdAndUpdate(id, { status });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('Admin support update error:', e);
    return NextResponse.json({ error: 'Server error ဖြစ်နေပါတယ်' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;