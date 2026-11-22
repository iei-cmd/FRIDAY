import { NextResponse } from 'next/server';
import { isGoogleDriveConfigured, getDriveAuthUrl } from '@/lib/google-drive';

export async function GET() {
  if (!isGoogleDriveConfigured()) {
    return NextResponse.json({
      error: 'Google Drive credentials are not yet configured in environment variables. Please supply GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
      configured: false,
    }, { status: 400 });
  }

  const authUrl = getDriveAuthUrl();
  return NextResponse.redirect(authUrl);
}
