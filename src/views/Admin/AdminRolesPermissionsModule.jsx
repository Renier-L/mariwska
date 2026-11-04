import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Check, 
  Minus, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Server, 
  Users, 
  Sprout, 
  Binary, 
  Calendar, 
  CheckSquare, 
  BarChart3, 
  BrainCircuit, 
  Megaphone, 
  FileText,
  RotateCcw,
  Save,
  CheckCircle2,
  Eye,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ICON_MAP = {
  Server,
  Users,
  Sprout,
  Binary,
  Calendar,
  CheckSquare,
  BarChart3,
  BrainCircuit,
  Megaphone,
  FileText
};

const AdminRolesPermissionsModule = () => {
  const { 
    rbacCategories = [], 
    updateRbacCapability, 
    resetRbacToDefault 
  } = useAuth();

  // Filters
  const [selectedRoleView, setSelectedRoleView] = useState('All'); // 'All' | 'Super Admin' | 'Admin IT/HR' | 'Farm Staff' | 'Farmer'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [accessLevelFilter, setAccessLevelFilter] = useState('all'); // 'all' | 'edit' | 'view' | 'restricted'
  const [saveNotice, setSaveNotice] = useState('');

  const [expandedCategories, setExpandedCategories] = useState({
    sys_admin: true,
    user_mgmt: true,
    crops: true,
    livestock: true,
    scheduling: true,
    validation: true,
    analytics: true,
    decision: true,
    broadcast: true,
    reports: true
  });

  const toggleCategory = (catId) => {
    setExpandedCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleExpandAll = () => {
    const allOpen = {};
    rbacCategories.forEach(c => { allOpen[c.id] = true; });
    setExpandedCategories(allOpen);
  };

  const handleCollapseAll = () => {
    const allClosed = {};
    rbacCategories.forEach(c => { allClosed[c.id] = false; });
    setExpandedCategories(allClosed);
  };

  const handleResetFilters = () => {
    setSelectedRoleView('All');
    setCategoryFilter('All');
    setSearchTerm('');
    setAccessLevelFilter('all');
    handleExpandAll();
  };

  const handleManualSave = () => {
    setSaveNotice('All Access Control policies successfully saved and active in real time!');
    setTimeout(() => setSaveNotice(''), 5000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all role permissions to the initial approved cooperative defaults?')) {
      if (resetRbacToDefault) {
        resetRbacToDefault();
        setSaveNotice('RBAC matrix reset to approved cooperative defaults.');
        setTimeout(() => setSaveNotice(''), 4000);
      }
    }
  };

  // 4 Roles Overview Cards
  const roleCards = [
    {
      id: 'super_admin',
      name: 'Super Admin',
      badge: 'Super Admin',
      badgeBg: '#fee2e2',
      badgeColor: '#b91c1c',
      userCount: '1 User',
      portal: 'Web Management Portal',
      description: 'System administrator with system-wide oversight, security, service telemetry, audit logs, and permission configuration.',
      footer: 'Full System & Security Governance',
      isProtected: true
    },
    {
      id: 'admin',
      name: 'Admin IT/HR',
      badge: 'Admin IT/HR',
      badgeBg: '#eff6ff',
      badgeColor: '#1d4ed8',
      userCount: '1 User',
      portal: 'Web Management Portal',
      description: 'Responsible for member records, account administration, role assignments within scope, and broadcast announcements.',
      footer: 'Member Records & Routine Administration',
      isProtected: false
    },
    {
      id: 'farm_staff',
      name: 'Farm Staff',
      badge: 'Farm Staff',
      badgeBg: '#dcfce7',
      badgeColor: '#15803d',
      userCount: '2 Users',
      portal: 'Web Management Portal',
      description: 'Responsible for field activity validation, crop and livestock management, PGS compliance monitoring, and task assignment.',
      footer: 'Field Operations & Activity Validation',
      isProtected: false
    },
    {
      id: 'farmer',
      name: 'Farmer',
      badge: 'Farmer',
      badgeBg: '#dcfce7',
      badgeColor: '#16a34a',
      userCount: '8 Users',
      portal: 'Farmer Mobile Application',
      portalColor: '#0284c7',
      description: 'Field producer logging crop and livestock activities, photo submissions, personal schedules, and receiving yield recommendations.',
      footer: 'Mobile Activity Logging & Personal Plots',
      isProtected: false
    }
  ];

  // Helper to render role cell with 1-click toggle button AND dropdown
  const renderCell = (catId, cap, roleKey, roleTitle) => {
    const rawVal = cap[roleKey] || 'restricted';
    const status = rawVal === 'granted' ? 'edit' : rawVal;

    // Super Admin protected capabilities
    if (cap.protected && roleKey === 'superAdmin') {
      return (
        <span 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.74rem',
            fontWeight: '800',
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1.5px solid #fecdd3',
            cursor: 'not-allowed'
          }}
          title="Protected Super Admin governance setting"
        >
          <Lock size={12} /> Protected
        </span>
      );
    }

    const colorScheme = {
      edit: { bg: '#dcfce7', text: '#15803d', border: '#86efac', icon: Check, label: 'Can Edit' },
      view: { bg: '#eff6ff', text: '#0284c7', border: '#bfdbfe', icon: Eye, label: 'View-Only' },
      restricted: { bg: '#f1f5f9', text: '#64748b', border: '#cbd5e1', icon: Minus, label: 'Restricted' }
    }[status] || { bg: '#f1f5f9', text: '#64748b', border: '#cbd5e1', icon: Minus, label: 'Restricted' };

    const IconComp = colorScheme.icon;

    // 1-Click Cycle Action: Can Edit -> View-Only -> Restricted -> Can Edit
    const handleCycleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const cycleMap = { edit: 'view', view: 'restricted', restricted: 'edit' };
      const nextVal = cycleMap[status] || 'edit';
      if (updateRbacCapability) {
        updateRbacCapability(catId, cap.id, roleKey, nextVal);
      }
      const labelMap = { edit: 'Can Edit & Manage', view: 'View-Only Access', restricted: 'Restricted' };
      setSaveNotice(`✓ Updated: ${roleTitle} is now '${labelMap[nextVal]}' for "${cap.title}".`);
      setTimeout(() => setSaveNotice(''), 4500);
    };

    // Dropdown direct select action
    const handleSelectChange = (e) => {
      const nextVal = e.target.value;
      if (updateRbacCapability) {
        updateRbacCapability(catId, cap.id, roleKey, nextVal);
      }
      const labelMap = { edit: 'Can Edit & Manage', view: 'View-Only Access', restricted: 'Restricted' };
      setSaveNotice(`✓ Updated: ${roleTitle} is now '${labelMap[nextVal]}' for "${cap.title}".`);
      setTimeout(() => setSaveNotice(''), 4500);
    };

    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Clickable Badge Button that cycles on click */}
        <button
          type="button"
          onClick={handleCycleClick}
          title={`Click to switch: Can Edit ➔ View-Only ➔ Restricted (Current: ${colorScheme.label})`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: '20px 0 0 20px',
            fontSize: '0.74rem',
            fontWeight: '800',
            background: colorScheme.bg,
            color: colorScheme.text,
            border: `1.5px solid ${colorScheme.border}`,
            borderRight: 'none',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.95)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
        >
          <IconComp size={12} />
          <span>{colorScheme.label}</span>
        </button>

        {/* Dropdown Selector to directly choose */}
        <select
          value={status}
          onChange={handleSelectChange}
          title={`Or select access level directly for ${roleTitle}`}
          style={{
            padding: '5px 6px 5px 2px',
            borderRadius: '0 20px 20px 0',
            fontSize: '0.74rem',
            fontWeight: '800',
            background: colorScheme.bg,
            color: colorScheme.text,
            border: `1.5px solid ${colorScheme.border}`,
            borderLeft: `1px solid ${colorScheme.border}`,
            cursor: 'pointer',
            outline: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.95)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
        >
          <option value="edit">✓ Edit</option>
          <option value="view">👁 View</option>
          <option value="restricted">— Block</option>
        </select>
      </div>
    );
  };

  // Filter Categories
  const filteredCategories = rbacCategories.filter(cat => {
    if (categoryFilter !== 'All' && cat.title !== categoryFilter && cat.id !== categoryFilter) {
      return false;
    }
    return true;
  }).map(cat => {
    const q = searchTerm.toLowerCase().trim();
    const matchingCaps = cat.capabilities.filter(cap => {
      // Access Level Filter
      if (accessLevelFilter !== 'all') {
        const statuses = [cap.superAdmin, cap.admin, cap.staff, cap.farmer];
        const hasLevel = statuses.some(s => (s === 'granted' ? 'edit' : s) === accessLevelFilter);
        if (!hasLevel) return false;
      }

      if (!q) return true;
      return (
        cap.title.toLowerCase().includes(q) ||
        cap.description.toLowerCase().includes(q) ||
        cap.badge.toLowerCase().includes(q)
      );
    });

    return {
      ...cat,
      capabilities: matchingCaps
    };
  }).filter(cat => cat.capabilities.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-0.4px' }}>
              Roles & Permissions
            </h1>
            <span style={{
              background: '#dcfce7',
              color: '#15803d',
              border: '1px solid #86efac',
              fontSize: '0.68rem',
              fontWeight: '700',
              padding: '2px 8px',
              borderRadius: '6px'
            }}>
              Cloud RBAC Enforced
            </span>
            <span style={{
              background: '#fef3c7',
              color: '#b45309',
              border: '1px solid #fde68a',
              fontSize: '0.68rem',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ⚡ Live Interactive Editor Active
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            Super Admin, Admin, and Farm Staff share the same set of modules. Click any badge to cycle access or select Can Edit, View-Only, or Restricted.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleManualSave}
            style={{
              background: 'linear-gradient(135deg, #15803d 0%, #11592c 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(21,128,61,0.2)'
            }}
          >
            <Save size={14} /> Save Policies
          </button>

          <button
            onClick={handleResetDefaults}
            style={{
              background: '#ffffff',
              color: '#64748b',
              border: '1px solid #cbd5e1',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Reset to default cooperative permissions"
          >
            <RotateCcw size={13} /> Reset Defaults
          </button>
        </div>
      </div>

      {/* Real-time Save Feedback Alert */}
      {saveNotice && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #86efac',
          borderRadius: '10px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.82rem',
          fontWeight: '700',
          color: '#15803d',
          boxShadow: '0 2px 8px rgba(22,163,74,0.1)'
        }}>
          <CheckCircle2 size={18} />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* Interactive Helper Banner */}
      <div style={{
        background: '#f0fdf4',
        border: '1px solid #86efac',
        borderRadius: '10px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SlidersHorizontal size={18} color="#15803d" />
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#15803d', display: 'block' }}>
              Interactive Access Control Active
            </span>
            <span style={{ fontSize: '0.74rem', color: '#166534' }}>
              Click any badge in the table to toggle its permission (<strong>Can Edit ➔ View-Only ➔ Restricted</strong>), or use the attached dropdown selector.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b' }}>CONTROL:</span>
          <span style={{
            fontSize: '0.72rem',
            fontWeight: '800',
            background: '#dcfce7',
            color: '#15803d',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            1-Click Toggle & Dropdown Enabled
          </span>
        </div>
      </div>

      {/* 4 Roles Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        {roleCards.map(role => (
          <div 
            key={role.id}
            className="m-card"
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: role.isProtected ? '3px solid #b91c1c' : '3px solid #11592c'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: '800',
                  background: role.badgeBg,
                  color: role.badgeColor,
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {role.badge}
                </span>

                <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#0f172a' }}>
                  {role.userCount}
                </span>
              </div>

              <h3 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0' }}>
                {role.name}
              </h3>

              <span style={{ fontSize: '0.72rem', color: role.portalColor || '#15803d', fontWeight: '700', display: 'block', marginBottom: '8px' }}>
                {role.portal}
              </span>

              <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                {role.description}
              </p>
            </div>

            <div style={{
              borderTop: '1px solid #f1f5f9',
              paddingTop: '8px',
              fontSize: '0.7rem',
              fontWeight: '700',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>{role.footer}</span>
              {role.isProtected && (
                <span style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Lock size={11} /> Protected
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Control Bar */}
      <div className="m-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Role View Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#64748b', marginRight: '4px' }}>
              ROLE VIEW:
            </span>
            {['All', 'Super Admin', 'Admin IT/HR', 'Farm Staff', 'Farmer'].map(role => (
              <button
                key={role}
                onClick={() => setSelectedRoleView(role)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.74rem',
                  fontWeight: selectedRoleView === role ? '800' : '600',
                  background: selectedRoleView === role ? '#11592c' : '#f1f5f9',
                  color: selectedRoleView === role ? '#ffffff' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Quick Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleExpandAll}
              style={{ background: 'none', border: 'none', fontSize: '0.74rem', color: '#15803d', fontWeight: '700', cursor: 'pointer' }}
            >
              Expand All
            </button>
            <span style={{ color: '#cbd5e1' }}>·</span>
            <button
              onClick={handleCollapseAll}
              style={{ background: 'none', border: 'none', fontSize: '0.74rem', color: '#64748b', fontWeight: '700', cursor: 'pointer' }}
            >
              Collapse All
            </button>
            <span style={{ color: '#cbd5e1' }}>·</span>
            <button
              onClick={handleResetFilters}
              style={{ background: 'none', border: 'none', fontSize: '0.74rem', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Category & Search Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Category Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '700', color: '#64748b' }}>CATEGORIES:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#0f172a',
                outline: 'none',
                fontWeight: '600'
              }}
            >
              <option value="All">All Categories ({rbacCategories.length})</option>
              {rbacCategories.map(cat => (
                <option key={cat.id} value={cat.title}>{cat.title}</option>
              ))}
            </select>
          </div>

          {/* Access Level Filter Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: '700', color: '#64748b' }}>ACCESS LEVEL:</span>
            <select
              value={accessLevelFilter}
              onChange={(e) => setAccessLevelFilter(e.target.value)}
              style={{
                padding: '6px 12px',
                fontSize: '0.78rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                background: '#ffffff',
                color: '#0f172a',
                outline: 'none',
                fontWeight: '600'
              }}
            >
              <option value="all">All Access Levels</option>
              <option value="edit">Can Edit & Manage</option>
              <option value="view">View-Only Access</option>
              <option value="restricted">Restricted Only</option>
            </select>
          </div>

          {/* Live Search */}
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search capabilities across 10 modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 12px 6px 30px',
                fontSize: '0.78rem',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                outline: 'none',
                background: '#ffffff'
              }}
            />
          </div>

          {/* Access Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.72rem', fontWeight: '700' }}>
            <span style={{ color: '#15803d', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></span>
              Can Edit
            </span>
            <span style={{ color: '#0284c7', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#0284c7' }}></span>
              View-Only
            </span>
            <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }}></span>
              Restricted
            </span>
          </div>
        </div>
      </div>

      {/* 10 Accordion Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredCategories.map(cat => {
          const isExpanded = expandedCategories[cat.id] !== false;
          const IconComp = ICON_MAP[cat.iconName] || ShieldCheck;

          return (
            <div key={cat.id} className="m-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Category Header Bar */}
              <div
                onClick={() => toggleCategory(cat.id)}
                style={{
                  padding: '14px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  background: isExpanded ? '#f8fafc' : '#ffffff',
                  borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none',
                  transition: 'background 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: cat.iconBg || '#dcfce7',
                    color: cat.iconColor || '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComp size={16} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '0.94rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                        {cat.title}
                      </h4>
                      <span style={{ fontSize: '0.68rem', fontWeight: '700', background: '#e2e8f0', color: '#475569', padding: '1px 6px', borderRadius: '4px' }}>
                        {cat.capabilities.length} capabilities
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {cat.subtitle}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600' }}>
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </span>
                  {isExpanded ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                </div>
              </div>

              {/* Table of Capabilities */}
              {isExpanded && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.7rem', fontWeight: '800' }}>
                        <th style={{ padding: '10px 20px' }}>CAPABILITY / ACTION</th>
                        {(selectedRoleView === 'All' || selectedRoleView === 'Super Admin') && (
                          <th style={{ padding: '10px 14px', width: '180px', textAlign: 'center' }}>SUPER ADMIN</th>
                        )}
                        {(selectedRoleView === 'All' || selectedRoleView === 'Admin IT/HR') && (
                          <th style={{ padding: '10px 14px', width: '180px', textAlign: 'center' }}>ADMIN IT/HR</th>
                        )}
                        {(selectedRoleView === 'All' || selectedRoleView === 'Farm Staff') && (
                          <th style={{ padding: '10px 14px', width: '180px', textAlign: 'center' }}>FARM STAFF</th>
                        )}
                        {(selectedRoleView === 'All' || selectedRoleView === 'Farmer') && (
                          <th style={{ padding: '10px 14px', width: '180px', textAlign: 'center' }}>FARMER</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {cat.capabilities.map((cap) => (
                        <tr key={cap.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          {/* Capability Name & Description */}
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                              <span style={{
                                fontSize: '0.68rem',
                                fontWeight: '800',
                                background: cap.badgeBg,
                                color: cap.badgeColor,
                                padding: '1px 6px',
                                borderRadius: '4px'
                              }}>
                                {cap.badge}
                              </span>

                              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0f172a' }}>
                                {cap.title}
                              </span>

                              {cap.protected && (
                                <span style={{
                                  fontSize: '0.64rem',
                                  fontWeight: '700',
                                  background: '#fee2e2',
                                  color: '#b91c1c',
                                  padding: '1px 5px',
                                  borderRadius: '4px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '2px'
                                }}>
                                  🔒 Protected
                                </span>
                              )}
                            </div>

                            <p style={{ fontSize: '0.72rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                              {cap.description}
                            </p>
                          </td>

                          {/* Super Admin */}
                          {(selectedRoleView === 'All' || selectedRoleView === 'Super Admin') && (
                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                              {renderCell(cat.id, cap, 'superAdmin', 'Super Admin')}
                            </td>
                          )}

                          {/* Admin IT/HR */}
                          {(selectedRoleView === 'All' || selectedRoleView === 'Admin IT/HR') && (
                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                              {renderCell(cat.id, cap, 'admin', 'Admin IT/HR')}
                            </td>
                          )}

                          {/* Farm Staff */}
                          {(selectedRoleView === 'All' || selectedRoleView === 'Farm Staff') && (
                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                              {renderCell(cat.id, cap, 'staff', 'Farm Staff')}
                            </td>
                          )}

                          {/* Farmer */}
                          {(selectedRoleView === 'All' || selectedRoleView === 'Farmer') && (
                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                              {renderCell(cat.id, cap, 'farmer', 'Farmer')}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminRolesPermissionsModule;
