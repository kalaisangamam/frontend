import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiUser, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import BrandIdentity from './BrandIdentity.jsx';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  // { label: 'Why Us', href: '/#why-us' },
  { label: 'Programs', href: '/programs' },
  { label: 'Masters', href: '/masters' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Events', href: '/events' },
  { label: 'Developers', href: '/developers' },
  // { label: 'Testimonials', href: '/#testimonials' },
  // { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/contact' },
  
];

const Navbar = () => {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => {
      if (window.innerWidth >= 1280) setOpen(false);
    };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-ink-950/95 backdrop-blur border-b border-parchment-100/5' : 'bg-transparent'
      }`}
    >
      <div className="container-xl flex items-center justify-between h-16 lg:h-20">
        <BrandIdentity placement="navbar" />

        <nav className="hidden xl:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isHashRoute = link.href.startsWith('/#');
            if (isHashRoute) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-parchment-300 hover:text-brass-400 transition-colors"
                >
                  {link.label}
                </a>
              );
            }

            return (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:bg-brass-500 after:transition-transform ${isActive ? 'text-brass-400 after:scale-x-100' : 'text-parchment-300 after:scale-x-0 hover:text-brass-400 hover:after:scale-x-100'}`
                }
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="hidden xl:flex items-center gap-3">
          <ThemeToggle />
          {!loading && user ? (
            <Link
              to={dashboardPath}
              className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-parchment-300/30 text-parchment-100 hover:border-brass-500 hover:text-brass-400 transition-colors"
              aria-label="Go to dashboard"
              title="Go to dashboard"
            >
              <FiUser />
            </Link>
          ) : (
            <Link to="/student/login" className="btn-secondary !py-2 !px-5 !text-xs">
              Student Login
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3 xl:hidden">
          <ThemeToggle />
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-parchment-100/10 text-2xl text-parchment-100 transition-colors hover:border-brass-500 hover:text-brass-400"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-parchment-100/10 bg-ink-900 px-5 py-6 shadow-xl flex flex-col gap-2">
          {NAV_LINKS.map((link) => {
            if (link.href.startsWith('/#')) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-3 text-sm font-medium text-parchment-200 hover:bg-ink-800 hover:text-brass-400"
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-sm font-medium text-parchment-200 hover:bg-ink-800 hover:text-brass-400"
              >
                {link.label}
              </Link>
            );
          })}
          {!loading && user ? (
            <Link to={dashboardPath} onClick={() => setOpen(false)} className="btn-primary mt-2">
              <FiUser /> Dashboard
            </Link>
          ) : (
            <Link to="/student/login" onClick={() => setOpen(false)} className="btn-primary mt-2">
              Student Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
