import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  Users, 
  Award, 
  MapPin, 
  Calendar, 
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { generateOfficialReportPDF } from '../../utils/pdfGenerator';

const AdminReportsModule = ({
  users = [],
  crops = [],
  livestock = [],
  validations = [],
  schedules = []
}) => {
  const [selectedReportId, setSelectedReportId] = useState('full-roster');
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [individualUserId, setIndividualUserId] = useState(users[4]?.id || '5'); // default to Renier Lopez or first farmer
  const [memberSearchTerm, setMemberSearchTerm] = useState('');

  // 5 Official Reports Catalog
  const reportCatalog = [
    {
      id: 'full-roster',
      title: 'Full Cooperative Member Directory',
      category: 'all',
      description: 'Comprehensive roster of all registered cooperative members, contact information, role allocations, and current account statuses.',
      recordCount: `${users.length} Registered Members`,
      frequency: 'Monthly / On-Demand',
      status: 'Ready to Generate'
    },
    {
      id: 'rsbsa-cert',
      title: 'Farmer RSBSA & Organic Certification Dossier',
      category: 'farmers',
      description: 'Official registry of farmer members with Department of Agriculture RSBSA registration numbers, PGS Organic Level certifications, and compliance logs.',
      recordCount: `${users.filter(u => u.role === 'Farmer').length} Organic Farmers`,
      frequency: 'Quarterly Audit',
      status: 'Ready to Generate'
    },
    {
      id: 'staff-assignment',
      title: 'Farm Staff Field & Pen Assignment Report',
      category: 'staff',
      description: 'Supervisory sector allocations for field staff, crop plot monitoring schedules, and caprine herd veterinary assignments.',
      recordCount: `${users.filter(u => u.role === 'Farm Staff').length} Field Supervisors`,
      frequency: 'Bi-Weekly',
      status: 'Ready to Generate'
    },
    {
      id: 'admin-accounts',
      title: 'Administrative & Governance Accounts Audit',
      category: 'governance',
      description: 'Access log audit and permission overview for Executive and Admin IT/HR system accounts with session security details.',
      recordCount: `${users.filter(u => u.role === 'Admin' || u.role === 'Executive' || u.role === 'Super Admin').length} Governance Accounts`,
      frequency: 'Monthly Security Review',
      status: 'Ready to Generate'
    },
    {
      id: 'individual-dossier',
      title: 'Individual User Record & Activity Dossier',
      category: 'individual',
      description: 'Detailed individual dossier including profile data, field plot or pen assignments, validated activity log counts, and compliance certification.',
      recordCount: 'Single Member Dossier',
      frequency: 'On-Demand / Adviser Priority',
      status: 'Configurable'
    }
  ];

  const selectedReport = reportCatalog.find(r => r.id === selectedReportId) || reportCatalog[0];
  const selectedIndividualUser = users.find(u => u.id === individualUserId) || users[0] || {};

  // Export CSV Helper
  const handleExportCSV = (reportType = selectedReportId) => {
    let headers = [];
    let rows = [];

    if (reportType === 'rsbsa-cert') {
      headers = ['Member Name', 'System Role', 'RSBSA Number', 'Organic Certification', 'Assigned Plot', 'Phone', 'Status'];
      rows = users.filter(u => u.role === 'Farmer').map(u => [
        `"${u.name}"`,
        `"${u.role}"`,
        `"${u.rsbsaNo || 'RSBSA-03-1425'}"`,
        `"${u.certification || 'PGS Certified Organic Farmer'}"`,
        `"${u.assignedPlot || 'Plot P-007'}"`,
        `"${u.phone || '+63 917 555 0100'}"`,
        `"${u.status !== false ? 'Active' : 'Inactive'}"`
      ]);
    } else if (reportType === 'staff-assignment') {
      headers = ['Staff Name', 'System Role', 'Sector / Herd Assignment', 'Supervisory Certification', 'Phone', 'Email'];
      rows = users.filter(u => u.role === 'Farm Staff').map(u => [
        `"${u.name}"`,
        `"${u.role}"`,
        `"${u.assignedPlot || 'Sector Oversight'}"`,
        `"${u.certification || 'PGS Level II Supervisor'}"`,
        `"${u.phone || '+63 917 555 0100'}"`,
        `"${u.email || ''}"`
      ]);
    } else if (reportType === 'individual-dossier') {
      headers = ['Field', 'Detail Value'];
      rows = [
        ['Full Name', `"${selectedIndividualUser.name}"`],
        ['System Role', `"${selectedIndividualUser.role}"`],
        ['Email Address', `"${selectedIndividualUser.email}"`],
        ['Contact Phone', `"${selectedIndividualUser.phone || '+63 917 555 0100'}"`],
        ['RSBSA Number', `"${selectedIndividualUser.rsbsaNo || 'N/A'}"`],
        ['Assigned Sector/Plot', `"${selectedIndividualUser.assignedPlot || 'General Cooperative'}"`],
        ['Organic Certification', `"${selectedIndividualUser.certification || 'Verified'}"`],
        ['Account Status', `"${selectedIndividualUser.status !== false ? 'Active' : 'Inactive'}"`],
        ['Join Date', `"${selectedIndividualUser.joinDate || '2024-03-15'}"`]
      ];
    } else {
      // Default: Full Member Directory
      headers = ['Member Name', 'System Role', 'Email', 'Phone', 'RSBSA Number', 'Assigned Plot', 'Status', 'Join Date'];
      rows = users.map(u => [
        `"${u.name}"`,
        `"${u.role}"`,
        `"${u.email}"`,
        `"${u.phone || '+63 917 555 0100'}"`,
        `"${u.rsbsaNo || 'RSBSA Registered'}"`,
        `"${u.assignedPlot || 'Cooperative HQ'}"`,
        `"${u.status !== false ? 'Active' : 'Inactive'}"`,
        `"${u.joinDate || '2024-01-15'}"`
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.setAttribute('download', `MARIKHA_${selectedReport.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    try {
      generateOfficialReportPDF(selectedReport.title, selectedReport.category, {
        crops,
        livestock,
        validations,
        schedules,
        users: selectedReportId === 'individual-dossier' ? [selectedIndividualUser] : users
      });
    } catch (e) {
      console.error('PDF export failed:', e);
      window.print();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.4px' }}>
            Administrative Reports
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            Generate, preview, and export cooperative member and administrative reports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => handleExportCSV(selectedReportId)}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              border: '1.5px solid #cbd5e1',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Download size={15} color="#15803d" /> Export CSV
          </button>

          <button
            onClick={() => setPreviewModalOpen(true)}
            style={{
              background: '#11592c',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(17,89,44,0.2)'
            }}
          >
            <Eye size={16} /> Preview Official Report
          </button>
        </div>
      </div>

      {/* Report Directory Grid */}
      <div>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: '0 0 12px 0' }}>
          Official Report Catalog
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {reportCatalog.map(report => {
            const isSelected = selectedReportId === report.id;

            return (
              <div
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className="m-card"
                style={{
                  padding: '18px',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #11592c' : '1px solid #e2e8f0',
                  background: isSelected ? '#f0fdf4' : '#ffffff',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isSelected ? '#dcfce7' : '#f1f5f9',
                      color: isSelected ? '#11592c' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileText size={16} />
                    </div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      background: isSelected ? '#bbf7d0' : '#e2e8f0',
                      color: isSelected ? '#11592c' : '#475569',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {report.frequency}
                    </span>
                  </div>

                  <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#15803d' }}>
                    {report.recordCount}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
                  {report.title}
                </h4>

                <p style={{ fontSize: '0.74rem', color: '#475569', margin: '0 0 14px 0', lineHeight: 1.45 }}>
                  {report.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    Status: <strong style={{ color: '#16a34a' }}>{report.status}</strong>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReportId(report.id);
                      setPreviewModalOpen(true);
                    }}
                    style={{
                      background: isSelected ? '#11592c' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#11592c',
                      border: '1px solid #cbd5e1',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Generate <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dedicated Section: Individual User Report Dossier */}
      {selectedReportId === 'individual-dossier' && (
        <div className="m-card" style={{ padding: '20px', borderLeft: '4px solid #11592c' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111827', margin: 0 }}>
                Individual Member Dossier Selector
              </h3>
              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Select a cooperative member to preview and print their individual record
              </span>
            </div>

            {/* Member Dropdown Selector */}
            <select
              value={individualUserId}
              onChange={(e) => setIndividualUserId(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1.5px solid #11592c',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#11592c',
                background: '#f0fdf4',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role}) — {u.rsbsaNo || 'Registered'}
                </option>
              ))}
            </select>
          </div>

          {/* Individual User Profile Card */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#11592c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem' }}>
                {selectedIndividualUser.initials || (selectedIndividualUser.name ? selectedIndividualUser.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'M')}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>
                  {selectedIndividualUser.name}
                </h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{selectedIndividualUser.email}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: '700', background: '#dcfce7', color: '#15803d', padding: '1px 6px', borderRadius: '4px' }}>
                    {selectedIndividualUser.role}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>RSBSA ID</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>{selectedIndividualUser.rsbsaNo || 'RSBSA-03-1425'}</span>
              </div>

              <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>ASSIGNED FIELD / SECTOR</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>{selectedIndividualUser.assignedPlot || 'Plot P-007'}</span>
              </div>

              <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>PHONE NUMBER</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>{selectedIndividualUser.phone || '+63 917 555 0100'}</span>
              </div>

              <div style={{ background: '#ffffff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>CERTIFICATION</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#16a34a' }}>{selectedIndividualUser.certification || 'PGS Level 1'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* A4 OFFICIAL LIVE PREVIEW MODAL */}
      {previewModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="m-card" style={{
            width: '100%',
            maxWidth: '840px',
            maxHeight: '90vh',
            background: '#ffffff',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            {/* Modal Control Bar */}
            <div style={{
              padding: '14px 20px',
              background: '#0c3619',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={18} color="#86efac" />
                <span style={{ fontSize: '0.88rem', fontWeight: '800', letterSpacing: '0.3px' }}>
                  A4 Report Document Preview: {selectedReport.title}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={handleDownloadPDF}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} /> Download PDF
                </button>

                <button
                  onClick={() => window.print()}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Printer size={14} /> Print
                </button>

                <button
                  onClick={() => setPreviewModalOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Document Content (Scrollable A4 paper view) */}
            <div style={{ padding: '28px 36px', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
              <div style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '32px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                minHeight: '600px'
              }}>
                {/* Official Letterhead */}
                <div style={{ borderBottom: '2px solid #0c3619', paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0c3619', margin: '0 0 4px 0', letterSpacing: '0.4px' }}>
                      ANTIPOLO ORGANIC FARMING COOPERATIVE (MARIKHA)
                    </h2>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>
                      Barangay San Jose, Antipolo City, Rizal · Cooperative Reg: ANT-ORG-2024-001
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: '700' }}>
                      Department of Agriculture · Bureau of Agriculture and Fisheries Standards (BAFS) Registered
                    </span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      display: 'inline-block',
                      background: '#f0fdf4',
                      border: '1.5px solid #86efac',
                      color: '#15803d',
                      fontSize: '0.72rem',
                      fontWeight: '800',
                      padding: '3px 10px',
                      borderRadius: '12px'
                    }}>
                      OFFICIAL DRAFT REPORT
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                      Generated: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Report Title & Metadata */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
                    {selectedReport.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.72rem', color: '#64748b' }}>
                    <span>Document Ref: <strong>DOC-ADM-2026-088</strong></span>
                    <span>Reporting Period: <strong>Wet Season 2026</strong></span>
                    <span>System Performer: <strong>Danilo Cruz (Admin IT/HR)</strong></span>
                  </div>
                </div>

                {/* Table Data Preview */}
                <div style={{ marginBottom: '28px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #cbd5e1', color: '#334155', textAlign: 'left' }}>
                        <th style={{ padding: '8px 10px' }}>#</th>
                        <th style={{ padding: '8px 10px' }}>Member Name</th>
                        <th style={{ padding: '8px 10px' }}>Role</th>
                        <th style={{ padding: '8px 10px' }}>RSBSA Number</th>
                        <th style={{ padding: '8px 10px' }}>Assigned Sector</th>
                        <th style={{ padding: '8px 10px' }}>Organic Cert</th>
                        <th style={{ padding: '8px 10px', textAlign: 'center' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedReportId === 'individual-dossier' ? [selectedIndividualUser] : users).map((u, idx) => (
                        <tr key={u.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 10px', color: '#94a3b8' }}>{idx + 1}</td>
                          <td style={{ padding: '8px 10px', fontWeight: '700', color: '#0f172a' }}>{u.name}</td>
                          <td style={{ padding: '8px 10px', color: '#11592c', fontWeight: '600' }}>{u.role}</td>
                          <td style={{ padding: '8px 10px', color: '#334155' }}>{u.rsbsaNo || 'RSBSA-03-1425'}</td>
                          <td style={{ padding: '8px 10px', color: '#475569' }}>{u.assignedPlot || 'Sector HQ'}</td>
                          <td style={{ padding: '8px 10px', color: '#16a34a' }}>{u.certification || 'PGS Level 1'}</td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: '700', color: u.status !== false ? '#15803d' : '#b45309' }}>
                              {u.status !== false ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Official Sign-off & Verification Block */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'auto'
                }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#0c3619', display: 'block' }}>
                      OFFICIAL ADMINISTRATIVE CERTIFICATION
                    </span>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '2px 0 0 0', maxWidth: '420px' }}>
                      Verified and certified from live Supabase cloud records under Antipolo Organic Farming Cooperative.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '28px', textAlign: 'center' }}>
                    <div>
                      <div style={{ width: '130px', borderBottom: '1px dashed #64748b', height: '24px', marginBottom: '4px' }} />
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#0f172a', display: 'block' }}>Danilo Cruz</span>
                      <span style={{ fontSize: '0.66rem', color: '#64748b' }}>Admin IT/HR</span>
                    </div>

                    <div>
                      <div style={{ width: '130px', borderBottom: '1px dashed #64748b', height: '24px', marginBottom: '4px' }} />
                      <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#0f172a', display: 'block' }}>Rosa Mendoza</span>
                      <span style={{ fontSize: '0.66rem', color: '#64748b' }}>Executive Director</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReportsModule;
