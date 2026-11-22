-- ==============================================================================
-- PROJECT FRIDAY: Faculty & Responsibility Integrated Data Analytics Yard
-- IEI Committee Work Management, Activity Tracking & Reporting System
-- Supabase PostgreSQL Initial Migration Script (Schema + RLS + Triggers + Indexes)
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. WORK CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.work_categories (
    id VARCHAR(50) PRIMARY KEY DEFAULT ('cat-' || uuid_generate_v4()::text),
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20) DEFAULT '#38BDF8',
    icon VARCHAR(50) DEFAULT 'Layers',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('usr-' || uuid_generate_v4()::text),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(30) DEFAULT 'member' CHECK (role IN ('administrator', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. MEMBER PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.member_profiles (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('mem-' || uuid_generate_v4()::text),
    user_id VARCHAR(100) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    gmail_address VARCHAR(255) NOT NULL UNIQUE,
    avatar_url TEXT,
    designation VARCHAR(150) NOT NULL,
    department VARCHAR(150) NOT NULL,
    college VARCHAR(255) NOT NULL DEFAULT 'Dr. M.G.R. Educational and Research Institute',
    iei_membership_no VARCHAR(100),
    mobile_number VARCHAR(30) NOT NULL,
    committee_role VARCHAR(150) NOT NULL,
    date_of_joining DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT TRUE,
    drive_folder_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. MEMBER GOOGLE DRIVE FOLDERS TABLE
CREATE TABLE IF NOT EXISTS public.member_drive_folders (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('mdf-' || uuid_generate_v4()::text),
    member_id VARCHAR(100) NOT NULL REFERENCES public.member_profiles(id) ON DELETE CASCADE,
    root_member_folder_id VARCHAR(255) NOT NULL,
    work_reports_folder_id VARCHAR(255) NOT NULL,
    supporting_docs_folder_id VARCHAR(255) NOT NULL,
    monthly_reports_folder_id VARCHAR(255) NOT NULL,
    folder_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    CONSTRAINT unique_member_drive_folder UNIQUE (member_id)
);

-- 5. WORK SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.work_submissions (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('sub-' || uuid_generate_v4()::text),
    member_id VARCHAR(100) NOT NULL REFERENCES public.member_profiles(id) ON DELETE CASCADE,
    member_name VARCHAR(255) NOT NULL,
    member_email VARCHAR(255) NOT NULL,
    member_designation VARCHAR(150) NOT NULL,
    member_department VARCHAR(150) NOT NULL,
    work_title VARCHAR(255) NOT NULL,
    category_id VARCHAR(50) NOT NULL REFERENCES public.work_categories(id),
    category_name VARCHAR(150) NOT NULL,
    work_description TEXT NOT NULL,
    work_date DATE NOT NULL,
    start_time VARCHAR(10) NOT NULL, -- "HH:MM"
    end_time VARCHAR(10) NOT NULL,   -- "HH:MM"
    total_hours NUMERIC(6, 2) NOT NULL CHECK (total_hours > 0 AND total_hours <= 24),
    hours_spent INT NOT NULL DEFAULT 0,
    minutes_spent INT NOT NULL DEFAULT 0,
    work_status VARCHAR(50) DEFAULT 'Completed' CHECK (work_status IN ('Completed', 'In Progress', 'Needs Review')),
    work_location VARCHAR(150) DEFAULT 'Offline Campus',
    related_event VARCHAR(255),
    remarks TEXT,
    approval_status VARCHAR(50) DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
    admin_feedback TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    pdf_generated BOOLEAN DEFAULT FALSE,
    pdf_drive_id VARCHAR(255),
    pdf_drive_url TEXT,
    pdf_file_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. WORK ATTACHMENTS TABLE
CREATE TABLE IF NOT EXISTS public.work_attachments (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('att-' || uuid_generate_v4()::text),
    submission_id VARCHAR(100) NOT NULL REFERENCES public.work_submissions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(150) NOT NULL,
    file_data TEXT, -- Optional base64 or bucket link
    drive_file_id VARCHAR(255),
    drive_web_view_link TEXT,
    drive_download_link TEXT,
    drive_folder_id VARCHAR(255),
    upload_status VARCHAR(30) DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploaded', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. DRIVE UPLOAD JOBS (RETRY QUEUE)
CREATE TABLE IF NOT EXISTS public.drive_upload_jobs (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('job-' || uuid_generate_v4()::text),
    submission_id VARCHAR(100) NOT NULL REFERENCES public.work_submissions(id) ON DELETE CASCADE,
    job_type VARCHAR(30) NOT NULL CHECK (job_type IN ('pdf_report', 'attachment')),
    attachment_id VARCHAR(100) REFERENCES public.work_attachments(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    target_folder_id VARCHAR(255) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    attempts INT DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 8. SUBMISSION FEEDBACK & AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.submission_audit_logs (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('aud-' || uuid_generate_v4()::text),
    actor_id VARCHAR(100) NOT NULL,
    actor_name VARCHAR(255) NOT NULL,
    actor_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('notif-' || uuid_generate_v4()::text),
    user_id VARCHAR(100) NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 10. SYSTEM SETTINGS & GOOGLE DRIVE CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_member_profiles_user_id ON public.member_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_member_profiles_email ON public.member_profiles(gmail_address);
CREATE INDEX IF NOT EXISTS idx_member_profiles_dept ON public.member_profiles(department);
CREATE INDEX IF NOT EXISTS idx_work_submissions_member_id ON public.work_submissions(member_id);
CREATE INDEX IF NOT EXISTS idx_work_submissions_date ON public.work_submissions(work_date);
CREATE INDEX IF NOT EXISTS idx_work_submissions_category ON public.work_submissions(category_id);
CREATE INDEX IF NOT EXISTS idx_work_submissions_status ON public.work_submissions(work_status);
CREATE INDEX IF NOT EXISTS idx_work_submissions_approval ON public.work_submissions(approval_status);
CREATE INDEX IF NOT EXISTS idx_work_attachments_sub_id ON public.work_attachments(submission_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_drive_jobs_status ON public.drive_upload_jobs(status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_drive_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Categories: Read-only for all, write for admin
CREATE POLICY "Allow public read categories" ON public.work_categories
    FOR SELECT USING (true);

-- Work Submissions: Members see their own; Admins see all
CREATE POLICY "Members see own submissions" ON public.work_submissions
    FOR SELECT USING (
        auth.jwt() ->> 'email' = member_email OR 
        EXISTS (SELECT 1 FROM public.users WHERE users.email = auth.jwt() ->> 'email' AND users.role = 'administrator')
    );

CREATE POLICY "Members insert own submissions" ON public.work_submissions
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'email' = member_email
    );

CREATE POLICY "Members update own pending submissions" ON public.work_submissions
    FOR UPDATE USING (
        (auth.jwt() ->> 'email' = member_email AND approval_status = 'Pending') OR
        EXISTS (SELECT 1 FROM public.users WHERE users.email = auth.jwt() ->> 'email' AND users.role = 'administrator')
    );

-- Notifications: Only receiver can read/update
CREATE POLICY "Users read own notifications" ON public.notifications
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users WHERE users.id = notifications.user_id AND users.email = auth.jwt() ->> 'email')
    );

-- ==============================================================================
-- SEED DEFAULT CATEGORIES
-- ==============================================================================
INSERT INTO public.work_categories (id, name, description, color, icon) VALUES
('cat-1', 'Meeting and Coordination', 'Core committee meetings, council discussions & agenda planning', '#38BDF8', 'Users'),
('cat-2', 'Event Planning', 'Symposiums, technical workshops, seminars, and guest lecture preparations', '#818CF8', 'Calendar'),
('cat-3', 'Event Execution', 'Conducting live events, stage management, registration & participant handling', '#34D399', 'PlayCircle'),
('cat-4', 'Documentation', 'Minutes of meetings, annual reports, accreditation dossiers & newsletters', '#FBBF24', 'FileText'),
('cat-5', 'Technical Activities', 'Hackathons, project expos, code sprints, and technical paper reviews', '#60A5FA', 'Cpu'),
('cat-6', 'Communication and Outreach', 'Public relations, institutional branding, student chapter outreach & social media', '#F472B6', 'Share2'),
('cat-7', 'Administrative Work', 'Budgeting, sponsorship coordination, procurement & statutory filings', '#A78BFA', 'ShieldCheck'),
('cat-8', 'Research and Development', 'R&D initiatives, patent workshops, journal preparations & industrial linkages', '#2DD4BF', 'FlaskConical'),
('cat-9', 'Other Committee Responsibilities', 'Ad-hoc duties, emergency tasks & general institutional responsibilities', '#94A3B8', 'Layers')
ON CONFLICT (name) DO NOTHING;
