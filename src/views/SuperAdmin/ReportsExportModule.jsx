import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Calendar, 
  User, 
  Sprout, 
  Binary, 
  Award, 
  ChevronRight, 
  Eye, 
  Layers, 
  Building2 
} from 'lucide-react';

const ReportsExportModule = () => {
  const [activeTab, setActiveTab] = useState('snapshot');
  const [selectedFarmerId, setSelectedFarmerId] = useState('FMR-001');
  const [selectedReportType, setSelectedReportType] = useState('All');

  // Farmers for individual dossier
  const farmers = [
    {
      id: 'FMR-001',
      name: 'Juan Dela Cruz',
      rsbsa: 'RSBSA-04-1234',
      plot: 'Plot P-007 (Sector A)',
      crop: 'Tomato (Diamante Max)',
      yieldActual: '412 kg',
      yieldTarget: '440 kg',
      efficiency: '93.6%',
      taskAdherence: '96%',
      inspections: '4 of 4 passed',
      status: 'PGS Level 2 Certified',
      notes: 'Excellent organic soil condition. Automated drip irrigation scheduled.'
    },
    {
      id: 'FMR-002',
      name: 'Roberto Cruz',
      rsbsa: 'RSBSA-04-5678',
      plot: 'Plot P-021 (Sector B)',
      crop: 'Eggplant (Mistisa)',
      yieldActual: '305 kg',
      yieldTarget: '320 kg',
      efficiency: '95.3%',
      taskAdherence: '88%',
      inspections: '3 of 4 passed',
      status: 'PGS Level 2 Certified',
      notes: 'Rainfall deficit monitored. Foliar nutrient booster applied.'
    },
    {
      id: 'FMR-003',
      name: 'Maria Santos',
      rsbsa: 'RSBSA-04-9012',
      plot: 'Plot P-094 (Sector C)',
      crop: 'Okra (Smooth Green)',
      yieldActual: '240 kg',
      yieldTarget: '235 kg',
      efficiency: '102.1%',
      taskAdherence: '95%',
      inspections: '4 of 4 passed',
      status: 'PGS Level 2 Certified',
      notes: 'Surpassed yield target. Grade A market delivery confirmed.'
    },
    {
      id: 'FMR-004',
      name: 'Elena Gomez',
      rsbsa: 'RSBSA-04-3456',
      plot: 'Plot P-082 (Sector B)',
      crop: 'Squash (Suprema)',
      yieldActual: '158 kg',
      yieldTarget: '170 kg',
      efficiency: '92.9%',
      taskAdherence: '90%',
      inspections: '4 of 4 passed',
      status: 'PGS Level 1 Certified',
      notes: 'Canopy shading optimal. Mulching renewed.'
    }
  ];

  const currentFarmer = farmers.find(f => f.id === selectedFarmerId) || farmers[0];

  // Report catalog items
  const reportCatalog = [
    {
      id: 'REP-2026-Q4-01',
      title: 'Quarterly Cooperative Harvest & Machine Learning Variance Report',
      period: 'Q4 2026 (Oct – Dec)',
      type: 'Harvest & Yield',
      generatedDate: '2026-11-02',
      signatory: 'Rosa Mendoza (Super Admin)',
      fileSize: '1.4 MB'
    },
    {
      id: 'REP-2026-Q4-02',
      title: 'Caprine Livestock Census & Veterinary Biometric Audit',
      period: 'Q4 2026',
      type: 'Livestock',
      generatedDate: '2026-11-01',
      signatory: 'Dr. V. Reyes (Municipal Vet)',
      fileSize: '980 KB'
    },
    {
      id: 'REP-2026-Q4-03',
      title: 'Participatory Guarantee System (PGS) Organic Compliance Dossier',
      period: 'Annual 2026',
      type: 'Compliance',
      generatedDate: '2026-10-28',
      signatory: 'DA-RFO4A Audit Team',
      fileSize: '2.1 MB'
    },
    {
      id: 'REP-2026-Q4-04',
      title: 'Member Farmer Operational Task Adherence & Labor Log',
      period: 'October 2026',
      type: 'Operations',
      generatedDate: '2026-11-01',
      signatory: 'A. Bautista (Farm Supervisor)',
      fileSize: '850 KB'
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="superadmin-module animate-fade-in" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#dcfce7', color: '#11592c', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '6px' }}>
            <FileText size={14} /> Official Audit & Export Center
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Reports & Compliance Export
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Official cooperative audit reports, farmer performance dossiers & regulatory compliance exports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={handlePrint}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', 
              background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', 
              borderRadius: '8px', fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer' 
            }}
          >
            <Printer size={15} /> Print Document
          </button>
          <button 
            onClick={() => {
              alert('Exporting official cooperative PDF dossier to downloads...');
              handlePrint();
            }}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', 
              background: '#11592c', color: '#ffffff', border: 'none', 
              borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(17,89,44,0.2)'
            }}
          >
            <Download size={15} /> Export Official PDF
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Plots Audited
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a' }}>6 Plots</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            4.8 hectares commercial organic production
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Livestock Census
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#11592c' }}>380 Goats</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            4 herds fully tagged and verified
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Task Adherence Rate
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#2563eb' }}>93.4%</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            On-time execution across member tasks
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Organic Certification
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#16a34a' }}>100% PGS</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Participatory Guarantee System verified
          </span>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', overflowX: 'auto' }}>
        {[
          { id: 'snapshot', label: 'Cooperative Reports Snapshot' },
          { id: 'farmer', label: 'Individual Farmer Reports' },
          { id: 'catalog', label: 'Report Catalog & Downloads' },
          { id: 'preview', label: 'Live Official Report Preview' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              fontSize: '0.82rem',
              fontWeight: activeTab === tab.id ? '700' : '600',
              color: activeTab === tab.id ? '#11592c' : '#64748b',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #11592c' : '2px solid transparent',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Cooperative Snapshot */}
      {activeTab === 'snapshot' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
            Quarterly Agricultural Production & Compliance Ledger (Q4 2026)
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 20px 0' }}>
            Consolidated operational audit summary for Antipolo Organic Farming Cooperative (ANT-ORG-001).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ padding: '16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Total Crops Harvested</span>
              <strong style={{ fontSize: '1.4rem', color: '#0f172a' }}>1,602 kg</strong>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', display: 'block', marginTop: '4px' }}>+8.4% above previous quarter</span>
            </div>
            <div style={{ padding: '16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Total Milk Collected</span>
              <strong style={{ fontSize: '1.4rem', color: '#0f172a' }}>1,420 L</strong>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', display: 'block', marginTop: '4px' }}>Anglo-Nubian & Saanen flocks</span>
            </div>
            <div style={{ padding: '16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Organic Inputs Produced</span>
              <strong style={{ fontSize: '1.4rem', color: '#0f172a' }}>4.2 Tons</strong>
              <span style={{ fontSize: '0.72rem', color: '#16a34a', display: 'block', marginTop: '4px' }}>Vermicompost & FAA liquid fertilizer</span>
            </div>
            <div style={{ padding: '16px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Municipal Audit Status</span>
              <strong style={{ fontSize: '1.4rem', color: '#16a34a' }}>Clean Record</strong>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginTop: '4px' }}>Zero non-compliance citations</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Individual Farmer Reports */}
      {activeTab === 'farmer' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Farmer Selector List */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
              Select Member Farmer
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {farmers.map((farmer) => {
                const isSelected = farmer.id === selectedFarmerId;
                return (
                  <button
                    key={farmer.id}
                    onClick={() => setSelectedFarmerId(farmer.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid #11592c' : '1px solid #e2e8f0',
                      background: isSelected ? '#dcfce7' : '#f8fafc',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <strong style={{ fontSize: '0.85rem', color: isSelected ? '#11592c' : '#0f172a' }}>{farmer.name}</strong>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{farmer.rsbsa}</span>
                    <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: '700', marginTop: '4px' }}>{farmer.crop}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Individual Dossier Card */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#11592c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Farmer Dossier & Operational Report
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 2px 0' }}>
                  {currentFarmer.name}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Government Registry: {currentFarmer.rsbsa} · {currentFarmer.plot}
                </span>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: '20px', background: '#dcfce7', color: '#15803d', fontSize: '0.74rem', fontWeight: '700' }}>
                {currentFarmer.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Harvest Actual / Target:</span>
                <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>{currentFarmer.yieldActual}</strong>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}> / {currentFarmer.yieldTarget}</span>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Yield Efficiency:</span>
                <strong style={{ fontSize: '1.05rem', color: '#11592c' }}>{currentFarmer.efficiency}</strong>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', display: 'block' }}>RF Regression Fit</span>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Task Adherence:</span>
                <strong style={{ fontSize: '1.05rem', color: '#2563eb' }}>{currentFarmer.taskAdherence}</strong>
                <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Field checklist rating</span>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <strong style={{ fontSize: '0.8rem', color: '#0f172a', display: 'block', marginBottom: '4px' }}>Advisory & Soil Notes:</strong>
              <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                {currentFarmer.notes}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={handlePrint}
                style={{ padding: '8px 16px', background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
              >
                Print Farmer Dossier
              </button>
              <button 
                onClick={() => alert(`Exported individual PDF for ${currentFarmer.name}`)}
                style={{ padding: '8px 18px', background: '#11592c', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Export Farmer PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Report Catalog */}
      {activeTab === 'catalog' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0' }}>Published Official Reports</h4>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Digitally signed audit ledgers archived on cloud storage</span>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                <th style={{ padding: '12px 16px' }}>Report Title</th>
                <th style={{ padding: '12px 16px' }}>Audit Period</th>
                <th style={{ padding: '12px 16px' }}>Category</th>
                <th style={{ padding: '12px 16px' }}>Generated Date</th>
                <th style={{ padding: '12px 16px' }}>Attested By</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportCatalog.map((rep) => (
                <tr key={rep.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <strong style={{ color: '#0f172a', display: 'block', fontSize: '0.85rem' }}>{rep.title}</strong>
                    <span style={{ color: '#64748b', fontSize: '0.72rem' }}>{rep.id} · {rep.fileSize}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>{rep.period}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '600' }}>
                      {rep.type}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{rep.generatedDate}</td>
                  <td style={{ padding: '14px 16px', color: '#0f172a', fontWeight: '500' }}>{rep.signatory}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button 
                      onClick={handlePrint}
                      style={{ padding: '6px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', color: '#11592c' }}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: Live Official Report Preview */}
      {activeTab === 'preview' && (
        <div style={{ background: '#525659', padding: '32px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'center' }}>
          {/* Paper sheet */}
          <div style={{
            background: '#ffffff', width: '100%', maxWidth: '800px', minHeight: '900px',
            padding: '48px', boxShadow: '0 8px 16px rgba(0,0,0,0.3)', borderRadius: '2px',
            color: '#1e293b', fontFamily: 'serif'
          }}>
            {/* Official Header */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569' }}>
                Republic of the Philippines · Province of Rizal
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '4px 0', color: '#0f172a' }}>
                ANTIPOLO ORGANIC FARMING COOPERATIVE
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                CDA Registration No. 9520-1002345 · Tenant Code: ANT-ORG-001
              </span>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: '0 0 4px 0', color: '#11592c' }}>
                OFFICIAL AGRICULTURAL PRODUCTION AUDIT & CERTIFICATION LEDGER
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Audit Period: Fourth Quarter 2026 (Oct 01 – Dec 31, 2026)</span>
            </div>

            {/* Official Summary Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '0.82rem', fontFamily: 'sans-serif' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left' }}>Item Description</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Registered Units</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Actual Output</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Compliance</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 10px' }}>Commercial Organic Crop Fields</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>6 Plots (4.8 ha)</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>1,602 kg</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#15803d' }}>100% PGS</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 10px' }}>Caprine Livestock Flocks (Goats)</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>4 Herds (380 Heads)</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>1,420 L Milk</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#15803d' }}>97.9% Vaccinated</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 10px' }}>Field Operations Dispatches</td>
                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>12 Scheduled Tasks</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right' }}>11 Executed</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', color: '#15803d' }}>93.4% Adherence</td>
                </tr>
              </tbody>
            </table>

            {/* Official Certification Text */}
            <p style={{ fontSize: '0.8rem', lineHeight: 1.6, color: '#334155', marginBottom: '40px' }}>
              This document certifies that the recorded agricultural yields, livestock counts, and field task logs have been audited and validated according to the Participatory Guarantee System (PGS) and municipal organic farming standards.
            </p>

            {/* Signature Block */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', fontFamily: 'sans-serif' }}>
              <div style={{ textAlign: 'center', width: '220px' }}>
                <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '6px', height: '24px' }}></div>
                <strong style={{ fontSize: '0.82rem', display: 'block', color: '#0f172a' }}>ROSA MENDOZA</strong>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Super Admin / General Manager</span>
              </div>
              <div style={{ textAlign: 'center', width: '220px' }}>
                <div style={{ borderBottom: '1px solid #0f172a', marginBottom: '6px', height: '24px' }}></div>
                <strong style={{ fontSize: '0.82rem', display: 'block', color: '#0f172a' }}>DR. V. REYES, DVM</strong>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Municipal Veterinary Officer</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsExportModule;
