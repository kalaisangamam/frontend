import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome, FiUsers, FiUserCheck, FiBookOpen, FiAward, FiImage,
  FiCalendar, FiMessageSquare, FiCheckSquare, FiCreditCard, FiHelpCircle,
  FiSettings, FiLogOut, FiMenu, FiX, FiArrowLeft, FiMail,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/common/ThemeToggle.jsx';

const LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/admin/students', label: 'Students', icon: FiUsers },
  { to: '/admin/masters', label: 'Masters', icon: FiUserCheck },
  { to: '/admin/programs', label: 'Programs', icon: FiBookOpen },
  { to: '/admin/achievements', label: 'Achievements', icon: FiAward },
  { to: '/admin/gallery', label: 'Gallery', icon: FiImage },
  { to: '/admin/events', label: 'Events', icon: FiCalendar },
  { to: '/admin/announcements', label: 'Flash News', icon: FiMessageSquare },
  { to: '/admin/testimonials', label: 'Testimonials', icon: FiMessageSquare },
  { to: '/admin/enquiries', label: 'Enquiries', icon: FiMail },
  { to: '/admin/attendance', label: 'Attendance', icon: FiCheckSquare },
  { to: '/admin/fees', label: 'Fees', icon: FiCreditCard },
  { to: '/admin/faqs', label: 'FAQs', icon: FiHelpCircle },
  { to: '/admin/settings', label: 'Website Settings', icon: FiSettings },
];

const AdminDashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const closeDesktopMenu = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener('resize', closeDesktopMenu);
    return () => window.removeEventListener('resize', closeDesktopMenu);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg text-parchment-100">Kalai <span className="text-brass-500">Sangamam</span></p>
          <p className="text-xs text-slate-500 mt-1">Admin &middot; {user?.username}</p>
        </div>
        <ThemeToggle className="!h-9 !w-9 text-lg" />
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto pr-1">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors ${
                isActive ? 'bg-brass-500/10 text-brass-400' : 'text-slate-400 hover:text-parchment-100'
              }`
            }
          >
            <l.icon /> {l.label}
          </NavLink>
        ))}
      </nav>
      <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-maroon-400 hover:text-maroon-300 mt-3">
        <FiLogOut /> Logout
      </button>
    </>
  );

  return (
    <div className="admin-portal min-h-screen bg-ink-950 lg:flex">
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-ink-900 border-r border-parchment-100/5 p-6 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-parchment-100/5">
        <button type="button" onClick={() => setOpen(true)} aria-label="Open navigation menu" className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-sm border border-parchment-100/10 text-xl text-parchment-100 transition-colors hover:border-brass-500 hover:text-brass-400"><FiMenu /></button>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm leading-tight text-parchment-100 sm:text-base">Kalai <span className="text-brass-500">Sangamam</span></p>
          <p className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-500">Admin Console</p>
        </div>
        <ThemeToggle className="!h-11 !w-11 shrink-0 text-lg" />
      </div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/70" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 max-w-[86vw] bg-ink-900 p-6 flex flex-col shadow-2xl">
            <button onClick={() => setOpen(false)} className="self-end text-parchment-100 text-xl mb-4"><FiX /></button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 p-5 lg:p-10 min-w-0">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-brass-400">
            <FiArrowLeft /> Back to site
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
