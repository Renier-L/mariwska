export const initialUsers = [
  { id: '1', name: 'Rosa Mendoza', role: 'Executive', email: 'rosa@mariwska.coop', phone: '+63 917 555 0101', status: true, initials: 'RM' },
  { id: '2', name: 'Liza Cruz', role: 'Admin', email: 'liza@mariwska.coop', phone: '+63 917 555 0102', status: true, initials: 'LC' },
  { id: '3', name: 'Ramon Velasco', role: 'Farm Staff', email: 'ramon@mariwska.coop', phone: '+63 917 555 0103', status: true, initials: 'RV' },
  { id: '4', name: 'Juan Dela Cruz', role: 'Farmer', email: 'mang.juan@farmer.ph', phone: '+63 917 555 0104', status: true, initials: 'JD' },
  { id: '5', name: 'Maria Santos', role: 'Farmer', email: 'maria.s@farmer.ph', phone: '+63 917 555 0105', status: true, initials: 'MS' },
  { id: '6', name: 'Pedro Ocampo', role: 'Farmer', email: 'pedro.o@farmer.ph', phone: '+63 917 555 0106', status: false, initials: 'PO' },
  { id: '7', name: 'Glenda Bautista', role: 'Farmer', email: 'glenda.b@farmer.ph', phone: '+63 917 555 0107', status: true, initials: 'GB' },
  { id: '8', name: 'Tomas Lopez', role: 'Farm Staff', email: 'tomas.l@mariwska.coop', phone: '+63 917 555 0108', status: true, initials: 'TL' },
  { id: '9', name: 'Fely Pascual', role: 'Farmer', email: 'fely.p@farmer.ph', phone: '+63 917 555 0109', status: false, initials: 'FP' }
];

export const initialCrops = [
  { id: 'c1', variety: 'Tomato (Diamante)', plot: 'P-007', growthStage: 'Flowering', fertilizer: 'Vermicompost - 12kg', irrigation: 'Daily 06:00', yield: '412 kg' },
  { id: 'c2', variety: 'Eggplant (Mistisa)', plot: 'P-021', growthStage: 'Vegetative', fertilizer: 'Compost tea - 8L', irrigation: 'Alt. days 06:00', yield: '305 kg' },
  { id: 'c3', variety: 'Okra (Smooth Green)', plot: 'P-034', growthStage: 'Harvest', fertilizer: 'Vermicast - 6kg', irrigation: 'Daily 17:00', yield: '240 kg' },
  { id: 'c4', variety: 'Squash (Suprema)', plot: 'P-055', growthStage: 'Fruiting', fertilizer: 'Organic NPK - 10kg', irrigation: 'Daily 06:00', yield: '158 kg' },
  { id: 'c5', variety: 'Tomato (Diamante)', plot: 'P-082', growthStage: 'Seedling', fertilizer: 'Vermicompost - 5kg', irrigation: 'Daily 06:00', yield: '—' },
  { id: 'c6', variety: 'Eggplant (Mistisa)', plot: 'P-094', growthStage: 'Flowering', fertilizer: 'Compost tea - 9L', irrigation: 'Alt. days 06:00', yield: '287 kg' }
];

export const initialLivestock = [
  { id: 'l1', group: 'Goat Herd GT-014', plot: 'P-055', headCount: 34, healthStatus: 'Healthy', vaccination: '96% (Up to date)', dailyGain: '+1.2 kg/wk' },
  { id: 'l2', group: 'Poultry Flock PF-003', plot: 'P-012', headCount: 150, healthStatus: 'Healthy', vaccination: '100% (Up to date)', dailyGain: '+0.4 kg/wk' },
  { id: 'l3', group: 'Cattle Group CG-002', plot: 'P-088', headCount: 18, healthStatus: 'Monitoring', vaccination: '92% (Watch)', dailyGain: '+2.8 kg/wk' }
];

export const initialAnnouncements = [];

export const initialValidations = [
  {
    id: 'val-1',
    plot: 'P-021',
    timestamp: '07:15 - Sep 18',
    farmer: 'Mang Juan Dela Cruz',
    taskType: 'Fertilizer - vermicompost 12kg',
    amount: '12 kg',
    location: '14.586° N · 121.176° E',
    farmerNote: 'Applied row 1–6, even distribution',
    status: 'Pending',
    photoUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12735?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'val-2',
    plot: 'P-007',
    timestamp: '06:42 - Sep 18',
    farmer: 'Maria Santos',
    taskType: 'Harvest - tomato',
    amount: '45 kg',
    location: '14.588° N · 121.172° E',
    farmerNote: 'First batch ripe harvest, excellent quality grade A',
    status: 'Pending',
    photoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'val-3',
    plot: 'P-034',
    timestamp: '08:03 - Sep 18',
    farmer: 'Glenda Bautista',
    taskType: 'Watering',
    amount: '120 L',
    location: '14.582° N · 121.179° E',
    farmerNote: 'Morning drip irrigation completed',
    status: 'Pending',
    photoUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=600&auto=format&fit=crop&q=60'
  },
  {
    id: 'val-4',
    plot: 'P-055',
    timestamp: '09:21 - Sep 18',
    farmer: 'Pedro Ocampo',
    taskType: 'Goat feeding',
    amount: '50 kg fodder',
    location: '14.590° N · 121.181° E',
    farmerNote: 'Fresh Napier grass distribution',
    status: 'Pending',
    photoUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=60'
  }
];

export const initialMLClassifications = [
  { id: 'ml-1', plot: 'P-007', farmer: 'M. Santos', details: 'Vermicompost cycle aligned with PGS schedule', status: 'Compliant', recommendation: 'Maintain current rotation.' },
  { id: 'ml-2', plot: 'P-021', farmer: 'J. Dela Cruz', details: 'Fertilizer log 2 days late · 1 missing photo', status: 'For Review', recommendation: 'Request supplementary photo evidence. Schedule on-site verification within 5 days.' },
  { id: 'ml-3', plot: 'P-034', farmer: 'G. Bautista', details: 'All inputs traceable to approved organic suppliers', status: 'Compliant', recommendation: 'No action required.' },
  { id: 'ml-4', plot: 'P-055', farmer: 'P. Ocampo', details: 'Unverified synthetic input flagged · PGS breach', status: 'Non-Compliant', recommendation: 'Suspend organic certification pending audit. Issue corrective notice within 24h. Trigger PGS auditor escalation.' },
  { id: 'ml-5', plot: 'P-082', farmer: 'F. Pascual', details: 'Repeated late submissions detected by RF classifier', status: 'For Review', recommendation: 'Coaching session on cloud-sync workflow.' }
];

export const rfFeatureImportance = [
  { feature: 'Missed scheduled tasks (30d)', percentage: 31, count: '6' },
  { feature: 'Incomplete records (open)', percentage: 24, count: '4' },
  { feature: 'Compliance breaches (90d)', percentage: 18, count: '1' },
  { feature: 'Average reporting delay', percentage: 15, count: '1.8 d' },
  { feature: 'Weather exposure index', percentage: 12, count: 'Med' }
];

export const superAdminPdfs = [
  { title: 'Quarterly Operational Summary · Q3 2025', date: 'Sep 18, 2025', size: '1.2 MB', type: 'Summary' },
  { title: 'Crop Production Historical Report · 2023–2025', date: 'Sep 12, 2025', size: '3.4 MB', type: 'Historical' },
  { title: 'Livestock Operations Annual Recap', date: 'Sep 09, 2025', size: '2.1 MB', type: 'Historical' },
  { title: 'PGS Organic Compliance Audit', date: 'Sep 04, 2025', size: '880 KB', type: 'Compliance' },
  { title: 'Farmer Productivity Index Report', date: 'Aug 30, 2025', size: '1.6 MB', type: 'Productivity' },
  { title: 'Harvest Yield Consolidation · Aug', date: 'Aug 28, 2025', size: '740 KB', type: 'Summary' }
];

export const adminPdfs = [
  { title: 'User Accounts Registry · Sep 2025', source: 'User records', date: 'Sep 18, 2025', size: '640 KB' },
  { title: 'Member Profile Directory', source: 'Member profiles', date: 'Sep 15, 2025', size: '1.1 MB' },
  { title: 'Role & Permission Assignments', source: 'User records', date: 'Sep 14, 2025', size: '320 KB' },
  { title: 'Operational Activity Digest · Q3', source: 'Operational info', date: 'Sep 10, 2025', size: '1.8 MB' },
  { title: 'Cooperative Onboarding Report', source: 'Member profiles', date: 'Aug 28, 2025', size: '540 KB' }
];

export const farmStaffPdfs = [
  { title: 'Activity Validation Report · Week 38', date: 'Sep 18, 2025', size: '880 KB' },
  { title: 'Crop Productivity Summary · Q3', date: 'Sep 15, 2025', size: '1.4 MB' },
  { title: 'Livestock Monitoring Digest · Aug', date: 'Sep 02, 2025', size: '920 KB' },
  { title: 'ML Risk Assessment Bundle', date: 'Sep 12, 2025', size: '1.1 MB' },
  { title: 'PGS Compliance Inspection Notes', date: 'Sep 10, 2025', size: '640 KB' }
];
