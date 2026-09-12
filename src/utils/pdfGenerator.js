import jsPDF from 'jspdf';

export const generateOfficialReportPDF = (title, category = 'all', liveData = {}) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const { crops = [], livestock = [], validations = [], schedules = [], users = [] } = liveData;

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 15;

  // Header Colors
  const primaryColor = [12, 54, 25]; // #0c3619 (Forest Green)
  const secondaryColor = [22, 163, 74]; // #16a34a (Vibrant Green)
  const darkTextColor = [17, 24, 39]; // #111827
  const grayTextColor = [100, 116, 139]; // #64748b

  // Draw Header Banner on Every Page
  const drawHeader = (docInstance) => {
    docInstance.setFillColor(...primaryColor);
    docInstance.rect(0, 0, pageWidth, 28, 'F');

    docInstance.setTextColor(255, 255, 255);
    docInstance.setFont('helvetica', 'bold');
    docInstance.setFontSize(13);
    docInstance.text('ANTIPOLO ORGANIC FARMING COOPERATIVE (MARIKHA)', 14, 11);

    docInstance.setFont('helvetica', 'normal');
    docInstance.setFontSize(8);
    docInstance.text('EXECUTIVE SUPER ADMIN CONSOLIDATED OPERATIONAL REPORT · REG: ANT-ORG-001', 14, 18);
    docInstance.text(`Generated: ${new Date().toLocaleString()} · Supabase Live Cloud Synchronized`, 14, 23);

    // Accent Ribbon
    docInstance.setFillColor(...secondaryColor);
    docInstance.rect(pageWidth - 32, 0, 32, 28, 'F');
    docInstance.setTextColor(255, 255, 255);
    docInstance.setFont('helvetica', 'bold');
    docInstance.setFontSize(7.5);
    docInstance.text('OFFICIAL REPORT', pageWidth - 30, 16);
  };

  // Draw Footer on Every Page
  const drawFooter = (docInstance, pageNum, totalPages) => {
    docInstance.setDrawColor(226, 232, 240);
    docInstance.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

    docInstance.setTextColor(...grayTextColor);
    docInstance.setFontSize(7.5);
    docInstance.setFont('helvetica', 'normal');
    docInstance.text('MARIKHA Agriculture Management Platform — Verified Supabase Data Export', 14, pageHeight - 9);
    docInstance.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 28, pageHeight - 9);
  };

  const checkPageBreak = (neededHeight) => {
    if (currentY + neededHeight > pageHeight - 20) {
      doc.addPage();
      drawHeader(doc);
      currentY = 36;
    }
  };

  // 1. Initial Page Header
  drawHeader(doc);
  currentY = 36;

  // 2. Document Title Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, currentY, pageWidth - 28, 22, 3, 3, 'FD');

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text((title || 'Executive Master Consolidated Report').toUpperCase(), 18, currentY + 9);

  doc.setTextColor(...grayTextColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const refCode = `MAR-RPT-${Math.floor(100000 + Math.random() * 900000)}`;
  doc.text(`Reference No: ${refCode} | Source: Supabase Cloud Database | Authority: Executive Super Admin`, 18, currentY + 16);

  currentY += 28;

  // 3. Executive KPI Snapshot
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkTextColor);
  doc.text('1. LIVE EXECUTIVE OPERATIONAL SNAPSHOT', 14, currentY);
  currentY += 5;

  const totalLivestockHeads = livestock.reduce((acc, l) => acc + (Number(l.headCount) || 0), 0);
  const validatedCount = validations.filter(v => v.status === 'Validated').length;

  const kpis = [
    { label: 'Active Crop Plots', val: `${crops.length} Plots` },
    { label: 'Livestock Headcount', val: `${totalLivestockHeads} Heads` },
    { label: 'Validated Activity Logs', val: `${validatedCount} / ${validations.length}` },
    { label: 'Cooperative Schedules', val: `${schedules.length} Events` }
  ];

  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, currentY, pageWidth - 28, 20, 2, 2, 'FD');

  let kpiX = 18;
  kpis.forEach(kpi => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(22, 101, 52);
    doc.text(kpi.label.toUpperCase(), kpiX, currentY + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...primaryColor);
    doc.text(kpi.val, kpiX, currentY + 14);

    kpiX += 45;
  });

  currentY += 26;

  // Generic Structured Table Drawer
  const drawTable = (sectionTitle, headers, rows, colWidths) => {
    checkPageBreak(30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...darkTextColor);
    doc.text(sectionTitle, 14, currentY);
    currentY += 6;

    // Header Row
    doc.setFillColor(...primaryColor);
    doc.rect(14, currentY, pageWidth - 28, 7.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);

    let hX = 16;
    headers.forEach((h, idx) => {
      doc.text(h, hX, currentY + 5.2);
      hX += colWidths[idx];
    });

    currentY += 7.5;

    if (rows.length === 0) {
      checkPageBreak(10);
      doc.setFillColor(249, 250, 251);
      doc.rect(14, currentY, pageWidth - 28, 8, 'F');
      doc.setTextColor(...grayTextColor);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.8);
      doc.text('No live database records found for this section.', 18, currentY + 5.5);
      currentY += 10;
      return;
    }

    // Rows
    rows.forEach((row, rIdx) => {
      checkPageBreak(8);
      const isAlt = rIdx % 2 === 1;
      doc.setFillColor(isAlt ? 248 : 255, isAlt ? 250 : 255, isAlt ? 252 : 255);
      doc.rect(14, currentY, pageWidth - 28, 7, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(14, currentY + 7, pageWidth - 14, currentY + 7);

      doc.setTextColor(...darkTextColor);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);

      let rX = 16;
      row.forEach((cellText, cIdx) => {
        const textStr = String(cellText || '');
        const maxLen = Math.floor(colWidths[cIdx] / 2.3);
        const truncated = textStr.length > maxLen ? textStr.substring(0, maxLen - 2) + '..' : textStr;
        doc.text(truncated, rX, currentY + 4.8);
        rX += colWidths[cIdx];
      });

      currentY += 7;
    });

    currentY += 6;
  };

  const catLower = (category || '').toLowerCase();
  const titleLower = (title || '').toLowerCase();

  // 4. Render Relevant Data Tables
  if (catLower === 'crop' || catLower.includes('crop') || catLower === 'master' || catLower === 'all' || titleLower.includes('master') || titleLower.includes('crop')) {
    const cropHeaders = ['Variety Name', 'Plot', 'Growth Stage', 'Fertilizer Application', 'Irrigation', 'Historical Yield'];
    const cropWidths = [42, 20, 28, 40, 30, 22];
    const cropRows = crops.map(c => [c.variety, c.plot, c.growthStage, c.fertilizer, c.irrigation, c.yield]);
    drawTable('2. CROP PRODUCTION DIRECTORY (REAL-TIME SUPABASE)', cropHeaders, cropRows, cropWidths);
  }

  if (catLower === 'livestock' || catLower.includes('livestock') || catLower === 'master' || catLower === 'all' || titleLower.includes('master') || titleLower.includes('livestock')) {
    const livestockHeaders = ['Flock / Group Name', 'Plot', 'Head Count', 'Vaccination Coverage', 'Health Status', 'Avg Daily Gain'];
    const livestockWidths = [44, 20, 24, 38, 30, 26];
    const livestockRows = livestock.map(l => [l.group, l.plot, `${l.headCount} heads`, l.vaccination, l.healthStatus, l.dailyGain]);
    drawTable('3. LIVESTOCK OPERATIONS REGISTRY (REAL-TIME SUPABASE)', livestockHeaders, livestockRows, livestockWidths);
  }

  if (catLower === 'activity' || catLower.includes('activity') || catLower === 'master' || catLower === 'all' || titleLower.includes('master') || titleLower.includes('task') || titleLower.includes('validation')) {
    const valHeaders = ['Farmer Name', 'Plot', 'Activity Task', 'Status', 'Geotag Location', 'Notes / Proof'];
    const valWidths = [38, 18, 36, 24, 34, 32];
    const valRows = validations.map(v => [v.farmer, v.plot, v.activity, v.status, v.gps || 'Antipolo Field', v.notes || 'Submitted via App']);
    drawTable('4. FARMER MOBILE TASK VALIDATIONS & LOGS (REAL-TIME SUPABASE)', valHeaders, valRows, valWidths);
  }

  if (catLower === 'schedule' || catLower.includes('schedule') || catLower === 'master' || catLower === 'all' || titleLower.includes('master') || titleLower.includes('schedule')) {
    const schedHeaders = ['Event Title', 'Category', 'Plot', 'Target Date & Time', 'Assigned Staff', 'Status'];
    const schedWidths = [48, 22, 22, 34, 36, 20];
    const schedRows = schedules.map(s => [s.title, s.category, s.plot, `${s.date} ${s.time}`, s.assignedTo, s.status]);
    drawTable('5. COOPERATIVE FIELD SCHEDULES & PROTOCOLS (REAL-TIME SUPABASE)', schedHeaders, schedRows, schedWidths);
  }

  // 5. Official Certification Sign-Off Block
  checkPageBreak(32);
  doc.setDrawColor(17, 89, 44);
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(14, currentY, pageWidth - 28, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryColor);
  doc.text('OFFICIAL EXECUTIVE CERTIFICATION & COMPLIANCE AUDIT', 18, currentY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(...darkTextColor);
  doc.text('This official report document has been generated dynamically from live records stored in Supabase Cloud Database.', 18, currentY + 12);
  doc.text('It constitutes a verified operational record for Antipolo Organic Farming Cooperative (MARIKHA) governance audit.', 18, currentY + 16.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Certified By: Executive Super Admin Officer', 18, currentY + 22);
  doc.text(`Digital Verification Code: ${refCode}`, pageWidth - 70, currentY + 22);

  // 6. Apply Footers Across All Pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  // Save PDF File
  const filename = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
};
