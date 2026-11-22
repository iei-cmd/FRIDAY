import { NextRequest, NextResponse } from 'next/server';
import { getSubmissionById, getMemberProfileById, getAttachmentsBySubmissionId } from '@/lib/db';
import { generateWorkReportPDF } from '@/lib/report-pdf';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    const submission = await getSubmissionById(id);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const member = await getMemberProfileById(submission.member_id);
    const attachments = await getAttachmentsBySubmissionId(id);

    const pdfBuffer = generateWorkReportPDF(submission, member, attachments);

    const safeMemberName = (submission.member_name || 'Member').replace(/[^a-zA-Z0-9]/g, '_');
    const safeTitle = (submission.work_title || 'Report').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    const fileName = `${safeMemberName}_${safeTitle}_${submission.work_date || 'doc'}.pdf`;

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error: any) {
    console.error('PDF export error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate PDF' }, { status: 500 });
  }
}
