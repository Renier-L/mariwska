import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminDashboardModule from './AdminDashboardModule';
import AdminMemberRecordsModule from './AdminMemberRecordsModule';
import AdminRolesPermissionsModule from './AdminRolesPermissionsModule';
import AdminAnnouncementModule from './AdminAnnouncementModule';
import AdminReportsModule from './AdminReportsModule';
import AdminProfileModule from './AdminProfileModule';
import AdminSettingsModule from './AdminSettingsModule';

const AdminConsole = ({ activeTab, setActiveTab }) => {
  const { 
    users = [], 
    crops = [],
    livestock = [],
    validations = [],
    schedules = [],
    toggleUserStatus, 
    addUser,
    updateUser, 
    deleteUser, 
    announcements = [], 
    publishAnnouncement,
    deleteAnnouncement,
    toggleArchiveAnnouncement,
    currentUser,
    selectedSeason,
    setSelectedSeason
  } = useAuth();

  // Tab Routing
  if (activeTab === 'user-accounts' || activeTab === 'member-records') {
    return (
      <AdminMemberRecordsModule
        users={users}
        addUser={addUser}
        updateUser={updateUser}
        deleteUser={deleteUser}
        toggleUserStatus={toggleUserStatus}
      />
    );
  }

  if (activeTab === 'roles-permissions') {
    return <AdminRolesPermissionsModule />;
  }

  if (activeTab === 'announcements') {
    return (
      <AdminAnnouncementModule
        announcements={announcements}
        publishAnnouncement={publishAnnouncement}
        deleteAnnouncement={deleteAnnouncement}
        toggleArchiveAnnouncement={toggleArchiveAnnouncement}
        currentUser={currentUser}
      />
    );
  }

  if (activeTab === 'reports') {
    return (
      <AdminReportsModule
        users={users}
        crops={crops}
        livestock={livestock}
        validations={validations}
        schedules={schedules}
      />
    );
  }

  if (activeTab === 'profile') {
    return <AdminProfileModule currentUser={currentUser} />;
  }

  if (activeTab === 'settings') {
    return <AdminSettingsModule />;
  }

  // Default: Administration Dashboard ('operations-dashboard')
  return (
    <AdminDashboardModule
      users={users}
      announcements={announcements}
      setActiveTab={setActiveTab}
      onOpenAddMember={() => setActiveTab && setActiveTab('member-records')}
      onOpenCreateAnnouncement={() => setActiveTab && setActiveTab('announcements')}
      selectedSeason={selectedSeason}
      setSelectedSeason={setSelectedSeason}
    />
  );
};

export default AdminConsole;
