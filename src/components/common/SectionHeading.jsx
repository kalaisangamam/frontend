import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({ eyebrow, title, subtitle, align = 'center' }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.5 }}
    className={`max-w-2xl mb-10 sm:mb-12 lg:mb-14 ${align === 'center' ? 'mx-auto text-center' : ''}`}
  >
    {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
    <h2 className="section-heading text-parchment-100">{title}</h2>
    {subtitle && <p className="mt-3 text-sm font-medium leading-relaxed text-slate-300 sm:mt-4 sm:text-base">{subtitle}</p>}
  </motion.div>
);

export default SectionHeading;
