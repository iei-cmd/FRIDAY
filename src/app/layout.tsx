import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FRIDAY | Faculty & Responsibility Integrated Data Analytics Yard',
  description: 'IEI Committee Work Management, Activity Tracking & Automated Google Drive Reporting System for The Institution of Engineers (India).',
  keywords: ['FRIDAY', 'IEI', 'Institution of Engineers India', 'Faculty Work Management', 'Activity Tracking', 'Google Drive Integration'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070b14] text-slate-100 antialiased selection:bg-sky-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
