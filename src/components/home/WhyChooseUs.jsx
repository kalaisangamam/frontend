import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiShield, FiCheckSquare } from 'react-icons/fi';
import SectionHeading from '../common/SectionHeading';

const REASONS = [
  {
    icon: FiUsers,
    title: 'Experienced Masters',
    text: 'Founders, directors and game-wise coaches bring years of hands-on training experience to every session.',
  },
  {
    icon: FiAward,
    title: 'Professional Training',
    text: 'Structured curricula with clear levels, so every student can track real, measurable progress.',
  },
  {
    icon: FiShield,
    title: 'Safety Standards',
    text: 'Supervised sessions and age-appropriate training maintained across every discipline we teach.',
  },
  {
    icon: FiCheckSquare,
    title: 'Certified Programs',
    text: 'Recognized training pathways from beginner levels through advanced belts and competitive stages.',
  },
];

const WhyChooseUs = () => (
  <section id="why-us" className="py-14 sm:py-16 lg:py-20">
    <div className="container-xl">
      <SectionHeading
        eyebrow="Why Choose Us"
        title="Training That Earns Your Trust"
        align="center"
      />

      <div className="mt-10 lg:mt-12 grid gap-px overflow-hidden rounded-2xl border border-brass-500/15 bg-brass-500/10 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="group relative bg-ink-950 p-7 sm:p-8 transition-colors duration-300 hover:bg-ink-900"
          >
            <span className="pointer-events-none absolute top-6 right-6 font-mono text-[0.65rem] tracking-[0.15em] text-brass-500/30">
              0{i + 1}
            </span>

            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brass-500/30 bg-ink-900/80 transition-transform duration-300 group-hover:scale-110 group-hover:border-brass-500/60">
              <r.icon className="text-brass-500 text-xl" />
            </div>

            <h3 className="font-display text-base font-semibold sm:text-lg text-parchment-100 mt-5 mb-2">
              {r.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {r.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
