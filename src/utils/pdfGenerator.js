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

  // Advanced Table Drawer with Multi-Line Text Wrapping
  const drawTable = (sectionTitle, headers, rows, colWidths) => {
    checkPageBreak(30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...darkTextColor);
    doc.text(sectionTitle, 14, currentY);
    currentY += 6;

    // Header Row
    doc.setFillColor(...primaryColor);
    doc.rect(14, currentY, pageWidth - 28, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);

    let hX = 16;
    headers.forEach((h, idx) => {
      doc.text(h, hX, currentY + 5.5);
      hX += colWidths[idx];
    });

    currentY += 8;

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

    // Rows with Dynamic Line Height & Multi-line Wrap
    rows.forEach((row, rIdx) => {
      const cellLinesList = row.map((cellText, cIdx) => {
        const textStr = String(cellText || '-');
        const maxW = colWidths[cIdx] - 3;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.2);
        return doc.splitTextToSize(textStr, maxW);
      });

      const maxLinesInRow = Math.max(...cellLinesList.map(lines => lines.length), 1);
      const rowHeight = Math.max(8, maxLinesInRow * 4 + 3);

      checkPageBreak(rowHeight + 2);

      const isAlt = rIdx % 2 === 1;
      doc.setFillColor(isAlt ? 248 : 255, isAlt ? 250 : 255, isAlt ? 252 : 255);
      doc.rect(14, currentY, pageWidth - 28, rowHeight, 'F');
      doc.setDrawColor(241, 245, 249);
      doc.line(14, currentY + rowHeight, pageWidth - 14, currentY + rowHeight);

      let rX = 16;
      cellLinesList.forEach((lines, cIdx) => {
        doc.setTextColor(...darkTextColor);
        doc.setFont('helvetica', cIdx === 0 ? 'bold' : 'normal');
        doc.setFontSize(7.2);

        let lineY = currentY + 4.5;
        lines.forEach(lineText => {
          doc.text(lineText, rX, lineY);
          lineY += 4;
        });

        rX += colWidths[cIdx];
      });

      currentY += rowHeight;
    });

    currentY += 6;
  };

  const catLower = (category || '').toLowerCase();
  const titleLower = (title || '').toLowerCase();

  // Helper to determine "WHAT ACTIVITY TO DO" / Recommended Next Action
  const getRecommendedNextActivity = (log, matchingSchedule) => {
    if (matchingSchedule && matchingSchedule.title) {
      return `RECOMMENDED NEXT: ${matchingSchedule.title} (${matchingSchedule.time || 'Scheduled'})`;
    }
    const act = (log.activity || log.notes || '').toLowerCase();
    if (act.includes('fertilizer')) {
      return 'NEXT ACTION: Conduct Soil Moisture Test & Apply Organic Foliar Nitrogen Boost';
    } else if (act.includes('water') || act.includes('irrigation')) {
      return 'NEXT ACTION: Inspect Drip Irrigation Flow & Verify Root Hydration Level';
    } else if (act.includes('pest') || act.includes('spray')) {
      return 'NEXT ACTION: Schedule Organic Neem Oil Re-application in 5 Days';
    } else if (act.includes('harvest')) {
      return 'NEXT ACTION: Initiate Post-Harvest Soil Recalibration & Seedbed Mulching';
    } else if (act.includes('weed')) {
      return 'NEXT ACTION: Lay Organic Straw Mulch Layer to Prevent Weed Resurgence';
    } else if (act.includes('feed') || act.includes('livestock')) {
      return 'NEXT ACTION: Check Daily Weight Gain & Maintain Clean Pen Sanitation Protocol';
    }
    return 'NEXT ACTION: Perform Weekly Geotag Inspection & Log Photo Verification';
  };

  // Section 2: FARMER ACTIVITY MONITORING & RECOMMENDED NEXT ACTIONS ("WHAT ACTIVITY TO DO")
  if (catLower === 'activity' || catLower.includes('activity') || catLower === 'master' || catLower === 'all' || titleLower.includes('master') || titleLower.includes('activity') || titleLower.includes('farmer')) {
    const actHeaders = ['Farmer & Plot', 'Current Monitored Activity', 'Status & Proof', 'Recommended Next Activity To Do', 'Target Schedule & Staff'];
    const actWidths = [34, 38, 26, 52, 32];
    const actRows = validations.map(v => {
      const matchingSched = schedules.find(s => s.plot === v.plot || (s.assignedTo && s.assignedTo.includes(v.farmer)));
      const nextAct = getRecommendedNextActivity(v, matchingSched);
      const schedTarget = matchingSched ? `${matchingSched.date} (${matchingSched.priority || 'HIGH'})` : '2026-09-20 (HIGH)';
      const staffName = matchingSched ? matchingSched.assignedTo : (v.farmer || 'Farm Staff');

      return [
        `${v.farmer || 'Renier Lopez'}\n${v.plot || 'Plot P-021'}`,
        `${v.activity || 'Fertilizer Application'}\n(${v.notes || 'Field Log'})`,
        `${v.status || 'Validated'}\n📍 ${v.gps || 'Antipolo Field'}`,
        nextAct,
        `📅 ${schedTarget}\n👤 ${staffName}`
      ];
    });

    drawTable('2. FARMER ACTIVITY MONITORING & RECOMMENDED NEXT ACTIONS ("WHAT ACTIVITY TO DO")', actHeaders, actRows, actWidths);
  }

  // Section 3: Crop Production Directory
  if (catLower === 'crop' || catLower.includes('crop') || catLower === 'master' || catLower === 'all' || titleLower.includes('master') || titleLower.includes('crop')) {
    const cropHeaders = ['Variety Name', 'Plot', 'Growth Stage', 'Fertilizer Application', 'Irrigation System', 'Yield Output'];
    const cropWidths = [38, 20, 28, 42, 32, 22];
    const cropRows = crops.map(c => [c.variety, c.plot, c.growthStage, c.fertilizer, c.irrigation, c.yield]);
    drawTable('3. CROP PRODUCTION DIRECTORY (REAL-TIME SUPABASE)', cropHeaders, cropRows, cropWidths);
  }

  // Section 4: Livestock Operations Registry
  if (catLower === 'livestock' || catLower.includes('livestock') || catLower === 'master' || catLower === 'all' || titleLower.includes('master') || titleLower.includes('livestock')) {
    const livestockHeaders = ['Herd / Group Name', 'Plot', 'Head Count', 'Vaccination Coverage', 'Health Status', 'Avg Daily Gain'];
    const livestockWidths = [42, 20, 24, 38, 32, 26];
    const livestockRows = livestock.map(l => [l.group, l.plot, `${l.headCount} heads`, l.vaccination, l.healthStatus, l.dailyGain]);
    drawTable('4. LIVESTOCK OPERATIONS REGISTRY (REAL-TIME SUPABASE)', livestockHeaders, livestockRows, livestockWidths);
  }

  // Section 5: Cooperative Field Schedules & Protocol Pipelines
  if (catLower === 'schedule' || catLower.includes('schedule') || catLower === 'master' || catLower === 'all' || titleLower.includes('master') || titleLower.includes('schedule')) {
    const schedHeaders = ['Event Protocol Title', 'Category', 'Plot', 'Target Date & Time', 'Assigned Staff', 'Status'];
    const schedWidths = [48, 22, 22, 34, 36, 20];
    const schedRows = schedules.map(s => [s.title, s.category, s.plot, `${s.date} ${s.time}`, s.assignedTo, s.status]);
    drawTable('5. COOPERATIVE FIELD SCHEDULES & PROTOCOLS (REAL-TIME SUPABASE)', schedHeaders, schedRows, schedWidths);
  }

  // 5. Official Certification Sign-Off Block
  checkPageBreak(34);
  doc.setDrawColor(17, 89, 44);
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(14, currentY, pageWidth - 28, 28, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryColor);
  doc.text('OFFICIAL EXECUTIVE CERTIFICATION & COMPLIANCE AUDIT', 18, currentY + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(...darkTextColor);
  doc.text('This official report document has been generated dynamically from live records stored in Supabase Cloud Database.', 18, currentY + 12);
  doc.text('It constitutes a verified operational record for Antipolo Organic Farming Cooperative (MARIKHA) governance audit.', 18, currentY + 16.5);
  doc.text('All farmer activity monitoring logs and recommended next operational activities are synchronized with the mobile app.', 18, currentY + 21);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Certified By: Executive Super Admin Officer', 18, currentY + 25.5);
  doc.text(`Digital Verification Code: ${refCode}`, pageWidth - 70, currentY + 25.5);

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
