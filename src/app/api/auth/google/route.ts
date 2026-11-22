import { NextResponse } from 'next/server';
import { isGoogleDriveConfigured, createOAuth2Client } from '@/lib/google-drive';

export async function GET() {
  if (!isGoogleDriveConfigured()) {
    // If not configured, redirect to login page with notice or direct simulated auth
    return NextResponse.redirect(new URL('/login?notice=google_oauth_pending', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
  }

  const oauth2Client = createOAuth2Client();
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

  return NextResponse.redirect(url);
}
