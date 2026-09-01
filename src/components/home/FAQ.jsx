import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';
import { SkeletonGrid, ErrorState, EmptyState } from '../common/StateViews';
import { publicService } from '../../services/publicService';

const FAQ = () => {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    publicService
      .getFaqs()
      .then(({ data }) => setItems(data.data))
      .catch(() => setError(true));
  }, []);

  return (
    <section id="faq" className="py-14 sm:py-16 lg:py-20">
      <div className="container-xl max-w-3xl">
        <SectionHeading eyebrow="FAQ" title="Common questions, answered" />

        {!items && !error && <SkeletonGrid count={4} />}
        {error && <ErrorState message="Couldn't load FAQs right now." />}
        {items && items.length === 0 && <EmptyState message="FAQs will be added here soon." />}

        {items && items.length > 0 && (
          <div className="space-y-3">
            {items.map((f) => (
              <div key={f.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpenId(openId === f.id ? null : f.id)}
                  className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                >
                  <span className="text-parchment-100 font-medium text-sm">{f.question}</span>
                  <FiChevronDown className={`shrink-0 text-brass-500 transition-transform duration-200 ${openId === f.id ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openId === f.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-slate-400 text-sm leading-relaxed">{f.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FAQ;
