import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Profile from '@/lib/models/Profile';
import { requireAdmin } from '@/lib/auth';

// GET - Fetch all profiles (admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    
    const skip = (page - 1) * limit;
    
    // Build query
    let query: any = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { 'userId.email': { $regex: search, $options: 'i' } },
      ];
    }
    
    if (status !== 'all') {
      if (status === 'active') {
        query['subscription.status'] = 'active';
      } else if (status === 'inactive') {
        query.$or = [
          { subscription: { $exists: false } },
          { 'subscription.status': { $ne: 'active' } }
        ];
      }
    }
    
    const profiles = await Profile.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Profile.countDocuments(query);
    
    return NextResponse.json({
      profiles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update profile (admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    const body = await request.json();
    const { profileId, ...updateData } = body;
    
    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      );
    }
    
    const profile = await Profile.findByIdAndUpdate(
      profileId,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email');
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete profile (admin only)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    const { searchParams } = new URL(request.url);
    const profileId = searchParams.get('profileId');
    
    if (!profileId) {
      return NextResponse.json(
        { error: 'Profile ID is required' },
        { status: 400 }
      );
    }
    
    const profile = await Profile.findByIdAndDelete(profileId);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}