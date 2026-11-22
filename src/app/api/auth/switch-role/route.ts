import { NextRequest, NextResponse } from 'next/server';
import { setSessionCookie } from '@/lib/auth';
import { getUserByEmail, createUser } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, role, name } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    let user = await getUserByEmail(email);
    if (!user) {
      user = await createUser({
        email,
        name: name || email.split('@')[0],
        role: role || 'member',
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
      });
    }

    await setSessionCookie(email, user.role);

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to switch role' }, { status: 500 });
  }
}
