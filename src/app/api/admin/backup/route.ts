import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/lib/models/Payment';
import Order from '@/lib/models/Order';
import User from '@/lib/models/User';
import Product from '@/lib/models/Product';
import Profile from '@/lib/models/Profile';
import Settings from '@/lib/models/Settings';
import { requireAdmin } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups');
    try {
      await mkdir(backupDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup-${timestamp}.json`;
    const backupPath = path.join(backupDir, backupFileName);
    
    // Collect all data
    const [orders, users, products, payments, profiles, settings] = await Promise.all([
      Order.find({}).populate('userId').populate('paymentId'),
      User.find({}).select('-password'), // Exclude passwords for security
      Product.find({}),
      Payment.find({}).populate('orderId'),
      Profile.find({}).populate('userId'),
      Settings.find({})
    ]);
    
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: {
        orders,
        users,
        products,
        payments,
        profiles,
        settings
      },
      stats: {
        totalOrders: orders.length,
        totalUsers: users.length,
        totalProducts: products.length,
        totalPayments: payments.length,
        totalProfiles: profiles.length
      }
    };
    
    // Write backup file
    await writeFile(backupPath, JSON.stringify(backupData, null, 2));
    
    return NextResponse.json({
      message: 'Backup created successfully',
      filename: backupFileName,
      timestamp: new Date().toISOString(),
      stats: backupData.stats
    });
    
  } catch (error) {
    console.error('Backup creation error:', error);
    return NextResponse.json(
      { error: 'Backup ဖန်တီး၍မရပါ' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Require admin authentication
    const admin = requireAdmin(request);
    
    // Return backup status and available backups
    const backupDir = path.join(process.cwd(), 'backups');
    
    try {
      const { readdir, stat } = await import('fs/promises');
      const files = await readdir(backupDir);
      const backupFiles = files.filter(file => file.startsWith('backup-') && file.endsWith('.json'));
      
      const backups = await Promise.all(
        backupFiles.map(async (file) => {
          const filePath = path.join(backupDir, file);
          const stats = await stat(filePath);
          return {
            filename: file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          };
        })
      );
      
      return NextResponse.json({
        backups: backups.sort((a, b) => b.created.getTime() - a.created.getTime()),
        totalBackups: backups.length
      });
      
    } catch (error) {
      // Backup directory doesn't exist or is empty
      return NextResponse.json({
        backups: [],
        totalBackups: 0
      });
    }
    
  } catch (error) {
    console.error('Backup list error:', error);
    return NextResponse.json(
      { error: 'Backup list ရယူ၍မရပါ' },
      { status: 500 }
    );
  }
}