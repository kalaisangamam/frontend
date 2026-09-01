import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { HomeSectionLink, HOME_SECTIONS } from '../../utils/homeSectionNavigation.jsx';
import { FiArrowRight, FiCalendar, FiPhone, FiExternalLink } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import { SkeletonGrid, ErrorState, EmptyState } from '../common/StateViews';
import { publicService } from '../../services/publicService';

const statusStyles = {
  open: 'bg-emerald-700/95 text-white border-emerald-300/90',
  closed: 'bg-red-700/95 text-white border-red-300/90',
  coming_soon: 'bg-brass-500/95 text-onaccent border-brass-200/90',
};
const statusLabel = { open: 'Open', closed: 'Closed', coming_soon: 'Coming Soon' };

const Events = ({ preview = false }) => {
  const location = useLocation();
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(false);
  const targetId = location.hash ? location.hash.replace('#', '') : '';

  useEffect(() => {
    publicService
      .getEvents()
      .then(({ data }) => setEvents(data.data))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (!events || !targetId) return;
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [events, targetId]);

  return (
    <section id="events" className="py-14 sm:py-16 lg:py-20">
      <div className="container-xl">
        <SectionHeading eyebrow="Upcoming Events" title="Belt tests, championships and camps" />

        {!events && !error && <SkeletonGrid count={3} className="lg:grid-cols-3" />}
        {error && <ErrorState message="Couldn't load upcoming events right now." />}
        {events && events.length === 0 && <EmptyState message="No upcoming events available." />}

        {events && events.length > 0 && (
          <>
          <div className="grid lg:grid-cols-3 gap-6">
            {events.slice(0, preview ? 3 : undefined).map((e, i) => (
              <motion.div
                key={e.id}
                id={`event-${e.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className={`card overflow-hidden flex flex-col transition-all ${targetId === `event-${e.id}` ? 'ring-1 ring-brass-500/50 shadow-[0_0_0_1px_rgba(224,133,50,0.2)]' : ''}`}
              >
                <div className="relative h-40 w-full bg-ink-800">
                  {e.image_url && <img src={e.image_url} alt={e.title} className="h-full w-full object-cover" />}
                  <span className={`absolute right-3 top-3 z-10 text-xs font-semibold px-3 py-1 rounded-full border shadow-lg backdrop-blur-sm ${statusStyles[e.registration_status] || statusStyles.coming_soon}`}>
                    {statusLabel[e.registration_status] || 'Coming Soon'}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-lg font-semibold text-parchment-100 mb-2">{e.title}</h3>
                  {e.description && (
                    <p className={`mb-4 text-sm leading-relaxed text-slate-400 ${preview ? 'line-clamp-2' : 'whitespace-pre-line'}`}>
                      {e.description}
                    </p>
                  )}

                  <div className="text-xs text-slate-400 space-y-1 mb-4">
                    <p className="flex items-center gap-2"><FiCalendar className="text-brass-500" /> {new Date(e.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    {e.last_date && <p>Last date to register: {new Date(e.last_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>}
                    {e.contact_info && <p className="flex items-center gap-2"><FiPhone className="text-brass-500" /> {e.contact_info}</p>}
                  </div>

                  <div className="mt-auto flex items-center gap-3">
                    {e.registration_link && e.registration_status === 'open' && (
                      <a href={e.registration_link} target="_blank" rel="noreferrer" className="btn-primary flex-1 !py-2.5 text-xs">
                        Register <FiExternalLink />
                      </a>
                    )}
                    <Link to="/contact#event-enquiry" className="btn-secondary flex-1 !py-2.5 text-xs text-center">
                      Any Queries?
                    </Link>
                    {e.qr_code_url && (
                      <img src={e.qr_code_url} alt="Registration QR" className="w-12 h-12 rounded-sm border border-parchment-100/10" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {preview && (
            <div className="mt-8 flex justify-center">
              <HomeSectionLink to="/events" section={HOME_SECTIONS.events} className="btn-secondary group w-40 sm:w-auto">
                View All Events
                <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
              </HomeSectionLink>
            </div>
          )}
          </>
        )}
      </div>
    </section>
  );
};

export default Events;
