import { NextRequest, NextResponse } from 'next/server';
import {
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
  getAttachmentsBySubmissionId,
} from '@/lib/db';
import { calculateWorkingHours } from '@/lib/time-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = await getSubmissionById(id);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const attachments = await getAttachmentsBySubmissionId(id);

    return NextResponse.json({ submission, attachments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch submission' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await getSubmissionById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Recalculate hours if start_time or end_time changed
    if (body.start_time || body.end_time) {
      const sTime = body.start_time || existing.start_time;
      const eTime = body.end_time || existing.end_time;
      const calc = calculateWorkingHours(sTime, eTime);
      if (calc.valid) {
        body.total_hours = calc.total_hours;
        body.hours_spent = calc.hours_spent;
        body.minutes_spent = calc.minutes_spent;
      }
    }

    const updated = await updateSubmission(id, body);
    return NextResponse.json({ success: true, submission: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update submission' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteSubmission(id);
    if (!success) {
      return NextResponse.json({ error: 'Submission not found or already deleted' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Submission deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete submission' }, { status: 500 });
  }
}
