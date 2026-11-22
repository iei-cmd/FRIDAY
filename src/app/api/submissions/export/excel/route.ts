import { NextRequest, NextResponse } from 'next/server';
import {
  getSubmissions,
  getMemberProfiles,
  getAnalyticsSummary,
} from '@/lib/db';
import {
  generateSubmissionsExcel,
  generateMembersExcel,
  generateConsolidatedReportExcel,
  generateCSV,
} from '@/lib/export-excel';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'submissions'; // submissions | members | consolidated | csv
    const memberId = searchParams.get('memberId') || undefined;

    const submissions = await getSubmissions({ memberId });
    const members = await getMemberProfiles();
    const analytics = await getAnalyticsSummary();

    const timestamp = new Date().toISOString().split('T')[0];

    if (type === 'csv') {
      const csvString = generateCSV(submissions);
      return new NextResponse(csvString, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="FRIDAY_Submissions_${timestamp}.csv"`,
        },
      });
    }

    if (type === 'members') {
      const buffer = generateMembersExcel(members);
      return new NextResponse(buffer as any, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="FRIDAY_IEI_Members_${timestamp}.xlsx"`,
        },
      });
    }

    if (type === 'consolidated') {
      const buffer = generateConsolidatedReportExcel(submissions, members, analytics);
      return new NextResponse(buffer as any, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="FRIDAY_IEI_Consolidated_Report_${timestamp}.xlsx"`,
        },
      });
    }

    // Default: submissions excel
    const buffer = generateSubmissionsExcel(submissions);
    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="FRIDAY_Submissions_Report_${timestamp}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error('Excel export error:', error);
    return NextResponse.json({ error: error.message || 'Failed to export Excel file' }, { status: 500 });
  }
}
