import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SupportMessage from '@/lib/models/SupportMessage';
import { getUserFromRequest } from '@/lib/auth';
import { isValidObjectId } from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
    }

    // Only match _id when the ID is a valid ObjectId to avoid cast errors
    const orFilters: any[] = [{ conversationId }];
    if (isValidObjectId(conversationId)) {
      orFilters.push({ _id: conversationId });
    }

    const items = await SupportMessage.find({ $or: orFilters })
      .sort({ createdAt: 1 })
      .lean();

    return NextResponse.json({ items });
  } catch (e) {
    console.error('Support messages fetch error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const { name, email, message, conversationId: cid } = body || {};
    const user = getUserFromRequest(req);

    if (!message || typeof message !== 'string' || message.trim().length < 2) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const conversationId = cid || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));

    // Extract client IP safely (NextRequest has no typed `ip`)
    const ipHeader = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '';
    const clientIp = ipHeader.split(',')[0]?.trim() || undefined;

    const doc = await SupportMessage.create({
      conversationId,
      sender: 'user',
      userId: user?.userId,
      name: user?.email ? undefined : name,
      email: user?.email || email,
      message: message.trim(),
      ip: clientIp,
      userAgent: req.headers.get('user-agent') ?? undefined,
      status: 'new',
    });

    return NextResponse.json({ message: 'Sent', id: doc._id, conversationId }, { status: 201 });
  } catch (e) {
    console.error('Support message error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}