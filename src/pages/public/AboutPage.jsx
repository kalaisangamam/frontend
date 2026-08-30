import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiCompass,
  FiTarget,
  FiHeart,
  FiShield,
  FiAward,
  FiActivity,
  FiBookOpen,
  FiArrowRight,
  FiUsers,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";

import PublicLayout from "../../layouts/PublicLayout.jsx";
import SectionHeading from "../../components/common/SectionHeading";
import academyImage from "../../assets/images/about-academy.jpg";
import masterImage from "../../assets/images/master-rajagopal.png";

/* ================================================================
   DATA
================================================================ */

// 1993 → 2026 = 33 years
const EXPERIENCE = "33+";

/* ----------------------------------------------------------------
   HISTORY / JOURNEY
----------------------------------------------------------------- */

const JOURNEY = [
  {
    year: "1993",
    title: "Karate & Silambam",
    text: "Kalai Sangamam began its journey with Karate and Silambam, establishing a strong foundation in martial arts and traditional practice.",
    icon: FiShield,
  },
  {
    year: "1998",
    title: "Yoga",
    text: "Yoga was introduced to promote physical fitness, flexibility, mental strength, and overall well-being.",
    icon: FiActivity,
  },
  {
    year: "2000+",
    title: "Skating",
    text: "Skating was introduced as part of Kalai Sangamam's growing range of sports and physical activities.",
    icon: FiTrendingUp,
  },
  {
    year: "2020",
    title: "Archery & Hindi",
    text: "Archery and Hindi were introduced, further expanding Kalai Sangamam's platform for sports, learning, and personal development.",
    icon: FiTarget,
  },
];

/* ----------------------------------------------------------------
   CORE VALUES
----------------------------------------------------------------- */

const CORE_VALUES = [
  {
    icon: FiShield,
    title: "Discipline",
    text: "Developing discipline, self-control, consistency, and responsibility through regular practice and training.",
  },
  {
    icon: FiHeart,
    title: "Dedication",
    text: "Encouraging students to remain committed to their goals and continuously improve through sincere effort and practice.",
  },
  {
    icon: FiBookOpen,
    title: "Tradition",
    text: "Preserving and promoting traditional arts, cultural values, and heritage for future generations.",
  },
  {
    icon: FiActivity,
    title: "Fitness",
    text: "Promoting physical fitness, healthy living, mental strength, and overall well-being through sports and physical activities.",
  },
  {
    icon: FiStar,
    title: "Excellence",
    text: "Inspiring every individual to develop their abilities and strive for excellence through dedication, discipline, and continuous practice.",
  },
  {
    icon: FiUsers,
    title: "Community",
    text: "Creating a positive platform where children, youth, and adults can learn, participate, develop their talents, and grow together.",
  },
];

/* ----------------------------------------------------------------
   PAGE
----------------------------------------------------------------- */

const AboutPage = () => (
  <PublicLayout>
    <div className="pt-20 lg:pt-24">

      {/* =========================================================
          PAGE INTRO
      ========================================================== */}
      <section className="container-xl text-center">

        <SectionHeading
          eyebrow="வணக்கம் — About Kalai Sangamam"
          title="Preserving Tradition. Developing Talent. Inspiring Excellence."
          align="center"
        />

        <p className="mt-4 max-w-3xl mx-auto text-slate-400 leading-relaxed text-base lg:text-lg">
          Kalai Sangamam is dedicated to preserving, promoting, and developing
          traditional arts, martial arts, sports, fitness, and cultural
          activities for the next generation.
        </p>

      </section>


      {/* =========================================================
          ABOUT KALAI SANGAMAM — HISTORY
      ========================================================== */}
      <section className="py-14 sm:py-18 lg:py-24">

        <div className="container-xl">

          <div className="grid lg:grid-cols-[45%_55%] gap-10 sm:gap-12 lg:gap-16 items-center">

            {/* -----------------------------------------------------
                ACADEMY IMAGE + EXPERIENCE
            ------------------------------------------------------ */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
              className="relative mx-auto w-full max-w-xs sm:max-w-sm lg:max-w-md"
            >

              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl border border-brass-500/25 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.7)]">

                <img
                  src={academyImage}
                  alt="Kalai Sangamam Academy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />

              </div>


              {/* EXPERIENCE BADGE */}
              <div className="absolute -bottom-5 right-3 sm:right-5 flex flex-col items-center justify-center rounded-xl border border-brass-500/40 bg-ink-950/90 px-4 py-3 sm:px-6 sm:py-4 text-center shadow-[0_15px_35px_-15px_rgba(224,133,50,0.6)] backdrop-blur-sm">

                <span className="font-display text-2xl sm:text-3xl leading-none text-brass-500">
                  {EXPERIENCE}
                </span>

                <span className="mt-1 font-mono text-[0.55rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-parchment-100">
                  Years
                </span>

                <span className="font-mono text-[0.5rem] sm:text-[0.6rem] uppercase tracking-[0.14em] text-parchment-200">
                  of Excellence
                </span>

              </div>

            </motion.div>


            {/* -----------------------------------------------------
                HISTORY CONTENT
            ------------------------------------------------------ */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: 0.1,
              }}
              className="text-left"
            >

              <p className="eyebrow mb-3">
                About Kalai Sangamam
              </p>

              <h2 className="section-heading mb-5">
                Rooted in Tradition.
                <br />
                Growing Through Excellence.
              </h2>


              <div className="space-y-4 text-slate-400 leading-relaxed text-base lg:text-lg">

                <p>
                  Kalai Sangamam is an organization dedicated to preserving,
                  promoting, and developing traditional arts, martial arts,
                  sports, fitness, and cultural activities.
                </p>

                <p>
                  With a vision of bringing together different forms of art and
                  physical education, Kalai Sangamam provides opportunities for
                  children, youth, and adults to learn discipline, confidence,
                  fitness, and traditional values.
                </p>

                <p>
                  Through regular training programs, competitions,
                  demonstrations, workshops, and cultural events, Kalai
                  Sangamam continues to encourage talent and create a positive
                  platform for the next generation.
                </p>

                <p>
                  Its journey is built on the principles of{" "}
                  <strong className="text-parchment-100 font-semibold">
                    discipline, dedication, tradition, fitness, and excellence
                  </strong>
                  , with the aim of connecting people through the spirit of art
                  and sport.
                </p>

              </div>

            </motion.div>

          </div>

        </div>

      </section>


      {/* =========================================================
          OUR JOURNEY / HISTORY TIMELINE
      ========================================================== */}
      <section className="py-14 sm:py-18 lg:py-24">

        <div className="container-xl">

          <SectionHeading
            eyebrow="Our History"
            title="A Journey Through the Years"
            align="left"
          />

          <p className="mt-4 max-w-2xl text-slate-400 leading-relaxed">
            From martial arts to sports, fitness, and learning, Kalai Sangamam
            has continued to expand its disciplines while staying committed to
            tradition, discipline, and excellence.
          </p>


          <div className="relative mt-12">

            {/* DESKTOP TIMELINE LINE */}
            <div className="hidden lg:block absolute left-0 right-0 top-[42px] h-px bg-brass-500/20" />


            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

              {JOURNEY.map((item, index) => (

                <motion.div
                  key={item.year}
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
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="relative"
                >

                  {/* YEAR */}
                  <div className="relative z-10 flex items-center gap-3">

                    <div className="flex h-[84px] w-[84px] shrink-0 items-center justify-center rounded-full border border-brass-500/40 bg-ink-950 shadow-[0_10px_30px_-15px_rgba(224,133,50,0.5)]">

                      <span className="font-display text-lg sm:text-xl text-brass-500">
                        {item.year}
                      </span>

                    </div>

                    {/* MOBILE CONNECTOR */}
                    <div className="lg:hidden h-px flex-1 bg-brass-500/20" />

                  </div>


                  {/* CONTENT */}
                  <div className="mt-5 pl-1">

                    <div className="flex items-center gap-2 mb-2">

                      <item.icon className="text-brass-500 text-base shrink-0" />

                      <h3 className="font-display text-lg sm:text-xl text-parchment-100">
                        {item.title}
                      </h3>

                    </div>

                    <p className="text-sm text-slate-400 leading-relaxed">
                      {item.text}
                    </p>

                  </div>

                </motion.div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =========================================================
          FOUNDER
      ========================================================== */}
      <section className="py-14 sm:py-18 lg:py-24 border-t border-parchment-100/5">

        <div className="container-xl">

          <SectionHeading
            eyebrow="The Founder"
            title="About Master V. Rajagopal"
            align="left"
          />


          <div className="mt-10 lg:mt-12 grid lg:grid-cols-[55%_45%] gap-10 lg:gap-16 items-center">

            {/* -----------------------------------------------------
                FOUNDER CONTENT
            ------------------------------------------------------ */}
            <motion.div
              initial={{
                opacity: 0,
                x: -25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
              }}
              className="text-left order-2 lg:order-1"
            >

              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-parchment-100 mb-4">
                Master V. Rajagopal
              </h3>

              <p className="text-brass-500 font-semibold text-sm sm:text-base uppercase tracking-wider mb-6">
                Founder & Guiding Force of Kalai Sangamam
              </p>


              <div className="space-y-4 text-slate-400 leading-relaxed text-base lg:text-lg">

                <p>
                  Master V. Rajagopal is the Founder and guiding force behind
                  Kalai Sangamam, with a strong commitment to developing martial
                  arts, sports, fitness, and traditional arts among children and
                  youth.
                </p>

                <p>
                  Through years of dedicated training, teaching, and organizing
                  sporting and cultural activities, he has worked to create
                  opportunities for students to build discipline, confidence,
                  physical fitness, leadership, and self-defense skills.
                </p>

                <p>
                  His vision is to bring different forms of art, martial arts,
                  and sports together under one platform and inspire the younger
                  generation to lead a healthy, disciplined, and purposeful life.
                </p>

                <p>
                  Through Kalai Sangamam, Master V. Rajagopal continues his
                  mission of nurturing talent, encouraging participation in
                  competitions, and preserving the values of traditional arts
                  for future generations.
                </p>

              </div>

            </motion.div>


            {/* -----------------------------------------------------
                FOUNDER IMAGE
            ------------------------------------------------------ */}
            <motion.div
              initial={{
                opacity: 0,
                x: 25,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.6,
                delay: 0.1,
              }}
              className="order-1 lg:order-2"
            >

              <div className="relative mx-auto w-full max-w-md">

                {/* OUTER FRAME */}
                <div className="absolute -inset-3 rounded-2xl border border-brass-500/10" />


                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-brass-500/25 bg-ink-900">

                  <img
                    src={masterImage}
                    alt="Master V. Rajagopal - Founder of Kalai Sangamam"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent" />


                  {/* NAME CARD */}
                  <div className="absolute bottom-5 left-5 right-5">

                    <div className="rounded-xl border border-brass-500/20 bg-ink-950/80 px-5 py-4 backdrop-blur-md">

                      <p className="font-display text-xl text-parchment-100">
                        Master V. Rajagopal
                      </p>

                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-brass-500">
                        Founder — Kalai Sangamam
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>


      {/* =========================================================
          VISION & MISSION
      ========================================================== */}
      <section className="py-14 sm:py-18 lg:py-24">

        <div className="container-xl">

          <SectionHeading
            eyebrow="Our Purpose"
            title="Vision & Mission"
            align="left"
          />


          <div className="mt-10 lg:mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">

            {/* -----------------------------------------------------
                VISION
            ------------------------------------------------------ */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
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
              className="card p-7 sm:p-9 lg:p-10"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brass-500/30 bg-ink-900/60 mb-5">

                <FiCompass className="text-brass-500 text-xl" />

              </div>


              <h3 className="font-display text-xl lg:text-2xl text-parchment-100 mb-4">
                Our Vision
              </h3>


              <p className="text-slate-400 leading-relaxed text-base">
                To build a healthy, disciplined, talented, and responsible
                society by promoting traditional values, physical fitness,
                sportsmanship, and cultural heritage.
              </p>

              <p className="mt-4 text-slate-400 leading-relaxed text-base">
                Kalai Sangamam aims to discover and nurture young talent,
                provide opportunities to participate and excel at district,
                state, national, and international levels, and inspire every
                individual to achieve excellence through dedication, discipline,
                and continuous practice.
              </p>

            </motion.div>


            {/* -----------------------------------------------------
                MISSION
            ------------------------------------------------------ */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
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
                delay: 0.1,
              }}
              className="card p-7 sm:p-9 lg:p-10 flex flex-col justify-center"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brass-500/30 bg-ink-900/60 mb-5">

                <FiTarget className="text-brass-500 text-xl" />

              </div>


              <h3 className="font-display text-xl lg:text-2xl text-parchment-100 mb-5">
                Our Mission
              </h3>


              <blockquote className="border-l-2 border-brass-500/50 pl-5 sm:pl-6">

                <p className="font-display text-xl sm:text-2xl lg:text-3xl leading-relaxed text-parchment-100">
                  “Preserve our tradition, develop our talent, strengthen our
                  body and mind, and inspire the next generation.”
                </p>

              </blockquote>

            </motion.div>

          </div>

        </div>

      </section>


      {/* =========================================================
          CORE VALUES
      ========================================================== */}
      <section className="py-14 sm:py-18 lg:py-24 border-t border-parchment-100/5">

        <div className="container-xl">

          <SectionHeading
            eyebrow="What We Believe"
            title="Our Core Values"
            align="left"
          />


          <div className="mt-10 lg:mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">

            {CORE_VALUES.map((value, index) => (

              <motion.div
                key={value.title}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.45,
                  delay: (index % 3) * 0.08,
                }}
                className="group border-t border-brass-500/20 pt-5 transition-colors duration-300 hover:border-brass-500/50"
              >

                <div className="flex items-center gap-3 mb-3">

                  <span className="font-mono text-xs text-brass-500">
                    0{index + 1}
                  </span>


                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-brass-500/20 bg-ink-900/50">

                    <value.icon className="text-brass-500 text-sm" />

                  </div>


                  <h3 className="font-display text-lg text-parchment-100">
                    {value.title}
                  </h3>

                </div>


                <p className="text-slate-400 text-sm leading-relaxed">
                  {value.text}
                </p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>


      {/* =========================================================
          OUR APPROACH
      ========================================================== */}
      <section className="py-14 sm:py-18 lg:py-24 border-t border-parchment-100/5">

        <div className="container-xl">

          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-start">

            <SectionHeading
              eyebrow="Our Approach"
              title="Building the Next Generation"
              align="left"
            />


            <motion.div
              initial={{
                opacity: 0,
                y: 16,
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
              className="text-slate-400 leading-relaxed text-base lg:text-lg"
            >

              <p>
                Through regular training programs, competitions,
                demonstrations, workshops, and cultural events, Kalai Sangamam
                creates opportunities for individuals to discover their
                abilities and develop their potential.
              </p>

              <p className="mt-5">
                Our approach brings together art, martial arts, sports,
                physical education, and cultural activities to support both
                physical and personal development.
              </p>

              <p className="mt-5">
                We believe that true development goes beyond physical skill.
                Discipline, confidence, fitness, traditional values,
                sportsmanship, and dedication help students build a strong
                foundation for life.
              </p>

            </motion.div>

          </div>

        </div>

      </section>


      {/* =========================================================
          CTA
      ========================================================== */}
      <section className="py-14 sm:py-18 lg:py-24">

        <div className="container-xl">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
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
            className="card flex flex-col items-center gap-5 px-6 py-12 sm:py-14 text-center sm:px-10 lg:px-16 border border-brass-500/20"
          >

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-parchment-100 max-w-2xl">
              Be a Part of the Kalai Sangamam Journey
            </h2>


            <p className="text-slate-400 max-w-xl leading-relaxed text-sm sm:text-base">
              Discover the opportunity to learn, develop your talent,
              strengthen your body and mind, and grow with the values of
              discipline, dedication, tradition, and excellence.
            </p>


            <Link
              to="/contact"
              className="btn-primary group mt-2 inline-flex items-center gap-2"
            >
              Get In Touch

              <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

          </motion.div>

        </div>

      </section>

    </div>
  </PublicLayout>
);

export default AboutPage;