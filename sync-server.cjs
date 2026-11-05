const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'sync_store.json');

// Initial seed matching user's Supabase database
const initialStore = {
  announcements: [
    {
      id: '47',
      title: 'High Yield Organic Protocol',
      content: 'Farm staff have deployed automated rice hull rations.',
      author: 'Arnel Bautista',
      targetAudience: 'all',
      audienceLabel: 'All Cooperative Members',
      date: '2026-11-04',
      startDate: '2026-11-04',
      endDate: '2026-11-18',
      archived: false,
      instantPush: true
    },
    {
      id: '44',
      title: 'Farmer Urgent Advisory',
      content: 'water asap',
      author: 'Farm Staff Supervisor',
      targetAudience: 'farmers',
      audienceLabel: 'Farmers Only (Mobile)',
      date: '2026-11-04',
      startDate: '2026-11-04',
      endDate: '2026-11-18',
      archived: false,
      instantPush: true
    },
    {
      id: '43',
      title: 'Weeding & Plot Inspection Directive',
      content: 'All assigned farmers are requested to clean furrow lines and log photo proofs before 5:00 PM.',
      author: 'Farm Staff Supervisor',
      targetAudience: 'farmers',
      audienceLabel: 'Farmers Only (Mobile)',
      date: '2026-11-04',
      startDate: '2026-11-04',
      endDate: '2026-11-18',
      archived: false,
      instantPush: true
    },
    {
      id: '42',
      title: 'Farmer Notice',
      content: 'Dear farmers',
      author: 'Farm Staff Supervisor',
      targetAudience: 'farmers',
      audienceLabel: 'Farmers Only (Mobile)',
      date: '2026-11-04',
      startDate: '2026-11-04',
      endDate: '2026-11-18',
      archived: false,
      instantPush: true
    },
    {
      id: '41',
      title: 'High Yield Organic Fertilizer Distribution',
      content: 'Farm staff have deployed automated rice hull and vermicompost rations across Sector B plots.',
      author: 'Arnel Bautista',
      targetAudience: 'all',
      audienceLabel: 'All Cooperative Members',
      date: '2026-11-04',
      startDate: '2026-11-04',
      endDate: '2026-11-18',
      archived: false,
      instantPush: true
    },
    {
      id: '7',
      title: 'Cooperative Broadcast Notice',
      content: 'wdads',
      author: 'Liza Cruz',
      targetAudience: 'all',
      audienceLabel: 'All Cooperative Members',
      date: '2026-09-12',
      startDate: '2026-09-12',
      endDate: '2026-09-26',
      archived: false,
      instantPush: true
    }
  ],
  validations: [
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
      createdAt: '2026-08-02T06:30:00Z'
    },
    {
      id: 'val-2',
      farmer: 'Mang Juan Dela Cruz',
      plot: 'Plot P-021',
      taskType: 'Foliar Organic Spray Application (15L)',
      activity: 'Foliar Organic Spray Application (15L)',
      timestamp: 'Aug 3, 2026 · 07:15 AM',
      urgency: 'Normal',
      urgencyCls: 'pill-low',
      location: '14.5902° N, 121.1802° E (Plot P-021)',
      gps: '14.5902° N, 121.1802° E',
      farmerNote: 'Preventive neem extract spray across Eggplant beds to deter fruit borer.',
      notes: 'Preventive neem extract spray across Eggplant beds to deter fruit borer.',
      photoUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop&q=60',
      photo_url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop&q=60',
      photoAttached: true,
      status: 'Pending',
      createdAt: '2026-08-03T07:15:00Z'
    },
    {
      id: 'val-3',
      farmer: 'Elena Velasco',
      plot: 'Plot P-055',
      taskType: 'Vermicompost Input & Soil Aeration',
      activity: 'Vermicompost Input & Soil Aeration',
      timestamp: 'Aug 4, 2026 · 08:45 AM',
      urgency: 'Normal',
      urgencyCls: 'pill-low',
      location: '14.5824° N, 121.1701° E (Plot P-055)',
      gps: '14.5824° N, 121.1701° E',
      farmerNote: 'Soil conditioning complete for next cycle crop rotation.',
      notes: 'Soil conditioning complete for next cycle crop rotation.',
      photoUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
      photo_url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
      photoAttached: true,
      status: 'Pending',
      createdAt: '2026-08-04T08:45:00Z'
    }
  ]
};

let store = initialStore;
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    store = { ...initialStore, ...JSON.parse(raw) };
  }
} catch (e) {}

function saveStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
  } catch (e) {}
}

const sseClients = [];

function broadcastSSE(type, data) {
  const payload = `data: ${JSON.stringify({ type, data })}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    try {
      sseClients[i].write(payload);
    } catch (e) {
      sseClients.splice(i, 1);
    }
  }
}

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // SSE Stream
  if (pathname === '/api/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'MARIKHA LAN Sync Stream Active' })}\n\n`);
    sseClients.push(res);
    req.on('close', () => {
      const idx = sseClients.indexOf(res);
      if (idx !== -1) sseClients.splice(idx, 1);
    });
    return;
  }

  // GET Announcements
  if (req.method === 'GET' && pathname === '/api/announcements') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(store.announcements));
    return;
  }

  // POST Announcements
  if (req.method === 'POST' && pathname === '/api/announcements') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const item = JSON.parse(body || '{}');
        const newAnn = {
          id: item.id || `ANN-${Date.now()}`,
          title: item.title || 'Cooperative Broadcast',
          content: item.content || '',
          author: item.author || 'Super Admin',
          targetAudience: item.targetAudience || 'all',
          audienceLabel: item.audienceLabel || 'All Cooperative Members',
          date: item.date || new Date().toISOString().split('T')[0],
          startDate: item.startDate || item.date || new Date().toISOString().split('T')[0],
          endDate: item.endDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          archived: false,
          instantPush: true,
          created_at: new Date().toISOString()
        };
        store.announcements = [newAnn, ...store.announcements.filter(a => String(a.id) !== String(newAnn.id))];
        saveStore();
        broadcastSSE('ANNOUNCEMENT_PUSH', newAnn);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newAnn));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // GET Validations
  if (req.method === 'GET' && pathname === '/api/validations') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(store.validations));
    return;
  }

  // POST Validations (from Mobile Phone Camera or Web)
  if (req.method === 'POST' && pathname === '/api/validations') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const item = JSON.parse(body || '{}');
        const photoUrl = item.photo_url || item.photoUrl || item.photo || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80';
        const newVal = {
          id: item.id || `val-${Date.now()}`,
          farmer: item.farmer || 'Rei Lopez',
          plot: item.plot || 'Plot P-007',
          taskType: item.activity || item.taskType || 'Field Task Activity',
          activity: item.activity || item.taskType || 'Field Task Activity',
          timestamp: 'Just now · Live Mobile Upload',
          urgency: item.urgency || 'Normal',
          urgencyCls: 'pill-low',
          location: item.gps || item.location || '14.5861° N · 121.1764° E',
          gps: item.gps || item.location || '14.5861° N · 121.1764° E',
          farmerNote: item.notes || item.farmerNote || 'Photo proof submitted live from Mobile Camera',
          notes: item.notes || item.farmerNote || 'Photo proof submitted live from Mobile Camera',
          photoUrl: photoUrl,
          photo_url: photoUrl,
          photoAttached: true,
          status: item.status || 'Pending',
          createdAt: new Date().toISOString()
        };
        store.validations = [newVal, ...store.validations.filter(v => String(v.id) !== String(newVal.id))];
        saveStore();
        broadcastSSE('VALIDATION_PUSH', newVal);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newVal));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // Health Check
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', serverTime: new Date().toISOString() }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ MARIKHA Realtime LAN Sync Server running at http://0.0.0.0:${PORT}/`);
  console.log(`  Local IP: http://10.200.7.98:${PORT}/`);
});
