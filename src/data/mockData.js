export const initialUsers = [
  { id: '1', name: 'Rosa Mendoza', role: 'Executive', email: 'rosa@mariwska.coop', phone: '+63 917 555 0101', password: 'Superadmin123', status: true, initials: 'RM' },
  { id: '2', name: 'Liza Cruz', role: 'Admin', email: 'liza@mariwska.coop', phone: '+63 917 555 0102', password: '123Admin', status: true, initials: 'LC' },
  { id: '3', name: 'Ramon Velasco', role: 'Farm Staff', email: 'ramon@mariwska.coop', phone: '+63 917 555 0103', password: 'staff123', status: true, initials: 'RV' },
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

export const initialValidations = [];

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
  { title: 'Executive Cooperative Governance Audit 2025', date: 'Oct 20, 2025', size: '3.1 MB' },
  { title: 'Multi-Tenant Resource Utilization Report', date: 'Oct 01, 2025', size: '2.2 MB' }
];

export const farmStaffPdfs = [
  { title: 'Field Operations & Input Task Log Report', date: 'Oct 18, 2025', size: '1.9 MB' },
  { title: 'Daily Yield & Harvest Validation Records', date: 'Sep 28, 2025', size: '2.7 MB' }
];
