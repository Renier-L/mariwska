export const initialUsers = [
 { id: '1', name: 'Rosa Mendoza', role: 'Executive', email: 'rosa@mariwska.coop', phone: '+63 917 555 0101', assignedPlot: 'Administrative HQ', rsbsaNo: 'RSBSA-03-1001-EXEC', certification: 'PGS Governance Board', emergencyContact: 'Jose Mendoza (+63 918 111 2222)', joinDate: '2023-01-15', password: 'Superadmin123', status: true, initials: 'RM' },
 { id: '2', name: 'Liza Cruz', role: 'Admin', email: 'liza@mariwska.coop', phone: '+63 917 555 0102', assignedPlot: 'Operations & Compliance Center', rsbsaNo: 'RSBSA-03-1002-ADM', certification: 'Certified Organic Auditor', emergencyContact: 'Mark Cruz (+63 918 333 4444)', joinDate: '2023-05-20', password: '123Admin', status: true, initials: 'LC' },
 { id: '3', name: 'Ramon Velasco', role: 'Farm Staff', email: 'ramon@mariwska.coop', phone: '+63 917 555 0103', assignedPlot: 'Sector B (Plot P-007 & P-021)', rsbsaNo: 'RSBSA-03-1003-STF', certification: 'PGS Organic Level II Supervisor', emergencyContact: 'Elena Velasco (+63 918 555 6666)', joinDate: '2024-02-10', password: 'staff123', status: true, initials: 'RV' },
 { id: '4', name: 'Renier Lopez', role: 'Farmer', email: 'lopezrenier97@gmail.com', phone: '+63 917 555 0100', assignedPlot: 'Plot P-007 (Tomato Diamante)', rsbsaNo: 'RSBSA-03-1425-001', certification: 'PGS Certified Organic Farmer', emergencyContact: 'Maria Lopez (+63 918 777 8888)', joinDate: '2024-03-15', password: 'password123', status: true, initials: 'RL' },
 { id: '5', name: 'Mang Juan Dela Cruz', role: 'Farmer', email: 'juan@mariwska.coop', phone: '+63 917 555 0105', assignedPlot: 'Plot P-021 (Eggplant Mistisa)', rsbsaNo: 'RSBSA-03-1425-002', certification: 'PGS Organic Certified', emergencyContact: 'Juana Dela Cruz (+63 918 999 0000)', joinDate: '2024-04-01', password: 'password123', status: true, initials: 'JC' }
];

export const initialCrops = [
  { 
    id: 'c1', 
    farmer: 'Renier Lopez',
    farmerId: '4',
    cropType: 'Tomato',
    variety: 'Tomato (Diamante Max)', 
    plot: 'Plot P-007', 
    plantingDate: '2026-06-15',
    cultivatedArea: 500,
    areaUnit: 'sq.m',
    plannedPlantingCount: 500,
    actualPlantedCount: 485,
    growthStage: 'Flowering', 
    confirmedGrowthStage: 'Flowering',
    cropStatus: 'Active',
    fertilizer: 'Vermicompost - 12kg', 
    irrigation: 'Daily 06:00 Drip', 
    predictedYield: 425,
    actualYield: 412,
    yield: '412 kg'
  },
  { 
    id: 'c2', 
    farmer: 'Mang Juan Dela Cruz',
    farmerId: '5',
    cropType: 'Eggplant',
    variety: 'Eggplant (Mistisa)', 
    plot: 'Plot P-021', 
    plantingDate: '2026-06-25',
    cultivatedArea: 450,
    areaUnit: 'sq.m',
    plannedPlantingCount: 450,
    actualPlantedCount: 430,
    growthStage: 'Vegetative', 
    confirmedGrowthStage: 'Vegetative',
    cropStatus: 'Active',
    fertilizer: 'Compost tea - 8L', 
    irrigation: 'Alt. days 06:00', 
    predictedYield: 310,
    actualYield: 305,
    yield: '305 kg'
  },
  { 
    id: 'c3', 
    farmer: 'Renier Lopez',
    farmerId: '4',
    cropType: 'Okra',
    variety: 'Okra (Smooth Green)', 
    plot: 'Plot P-034', 
    plantingDate: '2026-07-02',
    cultivatedArea: 350,
    areaUnit: 'sq.m',
    plannedPlantingCount: 400,
    actualPlantedCount: 390,
    growthStage: 'Harvesting', 
    confirmedGrowthStage: 'Harvesting',
    cropStatus: 'Harvest Ready',
    fertilizer: 'Vermicast - 6kg', 
    irrigation: 'Daily 17:00 Sprinkler', 
    predictedYield: 245,
    actualYield: 240,
    yield: '240 kg'
  },
  { 
    id: 'c4', 
    farmer: 'Elena Velasco',
    farmerId: '3',
    cropType: 'Squash',
    variety: 'Squash (Suprema)', 
    plot: 'Plot P-055', 
    plantingDate: '2026-07-10',
    cultivatedArea: 600,
    areaUnit: 'sq.m',
    plannedPlantingCount: 300,
    actualPlantedCount: 290,
    growthStage: 'Fruiting', 
    confirmedGrowthStage: 'Fruiting',
    cropStatus: 'Active',
    fertilizer: 'Organic NPK - 10kg', 
    irrigation: 'Daily 06:00 Drip', 
    predictedYield: 165,
    actualYield: 0,
    yield: '158 kg'
  },
  { 
    id: 'c5', 
    farmer: 'Mang Juan Dela Cruz',
    farmerId: '5',
    cropType: 'Tomato',
    variety: 'Tomato (Diamante Max)', 
    plot: 'Plot P-082', 
    plantingDate: '2026-08-01',
    cultivatedArea: 400,
    areaUnit: 'sq.m',
    plannedPlantingCount: 500,
    actualPlantedCount: 490,
    growthStage: 'Germination', 
    confirmedGrowthStage: 'Germination',
    cropStatus: 'Active',
    fertilizer: 'Vermicompost - 5kg', 
    irrigation: 'Daily 06:00 Misting', 
    predictedYield: 430,
    actualYield: 0,
    yield: '—'
  },
  { 
    id: 'c6', 
    farmer: 'Elena Velasco',
    farmerId: '3',
    cropType: 'Eggplant',
    variety: 'Eggplant (Mistisa)', 
    plot: 'Plot P-094', 
    plantingDate: '2026-07-20',
    cultivatedArea: 500,
    areaUnit: 'sq.m',
    plannedPlantingCount: 450,
    actualPlantedCount: 440,
    growthStage: 'Flowering', 
    confirmedGrowthStage: 'Flowering',
    cropStatus: 'Active',
    fertilizer: 'Compost tea - 9L', 
    irrigation: 'Alt. days 06:00', 
    predictedYield: 295,
    actualYield: 0,
    yield: '287 kg'
  }
];

export const initialLivestock = [
 { id: 'l1', groupCode: 'GT-014', group: 'Native Goat Herd GT-014 (34 Goats)', animalType: 'Native Goats', plot: 'Plot P-055', headCount: 34, healthStatus: 'Healthy', vaccination: '96% (Up to date)', forage: 'Organic Napier Grass', dailyGain: '+1.2 kg/wk', status: 'Compliant' },
 { id: 'l2', groupCode: 'GT-008', group: 'Anglo-Nubian Goat Herd GT-008 (28 Goats)', animalType: 'Anglo-Nubian Goats', plot: 'Plot P-012', headCount: 28, healthStatus: 'Healthy', vaccination: '100% (Up to date)', forage: 'Organic Napier Grass', dailyGain: '+1.4 kg/wk', status: 'Compliant' },
 { id: 'l3', groupCode: 'GT-022', group: 'Boer Dairy Goat Herd GT-022 (18 Goats)', animalType: 'Boer Goats', plot: 'Plot P-088', headCount: 18, healthStatus: 'Monitoring', vaccination: '92% (Watch)', forage: 'Organic Napier Grass', dailyGain: '+1.1 kg/wk', status: 'Compliant' }
];

export const initialAnnouncements = [
 {
 id: 'ann-1',
 title: 'Fertilizer & Organic Inputs Distribution Schedule',
 content: 'All cooperative members are requested to pick up their allocated Vermicompost and Bio-pesticides at Sector B Field Office.',
 author: 'Liza Cruz (Admin)',
 date: '2026-09-16',
 startDate: '2026-09-16',
 endDate: '2026-09-30',
 archived: false,
 instantPush: true
 },
 {
 id: 'ann-2',
 title: 'PGS Organic Certification Audit Notice',
 content: 'Third-party Organic Field Inspectors will conduct farm audits for Tomato Diamante and Eggplant Mistisa plots.',
 author: 'Rosa Mendoza (Executive)',
 date: '2026-09-10',
 startDate: '2026-09-10',
 endDate: '2026-09-25',
 archived: false,
 instantPush: true
 }
];

export const initialValidations = [
  {
    id: 'val-1',
    farmer: 'Renier Lopez',
    plot: 'Plot P-001',
    taskType: 'Watering & Compost Tea Application (10L)',
    activity: 'Watering & Compost Tea Application (10L)',
    timestamp: 'Aug 2, 2026 · 06:30 AM',
    urgency: 'Normal',
    urgencyCls: 'pill-low',
    location: '14.5862° N, 121.1764° E (Plot P-001)',
    gps: '14.5862° N, 121.1764° E',
    farmerNote: 'Applied 10L organic compost tea to Eggplant seedlings in Plot 1. Soil moisture optimal.',
    notes: 'Applied 10L organic compost tea to Eggplant seedlings in Plot 1. Soil moisture optimal.',
    photoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    photo_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
    photoAttached: true,
    status: 'Pending',
    createdAt: '2026-08-02T06:30:00Z',
    season: 'Wet Season 2026'
  },
  {
    id: 'val-2',
    farmer: 'Mang Juan Dela Cruz',
    plot: 'Plot P-021',
    taskType: 'Foliar Organic Spray Application (15L)',
    activity: 'Foliar Organic Spray Application (15L)',
    timestamp: 'Aug 3, 2026 · 07:15 AM',
    urgency: 'High',
    urgencyCls: 'pill-high',
    location: '14.5870° N, 121.1770° E (Plot P-021)',
    gps: '14.5870° N, 121.1770° E',
    farmerNote: 'Sprayed neem extract on Sitaw vines to counter aphids. Needs verification for PGS organic compliance check.',
    notes: 'Sprayed neem extract on Sitaw vines to counter aphids. Needs verification for PGS organic compliance check.',
    photoUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    photo_url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    photoAttached: true,
    status: 'Pending',
    createdAt: '2026-08-03T07:15:00Z',
    season: 'Wet Season 2026'
  },
  {
    id: 'val-3',
    farmer: 'Elena Velasco',
    plot: 'Plot P-055',
    taskType: 'Vermicompost Input & Soil Aeration',
    activity: 'Vermicompost Input & Soil Aeration',
    timestamp: 'Aug 4, 2026 · 08:00 AM',
    urgency: 'Medium',
    urgencyCls: 'pill-medium',
    location: '14.5880° N, 121.1780° E (Plot P-055)',
    gps: '14.5880° N, 121.1780° E',
    farmerNote: 'Distributed 20kg organic vermicompost around Okra beds. Compost log updated.',
    notes: 'Distributed 20kg organic vermicompost around Okra beds. Compost log updated.',
    photoUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    photo_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
    photoAttached: true,
    status: 'Pending',
    createdAt: '2026-08-04T08:00:00Z',
    season: 'Wet Season 2026'
  }
];

export const initialMLClassifications = [
 { crop: 'Tomato (Diamante)', plot: 'P-007', confidence: 0.94, yieldForecast: '412 kg', recommendedFertilizer: 'Vermicompost - 12kg', recommendedAction: 'Maintain daily 06:00 drip irrigation' },
 { crop: 'Eggplant (Mistisa)', plot: 'P-021', confidence: 0.89, yieldForecast: '305 kg', recommendedFertilizer: 'Compost tea - 8L', recommendedAction: 'Apply organic mulch around stem' },
 { crop: 'Okra (Smooth Green)', plot: 'P-034', confidence: 0.96, yieldForecast: '240 kg', recommendedFertilizer: 'Vermicast - 6kg', recommendedAction: 'Ready for harvest batch #2' }
];

export const adminPdfs = [
 { title: 'PGS Organic Compliance Audit 2025', date: 'Oct 15, 2025', size: '2.4 MB' },
 { title: 'Cooperative Farmer Directory & Yield Registry', date: 'Sep 30, 2025', size: '1.8 MB' },
 { title: 'Soil Nitrogen & Moisture Predictive Analysis', date: 'Aug 12, 2025', size: '4.1 MB' }
];

export const superAdminPdfs = [
 { id: 'rpt-1', title: 'Executive Master Consolidated Cooperative Report', date: 'Live Supabase', size: 'PDF Official', type: 'compliance', category: 'master' },
 { id: 'rpt-2', title: 'Crop Production & Field Plot Registry Audit', date: 'Live Supabase', size: 'PDF Official', type: 'crop', category: 'crop' },
 { id: 'rpt-3', title: 'Livestock Operations & Herd Veterinary Audit', date: 'Live Supabase', size: 'PDF Official', type: 'livestock', category: 'livestock' },
 { id: 'rpt-4', title: 'Farmer Mobile Task Logs & Geotag Proof Audit', date: 'Live Supabase', size: 'PDF Official', type: 'activity', category: 'activity' },
 { id: 'rpt-5', title: 'Cooperative Field Schedules & Protocol Timeline', date: 'Live Supabase', size: 'PDF Official', type: 'compliance', category: 'schedule' },
 { id: 'rpt-6', title: 'PGS Organic Certification & Governance Report', date: 'Live Supabase', size: 'PDF Official', type: 'compliance', category: 'compliance' }
];

export const farmStaffPdfs = [
 { title: 'Field Operations & Input Task Log Report', date: 'Oct 18, 2025', size: '1.9 MB' },
 { title: 'Daily Yield & Harvest Validation Records', date: 'Sep 28, 2025', size: '2.7 MB' }
];

export const initialSchedules = [
 {
 id: 'SCHED-1',
 title: 'Tomato Flowering Potassium Boost Application',
 category: 'planting',
 plot: 'Plot P-021',
 date: '2026-09-15',
 time: '07:30 AM',
 protocol: 'Organic Potassium Sulfate Spray (2.5L/ha)',
 assignedTo: 'Renier Lopez (Farmer)',
 priority: 'HIGH',
 status: 'Upcoming',
 countdown: '3 days'
 },
 {
 id: 'SCHED-2',
 title: 'Goat Herd GT-01 Deworming & Vaccination',
 category: 'livestock',
 plot: 'Plot P-007 (Goat Pen B)',
 date: '2026-09-14',
 time: '09:00 AM',
 protocol: 'Quarterly Multi-Strain Vaccine & Dewormer',
 assignedTo: 'Maria Santos (Livestock Specialist)',
 priority: 'HIGH',
 status: 'Upcoming',
 countdown: '2 days'
 },
 {
 id: 'SCHED-3',
 title: 'Cooperative Drip Irrigation Cycle (Sector B)',
 category: 'irrigation',
 plot: 'Plots P-014 to P-034',
 date: '2026-09-16',
 time: '05:30 AM',
 protocol: '45-minute Drip Fertigation Cycle',
 assignedTo: 'Juan Dela Cruz (Field Staff)',
 priority: 'MEDIUM',
 status: 'Scheduled',
 countdown: '4 days'
 },
 {
 id: 'SCHED-4',
 title: 'Okra Vegetative Weeding & Composting',
 category: 'planting',
 plot: 'Plot P-007',
 date: '2026-09-18',
 time: '08:00 AM',
 protocol: 'Manual Soil Aeration & Organic Vermicompost 10kg',
 assignedTo: 'Renier Lopez (Farmer)',
 priority: 'MEDIUM',
 status: 'Scheduled',
 countdown: '6 days'
 },
 {
 id: 'SCHED-5',
 title: 'Squash Harvest & Packing Protocol',
 category: 'harvest',
 plot: 'Plot P-014',
 date: '2026-09-22',
 time: '06:00 AM',
 protocol: 'Early Morning Harvest & Crate Grading',
 assignedTo: 'Cooperative Harvest Crew B',
 priority: 'HIGH',
 status: 'Planned',
 countdown: '10 days'
 }
];
