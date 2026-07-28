import http from 'http';

// Database State
const db = {
  tenant: {
    id: 'ANT-ORG-001',
    name: 'Antipolo Organic Farming Cooperative',
    status: 'Cloud sync · Live',
    lastSync: new Date().toISOString()
  },
  users: [
    { id: '1', name: 'Rosa Mendoza', role: 'Executive', email: 'superadmin@marikha.coop', status: true, initials: 'RM' },
    { id: '2', name: 'Liza Cruz', role: 'Admin', email: 'admin@marikha.org', status: true, initials: 'LC' },
    { id: '3', name: 'Ramon Velasco', role: 'Farm Staff', email: 'staff@marikha.org', status: true, initials: 'RV' },
    { id: '4', name: 'Juan Dela Cruz', role: 'Farmer', email: 'juan@marikha.org', status: true, initials: 'JD' },
  ],
  announcements: [
    { id: '1', title: 'PGS Organic Certification Audit Scheduled', content: 'Cooperative-wide PGS audit scheduled for Sep 12–15. All plot logs must be updated.', date: '2025-09-01', author: 'Liza Cruz (Admin)', instantPush: true, priority: 'High' },
    { id: '2', title: 'Water Allocation Adjustment for Cluster B', content: 'Irrigation window adjusted to 14:00-16:00 based on RF rainfall deficit forecast.', date: '2025-08-28', author: 'Rosa Mendoza (Executive)', instantPush: false, priority: 'Normal' },
  ],
  validations: [
    { id: 'VAL-001', farmer: 'Maria Santos', plot: 'Plot P-007', activity: 'Watering (10 Liters)', timestamp: '10 mins ago', urgency: 'Urgent', urgencyCls: 'pill-critical', gps: '14.586° N · 121.176° E', notes: 'Double morning ration due to heat advisory.', photoAttached: true },
    { id: 'VAL-002', farmer: 'Mang Juan Dela Cruz', plot: 'Plot P-021', activity: 'Fertilizer (Vermicompost 12kg)', timestamp: '25 mins ago', urgency: 'Urgent', urgencyCls: 'pill-critical', gps: '14.588° N · 121.178° E', notes: 'Applied compost tea ration.', photoAttached: true },
    { id: 'VAL-003', farmer: 'Glenda Bautista', plot: 'Plot P-034', activity: 'Harvest (Okra 18kg)', timestamp: '1 hour ago', urgency: 'Normal', urgencyCls: 'pill-medium', gps: '14.590° N · 121.180° E', notes: 'Pods 7-9cm length ready.', photoAttached: true },
  ],
  auditLogs: [
    { id: 'LOG-101', timestamp: new Date().toISOString(), user: 'Ramon Velasco (Staff)', action: 'VALIDATION_APPROVED', details: 'Approved task VAL-001 for Plot P-007', ip: '192.168.1.45' },
    { id: 'LOG-102', timestamp: new Date().toISOString(), user: 'Liza Cruz (Admin)', action: 'ANNOUNCEMENT_PUBLISHED', details: 'Published PGS Organic Certification Audit notice with Push toggle', ip: '192.168.1.12' },
  ],
  analytics: {
    rfStatus: 'Online · Model v2.4',
    confidenceScore: 0.87,
    recommendedCrop: 'Tomato · Diamante',
    estimatedYieldKg: 412,
    pgsCompliancePct: 94.2
  }
};

const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // GET /api/health
  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, { status: 'healthy', tenant: db.tenant, timestamp: new Date().toISOString() });
  }

  // GET /api/announcements
  if (req.method === 'GET' && pathname === '/api/announcements') {
    return sendJson(res, 200, db.announcements);
  }

  // POST /api/announcements
  if (req.method === 'POST' && pathname === '/api/announcements') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const newAnn = {
          id: String(Date.now()),
          title: payload.title || 'Cooperative Announcement',
          content: payload.content || '',
          date: new Date().toISOString().split('T')[0],
          author: payload.author || 'Liza Cruz (Admin)',
          instantPush: payload.instantPush || false,
          priority: payload.priority || 'Normal'
        };
        db.announcements.unshift(newAnn);
        db.auditLogs.unshift({
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: newAnn.author,
          action: 'ANNOUNCEMENT_CREATED',
          details: `Created announcement: ${newAnn.title}`,
          ip: '127.0.0.1'
        });
        return sendJson(res, 201, newAnn);
      } catch (err) {
        return sendJson(res, 400, { error: 'Invalid JSON payload' });
      }
    });
    return;
  }

  // GET /api/validations
  if (req.method === 'GET' && pathname === '/api/validations') {
    return sendJson(res, 200, db.validations);
  }

  // POST /api/validations (Farmer Submission)
  if (req.method === 'POST' && pathname === '/api/validations') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const newVal = {
          id: `VAL-${Date.now().toString().slice(-4)}`,
          farmer: payload.farmer || 'Juan Dela Cruz',
          plot: payload.plot || 'Plot P-007',
          activity: `${payload.activity || 'Watering'} (${payload.amount || 10} Liters)`,
          timestamp: 'Just now',
          urgency: 'Normal',
          urgencyCls: 'pill-low',
          gps: '14.586° N · 121.176° E',
          notes: payload.note || 'Submitted via Farmers Mobile App',
          photoAttached: true
        };
        db.validations.unshift(newVal);
        db.auditLogs.unshift({
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: newVal.farmer,
          action: 'TASK_SUBMITTED',
          details: `Submitted task for ${newVal.plot}`,
          ip: '127.0.0.1'
        });
        return sendJson(res, 201, newVal);
      } catch (err) {
        return sendJson(res, 400, { error: 'Invalid JSON payload' });
      }
    });
    return;
  }

  // GET /api/analytics/random-forest
  if (req.method === 'GET' && pathname === '/api/analytics/random-forest') {
    return sendJson(res, 200, db.analytics);
  }

  // GET /api/audit-logs
  if (req.method === 'GET' && pathname === '/api/audit-logs') {
    return sendJson(res, 200, db.auditLogs);
  }

  // Fallback 404
  sendJson(res, 404, { error: 'Route not found' });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`MARIKHA Real-Time Backend API Server listening on http://localhost:${PORT}`);
});
