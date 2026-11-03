import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
	LayoutDashboard, 
	Sprout, 
	Binary, 
	BarChart3, 
	BrainCircuit, 
	FileText, 
	LogOut, 
	Users, 
	ShieldCheck, 
	Megaphone,
	CheckSquare,
	ShieldAlert,
	Trees,
	CalendarDays,
	UserCheck,
	Settings
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
	const { currentRole, loginAsRole } = useAuth();

	let portalTitle = 'Super Admin Portal';

	// Categorized Navigation for Super Admin matching media_1793632288847.png
	const superAdminCategories = [
		{
			category: 'OVERVIEW & SYSTEM',
			items: [
				{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
				{ id: 'audit-logs', label: 'Audit Logs', icon: ShieldAlert },
			]
		},
		{
			category: 'FARM OPERATIONS',
			items: [
				{ id: 'crop-monitoring', label: 'Crop Monitoring', icon: Sprout },
				{ id: 'livestock-monitoring', label: 'Livestock Monitoring', icon: Binary },
				{ id: 'scheduling', label: 'Schedules & Tasks', icon: CalendarDays },
			]
		},
		{
			category: 'ANALYTICS & PREDICTIONS',
			items: [
				{ id: 'analytics', label: 'Agricultural Analytics', icon: BarChart3 },
				{ id: 'decision-support', label: 'Decision Support', icon: BrainCircuit },
				{ id: 'reports', label: 'Reports & Export', icon: FileText },
			]
		},
		{
			category: 'ADMINISTRATION',
			items: [
				{ id: 'user-accounts', label: 'User Management', icon: Users },
				{ id: 'roles-permissions', label: 'Roles & Security', icon: ShieldCheck },
			]
		},
		{
			category: 'ACCOUNT',
			items: [
				{ id: 'profile', label: 'My Profile', icon: UserCheck },
				{ id: 'settings', label: 'Settings', icon: Settings },
			]
		}
	];

	// Categorized Navigation for Admin Console
	const adminCategories = [
		{
			category: 'OPERATIONS & USERS',
			items: [
				{ id: 'operations-dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
				{ id: 'member-records', label: 'User Management', icon: Users },
				{ id: 'roles-permissions', label: 'Roles & Security', icon: ShieldCheck },
			]
		},
		{
			category: 'BROADCAST & AUDIT',
			items: [
				{ id: 'announcements', label: 'Announcements Push', icon: Megaphone },
				{ id: 'reports', label: 'Reports & Export', icon: FileText },
			]
		}
	];

	// Categorized Navigation for Farm Staff
	const farmStaffCategories = [
		{
			category: 'FIELD OPERATIONS',
			items: [
				{ id: 'operations-dashboard', label: 'Operations Overview', icon: LayoutDashboard },
				{ id: 'activity-validation', label: 'Activity Validation', icon: CheckSquare },
				{ id: 'ml-audit', label: 'ML Audit & Risk', icon: ShieldAlert },
			]
		},
		{
			category: 'FARM SUPERVISION',
			items: [
				{ id: 'crop-management', label: 'Crop Management', icon: Trees },
				{ id: 'farmer-management', label: 'Farmer Management', icon: Users },
				{ id: 'livestock-management', label: 'Livestock Management', icon: Binary },
				{ id: 'reports', label: 'Reports & Export', icon: FileText },
			]
		}
	];

	let categories = superAdminCategories;
	if (currentRole === 'admin') {
		portalTitle = 'Administrator Console';
		categories = adminCategories;
	} else if (currentRole === 'farm_staff') {
		portalTitle = 'Farm Staff Validation';
		categories = farmStaffCategories;
	}

	return (
		<aside className="sidebar-nav">
			{/* Fixed Brand Header */}
			<div style={{ flexShrink: 0, paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
				<div style={{
					width: '32px',
					height: '32px',
					borderRadius: '50%',
					background: 'rgba(255, 255, 255, 0.12)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontSize: '1rem',
					flexShrink: 0
				}}>
					🌿
				</div>
				<div>
					<h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1, margin: 0 }}>
						MARIKHA
					</h2>
					<div style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: '600' }}>
						{portalTitle}
					</div>
				</div>
			</div>

			{/* Scrollable Categorized Navigation (Always Stays Inside Dark Green Sidebar) */}
			<nav className="sidebar-scroll-container">
				<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
					{categories.map((cat, cIdx) => (
						<div key={cIdx}>
							<div style={{
								fontSize: '0.64rem',
								fontWeight: '800',
								color: '#6ee7b7',
								letterSpacing: '0.6px',
								textTransform: 'uppercase',
								marginBottom: '4px',
								paddingLeft: '10px'
							}}>
								{cat.category}
							</div>
							<div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
								{cat.items.map((item) => {
									const Icon = item.icon;
									// Distinct, accurate active check without accidental multi-active highlights
									const isActive = activeTab === item.id || 
										(item.id === 'user-accounts' && (activeTab === 'member-records' || activeTab === 'user-accounts')) ||
										(item.id === 'member-records' && (activeTab === 'user-accounts' || activeTab === 'member-records')) ||
										(item.id === 'dashboard' && !activeTab);

									return (
										<button
											key={item.id}
											onClick={() => {
												if (item.id === 'profile') {
													const profileBtn = document.querySelector('[title*="Edit My Profile"]');
													if (profileBtn) profileBtn.click();
												} else if (item.id === 'settings') {
													const guideBtn = document.querySelector('[title*="System Architecture"]');
													if (guideBtn) guideBtn.click();
												} else {
													setActiveTab(item.id);
												}
											}}
											style={{
												display: 'flex',
												alignItems: 'center',
												gap: '10px',
												padding: '7px 10px',
												borderRadius: '8px',
												fontSize: '0.78rem',
												fontWeight: isActive ? '800' : '500',
												color: isActive ? '#ffffff' : '#d1fae5',
												background: isActive ? '#175429' : 'transparent',
												border: isActive ? '1px solid #23733b' : '1px solid transparent',
												textAlign: 'left',
												cursor: 'pointer',
												transition: 'all 0.15s ease',
												whiteSpace: 'nowrap'
											}}
										>
											<Icon size={15} color={isActive ? '#86efac' : '#a7f3d0'} />
											{item.label}
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</nav>

			{/* Pinned Bottom Sign Out */}
			<div style={{ flexShrink: 0, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: '10px' }}>
				<button
					onClick={() => loginAsRole('login')}
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '10px',
						padding: '8px 12px',
						borderRadius: '8px',
						color: '#a7f3d0',
						fontSize: '0.8rem',
						fontWeight: '600',
						background: 'rgba(255,255,255,0.06)',
						border: '1px solid rgba(255,255,255,0.1)',
						width: '100%',
						cursor: 'pointer',
						transition: 'all 0.15s ease'
					}}
				>
					<LogOut size={14} />
					Sign out
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
