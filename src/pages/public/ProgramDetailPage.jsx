import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiClock, FiLayers, FiAward, FiTarget } from 'react-icons/fi';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { publicService } from '../../services/publicService';

const programImage = (slug) => new URL(`../../assets/images/programs/${slug}.jpg`, import.meta.url).href;

const Meta = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-md border border-parchment-100/10 bg-ink-950/40 px-4 py-3">
    {Icon && <Icon className="mt-0.5 text-brass-500 shrink-0" />}
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-1">{label}</p>
      <p className="text-sm text-parchment-100 break-words leading-snug">{value}</p>
    </div>
  </div>
);

const SectionLabel = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 mb-3 text-brass-500 text-xs uppercase tracking-[0.22em] font-mono">
    {Icon && <Icon className="shrink-0" />}
    {children}
  </div>
);

const ProgramSkeleton = () => (
  <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start animate-pulse">
    <div className="card overflow-hidden h-72 sm:h-96 bg-ink-900/60" />
    <div className="card p-7 sm:p-8 space-y-4">
      <div className="h-3 w-24 bg-ink-900/60 rounded" />
      <div className="h-8 w-2/3 bg-ink-900/60 rounded" />
      <div className="h-3 w-1/3 bg-ink-900/60 rounded" />
      <div className="h-24 w-full bg-ink-900/60 rounded mt-6" />
    </div>
  </div>
);

const ProgramDetailPage = () => {
  const { slug } = useParams();
  const [program, setProgram] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setProgram(null);
    setError(false);
    publicService
      .getProgramBySlug(slug)
      .then(({ data }) => setProgram(data.data))
      .catch(() => setError(true));
  }, [slug]);

  return (
    <PublicLayout>
      <div className="pt-20 lg:pt-24">
        <section className="py-10 sm:py-14">
          <div className="container-xl">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-brass-400 transition-colors mb-8"
            >
              <FiArrowLeft /> Back to programs
            </Link>

            {error && (
              <div className="card p-10 text-center max-w-xl mx-auto">
                <p className="text-parchment-100 font-display text-2xl">Program not found</p>
                <p className="mt-3 text-slate-400 text-sm">
                  This program page could not be loaded. It may have been renamed or removed.
                </p>
                <Link to="/programs" className="btn-primary inline-flex mt-6">
                  View all programs
                </Link>
              </div>
            )}

            {!program && !error && <ProgramSkeleton />}

            {program && (
              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
                {/* Media column */}
                <div className="lg:sticky lg:top-28 space-y-6">
                  <div className="card overflow-hidden">
                    <img
                      src={programImage(program.slug)}
                      alt={program.name}
                      className="w-full h-72 sm:h-96 object-cover"
                    />
                  </div>

                  {(program.training_schedule || program.levels?.length > 0) && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {program.training_schedule && (
                        <Meta icon={FiClock} label="Schedule" value={program.training_schedule} />
                      )}
                      {program.levels?.length > 0 && (
                        <Meta
                          icon={FiAward}
                          label="Levels"
                          value={`${program.levels.length} rank${program.levels.length > 1 ? 's' : ''}`}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Content column */}
                <div className="card p-7 sm:p-8">
                  <p className="eyebrow mb-3">Program Detail</p>
                  <h1 className="font-display text-3xl sm:text-4xl text-parchment-100 leading-tight">
                    {program.name}
                  </h1>
                  {program.tagline && (
                    <p className="mt-3 text-brass-400 text-sm uppercase tracking-[0.22em] font-mono">
                      {program.tagline}
                    </p>
                  )}

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/contact#enrol-form" className="btn-primary inline-flex">
                      Enroll in {program.name}
                    </Link>
                  </div>

                  <div className="mt-8 space-y-7 text-slate-300 text-sm leading-relaxed">
                    {program.introduction && (
                      <div>
                        <SectionLabel icon={FiTarget}>Introduction</SectionLabel>
                        <p>{program.introduction}</p>
                      </div>
                    )}

                    {program.training_details && (
                      <div>
                        <SectionLabel icon={FiLayers}>Training Details</SectionLabel>
                        <p>{program.training_details}</p>
                      </div>
                    )}
                  </div>

                  {program.benefits?.length > 0 && (
                    <div className="mt-8 pt-7 border-t border-parchment-100/10">
                      <SectionLabel icon={FiCheckCircle}>Benefits</SectionLabel>
                      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-slate-300 text-sm leading-relaxed">
                        {program.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2">
                            <FiCheckCircle className="mt-0.5 text-brass-500 shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {program.levels?.length > 0 && (
                    <div className="mt-8 pt-7 border-t border-parchment-100/10">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500 mb-3">Levels / Belts / Achievements</p>
                      <div className="flex flex-wrap gap-2">
                        {program.levels.map((level) => (
                          <span
                            key={level}
                            className="text-[11px] px-2.5 py-1 rounded-full bg-brass-500/10 text-brass-400 border border-brass-500/20"
                          >
                            {level}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default ProgramDetailPage;