import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens, getAuthenticatedDriveClient, ensureRootFolder } from '@/lib/google-drive';
import { updateDriveConfig, getMemberProfiles, saveMemberDriveFolder } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!code) {
    return NextResponse.redirect(`${appUrl}/admin/drive?error=missing_code`);
  }

  try {
    const { tokens, userInfo } = await exchangeCodeForTokens(code);
    const driveClient = getAuthenticatedDriveClient(tokens as any);

    // Create or retrieve "IEI Data of Works"
    const rootFolder = await ensureRootFolder(driveClient);

    // Update system drive config
    await updateDriveConfig({
      is_connected: true,
      connected_email: userInfo.email || 'Admin Google Drive',
      connected_name: userInfo.name || 'IEI Administrator',
      root_folder_id: rootFolder.id,
      root_folder_url: rootFolder.webViewLink,
      root_folder_name: 'IEI Data of Works',
      last_sync_at: new Date().toISOString(),
    });

    return NextResponse.redirect(`${appUrl}/admin/drive?status=connected`);
  } catch (error: any) {
    console.error('Drive OAuth Callback Error:', error);
    return NextResponse.redirect(`${appUrl}/admin/drive?error=connection_failed`);
  }
}
