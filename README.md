# 🚀 PROJECT FRIDAY
## Faculty & Responsibility Integrated Data Analytics Yard
### IEI Committee Work Management, Activity Tracking & Automated Google Drive Reporting System

> **Tagline:** *"Every Task. Every Hour. Every Contribution. One Intelligent Workspace."*  
> **Organization:** The Institution of Engineers (India) — IEI  
> **Institution:** Dr. M.G.R. Educational and Research Institute

---

## 📖 Executive Overview

**FRIDAY (Faculty & Responsibility Integrated Data Analytics Yard)** is a specialized, production-ready enterprise committee work management platform designed specifically for **IEI (Institution of Engineers, India)** committee members, conveners, faculty advisors, and student chapter executives.

FRIDAY bridges the gap between individual faculty contributions and administrative accountability. Every registered committee member records their activities, uploads supporting documents, and tracks working hours with overnight multi-session intelligence. The system automatically compiles each submission into an authenticated, official IEI PDF work report and organizes all documents hierarchically inside the **Administrator's Google Drive** under `IEI Data of Works`.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | **Next.js 16 (App Router)** with **React 19** & **TypeScript** |
| **Styling & Design System** | **Tailwind CSS v4** + Custom Deep Navy/Electric Blue Glassmorphic Design |
| **Icons & Micro-interactions** | **Lucide React** + Framer Motion |
| **Data Analytics & Visualizations** | **Recharts** (Area charts, Donut pies, Comparative leaderboards) |
| **Database & Security** | **Supabase PostgreSQL** + Complete Row Level Security (RLS) Policies |
| **Cloud Storage & Sync** | **Google Drive API (v3)** via official `googleapis` |
| **Document Generation** | **jsPDF** & **jspdf-autotable** (Official IEI Letterhead PDF reports) |
| **Spreadsheet Exports** | **xlsx** (Multi-sheet Excel Workbooks) & CSV Streamers |
| **Deployment Target** | **Vercel** |

---

## 📂 Administrator's Google Drive Architecture

All work submissions and supporting documents are automatically routed and archived in the **Administrator's Google Drive** (not scattered across individual member drives):

```text
My Drive (or Custom Parent Folder e.g. IEI WORK DATA)
└── 📁 IEI Data of Works
    │
    ├── 📁 Sripriyan S (Chairman / Administrator)
    │   ├── 📁 Work Reports       # Format: MemberName_WorkTitle_YYYY-MM-DD.pdf
    │   ├── 📁 Supporting Documents # Photos, Certificates, Spreadsheets, Docs
    │   └── 📁 Monthly Reports     # Automated Monthly Aggregations
    │
    ├── 📁 Dr. K. Ramesh (Honorary Secretary)
    │   ├── 📁 Work Reports
    │   ├── 📁 Supporting Documents
    │   └── 📁 Monthly Reports
    │
    ├── 📁 Prof. Ananya Sharma (Faculty Advisor)
    │   ├── 📁 Work Reports
    │   ├── 📁 Supporting Documents
    │   └── 📁 Monthly Reports
    │
    └── 📁 [Other Registered Committee Members...]
```

---

## ⚡ Core Application Workflows

### 1. Google OAuth & Member Registration
1. The committee member clicks **Continue with Google**.
2. Google authenticates the verified Gmail address.
3. If new, the member completes profile registration (Full Name, Locked Gmail, Designation, Department, Institution, IEI Membership No, Mobile No, Role, Joining Date).
4. FRIDAY automatically checks the Administrator's Drive and creates the member's folder hierarchy (`Work Reports`, `Supporting Documents`, `Monthly Reports`). Folder IDs are indexed in the database.

### 2. Work Submission & Automated Working-Hour Engine
1. Member details are pre-populated.
2. Selects category (Meeting & Coordination, Event Planning, Event Execution, Documentation, Technical Activities, Communication & Outreach, Administrative Work, Research & Development, etc.).
3. Enters Start Time & End Time.
4. **Automated Calculation Engine** computes exact duration in hours and minutes, with **robust support for overnight sessions past midnight** (e.g. 21:00 to 02:00 = 5.0 hours).
5. Uploads multiple supporting documents (Images, PDFs, Word, Excel).
6. FRIDAY stores the submission, generates a certified **IEI Official PDF Work Report**, and uploads both the PDF and all attachments to the Administrator's Drive.

### 3. Administrator Dashboard & Approvals Terminal
1. Administrator has system-wide visibility of total working hours, completed activities, and departmental distributions.
2. Opens the **Approvals Queue** to review submissions, inspect attached evidence, and provide feedback remarks with one-click **Approve** or **Reject**.
3. Real-time in-app notification is delivered to the submitting member.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### 1. Clone & Install Dependencies
```bash
cd friday-iei
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Pre-Seeded Demo Profiles

FRIDAY comes equipped with an **Instant Demo Role Switcher** in the top navigation header so you can immediately experience both member and administrator workflows without waiting for Google Cloud credentials:

| Profile | Role | Department | Default View |
|---|---|---|---|
| **Sripriyan S** (`admin.iei@drmgrdu.ac.in`) | **Administrator** (Chairman) | Computer Science & Engineering | `/admin` |
| **Dr. K. Ramesh** (`k.ramesh@drmgrdu.ac.in`) | **Committee Member** (Hon. Secretary) | Mechanical Engineering | `/dashboard` |
| **Prof. Ananya Sharma** (`ananya.sharma@gmail.com`) | **Committee Member** (Faculty Advisor) | Electronics & Communication | `/dashboard` |

Click **Switch Role** in the top navbar at any time to toggle between Administrator and Member perspectives.

---

## ☁️ Google Cloud Console Setup Guide

To link your live Google Drive:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g. `IEI-FRIDAY-Vault`).
3. Under **APIs & Services**, enable the **Google Drive API**.
4. Configure **OAuth Consent Screen** (User type: External or Internal).
5. Scopes: `https://www.googleapis.com/auth/drive`, `.../userinfo.email`, `.../userinfo.profile`.
6. Go to **Credentials** -> **Create Credentials** -> **OAuth Client ID** (Web application).
7. Add Authorized Redirect URIs:
   - `http://localhost:3000/api/drive/callback`
   - `http://localhost:3000/api/auth/callback`
8. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`.
9. Navigate to `/admin/drive` and click **Connect Administrator Google Drive**.

---

## 🗄️ Supabase PostgreSQL Migration

If deploying with Supabase:
1. Create a project on [Supabase.com](https://supabase.com).
2. Open the **SQL Editor**.
3. Paste the contents of `supabase/migrations/001_initial_schema.sql` and run.
4. Copy the Project URL, Anon Key, and Service Role Key to `.env.local`.

---

## 🌐 Vercel Production Deployment

FRIDAY is pre-configured for Vercel deployment:
1. Push your repository to GitHub.
2. In Vercel, click **Import Project** and select `friday-iei`.
3. Add the environment variables from `.env.example`.
4. Deploy!

```bash
vercel --prod
```

---

## ⚖️ License
Engineered for **The Institution of Engineers (India) - IEI**. All rights reserved.
"# FRIDAY" 
"# FRIDAY" 
