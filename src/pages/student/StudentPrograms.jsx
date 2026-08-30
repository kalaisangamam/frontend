import React, { useEffect } from 'react';
import { FiAward } from 'react-icons/fi';
import StudentDashboardLayout from '../../layouts/StudentDashboardLayout.jsx';
import { EmptyState } from '../../components/common/StateViews.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { studentService } from '../../services/studentService';

const StudentPrograms = () => {
  const { profile, setProfile } = useAuth();
  const enrolled = profile?.student_programs || [];

  useEffect(() => {
    const refreshProfile = async () => {
      try { const { data } = await studentService.getMyProfile(); setProfile(data.data); } catch { /* Retain the already-hydrated profile if refresh is unavailable. */ }
    };
    refreshProfile();
    const refreshWhenVisible = () => { if (document.visibilityState === 'visible') refreshProfile(); };
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => document.removeEventListener('visibilitychange', refreshWhenVisible);
  }, [setProfile]);

  return (
    <StudentDashboardLayout>
      <h1 className="section-heading !text-2xl lg:!text-3xl mb-1">My Programs &amp; Belt / Level / Achievements</h1>
      <p className="text-slate-500 text-sm mb-8">Your current progress, updated by your masters.</p>

      {enrolled.length === 0 ? (
        <EmptyState message="You're not enrolled in any program yet. Speak to the academy office to get started." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {enrolled.map((sp) => (
            <div key={sp.id} className="card p-6 flex items-start gap-4">
              <FiAward className="text-brass-500 text-2xl shrink-0 mt-1" />
              <div>
                <h3 className="font-display text-lg text-parchment-100">{sp.programs?.name}</h3>
                <p className="text-brass-400 text-sm mt-1">{sp.current_level || 'Level not yet assigned'}</p>
                <p className="text-slate-500 text-xs mt-2">
                  Enrolled {new Date(sp.enrolled_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </StudentDashboardLayout>
  );
};

export default StudentPrograms;
