import { NextRequest, NextResponse } from 'next/server';
import {
  getMemberProfileById,
  updateMemberProfile,
  updateUserRole,
  getUserById,
  getSubmissions,
  getMemberDriveFolder,
} from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await getMemberProfileById(id);
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const driveFolder = await getMemberDriveFolder(id);
    const submissions = await getSubmissions({ memberId: id });
    const user = await getUserById(member.user_id);

    return NextResponse.json({
      member,
      user,
      driveFolder,
      submissions,
      totalHours: Number(submissions.reduce((acc, s) => acc + s.total_hours, 0).toFixed(2)),
      completedCount: submissions.filter(s => s.work_status === 'Completed').length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch member' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const member = await getMemberProfileById(id);
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const updated = await updateMemberProfile(id, body);

    // If role toggle requested
    if (body.role && (body.role === 'administrator' || body.role === 'member')) {
      await updateUserRole(member.user_id, body.role);
    }

    return NextResponse.json({ success: true, member: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update member' }, { status: 500 });
  }
}
