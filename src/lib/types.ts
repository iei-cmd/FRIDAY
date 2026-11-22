export type UserRole = 'administrator' | 'member';

export type SubmissionStatus = 'Completed' | 'In Progress' | 'Needs Review';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface MemberProfile {
  id: string;
  user_id: string;
  full_name: string;
  gmail_address: string;
  avatar_url?: string;
  designation: string; // e.g. "Chairman", "Hon. Secretary", "Executive Member", "Faculty Advisor"
  department: string;  // e.g. "Computer Science & Engineering"
  college: string;     // e.g. "Dr. M.G.R. Educational and Research Institute"
  iei_membership_no?: string; // e.g. "M-1784920"
  mobile_number: string;
  committee_role: string; // e.g. "Technical Committee Lead"
  date_of_joining: string;
  is_active: boolean;
  drive_folder_id?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
}

export interface WorkSubmission {
  id: string;
  member_id: string;
  member_name: string;
  member_email: string;
  member_designation: string;
  member_department: string;
  work_title: string;
  category_id: string;
  category_name: string;
  work_description: string;
  work_date: string;
  start_time: string; // "14:00"
  end_time: string;   // "16:30"
  total_hours: number; // e.g. 2.5
  hours_spent: number; // 2
  minutes_spent: number; // 30
  work_status: SubmissionStatus;
  work_location: string; // "Offline Campus", "Online GMeet", "IEI State Centre", "Hybrid"
  related_event?: string;
  remarks?: string;
  approval_status: ApprovalStatus;
  admin_feedback?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  pdf_generated: boolean;
  pdf_drive_id?: string;
  pdf_drive_url?: string;
  pdf_file_name?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkAttachment {
  id: string;
  submission_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  file_data?: string; // base64 or storage url
  drive_file_id?: string;
  drive_web_view_link?: string;
  drive_download_link?: string;
  drive_folder_id?: string;
  upload_status: 'pending' | 'uploaded' | 'failed';
  created_at: string;
}

export interface MemberDriveFolders {
  id: string;
  member_id: string;
  root_member_folder_id: string;
  work_reports_folder_id: string;
  supporting_docs_folder_id: string;
  monthly_reports_folder_id: string;
  folder_path: string;
  created_at: string;
  updated_at: string;
}

export interface DriveUploadJob {
  id: string;
  submission_id: string;
  job_type: 'pdf_report' | 'attachment';
  attachment_id?: string;
  file_name: string;
  target_folder_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  attempts: number;
  last_error?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface GoogleDriveConfig {
  is_connected: boolean;
  connected_email?: string;
  connected_name?: string;
  root_folder_name: string; // "IEI Data of Works"
  root_folder_id?: string;
  parent_folder_id?: string; // Optional custom parent folder ID
  root_folder_url?: string;
  last_sync_at?: string;
  total_member_folders: number;
  total_reports_stored: number;
  failed_uploads_count: number;
}

export interface SystemAuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_email: string;
  action: string;
  target_type: 'submission' | 'member' | 'drive' | 'system';
  target_id: string;
  details: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface AnalyticsSummary {
  total_members: number;
  total_submissions: number;
  total_hours: number;
  completed_activities: number;
  pending_activities: number;
  active_members_current_month: number;
  current_month_hours: number;
  category_distribution: { category: string; count: number; hours: number; color: string }[];
  department_distribution: { department: string; members: number; hours: number }[];
  monthly_trends: { month: string; hours: number; submissions: number }[];
  top_contributors: { member_name: string; designation: string; department: string; hours: number; submissions: number }[];
}
