import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiMessageCircle } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import { SkeletonGrid, ErrorState, EmptyState } from '../common/StateViews';
import { publicService } from '../../services/publicService';

const Testimonials = () => {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    publicService
      .getTestimonials()
      .then(({ data }) => setItems(data.data))
      .catch(() => setError(true));
  }, []);

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  return (
    <section id="testimonials" className="py-14 sm:py-16 lg:py-20">
      <div className="container-xl">
        <SectionHeading eyebrow="Testimonials" title="Words from our students" />

        {!items && !error && <SkeletonGrid count={1} className="max-w-2xl mx-auto" />}
        {error && <ErrorState message="Couldn't load testimonials right now." />}
        {items && items.length === 0 && <EmptyState message="Student testimonials will appear here soon." />}

        {items && items.length > 0 && (
          <div className="max-w-3xl mx-auto relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={items[index].id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
                className="relative overflow-hidden rounded-2xl border border-brass-500/25 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 px-6 py-8 text-center shadow-xl sm:px-14 sm:py-10"
              >
                <div className="absolute -top-12 left-6 font-display text-[9rem] leading-none text-brass-500/10">&ldquo;</div>
                <FiMessageCircle className="relative mx-auto mb-5 text-3xl text-brass-400" />
                <p className="relative text-base leading-8 text-parchment-100 italic sm:text-lg">&ldquo;{items[index].message}&rdquo;</p>
                <div className="relative mx-auto mt-7 h-px w-12 bg-brass-500/60" />
                <p className="relative mt-4 font-display text-lg font-semibold text-brass-400">{items[index].student_name}</p>
                <p className="relative mt-1 text-xs font-medium uppercase tracking-[0.09em] text-slate-400">
                  {[items[index].program, items[index].designation].filter(Boolean).join(' · ')}
                </p>
              </motion.div>
            </AnimatePresence>

            {items.length > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button aria-label="Previous testimonial" onClick={prev} className="flex h-11 w-11 items-center justify-center rounded-full border border-parchment-100/15 text-slate-400 transition-colors hover:border-brass-500 hover:text-brass-400">
                  <FiChevronLeft />
                </button>
                <div className="flex gap-1.5">
                  {items.map((item, itemIndex) => <span key={item.id} className={`h-1.5 rounded-full transition-all ${itemIndex === index ? 'w-5 bg-brass-500' : 'w-1.5 bg-parchment-100/20'}`} />)}
                </div>
                <button aria-label="Next testimonial" onClick={next} className="flex h-11 w-11 items-center justify-center rounded-full border border-parchment-100/15 text-slate-400 transition-colors hover:border-brass-500 hover:text-brass-400">
                  <FiChevronRight />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
