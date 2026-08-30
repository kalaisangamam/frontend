import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

import Home from './pages/public/Home.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import ProgramsPage from './pages/public/ProgramsPage.jsx';
import ProgramDetailPage from './pages/public/ProgramDetailPage.jsx';
import MastersPage from './pages/public/MastersPage.jsx';
import AchievementsPage from './pages/public/AchievementsPage.jsx';
import GalleryPage from './pages/public/GalleryPage.jsx';
import EventsPage from './pages/public/EventsPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import DevelopersPage from './pages/public/DevelopersPage.jsx';
import NotFound from './pages/public/NotFound.jsx';

import StudentLogin from './pages/student/StudentLogin.jsx';
import StudentRegister from './pages/student/StudentRegister.jsx';
import StudentDashboardHome from './pages/student/StudentDashboardHome.jsx';
import StudentProfile from './pages/student/StudentProfile.jsx';
import StudentAttendance from './pages/student/StudentAttendance.jsx';
import StudentFees from './pages/student/StudentFees.jsx';
import StudentPrograms from './pages/student/StudentPrograms.jsx';
import StudentTestimonials from './pages/student/StudentTestimonials.jsx';
import StudentSettings from './pages/student/StudentSettings.jsx';

import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboardHome from './pages/admin/AdminDashboardHome.jsx';
import AdminStudents from './pages/admin/AdminStudents.jsx';
import AdminMasters from './pages/admin/AdminMasters.jsx';
import AdminPrograms from './pages/admin/AdminPrograms.jsx';
import AdminLevels from './pages/admin/AdminLevels.jsx';
import AdminAchievements from './pages/admin/AdminAchievements.jsx';
import AdminGallery from './pages/admin/AdminGallery.jsx';
import AdminEvents from './pages/admin/AdminEvents.jsx';
import AdminTestimonials from './pages/admin/AdminTestimonials.jsx';
import AdminFaqs from './pages/admin/AdminFaqs.jsx';
import AdminAttendance from './pages/admin/AdminAttendance.jsx';
import AdminFees from './pages/admin/AdminFees.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';
import AdminEnquiries from './pages/admin/AdminEnquiries.jsx';
import AdminAnnouncements from './pages/admin/AdminAnnouncements.jsx';
import { homeSectionStorageKey } from './utils/homeSectionNavigation.jsx';

/**
 * Keeps the scroll position with React Router's unique history-entry key.
 * PUSH/REPLACE navigation starts a new page at the top, while POP navigation
 * (the browser Back/Forward buttons) returns to the exact saved position.
 */
const ScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map());

  useEffect(() => {
    // Prevent the browser and React from competing to restore the same entry.
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useEffect(() => {
    const savePosition = () => {
      positions.current.set(location.key, {
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    savePosition();
    window.addEventListener('scroll', savePosition, { passive: true });
    window.addEventListener('pagehide', savePosition);

    return () => {
      savePosition();
      window.removeEventListener('scroll', savePosition);
      window.removeEventListener('pagehide', savePosition);
    };
  }, [location.key]);

  useLayoutEffect(() => {
    let cancelled = false;
    const frames = [];
    const timers = [];
    const runWhenRendered = (callback) => {
      frames.push(requestAnimationFrame(() => {
        frames.push(requestAnimationFrame(() => {
          if (!cancelled) callback();
        }));
      }));
    };

    const scrollToHash = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const target = id && document.getElementById(id);
      if (target) target.scrollIntoView({ block: 'start', behavior: 'auto' });
    };

    const homeSourceSection = location.pathname === '/'
      ? sessionStorage.getItem(homeSectionStorageKey(location.key))
      : null;
    const scrollToHomeSourceSection = () => {
      const target = homeSourceSection && document.getElementById(homeSourceSection);
      if (target) target.scrollIntoView({ block: 'start', behavior: 'auto' });
    };

    if (navigationType === 'POP' && homeSourceSection) {
      // A Home CTA explicitly tagged this history entry. It takes precedence
      // over pixel restoration and never defaults to an unrelated section.
      runWhenRendered(scrollToHomeSourceSection);
      [100, 300, 600].forEach((delay) => {
        timers.push(window.setTimeout(() => {
          if (!cancelled) scrollToHomeSourceSection();
        }, delay));
      });
    } else if (navigationType === 'POP') {
      const position = positions.current.get(location.key);
      if (position) {
        // A few short retries account for route effects and async cards/images
        // establishing their size without forcing a hard-coded page offset.
        const restore = () => window.scrollTo({ left: position.x, top: position.y, behavior: 'auto' });
        runWhenRendered(restore);
        [100, 300, 600].forEach((delay) => {
          timers.push(window.setTimeout(() => {
            if (!cancelled) restore();
          }, delay));
        });
      } else if (location.hash) {
        runWhenRendered(scrollToHash);
      } else {
        runWhenRendered(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
      }
    } else if (location.hash) {
      runWhenRendered(scrollToHash);
    } else {
      // New links and direct route loads intentionally start at the top.
      runWhenRendered(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
    }

    return () => {
      cancelled = true;
      frames.forEach(cancelAnimationFrame);
      timers.forEach(clearTimeout);
    };
  }, [location.key, location.hash, navigationType]);

  return null;
};

function App() {
  return (
    <ToastProvider>
      <ScrollRestoration />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/:slug" element={<ProgramDetailPage />} />
        <Route path="/masters" element={<MastersPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/developers" element={<DevelopersPage />} />

        {/* Student */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />
        <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboardHome /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />
        <Route path="/student/attendance" element={<ProtectedRoute role="student"><StudentAttendance /></ProtectedRoute>} />
        <Route path="/student/fees" element={<ProtectedRoute role="student"><StudentFees /></ProtectedRoute>} />
        <Route path="/student/programs" element={<ProtectedRoute role="student"><StudentPrograms /></ProtectedRoute>} />
        <Route path="/student/testimonials" element={<ProtectedRoute role="student"><StudentTestimonials /></ProtectedRoute>} />
        <Route path="/student/settings" element={<ProtectedRoute role="student"><StudentSettings /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboardHome /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute role="admin"><AdminStudents /></ProtectedRoute>} />
        <Route path="/admin/masters" element={<ProtectedRoute role="admin"><AdminMasters /></ProtectedRoute>} />
        <Route path="/admin/programs" element={<ProtectedRoute role="admin"><AdminPrograms /></ProtectedRoute>} />
        <Route path="/admin/levels" element={<ProtectedRoute role="admin"><AdminLevels /></ProtectedRoute>} />
        <Route path="/admin/achievements" element={<ProtectedRoute role="admin"><AdminAchievements /></ProtectedRoute>} />
        <Route path="/admin/gallery" element={<ProtectedRoute role="admin"><AdminGallery /></ProtectedRoute>} />
        <Route path="/admin/events" element={<ProtectedRoute role="admin"><AdminEvents /></ProtectedRoute>} />
        <Route path="/admin/announcements" element={<ProtectedRoute role="admin"><AdminAnnouncements /></ProtectedRoute>} />
        <Route path="/admin/testimonials" element={<ProtectedRoute role="admin"><AdminTestimonials /></ProtectedRoute>} />
        <Route path="/admin/faqs" element={<ProtectedRoute role="admin"><AdminFaqs /></ProtectedRoute>} />
        <Route path="/admin/attendance" element={<ProtectedRoute role="admin"><AdminAttendance /></ProtectedRoute>} />
        <Route path="/admin/fees" element={<ProtectedRoute role="admin"><AdminFees /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
        <Route path="/admin/enquiries" element={<ProtectedRoute role="admin"><AdminEnquiries /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
