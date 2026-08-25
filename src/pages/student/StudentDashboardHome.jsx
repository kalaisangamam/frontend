import React, { useEffect, useState } from 'react';
import { FiCheckSquare, FiCreditCard, FiAward } from 'react-icons/fi';
import StudentDashboardLayout from '../../layouts/StudentDashboardLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { studentService } from '../../services/studentService';

const StudentDashboardHome = () => {
  const { profile } = useAuth();
  const [attendance, setAttendance] = useState(null);
  const [fees, setFees] = useState(null);

  const activePrograms = (profile?.program_names?.length ? profile.program_names : (profile?.student_programs || [])
    .filter((enrollment) => enrollment.status === 'active' || !enrollment.status)
    .map((enrollment) => enrollment.programs?.name)
    .filter(Boolean));

  useEffect(() => {
    studentService.getMyAttendance().then(({ data }) => setAttendance(data.data.summary)).catch(() => {});
    studentService.getMyFees().then(({ data }) => setFees(data.data)).catch(() => {});
  }, []);

  const latestFee = fees?.[0];

  return (
    <StudentDashboardLayout>
      <h1 className="section-heading !text-2xl lg:!text-3xl mb-1">Welcome, {profile?.full_name || 'Student'}</h1>
      <p className="text-slate-500 text-sm mb-8">Here's a quick look at your training status.</p>

      <div className="grid sm:grid-cols-3 gap-5">
        <div className="card border-l-2 border-brass-500 p-6">
          <FiCheckSquare className="text-brass-500 text-2xl mb-3" />
          <p className="text-2xl font-mono text-parchment-100">{attendance ? `${attendance.percentage}%` : '—'}</p>
          <p className="text-slate-400 text-xs mt-1">Attendance this period</p>
        </div>
        <div className="card p-6">
          <FiCreditCard className="text-brass-500 text-2xl mb-3" />
          <p className="text-2xl font-mono text-parchment-100">{latestFee?.status?.replace('_', ' ') || '—'}</p>
          <p className="text-slate-400 text-xs mt-1">Latest fee status ({latestFee?.month || 'n/a'})</p>
        </div>
        <div className="card p-6">
          <FiAward className="text-brass-500 text-2xl mb-3" />
          <p className="text-2xl font-mono text-parchment-100">{activePrograms.length}</p>
          <p className="text-slate-400 text-xs mt-1">Registered programs</p>
        </div>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentDashboardHome;
