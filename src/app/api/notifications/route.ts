import { NextRequest, NextResponse } from 'next/server';
import { getNotifications, markAllNotificationsRead } from '@/lib/db';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getSession();
    const notifications = await getNotifications(session?.user?.id);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    return NextResponse.json({ notifications, unreadCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getSession();
    await markAllNotificationsRead(session?.user?.id);
    return NextResponse.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to mark notifications' }, { status: 500 });
  }
}
