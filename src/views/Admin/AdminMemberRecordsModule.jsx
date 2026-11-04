import React, { useState } from 'react';
import { 
  Users, 
  Sprout, 
  CheckSquare, 
  ShieldCheck, 
  Search, 
  Plus, 
  MapPin, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Ban, 
  X, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  ShieldAlert,
  Calendar,
  Phone,
  Mail,
  Award
} from 'lucide-react';

const AdminMemberRecordsModule = ({
  users = [],
  addUser,
  updateUser,
  deleteUser,
  toggleUserStatus
}) => {
  // 12 Standard Members matching screenshot exactly
  const initialRoster = [
    {
      id: '1',
      name: 'Rosa Mendoza',
      email: 'rosa@mariwska.coop',
      role: 'Super Admin',
      roleType: 'super_admin',
      sector: 'Administrative HQ',
      status: 'Active',
      initials: 'RM',
      rsbsa: 'RSBSA-03-1001-EXEC',
      cert: 'PGS Governance Board',
      phone: '+63 917 555 0101',
      emergency: 'Jose Mendoza (+63 918 111 2222)'
    },
    {
      id: '2',
      name: 'Liza Cruz',
      email: 'liza@mariwska.coop',
      role: 'Admin IT/HR',
      roleType: 'admin',
      sector: 'Operations & Compliance Center',
      status: 'Active',
      initials: 'LC',
      rsbsa: 'RSBSA-03-1002-ADM',
      cert: 'Certified Organic Auditor',
      phone: '+63 917 555 0102',
      emergency: 'Mark Cruz (+63 918 333 4444)'
    },
    {
      id: '3',
      name: 'Ramon Velasco',
      email: 'ramon@mariwska.coop',
      role: 'Farm Staff',
      roleType: 'farm_staff',
      sector: 'Sector B (Plot P-007 & P-021)',
      status: 'Active',
      initials: 'RV',
      rsbsa: 'RSBSA-03-1003-STF',
      cert: 'PGS Organic Level II Supervisor',
      phone: '+63 917 555 0103',
      emergency: 'Elena Velasco (+63 918 555 6666)'
    },
    {
      id: '4',
      name: 'Maria Clara Torres',
      email: 'maria@mariwska.coop',
      role: 'Farm Staff',
      roleType: 'farm_staff',
      sector: 'Sector A (Livestock P-012)',
      status: 'Active',
      initials: 'MT',
      rsbsa: 'RSBSA-03-1004-VET',
      cert: 'Municipal Veterinary Officer',
      phone: '+63 917 555 0104',
      emergency: 'Ana Torres (+63 918 444 5555)'
    },
    {
      id: '5',
      name: 'Renier Lopez',
      email: 'lopezrenier97@gmail.com',
      role: 'Farmer',
      roleType: 'farmer',
      sector: 'Plot P-007 (Tomato Diamante)',
      status: 'Active',
      initials: 'RL',
      rsbsa: 'RSBSA-03-1425-001',
      cert: 'PGS Certified Organic Farmer',
      phone: '+63 917 555 0100',
      emergency: 'Maria Lopez (+63 918 777 8888)'
    },
    {
      id: '6',
      name: 'Mang Juan Dela Cruz',
      email: 'juan@mariwska.coop',
      role: 'Farmer',
      roleType: 'farmer',
      sector: 'Plot P-021 (Eggplant Mistisa)',
      status: 'Active',
      initials: 'JC',
      rsbsa: 'RSBSA-03-1425-002',
      cert: 'PGS Organic Certified',
      phone: '+63 917 555 0105',
      emergency: 'Juana Dela Cruz (+63 918 999 0000)'
    },
    {
      id: '7',
      name: 'Teresa Aquino',
      email: 'teresa@mariwska.coop',
      role: 'Farmer',
      roleType: 'farmer',
      sector: 'Plot P-034 (Okra Smooth Green)',
      status: 'Active',
      initials: 'TA',
      rsbsa: 'RSBSA-03-1425-003',
      cert: 'PGS Organic Certified',
      phone: '+63 917 555 0106',
      emergency: 'Ben Aquino (+63 918 555 9999)'
    },
    {
      id: '8',
      name: 'Rodrigo Ramos',
      email: 'rodrigo@mariwska.coop',
      role: 'Farmer',
      roleType: 'farmer',
      sector: 'Plot P-055 (Squash Suprema)',
      status: 'Active',
      initials: 'RR',
      rsbsa: 'RSBSA-03-1425-004',
      cert: 'PGS Organic Certified',
      phone: '+63 917 555 0107',
      emergency: 'Rita Ramos (+63 918 444 8888)'
    },
    {
      id: '9',
      name: 'Elena Gomez',
      email: 'elena.gomez@farmer.ph',
      role: 'Farmer',
      roleType: 'farmer',
      sector: 'Plot P-082 (Squash Suprema)',
      status: 'Active',
      initials: 'EG',
      rsbsa: 'RSBSA-03-1425-005',
      cert: 'PGS Organic Level 1',
      phone: '+63 917 555 0108',
      emergency: 'Carlos Gomez (+63 918 333 7777)'
    },
    {
      id: '10',
      name: 'Danilo Ramos',
      email: 'danilo.ramos@farmer.ph',
      role: 'Farmer',
      roleType: 'farmer',
      sector: 'Plot P-015 (Lettuce)',
      status: 'Active',
      initials: 'DR',
      rsbsa: 'RSBSA-03-1425-006',
      cert: 'PGS Organic Level 1',
      phone: '+63 917 555 0109',
      emergency: 'Rita Ramos (+63 918 444 8888)'
    },
    {
      id: '11',
      name: 'Manuel Roxas',
      email: 'manuel.roxas@farmer.ph',
      role: 'Farmer',
      roleType: 'farmer',
      sector: 'Plot P-044 (String Beans)',
      status: 'Active',
      initials: 'MR',
      rsbsa: 'RSBSA-03-1425-007',
      cert: 'PGS Organic Level 1',
      phone: '+63 917 555 0110',
      emergency: 'Trinidad Roxas (+63 918 666 0000)'
    },
    {
      id: '12',
      name: 'Corazon Silang',
      email: 'corazon.silang@farmer.ph',
      role: 'Farmer',
      roleType: 'farmer',
      sector: 'Plot P-055 (Ampalaya)',
      status: 'Inactive',
      initials: 'CS',
      rsbsa: 'RSBSA-03-1425-008',
      cert: 'Pending Renewal',
      phone: '+63 917 555 0111',
      emergency: 'Diego Silang (+63 918 777 1111)'
    }
  ];

  const [memberList, setMemberList] = useState(initialRoster);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingMember, setViewingMember] = useState(null);

  // Form State for "Add Cooperative Member" modal (matches 5 sections from Screenshot 4 & 5)
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contactNumber, setContactNumber] = useState('+63 917 555 0100');
  const [emailAddress, setEmailAddress] = useState('');
  const [memberId, setMemberId] = useState('MEM-2026-013');
  const [rsbsaId, setRsbsaId] = useState('');
  const [certStatus, setCertStatus] = useState('PGS Certified Organic Farmer');
  const [cropPlot, setCropPlot] = useState('P-007 (Tomato (Diamante))');
  const [goatHerd, setGoatHerd] = useState('None / No Livestock Assigned');
  const [systemRole, setSystemRole] = useState('Farmer (Mobile App User & Field Producer)');
  const [contactPerson, setContactPerson] = useState('');
  const [relationship, setRelationship] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('+63 918 777 8888');

  // Summary counts
  const totalCount = memberList.length;
  const farmerCount = memberList.filter(u => u.role === 'Farmer').length;
  const staffCount = memberList.filter(u => u.role === 'Farm Staff').length;
  const adminCount = memberList.filter(u => u.role === 'Super Admin' || u.role === 'Admin IT/HR' || u.role === 'Admin' || u.role === 'Executive').length;

  // Filter logic
  const filteredMembers = memberList.filter(m => {
    // Role filter
    if (roleFilter === 'Super Admin' && m.role !== 'Super Admin' && m.role !== 'Executive') return false;
    if (roleFilter === 'Admin IT/HR' && m.role !== 'Admin IT/HR' && m.role !== 'Admin') return false;
    if (roleFilter === 'Farm Staff' && m.role !== 'Farm Staff') return false;
    if (roleFilter === 'Farmers' && m.role !== 'Farmer') return false;

    // Status filter
    if (statusFilter === 'Active' && m.status !== 'Active') return false;
    if (statusFilter === 'Inactive' && m.status !== 'Inactive') return false;

    // Search term
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.sector && m.sector.toLowerCase().includes(q)) ||
      (m.rsbsa && m.rsbsa.toLowerCase().includes(q))
    );
  });

  // Pagination (8 items per page matching Screenshot 2)
  const pageSize = 8;
  const totalPages = Math.ceil(filteredMembers.length / pageSize) || 1;
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Toggle selection
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedMembers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedMembers.map(m => m.id));
    }
  };

  const handleToggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Add Member Submission
  const handleRegisterMember = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !emailAddress.trim()) {
      alert('Please fill in First Name, Last Name, and Email Address.');
      return;
    }

    const fullName = `${firstName.trim()} ${middleName.trim() ? middleName.trim() + ' ' : ''}${lastName.trim()}`;
    let mappedRole = 'Farmer';
    let mappedRoleType = 'farmer';
    if (systemRole.includes('Farm Staff')) { mappedRole = 'Farm Staff'; mappedRoleType = 'farm_staff'; }
    else if (systemRole.includes('Admin IT/HR')) { mappedRole = 'Admin IT/HR'; mappedRoleType = 'admin'; }
    else if (systemRole.includes('Super Admin')) { mappedRole = 'Super Admin'; mappedRoleType = 'super_admin'; }

    const newMember = {
      id: String(memberList.length + 1),
      name: fullName,
      email: emailAddress.trim(),
      role: mappedRole,
      roleType: mappedRoleType,
      sector: cropPlot,
      status: 'Active',
      initials: `${firstName[0]}${lastName[0]}`.toUpperCase(),
      rsbsa: rsbsaId.trim() || 'RSBSA-03-1425-NEW',
      cert: certStatus,
      phone: contactNumber,
      emergency: `${contactPerson} (${relationship} · ${emergencyPhone})`
    };

    setMemberList(prev => [newMember, ...prev]);
    if (addUser) {
      addUser({
        name: fullName,
        email: emailAddress.trim(),
        role: mappedRole === 'Admin IT/HR' ? 'Admin' : (mappedRole === 'Super Admin' ? 'Executive' : mappedRole),
        phone: contactNumber,
        assignedPlot: cropPlot,
        rsbsaNo: rsbsaId.trim() || 'RSBSA-03-1425-NEW',
        certification: certStatus,
        status: true
      });
    }

    setShowAddModal(false);
    // Reset Form
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setEmailAddress('');
    setRsbsaId('');
    setContactPerson('');
    setRelationship('');
  };

  // Status toggle
  const handleToggleStatus = (memberId) => {
    let memberEmail = null;
    setMemberList(prev => prev.map(m => {
      if (m.id === memberId) {
        memberEmail = m.email;
        const nextStatus = m.status === 'Active' ? 'Inactive' : 'Active';
        return { ...m, status: nextStatus };
      }
      return m;
    }));
    if (toggleUserStatus) toggleUserStatus(memberId, memberEmail);
    setActiveMenuId(null);
  };

  // Delete member
  const handleDelete = (memberId, memberName) => {
    if (window.confirm(`Are you sure you want to delete member record "${memberName}"?`)) {
      setMemberList(prev => prev.filter(m => m.id !== memberId));
      if (deleteUser) deleteUser(memberId);
    }
    setActiveMenuId(null);
  };

  // Get Role Badge styling matching screenshot 1
  const getRoleBadge = (role) => {
    if (role === 'Super Admin' || role === 'Executive') {
      return {
        bg: '#fee2e2',
        color: '#b91c1c',
        border: '#fecdd3',
        label: 'Super Admin'
      };
    }
    if (role === 'Admin IT/HR' || role === 'Admin') {
      return {
        bg: '#eff6ff',
        color: '#1d4ed8',
        border: '#bfdbfe',
        label: 'Admin IT/HR'
      };
    }
    if (role === 'Farm Staff') {
      return {
        bg: '#f0fdf4',
        color: '#059669',
        border: '#a7f3d0',
        label: 'Farm Staff'
      };
    }
    return {
      bg: '#dcfce7',
      color: '#16a34a',
      border: '#86efac',
      label: 'Farmer'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Title & Add Cooperative Member Button (Screenshot 1) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>
            Member Records
          </h1>
          <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
            Manage cooperative members, their information, certifications, and farm assignments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: '#0c3619',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(12, 54, 25, 0.25)'
          }}
        >
          <Plus size={16} /> Add Cooperative Member
        </button>
      </div>

      {/* 4 Summary Cards (Screenshot 1) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {/* TOTAL REGISTERED MEMBERS */}
        <div className="m-card" style={{ padding: '18px 20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.4px' }}>
              TOTAL REGISTERED MEMBERS
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={15} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', lineHeight: 1.1, margin: '4px 0 6px 0' }}>
            {totalCount} Members
          </div>
          <span style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: '700' }}>
            Cooperative Registry
          </span>
        </div>

        {/* REGISTERED FARMERS */}
        <div className="m-card" style={{ padding: '18px 20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.4px' }}>
              REGISTERED FARMERS
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout size={15} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#15803d', lineHeight: 1.1, margin: '4px 0 6px 0' }}>
            {farmerCount} Members
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600' }}>
            Field Producers & Growers
          </span>
        </div>

        {/* FARM STAFF */}
        <div className="m-card" style={{ padding: '18px 20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.4px' }}>
              FARM STAFF
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckSquare size={15} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f766e', lineHeight: 1.1, margin: '4px 0 6px 0' }}>
            {staffCount} Staff
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600' }}>
            Field Supervisors & Validators
          </span>
        </div>

        {/* ADMINISTRATIVE MEMBERS */}
        <div className="m-card" style={{ padding: '18px 20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.4px' }}>
              ADMINISTRATIVE MEMBERS
            </span>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={15} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#1e40af', lineHeight: 1.1, margin: '4px 0 6px 0' }}>
            {adminCount} Officers
          </div>
          <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600' }}>
            System Governance & Operations
          </span>
        </div>
      </div>

      {/* Table Card (Screenshot 1 & 2) */}
      <div className="m-card" style={{ padding: '20px', borderRadius: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        {/* Controls Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          {/* Role Filter Pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'All', label: `All (${totalCount})` },
              { id: 'Super Admin', label: 'Super Admin (1)' },
              { id: 'Admin IT/HR', label: 'Admin IT/HR (1)' },
              { id: 'Farm Staff', label: `Farm Staff (${staffCount})` },
              { id: 'Farmers', label: `Farmers (${farmerCount})` }
            ].map(tab => {
              const isActive = roleFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setRoleFilter(tab.id);
                    setCurrentPage(1);
                  }}
                  style={{
                    border: isActive ? 'none' : '1px solid #cbd5e1',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    background: isActive ? '#11592c' : '#ffffff',
                    color: isActive ? '#ffffff' : '#475569',
                    boxShadow: isActive ? '0 2px 4px rgba(17,89,44,0.2)' : 'none'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Status Dropdown & Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.76rem',
                fontWeight: '700',
                color: '#334155',
                outline: 'none',
                background: '#ffffff',
                cursor: 'pointer'
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
              <input
                type="text"
                placeholder="Search name, email, member ID, ..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
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
        </div>

        {/* Total Count Label */}
        <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600', marginBottom: '12px' }}>
          Showing {filteredMembers.length} of {totalCount} registered members
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #e2e8f0', color: '#64748b', fontWeight: '800', textAlign: 'left' }}>
                <th style={{ padding: '10px 8px', width: '32px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedMembers.length && paginatedMembers.length > 0}
                    onChange={handleToggleSelectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </th>
                <th style={{ padding: '10px 12px' }}>MEMBER</th>
                <th style={{ padding: '10px 12px' }}>SYSTEM ROLE</th>
                <th style={{ padding: '10px 12px' }}>FARM / SECTOR ASSIGNMENT</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>ACCOUNT STATUS</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                    No member records found matching your filter.
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member) => {
                  const roleBadge = getRoleBadge(member.role);
                  const isChecked = selectedIds.includes(member.id);

                  return (
                    <tr key={member.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      {/* Checkbox */}
                      <td style={{ padding: '12px 8px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectOne(member.id)}
                          style={{ cursor: 'pointer' }}
                        />
                      </td>

                      {/* Member Info (Avatar, Name, Email) */}
                      <td style={{ padding: '12px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#0c3619',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '0.74rem',
                            flexShrink: 0
                          }}>
                            {member.initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '0.82rem' }}>
                              {member.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              {member.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* System Role Badge */}
                      <td style={{ padding: '12px 12px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: '800',
                          background: roleBadge.bg,
                          color: roleBadge.color,
                          border: `1px solid ${roleBadge.border}`
                        }}>
                          {roleBadge.label}
                        </span>
                      </td>

                      {/* Farm / Sector Assignment */}
                      <td style={{ padding: '12px 12px', color: '#334155', fontWeight: '500' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={13} color="#64748b" />
                          <span>{member.sector}</span>
                        </div>
                      </td>

                      {/* Account Status Badge */}
                      <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: '800',
                          background: member.status === 'Active' ? '#dcfce7' : '#fee2e2',
                          color: member.status === 'Active' ? '#15803d' : '#b91c1c'
                        }}>
                          <span style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: member.status === 'Active' ? '#16a34a' : '#dc2626'
                          }} />
                          {member.status}
                        </span>
                      </td>

                      {/* 3-Dot Actions Menu */}
                      <td style={{ padding: '12px 12px', textAlign: 'center', position: 'relative' }}>
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748b',
                            padding: '4px'
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === member.id && (
                          <div style={{
                            position: 'absolute',
                            right: '16px',
                            top: '40px',
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            zIndex: 100,
                            width: '140px',
                            textAlign: 'left',
                            padding: '4px 0'
                          }}>
                            <button
                              onClick={() => {
                                setViewingMember(member);
                                setActiveMenuId(null);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.74rem',
                                color: '#334155',
                                cursor: 'pointer'
                              }}
                            >
                              <Eye size={13} color="#0284c7" /> View Profile
                            </button>

                            <button
                              onClick={() => handleToggleStatus(member.id)}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.74rem',
                                color: member.status === 'Active' ? '#b45309' : '#15803d',
                                cursor: 'pointer'
                              }}
                            >
                              <Ban size={13} /> {member.status === 'Active' ? 'Suspend' : 'Reactivate'}
                            </button>

                            <button
                              onClick={() => handleDelete(member.id, member.name)}
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: 'none',
                                background: 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.74rem',
                                color: '#dc2626',
                                cursor: 'pointer',
                                borderTop: '1px solid #f1f5f9'
                              }}
                            >
                              <Trash2 size={13} /> Delete Record
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer (Screenshot 2) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
          <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
            Showing {filteredMembers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredMembers.length)} of {filteredMembers.length} members
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '0.74rem',
                fontWeight: '700',
                color: currentPage === 1 ? '#cbd5e1' : '#334155',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ChevronLeft size={13} /> Previous
            </button>

            <span style={{ fontSize: '0.74rem', color: '#0f172a', fontWeight: '800', padding: '0 4px' }}>
              {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '0.74rem',
                fontWeight: '700',
                color: currentPage === totalPages ? '#cbd5e1' : '#334155',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MEMBER PROFILE MODAL */}
      {viewingMember && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="m-card" style={{ width: '500px', background: '#fff', padding: '24px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0c3619', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  {viewingMember.initials}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>{viewingMember.name}</h3>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>{viewingMember.email}</span>
                </div>
              </div>
              <button onClick={() => setViewingMember(null)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>SYSTEM ROLE</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#11592c' }}>{viewingMember.role}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>RSBSA ID</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>{viewingMember.rsbsa || 'RSBSA-03-1425'}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>ASSIGNED SECTOR</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>{viewingMember.sector}</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: '700', display: 'block' }}>PHONE NUMBER</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a' }}>{viewingMember.phone || '+63 917 555 0100'}</span>
              </div>
            </div>

            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#15803d', display: 'block' }}>ORGANIC CERTIFICATION STATUS</span>
              <span style={{ fontSize: '0.78rem', color: '#166534' }}>{viewingMember.cert || 'PGS Certified Organic Farmer · Level 1 Verified'}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setViewingMember(null)} className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.78rem' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5-SECTION "ADD COOPERATIVE MEMBER" MODAL (Screenshot 4 & 5) */}
      {showAddModal && (
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
            maxWidth: '560px',
            maxHeight: '90vh',
            background: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)'
          }}>
            {/* Modal Green Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0c3619 0%, #15803d 100%)',
              padding: '18px 22px',
              color: '#ffffff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Plus size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800' }}>
                    Add Cooperative Member
                  </h3>
                  <span style={{ fontSize: '0.74rem', opacity: 0.9 }}>
                    Register a new cooperative member and configure farm assignments and system access
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
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
                <X size={15} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleRegisterMember} style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 1. PERSONAL INFORMATION */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <h4 style={{ fontSize: '0.74rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
                  1. PERSONAL INFORMATION
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Danilo"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Middle Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Santos (Optional)"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Morales"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Contact Number *</label>
                    <input
                      type="text"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="member@mariwska.coop"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. COOPERATIVE MEMBERSHIP DETAILS */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <h4 style={{ fontSize: '0.74rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
                  2. COOPERATIVE MEMBERSHIP DETAILS
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Member ID</label>
                    <input
                      type="text"
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem', background: '#f8fafc', fontWeight: '700' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>RSBSA Registry ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. RSBSA-03-1425-008"
                      value={rsbsaId}
                      onChange={(e) => setRsbsaId(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Organic Certification Status</label>
                  <select
                    value={certStatus}
                    onChange={(e) => setCertStatus(e.target.value)}
                    style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem', background: '#fff' }}
                  >
                    <option value="PGS Certified Organic Farmer">PGS Certified Organic Farmer</option>
                    <option value="PGS Transitioning Level 1">PGS Transitioning Level 1</option>
                    <option value="Certified Organic Auditor">Certified Organic Auditor</option>
                    <option value="Non-Certified / General Member">Non-Certified / General Member</option>
                  </select>
                </div>
              </div>

              {/* 3. FARM & LIVESTOCK ASSIGNMENTS */}
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '14px' }}>
                <h4 style={{ fontSize: '0.74rem', fontWeight: '800', color: '#15803d', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
                  3. FARM & LIVESTOCK ASSIGNMENTS
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#166534', display: 'block', marginBottom: '4px' }}>Crop Plot Assignment</label>
                    <select
                      value={cropPlot}
                      onChange={(e) => setCropPlot(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #86efac', fontSize: '0.76rem', background: '#fff' }}
                    >
                      <option value="P-007 (Tomato (Diamante))">P-007 (Tomato (Diamante))</option>
                      <option value="P-021 (Eggplant (Mistisa))">P-021 (Eggplant (Mistisa))</option>
                      <option value="P-034 (Okra (Smooth Green))">P-034 (Okra (Smooth Green))</option>
                      <option value="P-055 (Squash (Suprema))">P-055 (Squash (Suprema))</option>
                      <option value="P-012 (Bitter Gourd (Ampalaya))">P-012 (Bitter Gourd (Ampalaya))</option>
                      <option value="Administrative HQ">Administrative HQ</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#166534', display: 'block', marginBottom: '4px' }}>Goat Herd Assignment (Optional)</label>
                    <select
                      value={goatHerd}
                      onChange={(e) => setGoatHerd(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #86efac', fontSize: '0.76rem', background: '#fff' }}
                    >
                      <option value="None / No Livestock Assigned">None / No Livestock Assigned</option>
                      <option value="Goat Herd GT-001 (Anglo-Nubian)">Goat Herd GT-001 (Anglo-Nubian)</option>
                      <option value="Goat Herd GT-002 (Boer Crossbreed)">Goat Herd GT-002 (Boer Crossbreed)</option>
                      <option value="Goat Herd GT-003 (Saanen Dairy)">Goat Herd GT-003 (Saanen Dairy)</option>
                      <option value="Goat Herd GT-004 (Native Grazing)">Goat Herd GT-004 (Native Grazing)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 4. SYSTEM ROLE & ACCOUNT SETUP */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <h4 style={{ fontSize: '0.74rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
                  4. SYSTEM ROLE & ACCOUNT SETUP
                </h4>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>System Access Role *</label>
                  <select
                    value={systemRole}
                    onChange={(e) => setSystemRole(e.target.value)}
                    style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem', background: '#fff' }}
                  >
                    <option value="Farmer (Mobile App User & Field Producer)">Farmer (Mobile App User & Field Producer)</option>
                    <option value="Farm Staff (Field Supervisor & Validator)">Farm Staff (Field Supervisor & Validator)</option>
                    <option value="Admin IT/HR (System Administration)">Admin IT/HR (System Administration)</option>
                    <option value="Super Admin (Executive Governance)">Super Admin (Executive Governance)</option>
                  </select>
                </div>

                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 12px', borderRadius: '6px', fontSize: '0.72rem', color: '#166534', lineHeight: 1.4 }}>
                  <strong>Secure Account Access:</strong> A sign-in invitation and credentials will be sent to the member's registered email. Plaintext passwords are not stored in cooperative membership records.
                </div>
              </div>

              {/* 5. EMERGENCY CONTACT INFORMATION */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
                <h4 style={{ fontSize: '0.74rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
                  5. EMERGENCY CONTACT INFORMATION
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Contact Person Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Maria Morales"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Relationship</label>
                    <input
                      type="text"
                      placeholder="e.g. Spouse / Sibling"
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>Contact Phone</label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      style={{ width: '100%', padding: '7px 9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.76rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: '#ffffff',
                    color: '#334155',
                    border: '1.5px solid #cbd5e1',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    background: '#0c3619',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 22px',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(12, 54, 25, 0.25)'
                  }}
                >
                  Register Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMemberRecordsModule;
