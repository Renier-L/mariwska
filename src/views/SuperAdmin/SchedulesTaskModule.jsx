import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sprout, 
  Binary, 
  User, 
  Tag, 
  X, 
  Check, 
  Trash2, 
  Clock3 
} from 'lucide-react';

const SchedulesTaskModule = ({ schedules = [], addSchedule, updateScheduleStatus, deleteSchedule }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState(15);
  const [showAddModal, setShowAddModal] = useState(false);

  // Default tasks fallback if schedules is empty
  const defaultTasks = [
    {
      id: 'TSK-2026-001',
      title: 'Apply Foliar Seaweed Extract',
      category: 'Fertilization',
      target: 'Plot P-007 · Tomato (Diamante Max)',
      targetType: 'crop',
      farmer: 'Juan Dela Cruz (RSBSA-04-1234)',
      supervisor: 'Staff A. Bautista',
      dueDate: '2026-11-05',
      time: '07:30 AM',
      priority: 'High',
      status: 'Pending',
      instructions: 'Spray dilute 1:500 seaweed extract on lower foliage before morning heat.'
    },
    {
      id: 'TSK-2026-002',
      title: 'Drip Line Flushing & Moisture Probe',
      category: 'Irrigation & Soil',
      target: 'Plot P-021 · Eggplant (Mistisa)',
      targetType: 'crop',
      farmer: 'Roberto Cruz (RSBSA-04-5678)',
      supervisor: 'Staff A. Bautista',
      dueDate: '2026-11-06',
      time: '08:00 AM',
      priority: 'High',
      status: 'In Progress',
      instructions: 'Flush emitter lines at 1.5 bar pressure; inspect for sediment clogging.'
    },
    {
      id: 'TSK-2026-003',
      title: 'Routine Boer Herd Hoof Trimming',
      category: 'Livestock Care',
      target: 'Herd HRD-GT-002 · Boer Goats',
      targetType: 'livestock',
      farmer: 'Roberto Cruz (RSBSA-04-5678)',
      supervisor: 'Staff M. Reyes',
      dueDate: '2026-11-10',
      time: '09:00 AM',
      priority: 'Medium',
      status: 'Pending',
      instructions: 'Trim overgrown hoof walls; apply copper sulfate spray to soles.'
    },
    {
      id: 'TSK-2026-004',
      title: 'Harvest Window #4 Commercial Pick',
      category: 'Harvest',
      target: 'Plot P-094 · Okra (Smooth Green)',
      targetType: 'crop',
      farmer: 'Maria Santos (RSBSA-04-9012)',
      supervisor: 'Staff A. Bautista',
      dueDate: '2026-11-04',
      time: '06:00 AM',
      priority: 'High',
      status: 'Overdue',
      instructions: 'Harvest pods at 10-12 cm size; sort into Grade A organic crates.'
    },
    {
      id: 'TSK-2026-005',
      title: 'Neem Oil Pest Barrier Spraying',
      category: 'Pest & Weed',
      target: 'Plot P-082 · Squash (Suprema)',
      targetType: 'crop',
      farmer: 'Elena Gomez (RSBSA-04-3456)',
      supervisor: 'Staff M. Reyes',
      dueDate: '2026-11-08',
      time: '04:30 PM',
      priority: 'Medium',
      status: 'Pending',
      instructions: 'Apply organic cold-pressed neem formulation against fruit borers.'
    },
    {
      id: 'TSK-2026-006',
      title: 'Soil Nitrogen Test & Composting',
      category: 'Irrigation & Soil',
      target: 'Plot P-015 · Lettuce (Green Towers)',
      targetType: 'crop',
      farmer: 'Danilo Ramos (RSBSA-04-7890)',
      supervisor: 'Staff A. Bautista',
      dueDate: '2026-11-02',
      time: '08:00 AM',
      priority: 'Low',
      status: 'Completed',
      instructions: 'Take 5-point composite soil sample; mulch with vermicompost.'
    }
  ];

  const taskList = (schedules && schedules.length > 0) ? schedules : defaultTasks;

  // New task form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Fertilization',
    target: 'Plot P-007 · Tomato (Diamante Max)',
    farmer: 'Juan Dela Cruz (RSBSA-04-1234)',
    supervisor: 'Staff A. Bautista',
    dueDate: '2026-11-12',
    time: '08:00 AM',
    priority: 'Medium',
    instructions: ''
  });

  // Calculate statistics
  const totalTasks = taskList.length;
  const pendingTasks = taskList.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
  const overdueTasks = taskList.filter(t => t.status === 'Overdue').length;
  const completedTasks = taskList.filter(t => t.status === 'Completed').length;

  // Filter tasks
  const filteredTasks = taskList.filter(t => {
    const matchCat = selectedCategory === 'All' || t.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchSearch = (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (t.target || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (t.farmer || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreateTask = (e) => {
    e.preventDefault();
    const newTask = {
      ...formData,
      id: `TSK-2026-00${taskList.length + 1}`,
      status: 'Pending'
    };
    if (addSchedule) {
      addSchedule(newTask);
    }
    setShowAddModal(false);
    setFormData({
      title: '',
      category: 'Fertilization',
      target: 'Plot P-007 · Tomato (Diamante Max)',
      farmer: 'Juan Dela Cruz (RSBSA-04-1234)',
      supervisor: 'Staff A. Bautista',
      dueDate: '2026-11-12',
      time: '08:00 AM',
      priority: 'Medium',
      instructions: ''
    });
  };

  return (
    <div className="superadmin-module animate-fade-in" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', background: '#dcfce7', color: '#11592c', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', marginBottom: '6px' }}>
            <CalendarDays size={14} /> Cooperative Operations Calendar
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            Operational Schedules & Task Dispatch
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
            Farm operations calendar, task dispatching & field completion tracking.
          </p>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          style={{ 
            display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', 
            background: '#11592c', color: '#ffffff', border: 'none', 
            borderRadius: '8px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(17,89,44,0.2)'
          }}
        >
          <Plus size={16} /> Create Schedule / Task
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Scheduled Tasks
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#0f172a' }}>{totalTasks}</span>
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700' }}>Dispatched</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Across all crops and goat pens
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Pending Execution
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#2563eb' }}>{pendingTasks}</span>
            <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: '600' }}>Active</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Awaiting farmer field check-in
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Overdue Actions
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: overdueTasks > 0 ? '#ef4444' : '#16a34a' }}>{overdueTasks}</span>
            <span style={{ fontSize: '0.8rem', color: overdueTasks > 0 ? '#ef4444' : '#16a34a', fontWeight: '700' }}>
              {overdueTasks > 0 ? 'Urgent' : 'Clear'}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: overdueTasks > 0 ? '#b91c1c' : '#64748b', marginTop: '4px', display: 'block' }}>
            {overdueTasks > 0 ? 'Requires immediate supervisor follow-up' : 'All field activities on track'}
          </span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Completed This Week
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '1.9rem', fontWeight: '800', color: '#16a34a' }}>{completedTasks}</span>
            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '600' }}>Verified</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Validated by assigned farm supervisors
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'All', label: `All Operations (${taskList.length})` },
          { id: 'Fertilization', label: 'Fertilization' },
          { id: 'Irrigation', label: 'Irrigation & Soil' },
          { id: 'Harvest', label: 'Harvest' },
          { id: 'Pest', label: 'Pest & Weed' },
          { id: 'Livestock', label: 'Livestock Care' }
        ].map((pill) => (
          <button
            key={pill.id}
            onClick={() => setSelectedCategory(pill.id)}
            style={{
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: selectedCategory === pill.id ? '700' : '600',
              borderRadius: '20px',
              border: selectedCategory === pill.id ? '1px solid #11592c' : '1px solid #cbd5e1',
              background: selectedCategory === pill.id ? '#11592c' : '#ffffff',
              color: selectedCategory === pill.id ? '#ffffff' : '#475569',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Dual Pane Layout: Interactive Calendar + Operational Schedule Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Pane: Interactive Calendar */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>November 2026</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '4px 6px', cursor: 'pointer' }}>
                <ChevronLeft size={14} />
              </button>
              <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '4px 6px', cursor: 'pointer' }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', fontSize: '0.72rem', marginBottom: '16px' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <span key={i} style={{ color: '#94a3b8', fontWeight: '700', padding: '4px 0' }}>{d}</span>
            ))}
            {/* 30 days dummy calendar */}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isSelected = day === selectedDay;
              const hasTask = [2, 4, 5, 6, 8, 10, 15, 22].includes(day);
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #11592c' : '1px solid transparent',
                    background: isSelected ? '#dcfce7' : '#ffffff',
                    color: isSelected ? '#11592c' : '#334155',
                    fontWeight: isSelected ? '800' : '500',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <span>{day}</span>
                  {hasTask && (
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#11592c', position: 'absolute', bottom: '3px' }} />
                  )}
                </button>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '8px' }}>
              Day Agenda · Nov {selectedDay}, 2026
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #11592c', fontSize: '0.78rem' }}>
                <strong style={{ display: 'block', color: '#0f172a' }}>Drip Line Inspection</strong>
                <span style={{ color: '#64748b', fontSize: '0.72rem' }}>08:00 AM · Plot P-021</span>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', borderLeft: '3px solid #d97706', fontSize: '0.78rem' }}>
                <strong style={{ display: 'block', color: '#0f172a' }}>Compost Moisture Log</strong>
                <span style={{ color: '#64748b', fontSize: '0.72rem' }}>02:30 PM · Sector B</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Operational Schedule & Action Timeline */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {/* Search bar inside table container */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text"
                placeholder="Search tasks, crops, assigned farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 34px', fontSize: '0.82rem', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
              />
            </div>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Showing {filteredTasks.length} tasks
            </span>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                  <th style={{ padding: '12px 16px' }}>Task Description</th>
                  <th style={{ padding: '12px 16px' }}>Category</th>
                  <th style={{ padding: '12px 16px' }}>Target Asset</th>
                  <th style={{ padding: '12px 16px' }}>Assigned Farmer</th>
                  <th style={{ padding: '12px 16px' }}>Schedule Window</th>
                  <th style={{ padding: '12px 16px' }}>Priority</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ color: '#0f172a', display: 'block', fontSize: '0.85rem' }}>{task.title}</strong>
                      <span style={{ color: '#64748b', fontSize: '0.72rem' }}>{task.id}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: '#f1f5f9', color: '#334155', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', fontWeight: '600' }}>
                        {task.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#334155' }}>
                      {task.target}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#0f172a', fontWeight: '500' }}>
                      {task.farmer}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#475569' }}>
                      <div>{task.dueDate}</div>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{task.time}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        background: task.priority === 'High' ? '#fee2e2' : task.priority === 'Medium' ? '#fef3c7' : '#f1f5f9',
                        color: task.priority === 'High' ? '#b91c1c' : task.priority === 'Medium' ? '#b45309' : '#475569'
                      }}>
                        {task.priority}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <select 
                        value={task.status}
                        onChange={(e) => {
                          if (updateScheduleStatus) {
                            updateScheduleStatus(task.id, e.target.value);
                          }
                        }}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: '700',
                          border: '1px solid #cbd5e1',
                          background: task.status === 'Completed' ? '#dcfce7' : task.status === 'Overdue' ? '#fee2e2' : '#f8fafc',
                          color: task.status === 'Completed' ? '#15803d' : task.status === 'Overdue' ? '#b91c1c' : '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      {deleteSchedule && (
                        <button 
                          onClick={() => {
                            if (window.confirm(`Delete task ${task.title}?`)) {
                              deleteSchedule(task.id);
                            }
                          }}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                          title="Delete Task"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Create Schedule / Task */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Create Operational Task</h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '4px 0 0 0' }}>Dispatch farming activity to member or staff</p>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Task Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Apply Organic Foliar Spray"
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}
                  >
                    <option value="Fertilization">Fertilization</option>
                    <option value="Irrigation & Soil">Irrigation & Soil</option>
                    <option value="Pest & Weed">Pest & Weed</option>
                    <option value="Harvest">Harvest</option>
                    <option value="Livestock Care">Livestock Care</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Priority Level</label>
                  <select 
                    value={formData.priority} 
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Target Field Plot / Herd</label>
                <select 
                  value={formData.target} 
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#fff' }}
                >
                  <option value="Plot P-007 · Tomato (Diamante Max)">Plot P-007 · Tomato (Diamante Max)</option>
                  <option value="Plot P-021 · Eggplant (Mistisa)">Plot P-021 · Eggplant (Mistisa)</option>
                  <option value="Plot P-094 · Okra (Smooth Green)">Plot P-094 · Okra (Smooth Green)</option>
                  <option value="Plot P-082 · Squash (Suprema)">Plot P-082 · Squash (Suprema)</option>
                  <option value="Herd HRD-GT-001 · Anglo-Nubian Goats">Herd HRD-GT-001 · Anglo-Nubian Goats</option>
                  <option value="Herd HRD-GT-002 · Boer Goats">Herd HRD-GT-002 · Boer Goats</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Assigned Farmer</label>
                  <input 
                    type="text" 
                    value={formData.farmer} 
                    onChange={(e) => setFormData({ ...formData, farmer: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Due Date</label>
                  <input 
                    type="date" 
                    value={formData.dueDate} 
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.82rem', border: '1px solid #cbd5e1', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '4px' }}>Specific Field Instructions</label>
                <textarea 
                  placeholder="Outline dosage, equipment, or SOP precautions..."
                  value={formData.instructions} 
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  style={{ width: '100%', height: '70px', padding: '10px', fontSize: '0.8rem', border: '1px solid #cbd5e1', borderRadius: '8px', resize: 'none' }}
                />
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
                  Dispatch Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulesTaskModule;
