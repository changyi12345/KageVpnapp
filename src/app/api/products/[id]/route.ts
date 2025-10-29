import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params;

    const product = await Product.findById(id);
    
    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: 'Product မတွေ့ရှိပါ' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });

  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { error: 'Server error ဖြစ်နေပါတယ်' },
      { status: 500 }
    );
  }
}