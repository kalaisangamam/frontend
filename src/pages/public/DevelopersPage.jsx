import React from 'react';
import { motion } from 'framer-motion';
import {
  FiArrowUpRight,
  FiCode,
  FiExternalLink,
  FiInstagram,
  FiMail,
  FiPhone,
} from 'react-icons/fi';
import PublicLayout from '../../layouts/PublicLayout.jsx';

// Local developer images
import manojKumarImage from '../../assets/images/Manoj.png';
import kishorKumarImage from '../../assets/images/kishor.jpeg';

const DEVELOPERS = [
  {
    name: 'Manoj Kumar V',
    roles: ['Full-Stack Developer', 'Data Analyst'],
    image: manojKumarImage,
    email: 'kumarvmanoj329@gmail.com',
    phone: '+91 9500885468',
    instagram: 'https://instagram.com/',
    portfolio: 'https://mkv-portfolio.vercel.app/',
  },
  {
    name: 'Kishor Kumar S',
    roles: ['Full-Stack Developer', 'DevOps Engineer'],
    image: kishorKumarImage,
    email: 'pskishor196@gmail.com',
    phone: '+91 9659844778',
    instagram: 'https://instagram.com/',
    portfolio: 'https://kishors-portfolio.vercel.app/',
  },
];

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

/* ================================================================
   DEVELOPER CARD
================================================================ */

const DeveloperCard = ({ developer, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{
      once: true,
      amount: 0.2,
    }}
    transition={{
      duration: 0.5,
      delay: index * 0.1,
    }}
    className="
      group
      relative
      mx-auto
      w-full
      max-w-[520px]
      overflow-hidden
      rounded-[1.5rem]
      border
      border-parchment-100/10
      bg-ink-900/75
      shadow-[0_24px_70px_-38px_rgb(0_0_0_/_0.8)]
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-brass-500/40
      hover:shadow-[0_30px_70px_-34px_rgb(197_155_39_/_0.3)]
    "
  >
    {/* ============================================================
        IMAGE AREA
    ============================================================ */}

    <div
      className="
        relative
        mx-auto
        w-[92%]
        overflow-hidden
        rounded-b-[1.25rem]
        bg-white
        aspect-[4/5]
        sm:w-[94%]
      "
    >
      {developer.image ? (
        <img
          src={developer.image}
          alt={`${developer.name}, ${developer.roles.join(
            ' and ',
          )}`}
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-top
            grayscale-[0.08]
            transition-transform
            duration-700
            ease-out
            group-hover:scale-[1.025]
            group-hover:grayscale-0
          "
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className="
            flex
            h-full
            items-center
            justify-center
            text-brass-400
          "
        >
          <FiCode className="text-5xl" />
        </div>
      )}

      {/* ==========================================================
          DEVELOPER BADGE
      =========================================================== */}

      <span
        className="
          absolute
          left-0
          top-4
          rounded-full
          border
          border-brass-500/35
          bg-ink-950/65
          px-3
          py-1.5
          text-[0.58rem]
          font-bold
          uppercase
          tracking-[0.16em]
          text-brass-300
          backdrop-blur-sm
          sm:left-5
          sm:top-5
        "
      >
        Developer {String(index + 1).padStart(2, '0')}
      </span>

      {/* ==========================================================
          IMAGE BOTTOM SOFT TRANSITION
      =========================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          bottom-0
          h-16
          bg-gradient-to-t
          from-black/10
          to-transparent
        "
      />
    </div>

    {/* ============================================================
        CONTENT
    ============================================================= */}

    <div
      className="
        px-5
        pb-5
        pt-5
        sm:px-6
        sm:pb-6
      "
    >
      {/* Small Label */}

      <p
        className="
          mb-1.5
          text-[0.6rem]
          font-bold
          uppercase
          tracking-[0.18em]
          text-brass-400
        "
      >
        Digital craft
      </p>

      {/* Name */}

      <h2
        className="
          font-display
          text-xl
          leading-tight
          text-parchment-100
          sm:text-2xl
        "
      >
        {developer.name}
      </h2>

      {/* ==========================================================
          ROLE TAGS
      =========================================================== */}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {developer.roles.map((role) => (
          <span
            key={role}
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              border-parchment-100/10
              bg-parchment-100/[0.03]
              px-2.5
              py-1
              text-[0.68rem]
              text-parchment-200
            "
          >
            <FiCode className="text-[0.65rem] text-brass-400" />
            {role}
          </span>
        ))}
      </div>

      {/* Divider */}

      <div
        className="
          my-4
          h-px
          bg-gradient-to-r
          from-brass-500/40
          via-parchment-100/10
          to-transparent
        "
      />

      {/* ==========================================================
          CONNECT
      =========================================================== */}

      <div className="flex items-center justify-between gap-4">
        <span
          className="
            text-[0.62rem]
            uppercase
            tracking-[0.14em]
            text-slate-500
          "
        >
          Connect
        </span>

        <div className="flex items-center gap-1.5">
          {contactItems(developer).map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                target={
                  item.external ? '_blank' : undefined
                }
                rel={
                  item.external
                    ? 'noopener noreferrer'
                    : undefined
                }
                title={item.label}
                aria-label={`${item.label} ${developer.name}`}
                className="
                  inline-flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-parchment-100/10
                  text-parchment-300
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-brass-500/50
                  hover:bg-brass-500/10
                  hover:text-brass-300
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-brass-500/70
                  sm:h-9
                  sm:w-9
                "
              >
                <Icon className="text-sm" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  </motion.article>
);

/* ================================================================
   DEVELOPERS PAGE
================================================================ */

const DevelopersPage = () => (
  <PublicLayout>
    <main
      className="
        relative
        overflow-hidden
        pb-16
        pt-24
        sm:pb-24
        sm:pt-32
      "
    >
      {/* ==========================================================
          BACKGROUND DECORATION
      =========================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-24
          h-96
          w-96
          rounded-full
          bg-brass-500/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-72
          h-64
          w-64
          rounded-full
          bg-maroon-500/10
          blur-3xl
        "
      />

      <div className="container-xl">
        {/* ========================================================
            HEADER
        ========================================================= */}

        <section
          aria-labelledby="developer-profiles-heading"
          className="mt-0"
        >
          <div
            className="
              mb-7
              flex
              items-end
              justify-between
              gap-5
              border-b
              border-parchment-100/10
              pb-4
            "
          >
            <div>
              <p className="eyebrow mb-2">
                The team
              </p>

              <h1
                id="developer-profiles-heading"
                className="
                  font-display
                  text-2xl
                  text-parchment-100
                  sm:text-3xl
                "
              >
                Meet the builders
              </h1>
            </div>

            <span
              className="
                hidden
                text-xs
                uppercase
                tracking-[0.16em]
                text-slate-500
                sm:block
              "
            >
              Design / Develop / Deliver
            </span>
          </div>

          {/* ======================================================
              DEVELOPER GRID
          ======================================================= */}

          <div
            className="
              grid
              grid-cols-1
              items-start
              justify-items-center
              gap-7
              md:grid-cols-2
              md:gap-8
              lg:gap-10
            "
          >
            {DEVELOPERS.map(
              (developer, index) => (
                <DeveloperCard
                  key={developer.email}
                  developer={developer}
                  index={index}
                />
              ),
            )}
          </div>
        </section>
      </div>
    </main>
  </PublicLayout>
);

export default DevelopersPage;