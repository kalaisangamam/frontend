import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';

// Parses "15+" -> { number: 15, suffix: '+' }, "100+ Students" style values -> number/suffix pair.
const parseValue = (raw) => {
  const match = String(raw).match(/^(\d+)(.*)$/);
  if (!match) return { number: 0, suffix: raw };
  return { number: Number(match[1]), suffix: match[2] };
};

const AnimatedCounter = ({ value, label, className = '' }) => {
  const { number, suffix } = parseValue(value);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, number, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, number]);

  return (
    <motion.div ref={ref} className={className}>
      <p className="font-display text-5xl sm:text-6xl lg:text-7xl leading-none text-brass-500">
        {display}
        {suffix}
      </p>
      <p className="text-parchment-300/80 text-[11px] sm:text-xs mt-4 uppercase tracking-[0.12em]">{label}</p>
    </motion.div>
  );
};

export default AnimatedCounter;
