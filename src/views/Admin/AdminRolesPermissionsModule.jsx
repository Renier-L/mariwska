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
  RotateCcw
} from 'lucide-react';

const AdminRolesPermissionsModule = () => {
  const [selectedRoleView, setSelectedRoleView] = useState('All'); // 'All' | 'Super Admin' | 'Admin IT/HR' | 'Farm Staff' | 'Farmer'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyAllowed, setOnlyAllowed] = useState(false);
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
    categories.forEach(c => { allOpen[c.id] = true; });
    setExpandedCategories(allOpen);
  };

  const handleResetFilters = () => {
    setSelectedRoleView('All');
    setCategoryFilter('All');
    setSearchTerm('');
    setOnlyAllowed(false);
    handleExpandAll();
  };

  // 4 Roles Overview Cards (Screenshot 1)
  const roleCards = [
    {
      id: 'super_admin',
      name: 'Super Admin',
      badge: 'Super Admin',
      badgeBg: '#fee2e2',
      badgeColor: '#b91c1c',
      userCount: '1 User',
      portal: 'Web Management Portal',
      description: 'System administrator responsible for system-wide oversight, security, service telemetry, audit logs, and protected configurations.',
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

  // 10 Detailed Categories & Capabilities (Screenshots 2 to 5)
  const categories = [
    {
      id: 'sys_admin',
      title: 'System Administration',
      subtitle: 'Core infrastructure telemetry, system audit logs, and protected security configurations.',
      icon: Server,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      capabilities: [
        {
          badge: 'View',
          badgeColor: '#0284c7',
          badgeBg: '#eff6ff',
          title: 'View System Dashboard',
          description: 'Access comprehensive system dashboard overview and cooperative KPI metrics.',
          superAdmin: 'granted',
          admin: 'granted',
          staff: 'granted',
          farmer: 'restricted'
        },
        {
          badge: 'View',
          badgeColor: '#0284c7',
          badgeBg: '#eff6ff',
          title: 'Monitor Service Health & Telemetry',
          description: 'Inspect 5 core services telemetry, cloud latency, and database storage utilization.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'restricted',
          farmer: 'restricted'
        },
        {
          badge: 'View',
          badgeColor: '#0284c7',
          badgeBg: '#eff6ff',
          title: 'View System Audit Logs',
          description: 'Inspect immutable security audit trail, IP addresses, and user activity timestamps.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'restricted',
          farmer: 'restricted'
        },
        {
          badge: 'Configure',
          badgeColor: '#b45309',
          badgeBg: '#fef3c7',
          title: 'Manage Protected System Settings',
          protected: true,
          description: 'Configure cloud database endpoints, backup frequencies, and global security policies.',
          superAdmin: 'protected',
          admin: 'restricted',
          staff: 'restricted',
          farmer: 'restricted'
        },
        {
          badge: 'Configure',
          badgeColor: '#b45309',
          badgeBg: '#fef3c7',
          title: 'Configure Roles & Permissions Matrix',
          protected: true,
          description: 'Modify and commit role-based access control capabilities across user tiers.',
          superAdmin: 'protected',
          admin: 'restricted',
          staff: 'restricted',
          farmer: 'restricted'
        }
      ]
    },
    {
      id: 'user_mgmt',
      title: 'User & Member Management',
      subtitle: 'User authentication accounts, permission levels, and cooperative member profiles.',
      icon: Users,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      capabilities: [
        {
          badge: 'View',
          badgeColor: '#0284c7',
          badgeBg: '#eff6ff',
          title: 'View User Directory',
          description: 'Browse registered accounts, assigned roles, and member contact information.',
          superAdmin: 'granted',
          admin: 'granted',
          staff: 'granted',
          farmer: 'restricted'
        },
        {
          badge: 'Create',
          badgeColor: '#16a34a',
          badgeBg: '#dcfce7',
          title: 'Create User Accounts',
          description: 'Register new accounts with role-based access permissions and secure email invite.',
          superAdmin: 'granted',
          admin: 'granted',
          staff: 'restricted',
          farmer: 'restricted'
        },
        {
          badge: 'Edit',
          badgeColor: '#b45309',
          badgeBg: '#fef3c7',
          title: 'Edit Member Information',
          description: 'Update member names, mobile phone numbers, and assigned sectors.',
          superAdmin: 'granted',
          admin: 'granted',
          staff: 'restricted',
          farmer: 'restricted'
        },
        {
          badge: 'Configure',
          badgeColor: '#7e22ce',
          badgeBg: '#f3e8ff',
          title: 'Activate or Deactivate Accounts',
          description: 'Suspend or restore account login authentication without deleting historical logs.',
          superAdmin: 'granted',
          admin: 'granted',
          staff: 'restricted',
          farmer: 'restricted'
        },
        {
          badge: 'Configure',
          badgeColor: '#7e22ce',
          badgeBg: '#f3e8ff',
          title: 'Assign System Roles',
          protected: true,
          description: 'Assign or modify system access roles according to approved MARIKHA structure.',
          superAdmin: 'protected',
          admin: 'granted',
          staff: 'restricted',
          farmer: 'restricted'
        }
      ]
    },
    {
      id: 'crops',
      title: 'Crop Production Monitoring',
      subtitle: 'Field crop plots, vegetative growth steppers, organic inputs, and harvest records.',
      icon: Sprout,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      capabilities: [
        {
          badge: 'View',
          badgeColor: '#0284c7',
          badgeBg: '#eff6ff',
          title: 'View Crop Plot Records',
          description: 'Inspect registered crop plot details, planting dates, and vegetative stages.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'granted'
        },
        {
          badge: 'Create',
          badgeColor: '#16a34a',
          badgeBg: '#dcfce7',
          title: 'Register New Crop Plots',
          description: 'Register crop plots with land area, variety, and initial organic inputs.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'restricted'
        },
        {
          badge: 'Edit',
          badgeColor: '#b45309',
          badgeBg: '#fef3c7',
          title: 'Edit Crop Information',
          description: 'Update organic fertilizer inputs, drip irrigation systems, and target yields.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'restricted'
        },
        {
          badge: 'Update',
          badgeColor: '#d97706',
          badgeBg: '#fef3c7',
          title: 'Track Growth Stages & Yield Stepper',
          description: 'Advance vegetative growth cycles (Seedling, Vegetative, Flowering, Fruiting, Harvest).',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'granted'
        }
      ]
    },
    {
      id: 'livestock',
      title: 'Livestock Monitoring (Goats)',
      subtitle: 'Caprine herd inventory, pen locations, health observations, and vaccination protocols.',
      icon: Binary,
      iconBg: '#fef3c7',
      iconColor: '#d97706',
      capabilities: [
        {
          badge: 'View',
          badgeColor: '#0284c7',
          badgeBg: '#eff6ff',
          title: 'View Livestock Herd Records',
          description: 'Inspect caprine herd headcounts, breed breakdowns (Anglo-Nubian, Boer), and pens.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'granted'
        },
        {
          badge: 'Create',
          badgeColor: '#16a34a',
          badgeBg: '#dcfce7',
          title: 'Register Goat Herds & Pen Locations',
          description: 'Register new goat herd groups and barn pen locations in Supabase.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'restricted'
        },
        {
          badge: 'Edit',
          badgeColor: '#b45309',
          badgeBg: '#fef3c7',
          title: 'Edit Livestock Information',
          description: 'Update forage feed rations, buck/doe/kid headcounts, and average herd weights.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'restricted'
        },
        {
          badge: 'Update',
          badgeColor: '#d97706',
          badgeBg: '#fef3c7',
          title: 'Track Health & Vaccination Protocols',
          description: 'Log CDT toxoid, broad-spectrum deworming, and veterinary health observations.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'granted'
        }
      ]
    },
    {
      id: 'scheduling',
      title: 'Scheduling and Task Management',
      subtitle: 'Cooperative master calendar, agronomic tasks, farm events, and assignment workflows.',
      icon: Calendar,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      capabilities: [
        {
          badge: 'View',
          badgeColor: '#0284c7',
          badgeBg: '#eff6ff',
          title: 'View Schedules & Task Calendar',
          description: 'View cooperative-wide calendar, planned activities, and assigned deadlines.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'granted'
        },
        {
          badge: 'Create',
          badgeColor: '#16a34a',
          badgeBg: '#dcfce7',
          title: 'Create Agricultural Tasks',
          description: 'Create scheduled tasks with target date, priority, and organic protocol instructions.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'restricted'
        },
        {
          badge: 'Edit',
          badgeColor: '#b45309',
          badgeBg: '#fef3c7',
          title: 'Edit & Reschedule Tasks',
          description: 'Modify task dates, times, priority levels, and agronomic guidelines.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'restricted'
        },
        {
          badge: 'Assign',
          badgeColor: '#4f46e5',
          badgeBg: '#e0e7ff',
          title: 'Assign Tasks to Farmers & Staff',
          description: 'Allocate operational task responsibility to registered farmers and supervisors.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'restricted'
        },
        {
          badge: 'Update',
          badgeColor: '#d97706',
          badgeBg: '#fef3c7',
          title: 'Mark Tasks Completed',
          description: 'Mark assigned operational tasks as completed upon field execution.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'granted'
        }
      ]
    },
    {
      id: 'validation',
      title: 'Farmer Mobile Activity Validation',
      subtitle: 'Field inspection of photo proofs, GPS coordinates, and PGS organic verification.',
      icon: CheckSquare,
      iconBg: '#dcfce7',
      iconColor: '#15803d',
      capabilities: [
        {
          badge: 'View',
          badgeColor: '#0284c7',
          badgeBg: '#eff6ff',
          title: 'View Pending Mobile Activity Queue',
          description: 'Review submissions from farmers with photo proofs, timestamps, and GPS.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'restricted'
        },
        {
          badge: 'Validate',
          badgeColor: '#15803d',
          badgeBg: '#dcfce7',
          title: 'Approve or Reject Farm Activities',
          description: 'Validate farmer field entries for PGS compliance or flag for physical reinspection.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'restricted'
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Agricultural Analytics & Random Forest',
      subtitle: 'Random Forest Regressor (v2.4-rf-agri) harvest predictions, R² scores, and variance audits.',
      icon: BarChart3,
      iconBg: '#f3e8ff',
      iconColor: '#7e22ce',
      capabilities: [
        {
          badge: 'View',
          badgeColor: '#0284c7',
          badgeBg: '#eff6ff',
          title: 'View Harvest Yield Analytics & Trends',
          description: 'Inspect actual vs Random Forest predicted yields and historical variance curves.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'restricted'
        },
        {
          badge: 'Compute',
          badgeColor: '#7e22ce',
          badgeBg: '#f3e8ff',
          title: 'Recalculate Yield Regression Models',
          description: 'Trigger Random Forest model retrain with latest validated seasonal inputs.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'restricted',
          farmer: 'restricted'
        }
      ]
    },
    {
      id: 'decision',
      title: 'Decision Support & Operational Plan',
      subtitle: '8-week predictive yield horizon, feature weights, risk factors, and agronomic interventions.',
      icon: BrainCircuit,
      iconBg: '#f0fdf4',
      iconColor: '#15803d',
      capabilities: [
        {
          badge: 'View',
          badgeColor: '#0284c7',
          badgeBg: '#eff6ff',
          title: 'View Decision Support Recommendations',
          description: 'Inspect identified risk factors, predictive yield horizon, and suggested tasks.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'granted',
          farmer: 'restricted'
        },
        {
          badge: 'Action',
          badgeColor: '#15803d',
          badgeBg: '#dcfce7',
          title: 'Commit Recommendations to Schedule',
          description: 'Approve agronomic recommendations and schedule as cooperative tasks.',
          superAdmin: 'granted',
          admin: 'restricted',
          staff: 'restricted',
          farmer: 'restricted'
        }
      ]
    },
    {
      id: 'broadcast',
      title: 'Cooperative Broadcast & Announcements',
      subtitle: 'Create, schedule, and push cooperative broadcast notices to member web and mobile devices.',
      icon: Megaphone,
      iconBg: '#eff6ff',
      iconColor: '#2563eb',
      capabilities: [
        {
          badge: 'View',
          badgeColor: '#0284c7',
          badgeBg: '#eff6ff',
          title: 'View Broadcast Directory',
          description: 'Browse scheduled, active, and expired announcements.',
          superAdmin: 'granted',
          admin: 'granted',
          staff: 'granted',
          farmer: 'granted'
        },
        {
          badge: 'Create',
          badgeColor: '#16a34a',
          badgeBg: '#dcfce7',
          title: 'Publish & Push Announcements',
          description: 'Create announcements with target audience filters and instant push notifications.',
          superAdmin: 'granted',
          admin: 'granted',
          staff: 'restricted',
          farmer: 'restricted'
        },
        {
          badge: 'Manage',
          badgeColor: '#b45309',
          badgeBg: '#fef3c7',
          title: 'Archive or Delete Announcements',
          description: 'Manage expiration schedules and remove outdated broadcasts.',
          superAdmin: 'granted',
          admin: 'granted',
          staff: 'restricted',
          farmer: 'restricted'
        }
      ]
    },
    {
      id: 'reports',
      title: 'Administrative Reports & Data Export',
      subtitle: 'Export member directories, RSBSA registries, staff assignments, and A4 audit dossiers.',
      icon: FileText,
      iconBg: '#f8fafc',
      iconColor: '#475569',
      capabilities: [
        {
          badge: 'View',
          badgeColor: '#0284c7',
          badgeBg: '#eff6ff',
          title: 'Preview Official Reports',
          description: 'View A4 live document layout with letterheads and administrative sign-offs.',
          superAdmin: 'granted',
          admin: 'granted',
          staff: 'granted',
          farmer: 'restricted'
        },
        {
          badge: 'Export',
          badgeColor: '#15803d',
          badgeBg: '#dcfce7',
          title: 'Export PDF & CSV Master Dossiers',
          description: 'Download member directories, RSBSA rosters, and farm oversight reports.',
          superAdmin: 'granted',
          admin: 'granted',
          staff: 'granted',
          farmer: 'restricted'
        }
      ]
    }
  ];

  // Helper to render cell value
  const renderCell = (status) => {
    if (status === 'granted') {
      return (
        <span style={{ color: '#16a34a', fontWeight: '800', fontSize: '0.9rem' }}>
          ✓
        </span>
      );
    }
    if (status === 'protected') {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: '#fee2e2',
          color: '#b91c1c',
          padding: '2px 8px',
          borderRadius: '6px',
          fontSize: '0.68rem',
          fontWeight: '800'
        }}>
          🔒 Protected
        </span>
      );
    }
    return (
      <span style={{ color: '#cbd5e1', fontWeight: '700', fontSize: '0.85rem' }}>
        —
      </span>
    );
  };

  // Filter Categories
  const filteredCategories = categories.filter(cat => {
    if (categoryFilter !== 'All' && cat.id !== categoryFilter) return false;
    return true;
  }).map(cat => {
    let filteredCaps = cat.capabilities.filter(cap => {
      // Search
      const q = searchTerm.toLowerCase().trim();
      if (q && !cap.title.toLowerCase().includes(q) && !cap.description.toLowerCase().includes(q)) {
        return false;
      }

      // Role filter check
      if (selectedRoleView === 'Super Admin' && onlyAllowed && cap.superAdmin === 'restricted') return false;
      if (selectedRoleView === 'Admin IT/HR' && onlyAllowed && cap.admin === 'restricted') return false;
      if (selectedRoleView === 'Farm Staff' && onlyAllowed && cap.staff === 'restricted') return false;
      if (selectedRoleView === 'Farmer' && onlyAllowed && cap.farmer === 'restricted') return false;

      return true;
    });

    return { ...cat, capabilities: filteredCaps };
  }).filter(cat => cat.capabilities.length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Section (Screenshot 1) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>
            Roles & Permissions
          </h1>
          <span style={{
            background: '#dcfce7',
            color: '#15803d',
            border: '1px solid #86efac',
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '0.72rem',
            fontWeight: '800'
          }}>
            Cloud RBAC Enforced
          </span>
        </div>
        <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
          View system roles, access permissions, and assigned capabilities.
        </p>
      </div>

      {/* Read-Only Access Banner (Screenshot 1) */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <ShieldCheck size={18} color="#15803d" />
        <span style={{ fontSize: '0.78rem', color: '#334155' }}>
          <strong style={{ color: '#0f172a' }}>Read-Only Access:</strong> You can view role permissions. Only the Superadmin can modify permission settings.
        </span>
      </div>

      {/* SYSTEM ROLES OVERVIEW (4 ROLES DEFINED) (Screenshot 1) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="#0c3619" />
            <span style={{ fontSize: '0.78rem', fontWeight: '900', color: '#0f172a', letterSpacing: '0.4px' }}>
              SYSTEM ROLES OVERVIEW (4 ROLES DEFINED)
            </span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
            Click any role card below to inspect its permissions
          </span>
        </div>

        {/* 4 Role Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {roleCards.map(rc => {
            const isSelected = selectedRoleView === rc.name;

            return (
              <div
                key={rc.id}
                onClick={() => setSelectedRoleView(selectedRoleView === rc.name ? 'All' : rc.name)}
                className="m-card"
                style={{
                  padding: '16px 18px',
                  borderRadius: '12px',
                  background: isSelected ? '#f0fdf4' : '#ffffff',
                  border: isSelected ? '2px solid #11592c' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      background: rc.badgeBg,
                      color: rc.badgeColor,
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      {rc.badge}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                      {rc.userCount}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0f172a', margin: '0 0 2px 0' }}>
                    {rc.name}
                  </h3>
                  <span style={{ fontSize: '0.7rem', color: rc.portalColor || '#64748b', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                    {rc.portal}
                  </span>

                  <p style={{ fontSize: '0.72rem', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                    {rc.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px', fontSize: '0.68rem', color: '#64748b' }}>
                  <span>{rc.footer}</span>
                  {rc.isProtected && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      background: '#fef3c7',
                      color: '#b45309',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      fontWeight: '700'
                    }}>
                      🔒 Protected
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role View Filters Bar (Screenshot 1) */}
      <div className="m-card" style={{ padding: '16px 20px', borderRadius: '12px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Row 1: ROLE VIEW Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: '800', color: '#475569', letterSpacing: '0.3px' }}>
            ROLE VIEW:
          </span>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All Roles (Comparison)', 'Super Admin', 'Admin IT/HR', 'Farm Staff', 'Farmer'].map(tab => {
              const tabKey = tab.startsWith('All') ? 'All' : tab;
              const isActive = selectedRoleView === tabKey;

              return (
                <button
                  key={tab}
                  onClick={() => setSelectedRoleView(tabKey)}
                  style={{
                    border: isActive ? 'none' : '1px solid #cbd5e1',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    background: isActive ? '#0c3619' : '#ffffff',
                    color: isActive ? '#ffffff' : '#475569',
                    boxShadow: isActive ? '0 2px 4px rgba(12, 54, 25, 0.25)' : 'none'
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Category Dropdown, Search Input, Expand All, Reset Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.76rem',
                fontWeight: '700',
                color: '#334155',
                background: '#ffffff',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Modules (10 Categories)</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>

            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search capability or key..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  borderRadius: '8px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.76rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleExpandAll}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.74rem',
                fontWeight: '700',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              Expand All
            </button>

            <button
              onClick={handleResetFilters}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.74rem',
                fontWeight: '700',
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RotateCcw size={12} /> Reset Filters
            </button>
          </div>
        </div>

        {/* Row 3: Read-Only Mode & Legend */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '10px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: '700',
              color: '#475569'
            }}>
              <Lock size={12} /> Read-Only Mode
            </span>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#475569', cursor: 'pointer', fontWeight: '600' }}>
              <input
                type="checkbox"
                checked={onlyAllowed}
                onChange={(e) => setOnlyAllowed(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Show Allowed Permissions Only
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.72rem', color: '#64748b', fontWeight: '700' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#16a34a' }}>✓</span> Granted
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#cbd5e1' }}>—</span> Restricted
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#b45309' }}>🔒</span> Protected
            </span>
          </div>
        </div>
      </div>

      {/* Accordion Categories List (Screenshots 2 to 5) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredCategories.map(cat => {
          const Icon = cat.icon;
          const isExpanded = expandedCategories[cat.id] !== false;

          return (
            <div
              key={cat.id}
              className="m-card"
              style={{
                borderRadius: '14px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
              }}
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: '#ffffff',
                  border: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: cat.iconBg,
                    color: cat.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800', color: '#0f172a' }}>
                      {cat.title}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {cat.subtitle}
                    </span>
                  </div>
                </div>

                {isExpanded ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
              </button>

              {/* Capabilities Table */}
              {isExpanded && (
                <div style={{ overflowX: 'auto', borderTop: '1px solid #f1f5f9' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid #e2e8f0', color: '#64748b', fontWeight: '800', textAlign: 'center' }}>
                        <th style={{ padding: '10px 20px', textAlign: 'left' }}>CAPABILITY & ACTION</th>
                        {(selectedRoleView === 'All' || selectedRoleView === 'Super Admin') && (
                          <th style={{ padding: '10px 14px', width: '110px' }}>SUPER ADMIN</th>
                        )}
                        {(selectedRoleView === 'All' || selectedRoleView === 'Admin IT/HR') && (
                          <th style={{ padding: '10px 14px', width: '110px' }}>ADMIN IT/HR</th>
                        )}
                        {(selectedRoleView === 'All' || selectedRoleView === 'Farm Staff') && (
                          <th style={{ padding: '10px 14px', width: '110px' }}>FARM STAFF</th>
                        )}
                        {(selectedRoleView === 'All' || selectedRoleView === 'Farmer') && (
                          <th style={{ padding: '10px 14px', width: '110px' }}>FARMER</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {cat.capabilities.map((cap, capIdx) => (
                        <tr key={capIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
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
                            <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                              {renderCell(cap.superAdmin)}
                            </td>
                          )}

                          {/* Admin IT/HR */}
                          {(selectedRoleView === 'All' || selectedRoleView === 'Admin IT/HR') && (
                            <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                              {renderCell(cap.admin)}
                            </td>
                          )}

                          {/* Farm Staff */}
                          {(selectedRoleView === 'All' || selectedRoleView === 'Farm Staff') && (
                            <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                              {renderCell(cap.staff)}
                            </td>
                          )}

                          {/* Farmer */}
                          {(selectedRoleView === 'All' || selectedRoleView === 'Farmer') && (
                            <td style={{ padding: '14px 14px', textAlign: 'center' }}>
                              {renderCell(cap.farmer)}
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
