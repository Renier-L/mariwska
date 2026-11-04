// MARIKHA Centralized RBAC (Role-Based Access Control) Matrix Definition
// Governs granular capabilities across Super Admin, Admin IT/HR, Farm Staff, and Farmer

export const INITIAL_RBAC_CATEGORIES = [
  {
    id: 'sys_admin',
    title: 'System Administration',
    subtitle: 'Core infrastructure telemetry, system audit logs, and protected security configurations.',
    iconName: 'Server',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    capabilities: [
      {
        id: 'sys_dash',
        badge: 'View',
        badgeColor: '#0284c7',
        badgeBg: '#eff6ff',
        title: 'View System Dashboard',
        description: 'Access comprehensive system dashboard overview and cooperative KPI metrics.',
        superAdmin: 'edit',
        admin: 'edit',
        staff: 'view',
        farmer: 'restricted'
      },
      {
        id: 'sys_telemetry',
        badge: 'View',
        badgeColor: '#0284c7',
        badgeBg: '#eff6ff',
        title: 'Monitor Service Health & Telemetry',
        description: 'Inspect core services telemetry, cloud latency, and database storage utilization.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'restricted',
        farmer: 'restricted'
      },
      {
        id: 'sys_audit',
        badge: 'View',
        badgeColor: '#0284c7',
        badgeBg: '#eff6ff',
        title: 'View System Audit Logs',
        description: 'Inspect immutable security audit trail, IP addresses, and user activity timestamps.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'restricted',
        farmer: 'restricted'
      },
      {
        id: 'sys_settings',
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
        id: 'sys_rbac',
        badge: 'Configure',
        badgeColor: '#b45309',
        badgeBg: '#fef3c7',
        title: 'Configure Roles & Permissions Matrix',
        protected: true,
        description: 'Modify and commit role-based access control capabilities across user tiers.',
        superAdmin: 'protected',
        admin: 'view',
        staff: 'restricted',
        farmer: 'restricted'
      }
    ]
  },
  {
    id: 'user_mgmt',
    title: 'User & Member Management',
    subtitle: 'User authentication accounts, permission levels, and cooperative member profiles.',
    iconName: 'Users',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    capabilities: [
      {
        id: 'usr_dir',
        badge: 'View',
        badgeColor: '#0284c7',
        badgeBg: '#eff6ff',
        title: 'View User Directory',
        description: 'Browse registered accounts, assigned roles, and member contact information.',
        superAdmin: 'edit',
        admin: 'edit',
        staff: 'view',
        farmer: 'restricted'
      },
      {
        id: 'usr_create',
        badge: 'Create',
        badgeColor: '#16a34a',
        badgeBg: '#dcfce7',
        title: 'Create User Accounts',
        description: 'Register new accounts with role-based access permissions and secure email invite.',
        superAdmin: 'edit',
        admin: 'edit',
        staff: 'restricted',
        farmer: 'restricted'
      },
      {
        id: 'usr_edit',
        badge: 'Edit',
        badgeColor: '#b45309',
        badgeBg: '#fef3c7',
        title: 'Edit Member Information',
        description: 'Update member names, mobile phone numbers, and assigned sectors.',
        superAdmin: 'edit',
        admin: 'edit',
        staff: 'restricted',
        farmer: 'restricted'
      },
      {
        id: 'usr_status',
        badge: 'Configure',
        badgeColor: '#7e22ce',
        badgeBg: '#f3e8ff',
        title: 'Activate or Deactivate Accounts',
        description: 'Suspend or restore account login authentication without deleting historical logs.',
        superAdmin: 'edit',
        admin: 'edit',
        staff: 'restricted',
        farmer: 'restricted'
      },
      {
        id: 'usr_assign',
        badge: 'Configure',
        badgeColor: '#7e22ce',
        badgeBg: '#f3e8ff',
        title: 'Assign System Roles',
        protected: true,
        description: 'Assign or modify system access roles according to approved MARIKHA structure.',
        superAdmin: 'protected',
        admin: 'edit',
        staff: 'restricted',
        farmer: 'restricted'
      }
    ]
  },
  {
    id: 'crops',
    title: 'Crop Production Monitoring',
    subtitle: 'Field crop plots, vegetative growth steppers, organic inputs, and harvest records.',
    iconName: 'Sprout',
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    capabilities: [
      {
        id: 'crop_view',
        badge: 'View',
        badgeColor: '#0284c7',
        badgeBg: '#eff6ff',
        title: 'View Crop Plot Records',
        description: 'Inspect registered crop plot details, planting dates, and vegetative stages.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'view'
      },
      {
        id: 'crop_reg',
        badge: 'Create',
        badgeColor: '#16a34a',
        badgeBg: '#dcfce7',
        title: 'Register New Crop Plots',
        description: 'Register crop plots with land area, variety, and initial organic inputs.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'restricted'
      },
      {
        id: 'crop_edit',
        badge: 'Edit',
        badgeColor: '#b45309',
        badgeBg: '#fef3c7',
        title: 'Edit Crop Information',
        description: 'Update organic fertilizer inputs, drip irrigation systems, and target yields.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'restricted'
      },
      {
        id: 'crop_growth',
        badge: 'Update',
        badgeColor: '#d97706',
        badgeBg: '#fef3c7',
        title: 'Track Growth Stages & Yield Stepper',
        description: 'Advance vegetative growth cycles (Seedling, Vegetative, Flowering, Fruiting, Harvest).',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'edit'
      }
    ]
  },
  {
    id: 'livestock',
    title: 'Livestock Monitoring (Goats)',
    subtitle: 'Caprine herd inventory, pen locations, health observations, and vaccination protocols.',
    iconName: 'Binary',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    capabilities: [
      {
        id: 'live_view',
        badge: 'View',
        badgeColor: '#0284c7',
        badgeBg: '#eff6ff',
        title: 'View Livestock Herd Records',
        description: 'Inspect caprine herd headcounts, breed breakdowns (Anglo-Nubian, Boer), and pens.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'view'
      },
      {
        id: 'live_reg',
        badge: 'Create',
        badgeColor: '#16a34a',
        badgeBg: '#dcfce7',
        title: 'Register Goat Herds & Pen Locations',
        description: 'Register new goat herd groups and barn pen locations in Supabase.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'restricted'
      },
      {
        id: 'live_edit',
        badge: 'Edit',
        badgeColor: '#b45309',
        badgeBg: '#fef3c7',
        title: 'Edit Livestock Information',
        description: 'Update forage feed rations, buck/doe/kid headcounts, and average herd weights.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'restricted'
      },
      {
        id: 'live_vacc',
        badge: 'Update',
        badgeColor: '#d97706',
        badgeBg: '#fef3c7',
        title: 'Track Health & Vaccination Protocols',
        description: 'Log CDT toxoid, broad-spectrum deworming, and veterinary health observations.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'view'
      }
    ]
  },
  {
    id: 'scheduling',
    title: 'Scheduling and Task Management',
    subtitle: 'Cooperative master calendar, agronomic tasks, farm events, and assignment workflows.',
    iconName: 'Calendar',
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    capabilities: [
      {
        id: 'task_view',
        badge: 'View',
        badgeColor: '#0284c7',
        badgeBg: '#eff6ff',
        title: 'View Schedules & Task Calendar',
        description: 'View cooperative-wide calendar, planned activities, and assigned deadlines.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'view'
      },
      {
        id: 'task_create',
        badge: 'Create',
        badgeColor: '#16a34a',
        badgeBg: '#dcfce7',
        title: 'Create Agricultural Tasks',
        description: 'Create scheduled tasks with target date, priority, and organic protocol instructions.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'restricted'
      },
      {
        id: 'task_edit',
        badge: 'Edit',
        badgeColor: '#b45309',
        badgeBg: '#fef3c7',
        title: 'Edit & Reschedule Tasks',
        description: 'Modify task dates, times, priority levels, and agronomic guidelines.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'restricted'
      },
      {
        id: 'task_assign',
        badge: 'Assign',
        badgeColor: '#4f46e5',
        badgeBg: '#e0e7ff',
        title: 'Assign Tasks to Farmers & Staff',
        description: 'Allocate operational task responsibility to registered farmers and supervisors.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'restricted'
      },
      {
        id: 'task_complete',
        badge: 'Update',
        badgeColor: '#d97706',
        badgeBg: '#fef3c7',
        title: 'Mark Tasks Completed',
        description: 'Mark assigned operational tasks as completed upon field execution.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'edit'
      }
    ]
  },
  {
    id: 'validation',
    title: 'Farmer Mobile Activity Validation',
    subtitle: 'Field inspection of photo proofs, GPS coordinates, and PGS organic verification.',
    iconName: 'CheckSquare',
    iconBg: '#dcfce7',
    iconColor: '#15803d',
    capabilities: [
      {
        id: 'val_queue',
        badge: 'View',
        badgeColor: '#0284c7',
        badgeBg: '#eff6ff',
        title: 'View Pending Mobile Activity Queue',
        description: 'Review submissions from farmers with photo proofs, timestamps, and GPS.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'restricted'
      },
      {
        id: 'val_action',
        badge: 'Validate',
        badgeColor: '#15803d',
        badgeBg: '#dcfce7',
        title: 'Approve or Reject Farm Activities',
        description: 'Validate farmer field entries for PGS compliance or flag for physical reinspection.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'edit',
        farmer: 'restricted'
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Agricultural Analytics & Random Forest',
    subtitle: 'Random Forest Regressor (v2.4-rf-agri) harvest predictions, R² scores, and variance audits.',
    iconName: 'BarChart3',
    iconBg: '#f3e8ff',
    iconColor: '#7e22ce',
    capabilities: [
      {
        id: 'rf_view',
        badge: 'View',
        badgeColor: '#0284c7',
        badgeBg: '#eff6ff',
        title: 'View Harvest Yield Analytics & Trends',
        description: 'Inspect actual vs Random Forest predicted yields and historical variance curves.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'view',
        farmer: 'restricted'
      },
      {
        id: 'rf_recalc',
        badge: 'Compute',
        badgeColor: '#7e22ce',
        badgeBg: '#f3e8ff',
        title: 'Recalculate Yield Regression Models',
        description: 'Trigger Random Forest model retrain with latest validated seasonal inputs.',
        superAdmin: 'edit',
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
    iconName: 'BrainCircuit',
    iconBg: '#f0fdf4',
    iconColor: '#15803d',
    capabilities: [
      {
        id: 'dec_view',
        badge: 'View',
        badgeColor: '#0284c7',
        badgeBg: '#eff6ff',
        title: 'View Decision Support Recommendations',
        description: 'Inspect identified risk factors, predictive yield horizon, and suggested tasks.',
        superAdmin: 'edit',
        admin: 'view',
        staff: 'view',
        farmer: 'restricted'
      },
      {
        id: 'dec_commit',
        badge: 'Action',
        badgeColor: '#15803d',
        badgeBg: '#dcfce7',
        title: 'Commit Recommendations to Schedule',
        description: 'Approve agronomic recommendations and schedule as cooperative tasks.',
        superAdmin: 'edit',
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
    iconName: 'Megaphone',
    iconBg: '#eff6ff',
    iconColor: '#2563eb',
    capabilities: [
      {
        id: 'broad_view',
        badge: 'View',
        badgeColor: '#0284c7',
        badgeBg: '#eff6ff',
        title: 'View Broadcast Directory',
        description: 'Browse scheduled, active, and expired announcements.',
        superAdmin: 'edit',
        admin: 'edit',
        staff: 'view',
        farmer: 'view'
      },
      {
        id: 'broad_publish',
        badge: 'Create',
        badgeColor: '#16a34a',
        badgeBg: '#dcfce7',
        title: 'Publish & Push Announcements',
        description: 'Create announcements with target audience filters and instant push notifications.',
        superAdmin: 'edit',
        admin: 'edit',
        staff: 'restricted',
        farmer: 'restricted'
      },
      {
        id: 'broad_manage',
        badge: 'Manage',
        badgeColor: '#b45309',
        badgeBg: '#fef3c7',
        title: 'Archive or Delete Announcements',
        description: 'Manage expiration schedules and remove outdated broadcasts.',
        superAdmin: 'edit',
        admin: 'edit',
        staff: 'restricted',
        farmer: 'restricted'
      }
    ]
  },
  {
    id: 'reports',
    title: 'Administrative Reports & Data Export',
    subtitle: 'Export member directories, RSBSA registries, staff assignments, and A4 audit dossiers.',
    iconName: 'FileText',
    iconBg: '#f8fafc',
    iconColor: '#475569',
    capabilities: [
      {
        id: 'rep_preview',
        badge: 'View',
        badgeColor: '#0284c7',
        badgeBg: '#eff6ff',
        title: 'Preview Official Reports',
        description: 'View A4 live document layout with letterheads and administrative sign-offs.',
        superAdmin: 'edit',
        admin: 'edit',
        staff: 'view',
        farmer: 'restricted'
      },
      {
        id: 'rep_export',
        badge: 'Export',
        badgeColor: '#15803d',
        badgeBg: '#dcfce7',
        title: 'Export PDF & CSV Master Dossiers',
        description: 'Download member directories, RSBSA rosters, and farm oversight reports.',
        superAdmin: 'edit',
        admin: 'edit',
        staff: 'view',
        farmer: 'restricted'
      }
    ]
  }
];

export const ACCESS_LEVELS = [
  { value: 'edit', label: 'Can Edit & Manage', shortLabel: 'Can Edit', badgeBg: '#dcfce7', badgeColor: '#15803d', iconText: '✓' },
  { value: 'view', label: 'View-Only Access', shortLabel: 'View-Only', badgeBg: '#eff6ff', badgeColor: '#0284c7', iconText: '👁' },
  { value: 'restricted', label: 'Restricted (No Access)', shortLabel: 'Restricted', badgeBg: '#f1f5f9', badgeColor: '#64748b', iconText: '—' },
  { value: 'protected', label: 'System Protected', shortLabel: 'Protected', badgeBg: '#fee2e2', badgeColor: '#b91c1c', iconText: '🔒' }
];
