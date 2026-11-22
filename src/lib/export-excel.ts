import * as XLSX from 'xlsx';
import { WorkSubmission, MemberProfile, AnalyticsSummary } from './types';
import { formatDatePretty, formatTime12Hour } from './time-utils';

export function generateSubmissionsExcel(
  submissions: WorkSubmission[],
  sheetTitle = 'IEI Work Submissions'
): Buffer {
  const rows = submissions.map((s, idx) => ({
    'S.No': idx + 1,
    'Submission ID': s.id,
    'Member Name': s.member_name,
    'Gmail Address': s.member_email,
    'Designation': s.member_designation,
    'Department': s.member_department,
    'Work Title': s.work_title,
    'Category': s.category_name,
    'Date of Work': s.work_date,
    'Formatted Date': formatDatePretty(s.work_date),
    'Start Time': formatTime12Hour(s.start_time),
    'End Time': formatTime12Hour(s.end_time),
    'Duration (Hours)': s.total_hours,
    'Hours Spent': s.hours_spent,
    'Minutes Spent': s.minutes_spent,
    'Location': s.work_location,
    'Related Event': s.related_event || 'N/A',
    'Status': s.work_status,
    'Approval Status': s.approval_status,
    'Admin Feedback': s.admin_feedback || '',
    'Reviewed By': s.reviewed_by || '',
    'Google Drive PDF Link': s.pdf_drive_url || 'Stored in Drive',
    'Submitted At': s.created_at,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle.substring(0, 31));

  // Auto-fit column widths
  const colWidths = [
    { wch: 6 },  // S.No
    { wch: 22 }, // Sub ID
    { wch: 22 }, // Name
    { wch: 26 }, // Email
    { wch: 20 }, // Designation
    { wch: 24 }, // Dept
    { wch: 30 }, // Work Title
    { wch: 20 }, // Category
    { wch: 12 }, // Date
    { wch: 16 }, // Formatted Date
    { wch: 12 }, // Start Time
    { wch: 12 }, // End Time
    { wch: 14 }, // Duration
    { wch: 12 }, // Hours
    { wch: 12 }, // Mins
    { wch: 18 }, // Location
    { wch: 22 }, // Event
    { wch: 14 }, // Status
    { wch: 14 }, // Approval
    { wch: 26 }, // Feedback
    { wch: 18 }, // Reviewer
    { wch: 35 }, // Drive Link
    { wch: 22 }, // Submitted At
  ];
  worksheet['!cols'] = colWidths;

  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return Buffer.from(excelBuffer);
}

export function generateMembersExcel(members: MemberProfile[]): Buffer {
  const rows = members.map((m, idx) => ({
    'S.No': idx + 1,
    'Member ID': m.id,
    'Full Name': m.full_name,
    'Gmail Address': m.gmail_address,
    'Designation': m.designation,
    'Department': m.department,
    'College / Institution': m.college,
    'IEI Membership No': m.iei_membership_no || 'Registered Member',
    'Committee Role': m.committee_role,
    'Mobile Number': m.mobile_number,
    'Date of Joining': m.date_of_joining,
    'Account Active': m.is_active ? 'Yes' : 'No',
    'Google Drive Folder ID': m.drive_folder_id || 'Auto-Provisioned',
    'Registered On': m.created_at,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Committee Members');

  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return Buffer.from(excelBuffer);
}

export function generateConsolidatedReportExcel(
  submissions: WorkSubmission[],
  members: MemberProfile[],
  analytics: AnalyticsSummary
): Buffer {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Executive KPI Overview
  const kpiData = [
    { Metric: 'Project Name', Value: 'FRIDAY (Faculty & Responsibility Integrated Data Analytics Yard)' },
    { Metric: 'Organization', Value: 'The Institution of Engineers (India) - IEI' },
    { Metric: 'Report Generation Timestamp', Value: new Date().toLocaleString('en-IN') },
    { Metric: 'Total Registered Members', Value: analytics.total_members },
    { Metric: 'Total Work Submissions', Value: analytics.total_submissions },
    { Metric: 'Total Working Hours Contributed', Value: `${analytics.total_hours} Hours` },
    { Metric: 'Completed Activities', Value: analytics.completed_activities },
    { Metric: 'Pending Activities', Value: analytics.pending_activities },
    { Metric: 'Current Month Working Hours', Value: `${analytics.current_month_hours} Hours` },
    { Metric: 'Active Members This Month', Value: analytics.active_members_current_month },
  ];
  const kpiSheet = XLSX.utils.json_to_sheet(kpiData);
  kpiSheet['!cols'] = [{ wch: 32 }, { wch: 45 }];
  XLSX.utils.book_append_sheet(workbook, kpiSheet, 'Executive Summary');

  // Sheet 2: All Submissions
  const subRows = submissions.map((s, idx) => ({
    'S.No': idx + 1,
    'Submission ID': s.id,
    'Member Name': s.member_name,
    'Department': s.member_department,
    'Designation': s.member_designation,
    'Work Title': s.work_title,
    'Category': s.category_name,
    'Work Date': s.work_date,
    'Total Hours': s.total_hours,
    'Status': s.work_status,
    'Approval': s.approval_status,
    'Drive Link': s.pdf_drive_url || 'Vault',
  }));
  const subSheet = XLSX.utils.json_to_sheet(subRows);
  XLSX.utils.book_append_sheet(workbook, subSheet, 'Submissions');

  // Sheet 3: Member Directory
  const memRows = members.map((m, idx) => ({
    'S.No': idx + 1,
    'Full Name': m.full_name,
    'Email': m.gmail_address,
    'Designation': m.designation,
    'Department': m.department,
    'IEI Membership': m.iei_membership_no || 'N/A',
    'Mobile': m.mobile_number,
    'Status': m.is_active ? 'Active' : 'Inactive',
  }));
  const memSheet = XLSX.utils.json_to_sheet(memRows);
  XLSX.utils.book_append_sheet(workbook, memSheet, 'Members');

  // Sheet 4: Leaderboard & Department Stats
  const topRows = analytics.top_contributors.map((c, idx) => ({
    'Rank': idx + 1,
    'Member': c.member_name,
    'Designation': c.designation,
    'Department': c.department,
    'Submissions': c.submissions,
    'Hours Contributed': c.hours,
  }));
  const topSheet = XLSX.utils.json_to_sheet(topRows);
  XLSX.utils.book_append_sheet(workbook, topSheet, 'Leaderboard');

  const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  return Buffer.from(excelBuffer);
}

export function generateCSV(submissions: WorkSubmission[]): string {
  const headers = [
    'Submission_ID',
    'Member_Name',
    'Member_Email',
    'Designation',
    'Department',
    'Work_Title',
    'Category',
    'Date_of_Work',
    'Start_Time',
    'End_Time',
    'Total_Hours',
    'Location',
    'Status',
    'Approval_Status',
    'Drive_PDF_Link',
  ];

  const lines = [headers.join(',')];

  for (const s of submissions) {
    const row = [
      `"${s.id}"`,
      `"${s.member_name.replace(/"/g, '""')}"`,
      `"${s.member_email}"`,
      `"${s.member_designation}"`,
      `"${s.member_department}"`,
      `"${s.work_title.replace(/"/g, '""')}"`,
      `"${s.category_name}"`,
      `"${s.work_date}"`,
      `"${s.start_time}"`,
      `"${s.end_time}"`,
      s.total_hours,
      `"${s.work_location}"`,
      `"${s.work_status}"`,
      `"${s.approval_status}"`,
      `"${s.pdf_drive_url || ''}"`,
    ];
    lines.push(row.join(','));
  }

  return lines.join('\n');
}
