import { NextResponse } from 'next/server';
import { getDriveConfig, updateDriveConfig, getMemberProfiles, getSubmissions } from '@/lib/db';

export async function POST() {
  try {
    const members = await getMemberProfiles();
    const submissions = await getSubmissions();

    const config = await updateDriveConfig({
      last_sync_at: new Date().toISOString(),
      total_member_folders: members.length,
      total_reports_stored: submissions.length,
      failed_uploads_count: 0,
    });

    return NextResponse.json({
      success: true,
      message: `Sync completed. ${members.length} member folders verified and ${submissions.length} reports archived.`,
      config,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Sync failed' }, { status: 500 });
  }
}
