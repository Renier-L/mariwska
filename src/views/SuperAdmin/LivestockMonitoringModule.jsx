import React, { useState } from 'react';
import { 
  Binary, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Activity, 
  Download, 
  FileText, 
  ChevronRight, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  Camera, 
  Info,
  Layers,
  HeartPulse
} from 'lucide-react';

const LivestockMonitoringModule = ({ livestock = [], addLivestock, updateLivestock, deleteLivestock }) => {
  const [activeSubTab, setActiveSubTab] = useState('herds');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBreed, setFilterBreed] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHerd, setSelectedHerd] = useState(null);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [healthNotes, setHealthNotes] = useState('');

  // Default goat herds fallback if livestock is empty
  const defaultHerds = [
    {
      id: 'HRD-GT-001',
      tag: 'HRD-GT-001',
      breed: 'Anglo-Nubian',
      heads: 120,
      does: 75,
      bucks: 15,
      kids: 30,
      pen: 'Pen Alpha (Sector A)',
      status: 'Healthy',
      leadHandler: 'Juan Dela Cruz',
      lastVaccine: '2026-10-14',
      deworming: 'Up to Date',
      weightAvg: '48.5 kg',
      feedType: 'Napier Grass + Legume Silage'
    },
    {
      id: 'HRD-GT-002',
      tag: 'HRD-GT-002',
      breed: 'Boer',
      heads: 95,
      does: 58,
      bucks: 12,
      kids: 25,
      pen: 'Pen Bravo (Sector B)',
      status: 'Observation',
      leadHandler: 'Roberto Cruz',
      lastVaccine: '2026-10-22',
      deworming: 'Scheduled Nov 10',
      weightAvg: '54.2 kg',
      feedType: 'Trichanthera + High Protein Pellets'
    },
    {
      id: 'HRD-GT-003',
      tag: 'HRD-GT-003',
      breed: 'Saanen',
      heads: 85,
      does: 60,
      bucks: 8,
      kids: 17,
      pen: 'Pen Charlie (Sector A)',
      status: 'Healthy',
      leadHandler: 'Maria Santos',
      lastVaccine: '2026-09-30',
      deworming: 'Up to Date',
      weightAvg: '42.0 kg',
      feedType: 'Indigofera + Mineral Block'
    },
    {
      id: 'HRD-GT-004',
      tag: 'HRD-GT-004',
      breed: 'Native Philippine',
      heads: 80,
      does: 48,
      bucks: 10,
      kids: 22,
      pen: 'Free-Range Pasture 1',
      status: 'Healthy',
      leadHandler: 'Elena Gomez',
      lastVaccine: '2026-10-05',
      deworming: 'Up to Date',
      weightAvg: '32.4 kg',
      feedType: 'Grazed Pasture + Concentrate'
    }
  ];

  const herds = (livestock && livestock.length > 0) ? livestock : defaultHerds;

  // New Herd Form State
  const [formData, setFormData] = useState({
    tag: `HRD-GT-00${herds.length + 1}`,
    breed: 'Anglo-Nubian',
    heads: 50,
    does: 30,
    bucks: 5,
    kids: 15,
    pen: 'Pen Delta (Sector C)',
    status: 'Healthy',
    leadHandler: 'Juan Dela Cruz',
    lastVaccine: '2026-11-01',
    weightAvg: '40.0 kg'
  });

  // Calculate statistics
  const totalGoats = herds.reduce((acc, h) => acc + (parseInt(h.heads, 10) || 0), 0);
  const activeHerdsCount = herds.length;
  const observationCount = herds.filter(h => h.status === 'Observation' || h.status === 'Quarantine').reduce((acc, h) => acc + (parseInt(h.heads, 10) || 0), 0);
  const vaccinationRate = '97.9%';

  // Filter herds
  const filteredHerds = herds.filter(h => {
    const matchSearch = (h.tag || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (h.breed || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (h.leadHandler || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchBreed = filterBreed === 'All' || h.breed === filterBreed;
    return matchSearch && matchBreed;
  });

  const handleRegisterHerd = (e) => {
    e.preventDefault();
    const newHerd = {
      ...formData,
      id: formData.tag || `HRD-GT-${Date.now().toString().slice(-4)}`,
      heads: parseInt(formData.heads, 10) || (parseInt(formData.does, 10) + parseInt(formData.bucks, 10) + parseInt(formData.kids, 10)),
      type: 'Caprine (Goat)',
      deworming: 'Up to Date'
    };
    if (addLivestock) {
      addLivestock(newHerd);
    }
    setShowAddModal(false);
  };

  return (
    <div className="superadmin-module animate-fade-in" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#dcfce7', color: '#11592c', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '6px' }}>
            <Binary size={14} /> Caprine Livestock Registry
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Livestock Herd Monitoring
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Caprine demographic registry, biometric growth & health surveillance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => window.print()}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', 
              background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', 
              borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' 
            }}
          >
            <Download size={15} /> Export Registry
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', 
              background: '#11592c', color: '#ffffff', border: 'none', 
              borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(17,89,44,0.2)'
            }}
          >
            <Plus size={16} /> Register Herd Group
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Registered Goats
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a' }}>{totalGoats}</span>
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700' }}>Heads</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            4 active herd groups · 100% caprine
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Herds
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#11592c' }}>{activeHerdsCount}</span>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Pens</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Anglo-Nubian, Boer, Saanen, Native
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Under Observation
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#d97706' }}>{observationCount}</span>
            <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: '700' }}>Heads</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#b45309', marginTop: '4px', display: 'block' }}>
            Herd B-02 scheduled for hoof trimming
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Vaccination Coverage
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#16a34a' }}>{vaccinationRate}</span>
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>Verified</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Deworming & Rabies protocol compliant
          </span>
        </div>
      </div>

      {/* Alert Notices Strip */}
      <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '10px', padding: '12px 18px', marginBottom: '22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={18} color="#d97706" />
          <span style={{ fontSize: '0.82rem', color: '#854d0e', fontWeight: '600' }}>
            <strong>Herd Action Required:</strong> Boer Herd B-02 routine hoof trimming & deworming booster scheduled for November 10.
          </span>
        </div>
        <button 
          onClick={() => { setSelectedHerd(herds[1]); setShowHealthModal(true); }}
          style={{ background: '#ca8a04', color: '#ffffff', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
        >
          Review Health Notice
        </button>
      </div>

      {/* Sub-Tabs Bar */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', overflowX: 'auto', paddingBottom: '2px' }}>
        {[
          { id: 'herds', label: `Registered Goat Herds (${herds.length})` },
          { id: 'breeds', label: 'Livestock Overview & Breeds' },
          { id: 'health', label: 'Health & Vaccination Monitoring' },
          { id: 'weight', label: 'Weight Monitoring (kg)' },
          { id: 'submissions', label: 'Farmer Mobile Submissions' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              padding: '10px 18px',
              fontSize: '0.82rem',
              fontWeight: activeSubTab === tab.id ? '700' : '600',
              color: activeSubTab === tab.id ? '#11592c' : '#64748b',
              background: 'transparent',
              border: 'none',
              borderBottom: activeSubTab === tab.id ? '2px solid #11592c' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Registered Goat Herds */}
      {activeSubTab === 'herds' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {/* Filter Bar */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', minWidth: '240px' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text"
                  placeholder="Search herd tag, breed, handler..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 34px', fontSize: '0.82rem', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
                />
              </div>

              <select 
                value={filterBreed}
                onChange={(e) => setFilterBreed(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', background: '#ffffff', color: '#334155' }}
              >
                <option value="All">All Breeds</option>
                <option value="Anglo-Nubian">Anglo-Nubian</option>
                <option value="Boer">Boer</option>
                <option value="Saanen">Saanen</option>
                <option value="Native Philippine">Native Philippine</option>
              </select>
            </div>

            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Showing {filteredHerds.length} of {herds.length} herds
            </span>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                  <th style={{ padding: '12px 16px' }}>Herd ID</th>
                  <th style={{ padding: '12px 16px' }}>Breed</th>
                  <th style={{ padding: '12px 16px' }}>Head Count</th>
                  <th style={{ padding: '12px 16px' }}>Demographics (D / B / K)</th>
                  <th style={{ padding: '12px 16px' }}>Pen Location</th>
                  <th style={{ padding: '12px 16px' }}>Lead Handler</th>
                  <th style={{ padding: '12px 16px' }}>Health Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHerds.map((herd) => (
                  <tr key={herd.id || herd.tag} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: herd.status === 'Healthy' ? '#16a34a' : '#d97706' }} />
                        {herd.tag || herd.id}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#334155', fontWeight: '600' }}>
                      {herd.breed}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.9rem' }}>{herd.heads}</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '4px' }}>heads</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>
                      <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                        {herd.does || 0} Does · {herd.bucks || 0} Bucks · {herd.kids || 0} Kids
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>
                      {herd.pen || 'General Pasture'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#0f172a', fontWeight: '600' }}>
                      {herd.leadHandler || 'Assigned Staff'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        background: herd.status === 'Healthy' ? '#dcfce7' : '#fef3c7',
                        color: herd.status === 'Healthy' ? '#15803d' : '#b45309'
                      }}>
                        {herd.status || 'Healthy'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          onClick={() => { setSelectedHerd(herd); setShowHealthModal(true); }}
                          title="View Biometric & Health Details"
                          style={{ padding: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#475569' }}
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            const newStatus = herd.status === 'Healthy' ? 'Observation' : 'Healthy';
                            if (updateLivestock) {
                              updateLivestock(herd.id || herd.tag, { status: newStatus });
                            }
                          }}
                          title="Toggle Health Observation"
                          style={{ padding: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', color: '#11592c' }}
                        >
                          <HeartPulse size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Breeds & Biometrics */}
      {activeSubTab === 'breeds' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {[
            {
              breed: 'Anglo-Nubian',
              purpose: 'Dual Purpose (Milk & Meat)',
              origin: 'British / Middle Eastern',
              count: 120,
              share: '31.6%',
              avgWeight: '48.5 kg',
              milkYield: '1.8 - 2.5 L/day',
              hardiness: 'High heat tolerance, docile temperament',
              color: '#11592c'
            },
            {
              breed: 'Boer',
              purpose: 'Meat Production (Terminal Sire)',
              origin: 'South Africa',
              count: 95,
              share: '25.0%',
              avgWeight: '54.2 kg',
              milkYield: 'N/A (Meat Specialized)',
              hardiness: 'Rapid growth rate, robust muscular frame',
              color: '#d97706'
            },
            {
              breed: 'Saanen',
              purpose: 'Commercial Dairy',
              origin: 'Switzerland',
              count: 85,
              share: '22.4%',
              avgWeight: '42.0 kg',
              milkYield: '2.8 - 3.4 L/day',
              hardiness: 'Requires shaded pens, high feed conversion',
              color: '#2563eb'
            },
            {
              breed: 'Native Philippine',
              purpose: 'Hardy Grazing / Smallholder Meat',
              origin: 'Philippines Indigenous',
              count: 80,
              share: '21.0%',
              avgWeight: '32.4 kg',
              milkYield: '0.6 - 0.9 L/day',
              hardiness: 'Exceptional parasite & moisture resistance',
              color: '#16a34a'
            }
          ].map((item) => (
            <div key={item.breed} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>{item.breed}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.purpose}</span>
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: item.color }}>{item.count} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>heads</span></span>
              </div>

              <div style={{ height: '6px', width: '100%', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                <div style={{ height: '100%', width: item.share, background: item.color, borderRadius: '4px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.78rem', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Average Weight:</span>
                  <strong style={{ color: '#0f172a' }}>{item.avgWeight}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748b', display: 'block' }}>Milk Productivity:</span>
                  <strong style={{ color: '#0f172a' }}>{item.milkYield}</strong>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#64748b', display: 'block' }}>Field Adaptation:</span>
                  <span style={{ color: '#334155' }}>{item.hardiness}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Health & Vaccination */}
      {activeSubTab === 'health' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
            Vaccination & Deworming Protocol Schedule (Q4 2026)
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 20px 0' }}>
            Veterinary health compliance verified under municipal organic standards.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                <th style={{ padding: '12px 16px' }}>Herd Target</th>
                <th style={{ padding: '12px 16px' }}>Vaccine / Treatment</th>
                <th style={{ padding: '12px 16px' }}>Last Completed</th>
                <th style={{ padding: '12px 16px' }}>Next Scheduled</th>
                <th style={{ padding: '12px 16px' }}>Attending Officer</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { herd: 'HRD-GT-001 (Anglo-Nubian)', treatment: 'Clostridial (CD&T) Booster', last: '2026-10-14', next: '2027-04-14', doc: 'Dr. V. Reyes', status: 'Compliant' },
                { herd: 'HRD-GT-002 (Boer)', treatment: 'Broad-Spectrum Deworming (Albendazole)', last: '2026-08-10', next: '2026-11-10', doc: 'Dr. V. Reyes', status: 'Due Soon' },
                { herd: 'HRD-GT-003 (Saanen)', treatment: 'Haemorrhagic Septicaemia (HS)', last: '2026-09-30', next: '2027-03-30', doc: 'Dr. V. Reyes', status: 'Compliant' },
                { herd: 'HRD-GT-004 (Native)', treatment: 'Multivitamin & Selenium Injectable', last: '2026-10-05', next: '2027-01-05', doc: 'R. Mendoza', status: 'Compliant' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: '#0f172a' }}>{row.herd}</td>
                  <td style={{ padding: '14px 16px', color: '#334155' }}>{row.treatment}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{row.last}</td>
                  <td style={{ padding: '14px 16px', color: '#0f172a', fontWeight: '600' }}>{row.next}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{row.doc}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      background: row.status === 'Compliant' ? '#dcfce7' : '#fef3c7',
                      color: row.status === 'Compliant' ? '#15803d' : '#b45309'
                    }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: Weight Monitoring */}
      {activeSubTab === 'weight' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
            Biometric Growth & Weight Monitoring (kg)
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 20px 0' }}>
            Monthly weighing records track feed conversion and kid growth benchmarks.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {herds.map((h) => (
              <div key={h.id || h.tag} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', background: '#f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{h.tag || h.id}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '700' }}>{h.breed}</span>
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                  {h.weightAvg || '45.0 kg'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '10px' }}>
                  Average Weight · +1.2 kg gain past 30 days
                </div>
                <div style={{ fontSize: '0.72rem', color: '#475569', background: '#ffffff', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  Daily Ration: {h.feedType || 'Napier grass + concentrates'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Farmer Mobile Submissions */}
      {activeSubTab === 'submissions' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
            Field Livestock Logs (Farmer Mobile Sync)
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 20px 0' }}>
            Real-time field updates recorded by pen handlers and verified by farm staff.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                id: 'SUB-GT-01',
                time: 'Today, 08:30 AM',
                farmer: 'Juan Dela Cruz (RSBSA-04-1234)',
                herd: 'HRD-GT-001 (Anglo-Nubian)',
                event: 'Morning feed intake normal. Does milked: 42 liters collected.',
                status: 'Verified',
                note: 'Quality test passed: 3.8% butterfat'
              },
              {
                id: 'SUB-GT-02',
                time: 'Yesterday, 04:15 PM',
                farmer: 'Roberto Cruz (RSBSA-04-5678)',
                herd: 'HRD-GT-002 (Boer)',
                event: 'Hoof inspection completed. 2 bucks isolated for minor mud scald.',
                status: 'Pending Review',
                note: 'Antiseptic spray applied by staff'
              },
              {
                id: 'SUB-GT-03',
                time: 'Nov 01, 2026',
                farmer: 'Maria Santos (RSBSA-04-9012)',
                herd: 'HRD-GT-003 (Saanen)',
                event: 'Kidding event: Doe #SN-14 delivered healthy twins (1 male, 1 female).',
                status: 'Verified',
                note: 'Colostrum feeding confirmed within 2 hours'
              }
            ].map((sub) => (
              <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{sub.herd}</strong>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>· {sub.time}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#334155', marginBottom: '4px' }}>{sub.event}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Handler: {sub.farmer}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    background: sub.status === 'Verified' ? '#dcfce7' : '#fef3c7',
                    color: sub.status === 'Verified' ? '#15803d' : '#b45309'
                  }}>
                    {sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Register Herd Group */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Register Goat Herd Group</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0' }}>Enroll new caprine flock into cooperative livestock registry</p>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleRegisterHerd}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Herd Tag ID</label>
                  <input 
                    type="text" 
                    value={formData.tag} 
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Caprine Breed</label>
                  <select 
                    value={formData.breed} 
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}
                  >
                    <option value="Anglo-Nubian">Anglo-Nubian</option>
                    <option value="Boer">Boer</option>
                    <option value="Saanen">Saanen</option>
                    <option value="Native Philippine">Native Philippine</option>
                  </select>
                </div>
              </div>

              {/* Demographics breakdown */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                  Flock Demographics Breakdown
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>Does (Mature)</label>
                    <input 
                      type="number" 
                      value={formData.does} 
                      onChange={(e) => setFormData({ ...formData, does: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: '100%', padding: '6px 10px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>Bucks (Sire)</label>
                    <input 
                      type="number" 
                      value={formData.bucks} 
                      onChange={(e) => setFormData({ ...formData, bucks: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: '100%', padding: '6px 10px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b' }}>Kids / Growers</label>
                    <input 
                      type="number" 
                      value={formData.kids} 
                      onChange={(e) => setFormData({ ...formData, kids: parseInt(e.target.value, 10) || 0 })}
                      style={{ width: '100%', padding: '6px 10px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Pen / Sector Location</label>
                  <input 
                    type="text" 
                    value={formData.pen} 
                    onChange={(e) => setFormData({ ...formData, pen: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Assigned Lead Handler</label>
                  <input 
                    type="text" 
                    value={formData.leadHandler} 
                    onChange={(e) => setFormData({ ...formData, leadHandler: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 20px', background: '#11592c', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  Save Herd Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Health & Observation Details */}
      {showHealthModal && selectedHerd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  {selectedHerd.tag || selectedHerd.id} · {selectedHerd.breed}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Health status and pen surveillance profile</span>
              </div>
              <button onClick={() => setShowHealthModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px', fontSize: '0.82rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                <div><span style={{ color: '#64748b' }}>Total Count:</span> <strong>{selectedHerd.heads} heads</strong></div>
                <div><span style={{ color: '#64748b' }}>Status:</span> <strong style={{ color: selectedHerd.status === 'Healthy' ? '#16a34a' : '#d97706' }}>{selectedHerd.status}</strong></div>
                <div><span style={{ color: '#64748b' }}>Pen:</span> <span>{selectedHerd.pen}</span></div>
                <div><span style={{ color: '#64748b' }}>Deworming:</span> <span>{selectedHerd.deworming || 'Up to Date'}</span></div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Log Clinical / Nutrition Note
              </label>
              <textarea 
                placeholder="Enter veterinary notes, ration adjustments, or observation updates..."
                value={healthNotes}
                onChange={(e) => setHealthNotes(e.target.value)}
                style={{ width: '100%', height: '80px', padding: '10px', fontSize: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => setShowHealthModal(false)}
                style={{ padding: '8px 16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Close
              </button>
              <button 
                onClick={() => {
                  alert('Clinical note logged successfully.');
                  setHealthNotes('');
                  setShowHealthModal(false);
                }}
                style={{ padding: '8px 18px', background: '#11592c', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Save Health Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivestockMonitoringModule;
