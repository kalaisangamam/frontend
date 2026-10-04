import React, { useEffect, useState } from 'react';
import { FiAward } from 'react-icons/fi';
import StudentDashboardLayout from '../../layouts/StudentDashboardLayout.jsx';
import { EmptyState, ErrorState } from '../../components/common/StateViews.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { studentService } from '../../services/studentService';

const StudentPrograms = () => {
  const { profile, setProfile } = useAuth();
  const enrolled = profile?.student_programs || [];
  const [achievements, setAchievements] = useState(null);
  const [achievementError, setAchievementError] = useState(false);

  const refreshAchievements = async () => {
    try {
      const { data } = await studentService.getMyAchievements();
      setAchievements(data.data || []);
      setAchievementError(false);
    } catch {
      setAchievementError(true);
    }
  };

  useEffect(() => {
    const refreshProfile = async () => {
      try { const { data } = await studentService.getMyProfile(); setProfile(data.data); } catch { /* Retain the already-hydrated profile if refresh is unavailable. */ }
    };
    refreshProfile();
    refreshAchievements();
    const refreshWhenVisible = () => { if (document.visibilityState === 'visible') refreshProfile(); };
    const refreshAchievementsWhenVisible = () => { if (document.visibilityState === 'visible') refreshAchievements(); };
    document.addEventListener('visibilitychange', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshAchievementsWhenVisible);
    return () => {
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshAchievementsWhenVisible);
    };
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

      <section className="mt-10">
        <h2 className="section-heading !text-xl lg:!text-2xl mb-1">Achievements</h2>
        <p className="text-slate-500 text-sm mb-5">Recognition and results recorded for you by the academy.</p>
        {achievementError && <ErrorState message="Couldn't load your achievements right now." />}
        {!achievementError && achievements === null && <p className="text-sm text-slate-500 py-6">Loading achievements...</p>}
        {!achievementError && achievements?.length === 0 && <EmptyState message="No achievements have been recorded for you yet." />}
        {!achievementError && achievements?.length > 0 && <div className="grid sm:grid-cols-2 gap-5">
          {achievements.map((item) => <article key={item.id} className="card p-6 flex items-start gap-4">
            <FiAward className="text-brass-500 text-2xl shrink-0 mt-1" />
            <div className="min-w-0"><h3 className="font-display text-lg text-parchment-100">{item.title}</h3>
              <p className="text-brass-400 text-sm mt-1">{item.achievement}</p>
              <p className="text-slate-400 text-xs mt-3">{item.programs?.name || 'Program not available'}</p>
              <p className="text-slate-500 text-xs mt-1">{new Date(`${item.achievement_date}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </article>)}
        </div>}
      </section>
    </StudentDashboardLayout>
  );
};

export default StudentPrograms;
