import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiLock, FiArrowLeft, FiEye, FiEyeOff, FiAward } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from '../../components/common/ThemeToggle.jsx';

const StudentLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-ink-950 lg:grid-cols-2">
      <ThemeToggle className="absolute right-5 top-5 z-10 bg-ink-950/60 backdrop-blur sm:right-8 sm:top-8" />
      <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-brass-500/10 blur-3xl" />
      <section className="relative hidden flex-col justify-between border-r border-parchment-100/10 bg-ink-950 px-12 py-12 lg:flex xl:px-20">
        <Link to="/" className="inline-flex w-fit items-center gap-2 text-sm text-slate-400 transition-colors hover:text-brass-400">
          <FiArrowLeft /> Back to academy
        </Link>
        <div className="max-w-md">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-brass-500/30 bg-brass-500/10 text-2xl text-brass-400"><FiAward /></div>
          <p className="eyebrow mb-3">Student Portal</p>
          <h1 className="font-display text-4xl leading-tight text-parchment-100 xl:text-5xl">Your training journey, all in one place.</h1>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">Track your programs, attendance, fees, and academy updates whenever you need them.</p>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-600">Kalai Sangamam · Dindigul</p>
      </section>

      <main className="relative flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-brass-400 lg:hidden"><FiArrowLeft /> Back to academy</Link>
          <div className="rounded-3xl border border-parchment-100/10 bg-ink-900/95 p-6 shadow-2xl shadow-black/40 sm:p-9">
            <div className="mb-8">
              <p className="eyebrow mb-2">Welcome back</p>
              <h2 className="font-display text-3xl text-parchment-100">Student sign in</h2>
              <p className="mt-2 text-sm text-slate-500">Enter your account details to continue.</p>
            </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Username</label>
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Enter your username"
                  autoComplete="username"
                  className="!pl-11"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Password</label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="!pl-11 !pr-12"
                />
                <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-brass-400" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
              </div>
            </div>
            {error && <p className="rounded-xl border border-maroon-400/25 bg-maroon-400/10 px-3 py-2.5 text-xs text-maroon-400">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-500">
            New student? <Link to="/student/register" className="text-brass-400 hover:underline">Register here</Link>
          </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentLogin;
