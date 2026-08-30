import React from 'react';
import { motion } from 'framer-motion';
import {
  FiCode,
  FiExternalLink,
  FiInstagram,
  FiMail,
  FiPhone,
} from 'react-icons/fi';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import SectionHeading from '../../components/common/SectionHeading.jsx';

// -----------------------------------------------------------------------------
// Developer Details
// -----------------------------------------------------------------------------

const DEVELOPERS = [

  {
    name: 'Manoj Kumar V',
    roles: ['Full-Stack Developer', 'Data Analyst'],
    image:
      'https://drive.google.com/thumbnail?id=11ntCK6SSbN5Ys6xOpYieH3YapVzc8v2e&sz=w1000',
    email: 'kumarvmanoj329@gmail.com',
    phone: '+91 9500885468',
    instagram: 'https://instagram.com/',
    portfolio: 'https://mkv-portfolio.vercel.app/',
  },


  {
    name: 'Kishor Kumar S',
    roles: ['Full-Stack Developer', 'DevOps Engineer'],
    image: 'https://drive.google.com/thumbnail?id=1psVskDl8NfSDZo1wBy1mWRmz3HojEwnl&sz=w1000',
    email: 'pskishor196@gmail.com',
    phone: '+91 9659844778',
    instagram: 'https://instagram.com/',
    portfolio: 'https://kishors-portfolio.vercel.app/',
  },
];

// -----------------------------------------------------------------------------
// Contact Items
// -----------------------------------------------------------------------------

const contactItems = (developer) => [
  {
    label: 'Email',
    href: `mailto:${developer.email}`,
    icon: FiMail,
  },
  {
    label: 'Call',
    href: `tel:${developer.phone.replace(/\s/g, '')}`,
    icon: FiPhone,
  },
  {
    label: 'Instagram',
    href: developer.instagram,
    icon: FiInstagram,
    external: true,
  },
  {
    label: 'Portfolio',
    href: developer.portfolio,
    icon: FiExternalLink,
    external: true,
  },
];

// -----------------------------------------------------------------------------
// Developers Page
// -----------------------------------------------------------------------------

const DevelopersPage = () => (
  <PublicLayout>
    <div className="container-xl pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-28 lg:pt-40">

      {/* ------------------------------------------------------------------ */}
      {/* Page Header */}
      {/* ------------------------------------------------------------------ */}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="eyebrow mb-3">
          THE PEOPLE BEHIND THE PLATFORM
        </p>

        <SectionHeading
          title="Meet the Developers"
          align="center"
        />

        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Bringing thoughtful design and reliable technology together
          to create a seamless digital experience for Kalai Sangamam.
        </p>
      </motion.div>

      {/* ------------------------------------------------------------------ */}
      {/* Developer Cards */}
      {/* ------------------------------------------------------------------ */}

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:mt-16 md:grid-cols-2 md:gap-8">

        {DEVELOPERS.map((developer, index) => (
          <motion.article
            key={developer.email}
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
            }}
            whileHover={{
              y: -4,
            }}
            className="
              group
              flex
              flex-col
              overflow-hidden
              rounded-md
              border
              border-parchment-100/10
              bg-ink-900/70
              shadow-[0_20px_50px_-28px_rgba(0,0,0,0.75)]
              transition-[border-color,box-shadow]
              duration-300
              hover:border-brass-500/35
              hover:shadow-[0_28px_60px_-30px_rgba(200,145,55,0.35)]
            "
          >

            {/* ============================================================ */}
            {/* Developer Image */}
            {/* ============================================================ */}

            <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">

              {developer.image ? (
                <img
                  src={developer.image}
                  alt={`${developer.name}, ${developer.roles.join(' and ')}`}
                  className="
                    h-full
                    w-full
                    object-cover
                    object-center
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <div
                      className="
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-parchment-100/10
                        bg-ink-950/50
                      "
                    >
                      <FiCode className="text-xl text-brass-400" />
                    </div>

                    <span className="text-sm text-slate-500">
                      Developer
                    </span>
                  </div>
                </div>
              )}

              {/* Image Overlay */}
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-ink-950/30
                  via-transparent
                  to-transparent
                  opacity-0
                  transition-opacity
                  duration-500
                  group-hover:opacity-100
                "
              />
            </div>

            {/* ============================================================ */}
            {/* Developer Information */}
            {/* ============================================================ */}

            <div className="flex flex-1 flex-col items-center px-6 py-7 text-center sm:px-8 sm:py-8">

              {/* Name */}
              <h2
                className="
                  font-display
                  text-2xl
                  leading-tight
                  text-parchment-100
                  sm:text-[26px]
                "
              >
                {developer.name}
              </h2>

              {/* ======================================================== */}
              {/* Professional Roles */}
              {/* ======================================================== */}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">

                {developer.roles.map((role, roleIndex) => (
                  <React.Fragment key={role}>

                    {roleIndex > 0 && (
                      <span
                        className="
                          h-1
                          w-1
                          shrink-0
                          rounded-full
                          bg-brass-500/50
                        "
                      />
                    )}

                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-brass-500/20
                        bg-brass-500/5
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        tracking-wide
                        text-brass-300
                        transition-all
                        duration-300
                        group-hover:border-brass-500/35
                        group-hover:bg-brass-500/10
                      "
                    >
                      <FiCode className="text-[11px] opacity-80" />

                      {role}
                    </span>

                  </React.Fragment>
                ))}

              </div>

              {/* ======================================================== */}
              {/* Divider */}
              {/* ======================================================== */}

              <div className="mt-7 flex items-center gap-2">

                <span className="h-px w-8 bg-parchment-100/10" />

                <span className="h-1 w-1 rounded-full bg-brass-500/50" />

                <span className="h-px w-8 bg-parchment-100/10" />

              </div>

              {/* ======================================================== */}
              {/* Contact Actions */}
              {/* ======================================================== */}

              <div className="mt-6 flex items-center justify-center gap-3">

                {contactItems(developer).map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={
                      item.external
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    title={item.label}
                    aria-label={item.label}
                    className="
                      inline-flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-parchment-100/10
                      bg-ink-950/45
                      text-parchment-300
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:border-brass-500/40
                      hover:bg-brass-500/10
                      hover:text-brass-300
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-brass-500/70
                    "
                  >
                    <item.icon className="text-base" />
                  </a>
                ))}

              </div>

            </div>
          </motion.article>
        ))}

      </div>
    </div>
  </PublicLayout>
);

export default DevelopersPage;