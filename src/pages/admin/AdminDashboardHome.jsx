import React, { useEffect, useState } from 'react';
import { FiUsers, FiUserCheck, FiCalendar, FiCreditCard, FiImage } from 'react-icons/fi';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout.jsx';
import { adminService } from '../../services/adminService';
import { ErrorState } from '../../components/common/StateViews.jsx';

const CARDS = [
  { key: 'totalStudents', label: 'Total Students', icon: FiUsers, accent: 'border-brass-500' },
  { key: 'activeStudents', label: 'Active Students', icon: FiUserCheck, accent: 'border-emerald-500' },
  { key: 'totalMasters', label: 'Total Masters', icon: FiUserCheck, accent: 'border-sky-500' },
  { key: 'upcomingEvents', label: 'Upcoming Events', icon: FiCalendar, accent: 'border-violet-500' },
  { key: 'pendingFees', label: 'Pending Fees', icon: FiCreditCard, accent: 'border-amber-500' },
  { key: 'galleryItems', label: 'Gallery Items', icon: FiImage, accent: 'border-rose-500' },
];

const AdminDashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    adminService.getOverview().then(({ data }) => setStats(data.data)).catch(() => setError(true));
  }, []);

  return (
    <AdminDashboardLayout>
      <h1 className="section-heading !text-2xl lg:!text-3xl mb-1">Dashboard Overview</h1>
      <p className="text-slate-500 text-sm mb-8">A snapshot of the academy right now.</p>

      {error && <ErrorState message="Couldn't load dashboard statistics right now." />}

      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CARDS.map((c) => (
            <div key={c.key} className={`card border-l-2 p-6 ${c.accent}`}>
              <c.icon className="text-brass-500 text-2xl mb-3" />
              <p className="text-2xl font-mono text-parchment-100">{stats[c.key]}</p>
              <p className="text-slate-400 text-xs mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminDashboardHome;
