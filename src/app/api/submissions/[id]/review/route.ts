import { NextRequest, NextResponse } from 'next/server';
import { reviewSubmission, getSubmissionById } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { approval_status, admin_feedback, reviewer_name } = body;

    if (!approval_status || (approval_status !== 'Approved' && approval_status !== 'Rejected')) {
      return NextResponse.json({ error: 'Valid approval status (Approved / Rejected) is required.' }, { status: 400 });
    }

    const submission = await getSubmissionById(id);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const reviewed = await reviewSubmission(
      id,
      approval_status,
      admin_feedback || '',
      reviewer_name || 'Administrator'
    );

    return NextResponse.json({ success: true, submission: reviewed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to review submission' }, { status: 500 });
  }
}
