import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/google-drive';
import { getUserByEmail, createUser, getMemberProfileByEmail } from '@/lib/db';
import { setSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!code) {
    return NextResponse.redirect(`${appUrl}/login?error=missing_code`);
  }

  try {
    const { userInfo } = await exchangeCodeForTokens(code);
    const email = userInfo.email;
    const name = userInfo.name || email?.split('@')[0] || 'User';
    const avatar = userInfo.picture;

    if (!email) {
      return NextResponse.redirect(`${appUrl}/login?error=no_email`);
    }

    let user = await getUserByEmail(email);
    if (!user) {
      user = await createUser({
        email,
        name,
        avatar_url: avatar || undefined,
        role: 'member',
      });
    }

    await setSessionCookie(email, user.role);

    // Check if member profile is already filled
    const profile = await getMemberProfileByEmail(email);
    if (!profile) {
      return NextResponse.redirect(`${appUrl}/register`);
    }

    if (user.role === 'administrator') {
      return NextResponse.redirect(`${appUrl}/admin`);
    } else {
      return NextResponse.redirect(`${appUrl}/dashboard`);
    }
  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${appUrl}/login?error=oauth_failed`);
  }
}
