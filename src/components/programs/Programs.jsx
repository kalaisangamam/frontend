import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { HomeSectionLink, HOME_SECTIONS } from '../../utils/homeSectionNavigation.jsx';
import SectionHeading from '../common/SectionHeading';
import { SkeletonGrid, ErrorState, EmptyState } from '../common/StateViews';
import { publicService } from '../../services/publicService';

// Program media lives in frontend assets
const programImage = (slug) =>
  new URL(`../../assets/images/programs/${slug}.jpg`, import.meta.url).href;

const Programs = () => {
  const [programs, setPrograms] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    publicService
      .getPrograms()
      .then(({ data }) => setPrograms(data.data))
      .catch(() => setError(true));
  }, []);

  return (
    <section id="programs" className="py-14 sm:py-16 lg:py-20">
      <div className="container-xl">
        <SectionHeading
          eyebrow="Our Training Programs"
          title="Six disciplines, one standard of excellence"
          subtitle="Silambam, Karate, Yoga, Skating, Archery and Hindi — each with a structured path from introduction to advanced levels."
        />

        {!programs && !error && (
          <SkeletonGrid
            count={6}
            className="sm:grid-cols-2 lg:grid-cols-3"
          />
        )}

        {error && (
          <ErrorState message="Couldn't load training programs right now." />
        )}

        {programs && programs.length === 0 && (
          <EmptyState message="Programs will be listed here soon." />
        )}

        {programs && programs.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.06,
                }}
                className="card overflow-hidden flex flex-col h-full"
              >
                {/* IMAGE */}
                <div className="h-52 overflow-hidden bg-ink-900 flex items-center justify-center">
                  <div className="w-full h-52 overflow-hidden">
                    <img
                      src={programImage(p.slug)}
                      alt={p.name}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                      className="
                        w-full
                        h-full
                        object-cover
                        object-center
                        hover:scale-105
                        transition-transform
                        duration-500
                      "
                    />
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display text-xl font-semibold text-parchment-100">
                    {p.name}
                  </h3>

                  <p className="mt-2 text-brass-400 text-sm font-semibold uppercase tracking-[0.12em] font-mono line-clamp-1">
                    {p.tagline ||
                      p.training_schedule ||
                      p.introduction ||
                      'Training program'}
                  </p>

                  <p className="mt-2 text-slate-300 text-sm leading-relaxed line-clamp-3">
                    {p.training_details ||
                      p.introduction ||
                      'Structured training designed to build skill, discipline and confidence.'}
                  </p>

                  {/* SHOW ONLY FIRST 2 BENEFITS */}
                  {p.benefits?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-brass-500/20">
                      <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brass-400">
                        Key Benefits
                      </span>

                      <ul className="mt-3 space-y-2.5">
                        {p.benefits.slice(0, 2).map((benefit) => (
                          <li
                            key={benefit}
                            className="flex items-start gap-2.5 text-slate-300 text-sm leading-snug"
                          >
                            <FiCheckCircle className="mt-0.5 shrink-0 text-brass-500 text-base" />

                            <span className="line-clamp-1">
                              {benefit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-auto pt-6">
                    <HomeSectionLink
                      to={`/programs/${p.slug}`}
                      section={HOME_SECTIONS.programs}
                      className="inline-flex items-center gap-1 text-sm text-brass-400 hover:gap-2 transition-all"
                    >
                      View More <FiArrowRight />
                    </HomeSectionLink>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Programs;
