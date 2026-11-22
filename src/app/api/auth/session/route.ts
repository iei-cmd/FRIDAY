import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ authenticated: false, session: null }, { status: 200 });
    }
    return NextResponse.json({ authenticated: true, session }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to retrieve session' }, { status: 500 });
  }
}
