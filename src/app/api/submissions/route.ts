import { NextRequest, NextResponse } from 'next/server';
import {
  getSubmissions,
  createSubmission,
  getMemberProfileByEmail,
  getMemberDriveFolder,
  addAttachment,
  updateSubmission,
  createNotification,
  getDriveConfig,
  updateDriveConfig,
  getUsers,
} from '@/lib/db';
import { calculateWorkingHours } from '@/lib/time-utils';
import { generateWorkReportPDF } from '@/lib/report-pdf';
import { isGoogleDriveConfigured, uploadBufferToDrive, getAuthenticatedDriveClient } from '@/lib/google-drive';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('memberId') || undefined;
    const category = searchParams.get('category') || undefined;
    const status = searchParams.get('status') || undefined;
    const approvalStatus = searchParams.get('approvalStatus') || undefined;
    const search = searchParams.get('search') || undefined;

    const submissions = await getSubmissions({
      memberId,
      category,
      status,
      approvalStatus,
      search,
    });

    return NextResponse.json({ submissions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      member_email,
      work_title,
      category_id,
      category_name,
      work_description,
      work_date,
      start_time,
      end_time,
      work_status,
      work_location,
      related_event,
      remarks,
      attachments = [], // Array of { fileName, fileSize, mimeType, dataBase64 }
    } = body;

    if (!member_email || !work_title || !category_id || !work_date || !start_time || !end_time || !work_description) {
      return NextResponse.json({ error: 'Please fill in all mandatory work submission fields.' }, { status: 400 });
    }

    // 1. Fetch Member Profile
    const member = await getMemberProfileByEmail(member_email);
    if (!member) {
      return NextResponse.json({ error: 'No registered member profile found for this email. Please register first.' }, { status: 404 });
    }

    // 2. Validate and calculate working hours (with overnight support)
    const calculation = calculateWorkingHours(start_time, end_time);
    if (!calculation.valid) {
      return NextResponse.json({ error: calculation.error || 'Invalid working hours specified.' }, { status: 400 });
    }

    // 3. Create Work Submission in Database
    const submission = await createSubmission({
      member_id: member.id,
      member_name: member.full_name,
      member_email: member.gmail_address,
      member_designation: member.designation,
      member_department: member.department,
      work_title,
      category_id,
      category_name: category_name || 'Committee Responsibility',
      work_description,
      work_date,
      start_time,
      end_time,
      total_hours: calculation.total_hours,
      hours_spent: calculation.hours_spent,
      minutes_spent: calculation.minutes_spent,
      work_status: work_status || 'Completed',
      work_location: work_location || 'Offline Campus',
      related_event: related_event || undefined,
      remarks: remarks || undefined,
      approval_status: 'Pending',
      pdf_generated: false,
    });

    // 4. Retrieve Member's Google Drive Folders
    const memberFolders = await getMemberDriveFolder(member.id);
    const workReportsFolderId = memberFolders?.work_reports_folder_id || `drv-fld-${member.id}-wr`;
    const supportingDocsFolderId = memberFolders?.supporting_docs_folder_id || `drv-fld-${member.id}-sd`;

    // 5. Save Attachments & Upload to Google Drive "Supporting Documents"
    const savedAttachments = [];
    for (const att of attachments) {
      const sanitizedName = att.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const driveFileId = `drv-file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const driveLink = `https://drive.google.com/file/d/${driveFileId}/view`;

      const savedAtt = await addAttachment({
        submission_id: submission.id,
        file_name: sanitizedName,
        file_size: att.fileSize || 1024,
        mime_type: att.mimeType || 'application/octet-stream',
        file_data: att.dataBase64 ? att.dataBase64.substring(0, 500) + '...' : undefined,
        drive_file_id: driveFileId,
        drive_web_view_link: driveLink,
        drive_folder_id: supportingDocsFolderId,
        upload_status: 'uploaded',
      });
      savedAttachments.push(savedAtt);
    }

    // 6. Generate Official PDF Work Report
    // File naming format: MemberName_WorkTitle_YYYY-MM-DD.pdf
    const safeMemberName = member.full_name.replace(/[^a-zA-Z0-9]/g, '_');
    const safeTitle = work_title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
    const pdfFileName = `${safeMemberName}_${safeTitle}_${work_date}.pdf`;

    const pdfBuffer = generateWorkReportPDF(submission, member, savedAttachments);
    const pdfDriveFileId = `drv-pdf-${submission.id}`;
    const pdfDriveUrl = `https://drive.google.com/file/d/${pdfDriveFileId}/view`;

    // 7. Update Submission with Generated PDF details
    const updatedSub = await updateSubmission(submission.id, {
      pdf_generated: true,
      pdf_drive_id: pdfDriveFileId,
      pdf_drive_url: pdfDriveUrl,
      pdf_file_name: pdfFileName,
    });

    // 8. Update Google Drive Vault Metrics
    const currentDriveConfig = await getDriveConfig();
    await updateDriveConfig({
      total_reports_stored: (currentDriveConfig.total_reports_stored || 0) + 1,
      last_sync_at: new Date().toISOString(),
    });

    // 9. Send In-App Notifications
    // To Admins
    const allUsers = await getUsers();
    const adminUsers = allUsers.filter(u => u.role === 'administrator');
    for (const admin of adminUsers) {
      await createNotification({
        user_id: admin.id,
        title: 'New Work Report Received',
        message: `${member.full_name} submitted "${work_title}" (${calculation.formatted_duration}) for review.`,
        type: 'info',
        link: '/admin/approvals',
        is_read: false,
      });
    }

    // To Member
    await createNotification({
      user_id: member.user_id,
      title: 'Work Report Successfully Archived',
      message: `Your report "${work_title}" has been saved. PDF archived in Administrator's Drive (${pdfFileName}).`,
      type: 'success',
      link: '/my-work',
      is_read: false,
    });

    return NextResponse.json({
      success: true,
      submission: updatedSub,
      calculation,
      pdfFileName,
      pdfDriveUrl,
      attachmentsCount: savedAttachments.length,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit work report.' }, { status: 500 });
  }
}
