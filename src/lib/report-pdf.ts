import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { WorkSubmission, WorkAttachment, MemberProfile } from './types';
import { formatDatePretty, formatTime12Hour } from './time-utils';

export function generateWorkReportPDF(
  submission: WorkSubmission,
  member?: Partial<MemberProfile> | null,
  attachments: WorkAttachment[] = []
): Buffer {
  // A4 size: 210 x 297 mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Header Banner Background (Deep Navy)
  doc.setFillColor(11, 15, 25); // #0B0F19
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Line (Electric Blue & Violet gradient simulation)
  doc.setFillColor(37, 99, 235); // #2563EB
  doc.rect(0, 42, pageWidth * 0.65, 2, 'F');
  doc.setFillColor(124, 58, 237); // #7C3AED
  doc.rect(pageWidth * 0.65, 42, pageWidth * 0.35, 2, 'F');

  // IEI Badge / Emblem Simulation
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(margin, 8, 26, 26, 3, 3, 'F');
  doc.setTextColor(56, 189, 248); // Sky blue
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('IEI', margin + 13, 22, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('INDIA', margin + 13, 28, { align: 'center' });

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('THE INSTITUTION OF ENGINEERS (INDIA)', margin + 32, 16);

  doc.setFontSize(10);
  doc.setTextColor(56, 189, 248);
  doc.text('PROJECT FRIDAY - FACULTY & RESPONSIBILITY INTEGRATED DATA ANALYTICS YARD', margin + 32, 23);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Official Committee Work Record & Activity Authentication Document', margin + 32, 29);
  doc.text(`Reference ID: ${submission.id} | Generated: ${new Date().toLocaleString('en-IN')}`, margin + 32, 34);

  let currentY = 50;

  // Title of Report
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ACTIVITY WORK REPORT', margin, currentY);
  currentY += 4;

  // Member Information Table
  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
    },
    head: [['MEMBER PROFILE & DESIGNATION', 'AFFILIATION DETAILS']],
    body: [
      [
        `Full Name: ${submission.member_name || member?.full_name || 'N/A'}\nGmail Address: ${submission.member_email || member?.gmail_address || 'N/A'}\nDesignation: ${submission.member_designation || member?.designation || 'Committee Member'}`,
        `Department: ${submission.member_department || member?.department || 'N/A'}\nInstitution: ${member?.college || 'Dr. M.G.R. Educational and Research Institute'}\nIEI Membership No: ${member?.iei_membership_no || 'Registered Member'}\nCommittee Role: ${member?.committee_role || 'Executive Member'}`
      ],
    ],
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // Work Specifics Table
  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
    },
    head: [['WORK ATTRIBUTE', 'ACTIVITY DETAILS & PARAMETERS']],
    body: [
      ['Work Title', submission.work_title],
      ['Work Category', submission.category_name],
      ['Date of Work', formatDatePretty(submission.work_date)],
      ['Time Log', `${formatTime12Hour(submission.start_time)} to ${formatTime12Hour(submission.end_time)}`],
      ['Total Time Contributed', `${submission.hours_spent || Math.floor(submission.total_hours)} Hours ${submission.minutes_spent || Math.round((submission.total_hours % 1) * 60)} Minutes (${submission.total_hours} hrs decimal)`],
      ['Location / Platform', submission.work_location || 'Offline Campus'],
      ['Related Event / Initiative', submission.related_event || 'General Committee Operations'],
      ['Work Status', submission.work_status],
      ['Approval Status', `${submission.approval_status}${submission.reviewed_by ? ` (Reviewed by ${submission.reviewed_by})` : ''}`],
    ],
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // Description Block
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Detailed Work Description:', margin, currentY);
  currentY += 4;

  const splitDescription = doc.splitTextToSize(submission.work_description || 'No detailed description provided.', pageWidth - margin * 2 - 4);
  
  doc.setFillColor(248, 250, 252); // light slate background
  doc.setDrawColor(226, 232, 240);
  const descHeight = Math.max(splitDescription.length * 4.5 + 6, 20);

  // Check if page height exceeded
  if (currentY + descHeight > pageHeight - 35) {
    doc.addPage();
    currentY = 20;
  }

  doc.rect(margin, currentY, pageWidth - margin * 2, descHeight, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(splitDescription, margin + 3, currentY + 5);
  currentY += descHeight + 6;

  // Remarks / Feedback Block
  if (submission.remarks || submission.admin_feedback) {
    if (currentY + 25 > pageHeight - 35) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Remarks & Administrative Feedback:', margin, currentY);
    currentY += 4;

    const feedbackText = `Member Remarks: ${submission.remarks || 'None'}\nAdmin Feedback: ${submission.admin_feedback || 'No administrative notes'}`;
    const splitFeedback = doc.splitTextToSize(feedbackText, pageWidth - margin * 2 - 4);
    const fbHeight = splitFeedback.length * 4 + 6;

    doc.setFillColor(254, 252, 232); // soft yellow box
    doc.setDrawColor(254, 240, 138);
    doc.rect(margin, currentY, pageWidth - margin * 2, fbHeight, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(113, 63, 18);
    doc.text(splitFeedback, margin + 3, currentY + 5);
    currentY += fbHeight + 6;
  }

  // Supporting Documents List
  if (attachments.length > 0) {
    if (currentY + 25 > pageHeight - 35) {
      doc.addPage();
      currentY = 20;
    }

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'grid',
      headStyles: {
        fillColor: [71, 85, 105],
        textColor: [255, 255, 255],
        fontSize: 8,
      },
      styles: {
        fontSize: 7.5,
        cellPadding: 2,
      },
      head: [['ATTACHED SUPPORTING DOCUMENTS', 'SIZE', 'GOOGLE DRIVE ARCHIVE STATUS']],
      body: attachments.map(att => [
        att.file_name,
        `${(att.file_size / 1024).toFixed(1)} KB`,
        att.drive_web_view_link ? 'Stored in Administrator Google Drive' : 'Uploaded to FRIDAY Vault'
      ]),
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // Footer / Verification Signatures
  if (currentY + 30 > pageHeight - 15) {
    doc.addPage();
    currentY = 20;
  }

  const signY = pageHeight - 24;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, signY - 5, pageWidth - margin, signY - 5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('MEMBER SIGNATURE', margin + 10, signY);
  doc.text('COMMITTEE ADMINISTRATOR / CONVENOR', pageWidth - margin - 75, signY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Electronically Verified via Google OAuth', margin + 10, signY + 4);
  doc.text('IEI Committee Verification & Approval Record', pageWidth - margin - 75, signY + 4);

  // Return Buffer
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}
