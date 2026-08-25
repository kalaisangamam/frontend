import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboardLayout from '../../layouts/StudentDashboardLayout.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext.jsx';

const StudentSettings = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword(form.currentPassword, form.newPassword);
      showToast('Password changed successfully.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/student/login');
  };

  return (
    <StudentDashboardLayout>
      <h1 className="section-heading !text-2xl lg:!text-3xl mb-1">Settings</h1>
      <p className="text-slate-500 text-sm mb-8">Manage your account.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Account</p>
          <p className="text-parchment-100 text-sm">Username: {user?.username}</p>
          {user?.email && <p className="text-parchment-100 text-sm mt-1">Email: {user.email}</p>}
          <button onClick={handleLogout} className="btn-secondary mt-6 !text-maroon-400 !border-maroon-500/40">
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Change Password</p>
          <input
            required
            type="password"
            placeholder="Current password"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none"
          />
          <input
            required
            type="password"
            placeholder="New password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none"
          />
          <input
            required
            type="password"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentSettings;
