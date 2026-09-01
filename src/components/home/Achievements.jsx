import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import AnimatedCounter from '../common/AnimatedCounter';
import { SkeletonGrid, ErrorState } from '../common/StateViews';
import { publicService } from '../../services/publicService';

const homeStats = [
  { id: 'students-trained', value: '1200+', label: 'Students Trained' },
  { id: 'competitions-attended', value: '50+', label: 'Competitions Attended' },
  { id: 'awards-won', value: '85+', label: 'Awards Won' },
  { id: 'years-experience', value: '20+', label: 'Years of Experience' },
];

const Achievements = ({ pageView = false }) => {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!pageView) return;
    publicService
      .getAchievements()
      .then(({ data }) => setItems(data.data))
      .catch(() => setError(true));
  }, [pageView]);

  const stats = items?.filter((i) => i.type === 'stat') || [];
  const milestones = (items?.filter((i) => i.type === 'milestone') || []).sort((a, b) => (a.year || 0) - (b.year || 0));
  const displayedStats = homeStats;

  return (
    <section id="achievements" className="py-14 sm:py-16 lg:py-20">
      <div className="container-xl">
        <SectionHeading
          eyebrow="Achievements"
          title="Numbers that reflect real training"
          subtitle={!pageView ? 'A legacy built through disciplined training, dedicated coaching and competitive excellence.' : undefined}
        />

        {pageView && !items && !error && <SkeletonGrid count={4} className="sm:grid-cols-2 lg:grid-cols-4" />}
        {pageView && error && <ErrorState message="Couldn't load achievements right now." />}
        {displayedStats.length > 0 && (
          <>
            <div className="grid overflow-hidden rounded-2xl border border-parchment-100/10 bg-ink-900 sm:grid-cols-2 lg:grid-cols-4">
              {displayedStats.map((s) => (
                <AnimatedCounter
                  key={s.id}
                  value={s.value}
                  label={s.label}
                  className="border-b border-parchment-100/10 px-6 py-7 text-center last:border-b-0 sm:px-8 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:[&:not(:last-child)]:border-r lg:[&:nth-child(odd)]:border-r lg:text-left"
                />
              ))}
            </div>
            {!pageView && (
              <div className="mt-9 text-center">
                <Link to="/achievements" className="btn-secondary">
                  See All Achievements <FiArrowRight />
                </Link>
              </div>
            )}
          </>
        )}

        {pageView && stats.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <p className="eyebrow">Additional Achievements</p>
            </div>
            <div className="grid overflow-hidden rounded-2xl border border-parchment-100/10 bg-ink-900 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <AnimatedCounter
                  key={s.id}
                  value={s.value}
                  label={s.label}
                  className="border-b border-parchment-100/10 px-6 py-7 text-center last:border-b-0 sm:px-8 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:[&:not(:last-child)]:border-r lg:[&:nth-child(odd)]:border-r lg:text-left"
                />
              ))}
            </div>
          </div>
        )}

        {pageView && milestones.length > 0 && (
          <div className="mt-16 relative pl-6 border-l border-brass-500/30 space-y-8">
            {milestones.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="relative"
              >
                <span className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-brass-500" />
                <p className="font-mono text-brass-400 text-sm">{m.year}</p>
                <p className="text-parchment-200 text-sm mt-1">{m.description || m.label}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Achievements;
