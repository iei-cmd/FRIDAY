import { NextResponse } from 'next/server';
import { getDriveConfig } from '@/lib/db';
import { isSupabaseConfigured } from '@/lib/supabase';
import { isGoogleDriveConfigured } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = await getDriveConfig();
    const isLiveConfigured = isGoogleDriveConfigured();

    return NextResponse.json({
      config,
      isLiveConfigured,
      isSupabaseConfigured,
      status: config.is_connected ? 'connected' : 'disconnected',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch drive status' }, { status: 500 });
  }
}
