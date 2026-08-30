import React from "react";
import { motion } from "framer-motion";
import {
  HomeSectionLink,
  HOME_SECTIONS,
} from "../../utils/homeSectionNavigation.jsx";

import {
  FiTarget,
  FiCompass,
  FiHeart,
  FiArrowRight,
  FiShield,
  FiChevronRight,
} from "react-icons/fi";

import SectionHeading from "../common/SectionHeading";

import academyImage from "../../assets/images/about-academy.jpg";

/* ================================================================
   CONSTANTS
================================================================ */

const EXPERIENCE = "33+";

/* ================================================================
   VALUES
================================================================ */

const VALUES = [
  {
    number: "01",
    icon: FiCompass,
    title: "Discipline",
    text: "Building focus, consistency, confidence, and responsibility through regular training.",
  },
  {
    number: "02",
    icon: FiHeart,
    title: "Tradition",
    text: "Preserving traditional arts and cultural values while developing the next generation.",
  },
  {
    number: "03",
    icon: FiTarget,
    title: "Excellence",
    text: "Encouraging every student to grow through dedication, practice, and continuous improvement.",
  },
];

/* ================================================================
   ABOUT COMPONENT
================================================================ */

const About = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-28"
    >
      <div className="container-xl">
        {/* ========================================================
            SECTION HEADING
        ========================================================= */}
        <SectionHeading
          eyebrow="About Kalai Sangamam"
          title="Preserving Tradition. Developing Talent."
          align="center"
        />

        {/* ========================================================
            INTRO / MAIN ABOUT
        ========================================================= */}
        <div className="mt-10 sm:mt-14 lg:mt-16">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-20">
            {/* ==================================================
                IMAGE SIDE
            =================================================== */}
            <motion.div
              initial={{
                opacity: 0,
                x: -35,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="relative mx-auto w-full max-w-md lg:mx-0"
            >
              {/* Decorative Frame */}
              <div className="absolute -left-3 -top-3 hidden h-full w-full rounded-2xl border border-brass-500/10 sm:block" />

              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-brass-500/25 bg-ink-900 shadow-[0_25px_70px_-30px_rgba(0,0,0,0.8)]">
                <img
                  src={academyImage}
                  alt="Kalai Sangamam Academy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />

                {/* Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />

                {/* Bottom Image Label */}
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="border-l-2 border-brass-500 pl-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-brass-500">
                      Since
                    </p>

                    <p className="mt-1 font-display text-2xl text-parchment-100 sm:text-3xl">
                      1993
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  EXPERIENCE BADGE
              =================================================== */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.35,
                }}
                className="absolute -bottom-5 -right-2 z-10 flex min-w-[112px] flex-col items-center justify-center rounded-xl border border-brass-500/40 bg-ink-950/95 px-4 py-3 text-center shadow-[0_15px_40px_-15px_rgba(224,133,50,0.65)] backdrop-blur-md sm:-right-5 sm:min-w-[135px] sm:px-5 sm:py-4"
              >
                <span className="font-display text-3xl leading-none text-brass-500 sm:text-4xl">
                  {EXPERIENCE}
                </span>

                <span className="mt-1 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-parchment-100 sm:text-[10px]">
                  Years
                </span>

                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-slate-400 sm:text-[9px]">
                  Of Excellence
                </span>
              </motion.div>
            </motion.div>

            {/* ==================================================
                CONTENT SIDE
            =================================================== */}
            <motion.div
              initial={{
                opacity: 0,
                x: 35,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
                delay: 0.1,
              }}
              className="pt-2 lg:pt-0"
            >
              {/* Eyebrow */}
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-brass-500" />

                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-brass-500 sm:text-xs">
                  Our Story
                </span>
              </div>

              {/* Heading */}
              <h2 className="max-w-2xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-parchment-100 sm:text-4xl lg:text-5xl xl:text-[3.4rem]">
                A Journey Built on{" "}
                <span className="text-brass-500">Tradition & Excellence.</span>
              </h2>

              {/* Story */}
              <div className="mt-6 max-w-2xl space-y-4 text-justify text-sm leading-7 text-slate-400 sm:text-base sm:leading-7 lg:text-left lg:text-lg lg:leading-8">
                <p>
                  Kalai Sangamam is dedicated to preserving, promoting, and
                  developing{" "}
                  <span className="text-parchment-100">
                    traditional arts, martial arts, sports, fitness, and
                    cultural activities.
                  </span>
                </p>

                <p>
                  Beginning its journey in{" "}
                  <span className="text-parchment-100">
                    1993 with Karate and Silambam
                  </span>
                  , Kalai Sangamam has grown over the years by introducing Yoga,
                  Skating, Archery, and Hindi.
                </p>

                <p>
                  Today, it provides opportunities for children, youth, and
                  adults to develop discipline, confidence, fitness, talent, and
                  traditional values through regular training and participation.
                </p>
              </div>

              {/* Tamil Tagline */}
              <div className="mt-6 border-l-2 border-brass-500/40 pl-4 sm:mt-7">
                <p className="text-sm font-bold leading-6 text-brass-500 sm:text-base">
                  மரபை காப்போம். திறமையை வளர்ப்போம். தலைமுறையை உருவாக்குவோம்.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ========================================================
            VALUES
        ========================================================= */}
        <div className="mt-16 sm:mt-20 lg:mt-24">
          {/* Small Section Label */}
          <div className="mb-7 flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brass-500 sm:text-xs">
              What We Stand For
            </span>

            <div className="h-px flex-1 bg-brass-500/15" />
          </div>

          {/* Values Grid */}
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {VALUES.map((value, index) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.title}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="group relative overflow-hidden rounded-xl border border-brass-500/15 bg-ink-900/30 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brass-500/40 hover:bg-ink-900/50 sm:p-6"
                >
                  {/* Number */}
                  <span className="absolute right-5 top-4 font-mono text-[10px] tracking-[0.15em] text-brass-500/50">
                    {value.number}
                  </span>

                  {/* Icon */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-brass-500/20 bg-ink-950/60">
                    <Icon className="text-lg text-brass-500 transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  {/* Content */}
                  <div className="mt-5">
                    <h3 className="font-display text-xl text-parchment-100">
                      {value.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {value.text}
                    </p>
                  </div>

                  {/* Bottom Accent */}
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-brass-500 transition-all duration-500 group-hover:w-full" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            VISION & MISSION
        ========================================================= */}
        <div className="mt-16 sm:mt-20 lg:mt-24">
          <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
            {/* ==================================================
        VISION
    =================================================== */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -6,
                transition: { duration: 0.3 },
              }}
              className="group relative overflow-hidden rounded-2xl border border-parchment-100/10 bg-ink-900/40 p-6 sm:p-8 lg:p-10"
            >
              {/* Background Number */}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.2,
                  ease: "easeOut",
                }}
                className="pointer-events-none absolute -right-3 -top-8 font-display text-[120px] leading-none text-brass-500/[0.035] transition-transform duration-700 group-hover:scale-110"
              >
                01
              </motion.span>

              {/* Subtle Glow */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-brass-500/5 blur-3xl"
              />

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.15,
                }}
                className="relative flex items-center gap-3"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: 8,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brass-500/30 bg-ink-950/60"
                >
                  <FiCompass className="text-lg text-brass-500" />
                </motion.div>

                <div>
                  <h3 className="font-display text-xl text-parchment-100 sm:text-2xl">
                    Our Vision
                  </h3>

                  {/* Animated underline */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 45 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.4,
                    }}
                    className="mt-1 h-[2px] bg-brass-500"
                  />
                </div>
              </motion.div>

              {/* Vision Text */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                }}
                className="relative mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-7"
              >
                To build a healthy, disciplined, talented, and responsible
                society by promoting traditional values, physical fitness,
                sportsmanship, and cultural heritage.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.45,
                }}
                className="relative mt-3 max-w-xl text-sm leading-7 text-slate-400"
              >
                Kalai Sangamam aims to discover and nurture young talent and
                provide opportunities to participate and excel at district,
                state, national, and international levels.
              </motion.p>

              {/* Bottom Accent */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                  ease: "easeOut",
                }}
                className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-brass-500/60 via-brass-500/20 to-transparent"
              />
            </motion.div>

            {/* ==================================================
        MISSION
    =================================================== */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -6,
                transition: { duration: 0.3 },
              }}
              className="group relative overflow-hidden rounded-2xl border border-parchment-100/10 bg-ink-900/40 p-6 sm:p-8 lg:p-10"
            >
              {/* Background Number */}
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                  ease: "easeOut",
                }}
                className="pointer-events-none absolute -right-3 -top-8 font-display text-[120px] leading-none text-parchment-100/[0.025] transition-transform duration-700 group-hover:scale-110"
              >
                02
              </motion.span>

              {/* Subtle Glow */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                }}
                className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-brass-500/5 blur-3xl"
              />

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.25,
                }}
                className="relative flex items-center gap-3"
              >
                {/* Icon */}
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: -8,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 15,
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brass-500/30 bg-ink-950/60"
                >
                  <FiTarget className="text-lg text-brass-500" />
                </motion.div>

                <div>
                  <h3 className="font-display text-xl text-parchment-100 sm:text-2xl">
                    Our Mission
                  </h3>

                  {/* Animated underline */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 45 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.5,
                    }}
                    className="mt-1 h-[2px] bg-brass-500"
                  />
                </div>
              </motion.div>

              {/* Mission Quote */}
              <motion.blockquote
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.4,
                  ease: "easeOut",
                }}
                className="relative mt-6 border-l-2 border-brass-500/50 pl-5 sm:pl-6"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: 0.55,
                  }}
                  className="font-display text-lg leading-7 text-parchment-100 sm:text-xl lg:text-2xl lg:leading-9"
                >
                  “Preserve our tradition, develop our talent, strengthen our
                  body and mind, and inspire the next generation.”
                </motion.p>
              </motion.blockquote>

              {/* Quote Accent */}
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: "70%" }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.5,
                }}
                className="absolute left-0 top-1/2 w-[2px] -translate-y-1/2 bg-brass-500/20"
              />

              {/* Bottom Accent */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  delay: 0.65,
                  ease: "easeOut",
                }}
                className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-brass-500/60 via-brass-500/20 to-transparent"
              />
            </motion.div>
          </div>
        </div>

        {/* ========================================================
            CTA
        ========================================================= */}
        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
          }}
          className="mt-10 flex justify-center sm:mt-12"
        >
          <HomeSectionLink
            to="/about"
            section={HOME_SECTIONS.about}
            className="group inline-flex items-center gap-2 rounded-full border border-brass-500/30 px-5 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-brass-500 transition-all duration-300 hover:border-brass-500 hover:bg-brass-500/5 sm:px-6 sm:py-3 sm:text-xs"
          >
            View Full Story
            <FiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
          </HomeSectionLink>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
