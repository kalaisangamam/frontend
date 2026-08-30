import React, { useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';
import StudentDashboardLayout from '../../layouts/StudentDashboardLayout.jsx';
import { EmptyState, ErrorState, SkeletonGrid } from '../../components/common/StateViews.jsx';
import { publicService } from '../../services/publicService';
import { studentService } from '../../services/studentService';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const StudentTestimonials = () => {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [designation, setDesignation] = useState('');
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const { profile } = useAuth();
  const activePrograms = (profile?.program_names?.length ? profile.program_names : (profile?.student_programs || [])
    .filter((enrollment) => enrollment.status === 'active' || !enrollment.status)
    .map((enrollment) => enrollment.programs?.name)
    .filter(Boolean));
  const program = activePrograms.length ? activePrograms.join(', ') : 'Not assigned';

  useEffect(() => {
    publicService.getTestimonials().then(({ data }) => setItems(data.data.slice(0, 2))).catch(() => setError(true));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;
    setSaving(true);
    try {
      await studentService.submitTestimonial({ message, designation });
      setMessage('');
      setDesignation('');
      showToast('Thank you for sharing your testimonial.');
      const { data } = await publicService.getTestimonials();
      setItems(data.data.slice(0, 2));
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not submit your testimonial.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <StudentDashboardLayout>
      <h1 className="section-heading !text-2xl lg:!text-3xl mb-1">Testimonials</h1>
      <p className="text-slate-500 text-sm mb-8">Share your experience with the academy and read messages from fellow students.</p>

      <form onSubmit={handleSubmit} className="card mb-8 p-6">
        <label htmlFor="testimonial-message" className="mb-2 block font-display text-lg text-parchment-100">Share your experience</label>
        <p className="mb-4 text-xs text-slate-500">Your name and registered programs are linked to your student profile.</p>
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Student Name</label>
            <input value={profile?.full_name || ''} readOnly className="w-full rounded-sm border border-parchment-100/10 bg-ink-950/60 px-4 py-2.5 text-sm text-slate-400 outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Program</label>
            <input value={program} readOnly className="w-full rounded-sm border border-parchment-100/10 bg-ink-950/60 px-4 py-2.5 text-sm text-slate-400 outline-none" />
          </div>
        </div>
        <textarea
          id="testimonial-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={500}
          rows={4}
          required
          placeholder="Tell us about your learning experience..."
          className="w-full resize-none rounded-sm border border-parchment-100/10 bg-ink-950 px-4 py-3 text-sm text-parchment-100 outline-none focus:border-brass-500"
        />
        <div className="mt-4">
          <label htmlFor="testimonial-designation" className="mb-1.5 block text-xs text-slate-400">Designation (optional)</label>
          <input
            id="testimonial-designation"
            value={designation}
            onChange={(event) => setDesignation(event.target.value)}
            maxLength={100}
            placeholder="For example: Parent, Alumni, State-level athlete"
            className="w-full rounded-sm border border-parchment-100/10 bg-ink-950 px-4 py-2.5 text-sm text-parchment-100 outline-none focus:border-brass-500"
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">{message.length}/500</span>
          <button type="submit" disabled={saving || !message.trim()} className="btn-primary !py-2.5 text-xs disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? 'Submitting...' : 'Submit Testimonial'}
          </button>
        </div>
      </form>

      {!items && !error && <SkeletonGrid count={4} className="sm:grid-cols-2" />}
      {error && <ErrorState message="Couldn't load testimonials right now." />}
      {items && items.length === 0 && <EmptyState message="No testimonials have been shared yet." />}

      {items && items.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-5">
          {items.map((t) => (
            <div key={t.id} className="card p-6">
              <FiUser className="text-brass-500 text-xl mb-3" />
              <p className="text-parchment-200 text-sm leading-relaxed italic">&ldquo;{t.message}&rdquo;</p>
              <p className="mt-4 font-display text-parchment-100 text-sm">{t.student_name}</p>
              <p className="text-xs text-slate-500">{t.program}</p>
            </div>
          ))}
        </div>
      )}
    </StudentDashboardLayout>
  );
};

export default StudentTestimonials;
