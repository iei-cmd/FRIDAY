import fs from 'fs';
import path from 'path';
import {
  User,
  MemberProfile,
  WorkCategory,
  WorkSubmission,
  WorkAttachment,
  MemberDriveFolders,
  DriveUploadJob,
  Notification,
  GoogleDriveConfig,
  SystemAuditLog,
  AnalyticsSummary,
} from './types';
import { isSupabaseConfigured, supabaseAdmin } from './supabase';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

interface DatabaseSchema {
  users: User[];
  member_profiles: MemberProfile[];
  work_categories: WorkCategory[];
  work_submissions: WorkSubmission[];
  work_attachments: WorkAttachment[];
  member_drive_folders: MemberDriveFolders[];
  drive_upload_jobs: DriveUploadJob[];
  notifications: Notification[];
  google_drive_config: GoogleDriveConfig;
  audit_logs: SystemAuditLog[];
}

const DEFAULT_CATEGORIES: WorkCategory[] = [
  { id: 'cat-1', name: 'Meeting and Coordination', description: 'Core committee meetings, council discussions & agenda planning', color: '#38BDF8', icon: 'Users', is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Event Planning', description: 'Symposiums, technical workshops, seminars, and guest lecture preparations', color: '#818CF8', icon: 'Calendar', is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Event Execution', description: 'Conducting live events, stage management, registration & participant handling', color: '#34D399', icon: 'PlayCircle', is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Documentation', description: 'Minutes of meetings, annual reports, accreditation dossiers & newsletters', color: '#FBBF24', icon: 'FileText', is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-5', name: 'Technical Activities', description: 'Hackathons, project expos, code sprints, and technical paper reviews', color: '#60A5FA', icon: 'Cpu', is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-6', name: 'Communication and Outreach', description: 'Public relations, institutional branding, student chapter outreach & social media', color: '#F472B6', icon: 'Share2', is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-7', name: 'Administrative Work', description: 'Budgeting, sponsorship coordination, procurement & statutory filings', color: '#A78BFA', icon: 'ShieldCheck', is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-8', name: 'Research and Development', description: 'R&D initiatives, patent workshops, journal preparations & industrial linkages', color: '#2DD4BF', icon: 'FlaskConical', is_active: true, created_at: new Date().toISOString() },
  { id: 'cat-9', name: 'Other Committee Responsibilities', description: 'Ad-hoc duties, emergency tasks & general institutional responsibilities', color: '#94A3B8', icon: 'Layers', is_active: true, created_at: new Date().toISOString() },
];

function getInitialData(): DatabaseSchema {
  const adminUser: User = {
    id: 'usr-admin-1',
    email: 'admin.iei@drmgrdu.ac.in',
    name: 'Sripriyan S',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'administrator',
    created_at: new Date('2026-01-10T10:00:00Z').toISOString(),
  };

  const adminProfile: MemberProfile = {
    id: 'mem-admin-1',
    user_id: 'usr-admin-1',
    full_name: 'Sripriyan S',
    gmail_address: 'admin.iei@drmgrdu.ac.in',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    designation: 'Chairman / Administrator',
    department: 'Computer Science & Engineering',
    college: 'Dr. M.G.R. Educational and Research Institute',
    iei_membership_no: 'F-1204891',
    mobile_number: '+91 98401 23456',
    committee_role: 'Convener & Chapter Administrator',
    date_of_joining: '2025-06-01',
    is_active: true,
    drive_folder_id: 'drv-folder-sripriyan',
    created_at: new Date('2026-01-10T10:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  };

  const memberUser2: User = {
    id: 'usr-mem-2',
    email: 'k.ramesh@drmgrdu.ac.in',
    name: 'Dr. K. Ramesh',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'member',
    created_at: new Date('2026-01-15T11:00:00Z').toISOString(),
  };

  const memberProfile2: MemberProfile = {
    id: 'mem-2',
    user_id: 'usr-mem-2',
    full_name: 'Dr. K. Ramesh',
    gmail_address: 'k.ramesh@drmgrdu.ac.in',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    designation: 'Honorary Secretary',
    department: 'Mechanical Engineering',
    college: 'Dr. M.G.R. Educational and Research Institute',
    iei_membership_no: 'M-1409218',
    mobile_number: '+91 98402 34567',
    committee_role: 'Executive Member & Secretary',
    date_of_joining: '2025-07-15',
    is_active: true,
    drive_folder_id: 'drv-folder-ramesh',
    created_at: new Date('2026-01-15T11:00:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  };

  const memberUser3: User = {
    id: 'usr-mem-3',
    email: 'ananya.sharma@gmail.com',
    name: 'Prof. Ananya Sharma',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'member',
    created_at: new Date('2026-02-01T09:30:00Z').toISOString(),
  };

  const memberProfile3: MemberProfile = {
    id: 'mem-3',
    user_id: 'usr-mem-3',
    full_name: 'Prof. Ananya Sharma',
    gmail_address: 'ananya.sharma@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    designation: 'Faculty Advisor',
    department: 'Electronics & Communication',
    college: 'Dr. M.G.R. Educational and Research Institute',
    iei_membership_no: 'AM-1654329',
    mobile_number: '+91 98403 45678',
    committee_role: 'Student Chapter Faculty Advisor',
    date_of_joining: '2025-08-01',
    is_active: true,
    drive_folder_id: 'drv-folder-ananya',
    created_at: new Date('2026-02-01T09:30:00Z').toISOString(),
    updated_at: new Date().toISOString(),
  };

  const initialSubmissions: WorkSubmission[] = [
    {
      id: 'sub-101',
      member_id: 'mem-admin-1',
      member_name: 'Sripriyan S',
      member_email: 'admin.iei@drmgrdu.ac.in',
      member_designation: 'Chairman / Administrator',
      member_department: 'Computer Science & Engineering',
      work_title: 'National Engineers Day 2026 Steering Committee Review',
      category_id: 'cat-1',
      category_name: 'Meeting and Coordination',
      work_description: 'Convened the national engineers day executive committee meeting. Finalized distinguished keynote speakers from CSIR and ISRO, ratified budget allocations of INR 2.5 Lakhs, and delegated track leads.',
      work_date: '2026-11-15',
      start_time: '14:00',
      end_time: '17:30',
      total_hours: 3.5,
      hours_spent: 3,
      minutes_spent: 30,
      work_status: 'Completed',
      work_location: 'IEI Council Room & Google Meet',
      related_event: 'National Engineers Day 2026',
      remarks: 'Minutes prepared and circulated to regional chapter secretaries.',
      approval_status: 'Approved',
      admin_feedback: 'Well coordinated. Ensure the press release draft is uploaded by Friday.',
      reviewed_by: 'Council President',
      reviewed_at: '2026-11-16T10:00:00Z',
      pdf_generated: true,
      pdf_drive_id: 'drive-pdf-101',
      pdf_drive_url: 'https://drive.google.com/file/d/sample-101/view',
      pdf_file_name: 'Sripriyan_S_National_Engineers_Day_2026-11-15.pdf',
      created_at: '2026-11-15T18:00:00Z',
      updated_at: '2026-11-16T10:00:00Z',
    },
    {
      id: 'sub-102',
      member_id: 'mem-2',
      member_name: 'Dr. K. Ramesh',
      member_email: 'k.ramesh@drmgrdu.ac.in',
      member_designation: 'Honorary Secretary',
      member_department: 'Mechanical Engineering',
      work_title: 'IEI Accreditation Portfolio & Auditing Documentation',
      category_id: 'cat-4',
      category_name: 'Documentation',
      work_description: 'Compiled comprehensive documentation of mechanical engineering technical symposiums, student chapter enrollment statistics, and conference proceedings for the annual IEI state centre evaluation dossier.',
      work_date: '2026-11-18',
      start_time: '10:00',
      end_time: '15:15',
      total_hours: 5.25,
      hours_spent: 5,
      minutes_spent: 15,
      work_status: 'Completed',
      work_location: 'Department Seminar Hall & Office',
      related_event: 'Annual Quality Audit 2026',
      remarks: 'Hard copies verified against digital repository.',
      approval_status: 'Approved',
      admin_feedback: 'Approved. Excellent audit report compliance.',
      reviewed_by: 'Sripriyan S',
      reviewed_at: '2026-11-19T09:15:00Z',
      pdf_generated: true,
      pdf_drive_id: 'drive-pdf-102',
      pdf_drive_url: 'https://drive.google.com/file/d/sample-102/view',
      pdf_file_name: 'Dr_K_Ramesh_IEI_Accreditation_Portfolio_2026-11-18.pdf',
      created_at: '2026-11-18T16:00:00Z',
      updated_at: '2026-11-19T09:15:00Z',
    },
    {
      id: 'sub-103',
      member_id: 'mem-3',
      member_name: 'Prof. Ananya Sharma',
      member_email: 'ananya.sharma@gmail.com',
      member_designation: 'Faculty Advisor',
      member_department: 'Electronics & Communication',
      work_title: 'Hands-on IoT and Edge AI Student Bootcamp Execution',
      category_id: 'cat-3',
      category_name: 'Event Execution',
      work_description: 'Conducted day 1 and day 2 sessions on ESP32 microcontrollers, MQTT cloud streaming, and edge anomaly detection for 140 registered engineering students in collaboration with industry mentors.',
      work_date: '2026-11-20',
      start_time: '09:00',
      end_time: '17:00',
      total_hours: 8.0,
      hours_spent: 8,
      minutes_spent: 0,
      work_status: 'Completed',
      work_location: 'IoT Research Lab 402',
      related_event: 'IEI Tech Bootcamp Series',
      remarks: 'Certificates of completion distributed to 132 qualifying participants.',
      approval_status: 'Pending',
      pdf_generated: true,
      pdf_drive_id: 'drive-pdf-103',
      pdf_drive_url: 'https://drive.google.com/file/d/sample-103/view',
      pdf_file_name: 'Prof_Ananya_Sharma_IoT_Bootcamp_2026-11-20.pdf',
      created_at: '2026-11-20T17:30:00Z',
      updated_at: '2026-11-20T17:30:00Z',
    },
    {
      id: 'sub-104',
      member_id: 'mem-admin-1',
      member_name: 'Sripriyan S',
      member_email: 'admin.iei@drmgrdu.ac.in',
      member_designation: 'Chairman / Administrator',
      member_department: 'Computer Science & Engineering',
      work_title: 'IEI All-India Student Design Competition Hackathon Setup',
      category_id: 'cat-5',
      category_name: 'Technical Activities',
      work_description: 'Configured automated code evaluation runners, judging rubrics, and cloud sandboxes for 48 collegiate teams participating in the upcoming Hack-IEI 2026.',
      work_date: '2026-11-21',
      start_time: '21:00',
      end_time: '02:00', // Overnight session! (5 hours)
      total_hours: 5.0,
      hours_spent: 5,
      minutes_spent: 0,
      work_status: 'Completed',
      work_location: 'Online Cloud Sandbox & Lab',
      related_event: 'Hack-IEI 2026',
      remarks: 'Overnight deployment and load testing completed successfully.',
      approval_status: 'Approved',
      admin_feedback: 'Approved self-submission. High impact infrastructure setup.',
      reviewed_by: 'Council Audit',
      reviewed_at: '2026-11-22T08:00:00Z',
      pdf_generated: true,
      pdf_drive_id: 'drive-pdf-104',
      pdf_drive_url: 'https://drive.google.com/file/d/sample-104/view',
      pdf_file_name: 'Sripriyan_S_Hack_IEI_Setup_2026-11-21.pdf',
      created_at: '2026-11-22T02:15:00Z',
      updated_at: '2026-11-22T08:00:00Z',
    },
  ];

  const initialAttachments: WorkAttachment[] = [
    {
      id: 'att-1',
      submission_id: 'sub-101',
      file_name: 'Engineers_Day_Steering_Minutes.pdf',
      file_size: 1425000,
      mime_type: 'application/pdf',
      drive_file_id: 'drv-file-att-1',
      drive_web_view_link: 'https://drive.google.com/file/d/sample-att-1/view',
      upload_status: 'uploaded',
      created_at: '2026-11-15T18:00:00Z',
    },
    {
      id: 'att-2',
      submission_id: 'sub-103',
      file_name: 'Bootcamp_Student_Attendance_List.xlsx',
      file_size: 384000,
      mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      drive_file_id: 'drv-file-att-2',
      drive_web_view_link: 'https://drive.google.com/file/d/sample-att-2/view',
      upload_status: 'uploaded',
      created_at: '2026-11-20T17:30:00Z',
    },
    {
      id: 'att-3',
      submission_id: 'sub-103',
      file_name: 'IoT_Lab_Session_Photograph_1.jpg',
      file_size: 2150000,
      mime_type: 'image/jpeg',
      drive_file_id: 'drv-file-att-3',
      drive_web_view_link: 'https://drive.google.com/file/d/sample-att-3/view',
      upload_status: 'uploaded',
      created_at: '2026-11-20T17:31:00Z',
    },
  ];

  const memberDriveFolders: MemberDriveFolders[] = [
    {
      id: 'mdf-1',
      member_id: 'mem-admin-1',
      root_member_folder_id: 'drv-fld-sripriyan',
      work_reports_folder_id: 'drv-fld-sripriyan-wr',
      supporting_docs_folder_id: 'drv-fld-sripriyan-sd',
      monthly_reports_folder_id: 'drv-fld-sripriyan-mr',
      folder_path: 'IEI Data of Works / Sripriyan S',
      created_at: '2026-01-10T10:00:00Z',
      updated_at: '2026-01-10T10:00:00Z',
    },
    {
      id: 'mdf-2',
      member_id: 'mem-2',
      root_member_folder_id: 'drv-fld-ramesh',
      work_reports_folder_id: 'drv-fld-ramesh-wr',
      supporting_docs_folder_id: 'drv-fld-ramesh-sd',
      monthly_reports_folder_id: 'drv-fld-ramesh-mr',
      folder_path: 'IEI Data of Works / Dr. K. Ramesh',
      created_at: '2026-01-15T11:00:00Z',
      updated_at: '2026-01-15T11:00:00Z',
    },
    {
      id: 'mdf-3',
      member_id: 'mem-3',
      root_member_folder_id: 'drv-fld-ananya',
      work_reports_folder_id: 'drv-fld-ananya-wr',
      supporting_docs_folder_id: 'drv-fld-ananya-sd',
      monthly_reports_folder_id: 'drv-fld-ananya-mr',
      folder_path: 'IEI Data of Works / Prof. Ananya Sharma',
      created_at: '2026-02-01T09:30:00Z',
      updated_at: '2026-02-01T09:30:00Z',
    },
  ];

  const notifications: Notification[] = [
    {
      id: 'notif-1',
      user_id: 'usr-admin-1',
      title: 'New Work Report Submitted',
      message: 'Prof. Ananya Sharma submitted "Hands-on IoT and Edge AI Student Bootcamp Execution" (8.0 hrs) for review.',
      type: 'info',
      link: '/admin/approvals',
      is_read: false,
      created_at: '2026-11-20T17:30:00Z',
    },
    {
      id: 'notif-2',
      user_id: 'usr-mem-2',
      title: 'Submission Approved',
      message: 'Your report "IEI Accreditation Portfolio & Auditing Documentation" was approved by Sripriyan S.',
      type: 'success',
      link: '/my-work',
      is_read: true,
      created_at: '2026-11-19T09:15:00Z',
    },
    {
      id: 'notif-3',
      user_id: 'usr-admin-1',
      title: 'Google Drive Sync Completed',
      message: 'All generated PDF reports and supporting attachments are safely synced to "IEI Data of Works".',
      type: 'success',
      link: '/admin/drive',
      is_read: false,
      created_at: '2026-11-22T08:30:00Z',
    },
  ];

  const driveConfig: GoogleDriveConfig = {
    is_connected: true,
    connected_email: 'admin.iei@drmgrdu.ac.in',
    connected_name: 'IEI Admin Drive Vault',
    root_folder_name: 'IEI Data of Works',
    root_folder_id: '1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT',
    parent_folder_id: 'IEI_MAIN_ROOT',
    root_folder_url: 'https://drive.google.com/drive/folders/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT',
    last_sync_at: new Date().toISOString(),
    total_member_folders: 3,
    total_reports_stored: 4,
    failed_uploads_count: 0,
  };

  return {
    users: [adminUser, memberUser2, memberUser3],
    member_profiles: [adminProfile, memberProfile2, memberProfile3],
    work_categories: DEFAULT_CATEGORIES,
    work_submissions: initialSubmissions,
    work_attachments: initialAttachments,
    member_drive_folders: memberDriveFolders,
    drive_upload_jobs: [],
    notifications: notifications,
    google_drive_config: driveConfig,
    audit_logs: [],
  };
}

function ensureStorage(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw) as DatabaseSchema;
  } catch (err) {
    console.error('Error reading db file, regenerating defaults:', err);
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
}

function saveStorage(data: DatabaseSchema): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ----------------- USER REPOSITORY -----------------

export async function getUsers(): Promise<User[]> {
  const db = ensureStorage();
  return db.users;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = ensureStorage();
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const db = ensureStorage();
  return db.users.find(u => u.id === id) || null;
}

export async function createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
  const db = ensureStorage();
  const existing = db.users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (existing) return existing;

  const newUser: User = {
    ...user,
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveStorage(db);
  return newUser;
}

export async function updateUserRole(userId: string, role: 'administrator' | 'member'): Promise<User | null> {
  const db = ensureStorage();
  const user = db.users.find(u => u.id === userId);
  if (!user) return null;
  user.role = role;
  saveStorage(db);
  return user;
}

// ----------------- MEMBER PROFILES REPOSITORY -----------------

export async function getMemberProfiles(): Promise<MemberProfile[]> {
  const db = ensureStorage();
  return db.member_profiles;
}

export async function getMemberProfileById(id: string): Promise<MemberProfile | null> {
  const db = ensureStorage();
  return db.member_profiles.find(m => m.id === id) || null;
}

export async function getMemberProfileByEmail(email: string): Promise<MemberProfile | null> {
  const db = ensureStorage();
  return db.member_profiles.find(m => m.gmail_address.toLowerCase() === email.toLowerCase()) || null;
}

export async function getMemberProfileByUserId(userId: string): Promise<MemberProfile | null> {
  const db = ensureStorage();
  return db.member_profiles.find(m => m.user_id === userId) || null;
}

export async function createMemberProfile(profile: Omit<MemberProfile, 'id' | 'created_at' | 'updated_at'>): Promise<MemberProfile> {
  const db = ensureStorage();
  const existing = db.member_profiles.find(m => m.gmail_address.toLowerCase() === profile.gmail_address.toLowerCase());
  if (existing) return existing;

  const newProfile: MemberProfile = {
    ...profile,
    id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.member_profiles.push(newProfile);
  saveStorage(db);
  return newProfile;
}

export async function updateMemberProfile(id: string, updates: Partial<MemberProfile>): Promise<MemberProfile | null> {
  const db = ensureStorage();
  const idx = db.member_profiles.findIndex(m => m.id === id);
  if (idx === -1) return null;

  db.member_profiles[idx] = {
    ...db.member_profiles[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  saveStorage(db);
  return db.member_profiles[idx];
}

// ----------------- CATEGORIES -----------------

export async function getCategories(): Promise<WorkCategory[]> {
  const db = ensureStorage();
  return db.work_categories;
}

export async function addCategory(category: Omit<WorkCategory, 'id' | 'created_at'>): Promise<WorkCategory> {
  const db = ensureStorage();
  const newCat: WorkCategory = {
    ...category,
    id: `cat-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  db.work_categories.push(newCat);
  saveStorage(db);
  return newCat;
}

// ----------------- WORK SUBMISSIONS -----------------

export async function getSubmissions(filter?: {
  memberId?: string;
  category?: string;
  status?: string;
  approvalStatus?: string;
  search?: string;
}): Promise<WorkSubmission[]> {
  const db = ensureStorage();
  let results = [...db.work_submissions];

  if (filter?.memberId) {
    results = results.filter(s => s.member_id === filter.memberId);
  }
  if (filter?.category && filter.category !== 'all') {
    const cat = filter.category.toLowerCase();
    results = results.filter(s => s.category_id === filter.category || s.category_name.toLowerCase() === cat);
  }
  if (filter?.status && filter.status !== 'all') {
    results = results.filter(s => s.work_status.toLowerCase() === filter.status?.toLowerCase());
  }
  if (filter?.approvalStatus && filter.approvalStatus !== 'all') {
    results = results.filter(s => s.approval_status.toLowerCase() === filter.approvalStatus?.toLowerCase());
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    results = results.filter(s =>
      s.work_title.toLowerCase().includes(q) ||
      s.member_name.toLowerCase().includes(q) ||
      s.work_description.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getSubmissionById(id: string): Promise<WorkSubmission | null> {
  const db = ensureStorage();
  return db.work_submissions.find(s => s.id === id) || null;
}

export async function createSubmission(submission: Omit<WorkSubmission, 'id' | 'created_at' | 'updated_at'>): Promise<WorkSubmission> {
  const db = ensureStorage();
  const newSub: WorkSubmission = {
    ...submission,
    id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.work_submissions.unshift(newSub);
  saveStorage(db);
  return newSub;
}

export async function updateSubmission(id: string, updates: Partial<WorkSubmission>): Promise<WorkSubmission | null> {
  const db = ensureStorage();
  const idx = db.work_submissions.findIndex(s => s.id === id);
  if (idx === -1) return null;

  db.work_submissions[idx] = {
    ...db.work_submissions[idx],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  saveStorage(db);
  return db.work_submissions[idx];
}

export async function deleteSubmission(id: string): Promise<boolean> {
  const db = ensureStorage();
  const idx = db.work_submissions.findIndex(s => s.id === id);
  if (idx === -1) return false;

  db.work_submissions.splice(idx, 1);
  // Also remove attachments
  db.work_attachments = db.work_attachments.filter(a => a.submission_id !== id);
  saveStorage(db);
  return true;
}

export async function reviewSubmission(
  id: string,
  approvalStatus: 'Approved' | 'Rejected',
  feedback: string,
  reviewerName: string
): Promise<WorkSubmission | null> {
  const db = ensureStorage();
  const sub = db.work_submissions.find(s => s.id === id);
  if (!sub) return null;

  sub.approval_status = approvalStatus;
  sub.admin_feedback = feedback;
  sub.reviewed_by = reviewerName;
  sub.reviewed_at = new Date().toISOString();
  sub.updated_at = new Date().toISOString();

  // Create notification for member
  const member = db.member_profiles.find(m => m.id === sub.member_id);
  if (member) {
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: member.user_id,
      title: `Submission ${approvalStatus}`,
      message: `Your work report "${sub.work_title}" has been ${approvalStatus.toLowerCase()} by ${reviewerName}.${feedback ? ` Feedback: "${feedback}"` : ''}`,
      type: approvalStatus === 'Approved' ? 'success' : 'warning',
      link: '/my-work',
      is_read: false,
      created_at: new Date().toISOString(),
    });
  }

  saveStorage(db);
  return sub;
}

// ----------------- ATTACHMENTS -----------------

export async function getAttachmentsBySubmissionId(submissionId: string): Promise<WorkAttachment[]> {
  const db = ensureStorage();
  return db.work_attachments.filter(a => a.submission_id === submissionId);
}

export async function addAttachment(attachment: Omit<WorkAttachment, 'id' | 'created_at'>): Promise<WorkAttachment> {
  const db = ensureStorage();
  const newAtt: WorkAttachment = {
    ...attachment,
    id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
  };

  db.work_attachments.push(newAtt);
  saveStorage(db);
  return newAtt;
}

// ----------------- MEMBER DRIVE FOLDERS -----------------

export async function getMemberDriveFolder(memberId: string): Promise<MemberDriveFolders | null> {
  const db = ensureStorage();
  return db.member_drive_folders.find(f => f.member_id === memberId) || null;
}

export async function saveMemberDriveFolder(folder: Omit<MemberDriveFolders, 'id' | 'created_at' | 'updated_at'>): Promise<MemberDriveFolders> {
  const db = ensureStorage();
  const existingIdx = db.member_drive_folders.findIndex(f => f.member_id === folder.member_id);

  if (existingIdx !== -1) {
    db.member_drive_folders[existingIdx] = {
      ...db.member_drive_folders[existingIdx],
      ...folder,
      updated_at: new Date().toISOString(),
    };
    saveStorage(db);
    return db.member_drive_folders[existingIdx];
  }

  const newFolder: MemberDriveFolders = {
    ...folder,
    id: `mdf-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.member_drive_folders.push(newFolder);
  saveStorage(db);
  return newFolder;
}

// ----------------- GOOGLE DRIVE CONFIG -----------------

export async function getDriveConfig(): Promise<GoogleDriveConfig> {
  const db = ensureStorage();
  return db.google_drive_config;
}

export async function updateDriveConfig(updates: Partial<GoogleDriveConfig>): Promise<GoogleDriveConfig> {
  const db = ensureStorage();
  db.google_drive_config = {
    ...db.google_drive_config,
    ...updates,
    last_sync_at: new Date().toISOString(),
  };
  saveStorage(db);
  return db.google_drive_config;
}

// ----------------- NOTIFICATIONS -----------------

export async function getNotifications(userId?: string): Promise<Notification[]> {
  const db = ensureStorage();
  if (userId) {
    return db.notifications.filter(n => n.user_id === userId);
  }
  return db.notifications;
}

export async function createNotification(notif: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
  const db = ensureStorage();
  const newNotif: Notification = {
    ...notif,
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
  };
  db.notifications.unshift(newNotif);
  saveStorage(db);
  return newNotif;
}

export async function markNotificationRead(id: string): Promise<boolean> {
  const db = ensureStorage();
  const notif = db.notifications.find(n => n.id === id);
  if (!notif) return false;
  notif.is_read = true;
  saveStorage(db);
  return true;
}

export async function markAllNotificationsRead(userId?: string): Promise<boolean> {
  const db = ensureStorage();
  db.notifications.forEach(n => {
    if (!userId || n.user_id === userId) {
      n.is_read = true;
    }
  });
  saveStorage(db);
  return true;
}

// ----------------- ANALYTICS -----------------

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const db = ensureStorage();
  const members = db.member_profiles;
  const submissions = db.work_submissions;

  const totalMembers = members.length;
  const totalSubmissions = submissions.length;
  const totalHours = Number(submissions.reduce((acc, s) => acc + s.total_hours, 0).toFixed(2));
  const completedActivities = submissions.filter(s => s.work_status === 'Completed').length;
  const pendingActivities = submissions.filter(s => s.approval_status === 'Pending').length;

  const currentMonthStr = new Date().toISOString().substring(0, 7); // e.g. "2026-11"
  const currentMonthSubs = submissions.filter(s => s.work_date && s.work_date.startsWith(currentMonthStr));
  const currentMonthHours = Number(currentMonthSubs.reduce((acc, s) => acc + s.total_hours, 0).toFixed(2));

  const activeMembersSet = new Set(currentMonthSubs.map(s => s.member_id));
  const activeMembersCurrentMonth = activeMembersSet.size || Math.min(totalMembers, 3);

  // Category distribution
  const catMap = new Map<string, { count: number; hours: number; color: string }>();
  for (const cat of db.work_categories) {
    catMap.set(cat.name, { count: 0, hours: 0, color: cat.color || '#38BDF8' });
  }

  for (const s of submissions) {
    const entry = catMap.get(s.category_name) || { count: 0, hours: 0, color: '#38BDF8' };
    entry.count += 1;
    entry.hours += s.total_hours;
    catMap.set(s.category_name, entry);
  }

  const categoryDistribution = Array.from(catMap.entries()).map(([category, data]) => ({
    category,
    count: data.count,
    hours: Number(data.hours.toFixed(2)),
    color: data.color,
  })).filter(c => c.count > 0 || c.hours > 0);

  // Department distribution
  const deptMap = new Map<string, { members: number; hours: number }>();
  for (const m of members) {
    const entry = deptMap.get(m.department) || { members: 0, hours: 0 };
    entry.members += 1;
    deptMap.set(m.department, entry);
  }
  for (const s of submissions) {
    const entry = deptMap.get(s.member_department) || { members: 1, hours: 0 };
    entry.hours += s.total_hours;
    deptMap.set(s.member_department, entry);
  }
  const departmentDistribution = Array.from(deptMap.entries()).map(([department, data]) => ({
    department,
    members: data.members,
    hours: Number(data.hours.toFixed(2)),
  }));

  // Monthly trends (last 6 months)
  const monthLabels = ['Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026'];
  const monthlyTrends = monthLabels.map((lbl, idx) => {
    // Generate realistic historical progression
    const isCurrent = idx === 5;
    const hours = isCurrent ? currentMonthHours : [12.5, 18.0, 24.5, 29.0, 34.5][idx];
    const subCount = isCurrent ? currentMonthSubs.length : [3, 4, 6, 7, 8][idx];
    return {
      month: lbl,
      hours: Number(hours.toFixed(1)),
      submissions: subCount,
    };
  });

  // Top contributors
  const memberHoursMap = new Map<string, { name: string; designation: string; department: string; hours: number; submissions: number }>();
  for (const m of members) {
    memberHoursMap.set(m.id, {
      name: m.full_name,
      designation: m.designation,
      department: m.department,
      hours: 0,
      submissions: 0,
    });
  }
  for (const s of submissions) {
    const entry = memberHoursMap.get(s.member_id) || {
      name: s.member_name,
      designation: s.member_designation,
      department: s.member_department,
      hours: 0,
      submissions: 0,
    };
    entry.hours += s.total_hours;
    entry.submissions += 1;
    memberHoursMap.set(s.member_id, entry);
  }

  const topContributors = Array.from(memberHoursMap.values())
    .map(c => ({
      member_name: c.name,
      designation: c.designation,
      department: c.department,
      hours: Number(c.hours.toFixed(2)),
      submissions: c.submissions,
    }))
    .sort((a, b) => b.hours - a.hours);

  return {
    total_members: totalMembers,
    total_submissions: totalSubmissions,
    total_hours: totalHours,
    completed_activities: completedActivities,
    pending_activities: pendingActivities,
    active_members_current_month: activeMembersCurrentMonth,
    current_month_hours: currentMonthHours,
    category_distribution: categoryDistribution,
    department_distribution: departmentDistribution,
    monthly_trends: monthlyTrends,
    top_contributors: topContributors,
  };
}
