import { NextResponse } from 'next/server';
import { updateDriveConfig } from '@/lib/db';

export async function POST() {
  try {
    await updateDriveConfig({
      is_connected: false,
      connected_email: undefined,
      connected_name: undefined,
      last_sync_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Google Drive integration disconnected.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to disconnect drive' }, { status: 500 });
  }
}
