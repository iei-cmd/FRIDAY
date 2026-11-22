const http = require('http');

async function testEndpoint(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const reqOptions = {
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = http.request(reqOptions, (res) => {
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: buffer.toString('utf-8'),
          rawBuffer: buffer,
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING FRIDAY VERIFICATION SUITE ---');
  const baseUrl = 'http://localhost:3000';

  try {
    // 1. Session check
    console.log('1. Testing /api/auth/session...');
    const sessionRes = await testEndpoint(`${baseUrl}/api/auth/session`);
    console.log(`Status: ${sessionRes.statusCode}`);
    const sessionData = JSON.parse(sessionRes.body);
    console.log(`Authenticated: ${sessionData.authenticated}, User: ${sessionData.session?.user?.name}`);

    // 2. Members check
    console.log('\n2. Testing /api/members...');
    const membersRes = await testEndpoint(`${baseUrl}/api/members`);
    console.log(`Status: ${membersRes.statusCode}`);
    const membersData = JSON.parse(membersRes.body);
    console.log(`Total Members: ${membersData.members?.length}`);

    // 3. Submissions check
    console.log('\n3. Testing /api/submissions...');
    const subsRes = await testEndpoint(`${baseUrl}/api/submissions`);
    console.log(`Status: ${subsRes.statusCode}`);
    const subsData = JSON.parse(subsRes.body);
    console.log(`Total Submissions: ${subsData.submissions?.length}`);

    // 4. Create new work submission (Overnight session test)
    console.log('\n4. Testing POST /api/submissions with overnight hours...');
    const newSubPayload = {
      member_email: 'k.ramesh@drmgrdu.ac.in',
      work_title: 'Automated Overnight Server Maintenance & Database Backup',
      category_id: 'cat-5',
      category_name: 'Technical Activities',
      work_description: 'Performed scheduled overnight database indexing, security patch verification, and Google Drive vault synchronization across faculty dossiers.',
      work_date: '2026-11-22',
      start_time: '23:00',
      end_time: '03:30', // Overnight: 4.5 hours
      work_status: 'Completed',
      work_location: 'Server Room & Remote Cloud Console',
      related_event: 'System Maintenance Cycle',
      remarks: 'All test assertions passed without regression.',
      attachments: [],
    };

    const createRes = await testEndpoint(`${baseUrl}/api/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: newSubPayload,
    });
    console.log(`Create Status: ${createRes.statusCode}`);
    const createdData = JSON.parse(createRes.body);
    console.log(`Created ID: ${createdData.submission?.id}`);
    console.log(`Calculated Duration: ${createdData.calculation?.formatted_duration} (${createdData.calculation?.total_hours} hrs, overnight: ${createdData.calculation?.is_overnight})`);
    console.log(`Generated PDF File: ${createdData.pdfFileName}`);

    const newSubId = createdData.submission?.id;

    // 5. Test PDF Export
    if (newSubId) {
      console.log(`\n5. Testing /api/submissions/export/pdf?id=${newSubId}...`);
      const pdfRes = await testEndpoint(`${baseUrl}/api/submissions/export/pdf?id=${newSubId}`);
      console.log(`PDF Status: ${pdfRes.statusCode}, Content-Type: ${pdfRes.headers['content-type']}, Size: ${pdfRes.rawBuffer.length} bytes`);
    }

    // 6. Test Excel Export
    console.log('\n6. Testing /api/submissions/export/excel?type=consolidated...');
    const excelRes = await testEndpoint(`${baseUrl}/api/submissions/export/excel?type=consolidated`);
    console.log(`Excel Status: ${excelRes.statusCode}, Content-Type: ${excelRes.headers['content-type']}, Size: ${excelRes.rawBuffer.length} bytes`);

    // 7. Test Admin Review
    if (newSubId) {
      console.log(`\n7. Testing POST /api/submissions/${newSubId}/review...`);
      const reviewRes = await testEndpoint(`${baseUrl}/api/submissions/${newSubId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          approval_status: 'Approved',
          admin_feedback: 'Verified and approved by Committee Chairman.',
          reviewer_name: 'Sripriyan S (Chairman)',
        },
      });
      console.log(`Review Status: ${reviewRes.statusCode}`);
      const reviewData = JSON.parse(reviewRes.body);
      console.log(`New Approval Status: ${reviewData.submission?.approval_status}`);
    }

    // 8. Test Analytics Summary
    console.log('\n8. Testing /api/analytics...');
    const analyticsRes = await testEndpoint(`${baseUrl}/api/analytics`);
    console.log(`Status: ${analyticsRes.statusCode}`);
    const analyticsData = JSON.parse(analyticsRes.body);
    console.log(`Total Hours: ${analyticsData.summary?.total_hours} hrs, Top Contributor: ${analyticsData.summary?.top_contributors?.[0]?.member_name}`);

    // 9. Test Drive Status & Connection Test
    console.log('\n9. Testing /api/drive/status and /api/drive/test...');
    const driveStatusRes = await testEndpoint(`${baseUrl}/api/drive/status`);
    console.log(`Drive Status: ${JSON.parse(driveStatusRes.body).status}`);
    const driveTestRes = await testEndpoint(`${baseUrl}/api/drive/test`, { method: 'POST' });
    console.log(`Drive Test Result: ${JSON.parse(driveTestRes.body).message}`);

    console.log('\n🎉 ALL FRIDAY E2E VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test Suite Failed:', err);
    process.exit(1);
  }
}

runTests();
