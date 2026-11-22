import { cookies } from 'next/headers';
import { User, MemberProfile } from './types';
import { getUserByEmail, getMemberProfileByEmail, createUser } from './db';

const SESSION_COOKIE_NAME = 'friday_session';

export interface SessionData {
  user: User;
  profile: MemberProfile | null;
  isRegistered: boolean;
  isAdmin: boolean;
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  // If no cookie, default to the Chairman / Administrator for immediate first-time demo access
  let userEmail = 'admin.iei@drmgrdu.ac.in';
  if (sessionCookie && sessionCookie.value) {
    try {
      const parsed = JSON.parse(decodeURIComponent(sessionCookie.value));
      if (parsed.email) {
        userEmail = parsed.email;
      }
    } catch {
      userEmail = sessionCookie.value;
    }
  }

  const user = await getUserByEmail(userEmail);
  if (!user) {
    return null;
  }

  const profile = await getMemberProfileByEmail(user.email);

  return {
    user,
    profile,
    isRegistered: Boolean(profile),
    isAdmin: user.role === 'administrator',
  };
}

export async function setSessionCookie(email: string, role?: 'administrator' | 'member'): Promise<void> {
  const cookieStore = await cookies();
  const payload = JSON.stringify({ email, role: role || 'member', timestamp: Date.now() });

  cookieStore.set(SESSION_COOKIE_NAME, encodeURIComponent(payload), {
    path: '/',
    httpOnly: false, // Accessible to client-side switchers for seamless demo testing
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
