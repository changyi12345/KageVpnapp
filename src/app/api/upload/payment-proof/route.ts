import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file: File | null = formData.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'ဖိုင် မရွေးချယ်ထားပါ' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'ပုံဖိုင်များသာ upload လုပ်နိုင်ပါတယ် (JPG, PNG, WebP)' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'ဖိုင်အရွယ်အစား 5MB ထက် မကျော်ရပါ' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `payment-proof-${timestamp}-${file.name}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'payment-proofs');
    const filepath = join(uploadDir, filename);

    // Create directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/payment-proofs/${filename}`;

    return NextResponse.json({
      message: 'ဖိုင် upload အောင်မြင်ပါတယ်',
      fileUrl,
      filename,
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'ဖိုင် upload မအောင်မြင်ပါ' },
      { status: 500 }
    );
  }
}