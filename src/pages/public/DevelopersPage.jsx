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

const DEVELOPERS = [
  {
    name: 'Manoj Kumar V',
    roles: ['Full-Stack Developer', 'Data Analyst'],
    image: 'https://drive.google.com/thumbnail?id=11ntCK6SSbN5Ys6xOpYieH3YapVzc8v2e&sz=w1000',
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

const contactItems = (developer) => [
  { label: 'Email', href: `mailto:${developer.email}`, icon: FiMail },
  { label: 'Call', href: `tel:${developer.phone.replace(/\s/g, '')}`, icon: FiPhone },
  { label: 'Instagram', href: developer.instagram, icon: FiInstagram, external: true },
  { label: 'Portfolio', href: developer.portfolio, icon: FiExternalLink, external: true },
];

const DeveloperCard = ({ developer, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group relative overflow-hidden rounded-[1.75rem] border border-parchment-100/10 bg-ink-900/75 shadow-[0_24px_70px_-38px_rgb(0_0_0_/_0.8)] transition-all duration-300 hover:-translate-y-1 hover:border-brass-500/40 hover:shadow-[0_30px_70px_-34px_rgb(197_155_39_/_0.3)]"
  >
    <div className="relative aspect-[1.12/1] overflow-hidden bg-ink-800">
      {developer.image ? (
        <img
          src={developer.image}
          alt={`${developer.name}, ${developer.roles.join(' and ')}`}
          className="h-full w-full object-cover object-top grayscale-[0.15] transition duration-700 group-hover:scale-[1.02] group-hover:grayscale-0"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-brass-400">
          <FiCode className="text-5xl" />
        </div>
      )}
      <span className="absolute left-5 top-5 rounded-full border border-brass-500/35 bg-ink-950/60 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-brass-300 backdrop-blur-sm">
        Developer {String(index + 1).padStart(2, '0')}
      </span>
    </div>

    <div className="px-5 pb-6 pt-6 sm:px-6">
      <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-brass-400">Digital craft</p>
      <h2 className="font-display text-2xl leading-tight text-parchment-100 sm:text-3xl">{developer.name}</h2>

      <div className="flex flex-wrap gap-2">
        {developer.roles.map((role) => (
          <span key={role} className="inline-flex items-center gap-1.5 rounded-full border border-parchment-100/10 bg-parchment-100/[0.03] px-3 py-1.5 text-xs text-parchment-200">
            <FiCode className="text-brass-400" />
            {role}
          </span>
        ))}
      </div>

      <div className="my-5 h-px bg-gradient-to-r from-brass-500/40 via-parchment-100/10 to-transparent" />

      <div className="flex items-center justify-between gap-4">
        <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Connect</span>
        <div className="flex items-center gap-2">
          {contactItems(developer).map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              title={item.label}
              aria-label={`${item.label} ${developer.name}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-parchment-100/10 text-parchment-300 transition-all hover:-translate-y-0.5 hover:border-brass-500/50 hover:bg-brass-500/10 hover:text-brass-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/70"
            >
              <item.icon />
            </a>
          ))}
        </div>
      </div>
    </div>
  </motion.article>
);

const DevelopersPage = () => (
  <PublicLayout>
    <main className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-36">
      <div className="pointer-events-none absolute -right-40 top-24 h-96 w-96 rounded-full bg-brass-500/10 blur-3xl" />
      <div className="pointer-events-none absolute left-0 top-72 h-64 w-64 rounded-full bg-maroon-500/10 blur-3xl" />

      <div className="container-xl">
        {/* <section className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
            <p className="eyebrow mb-4">The people behind the platform</p>
            <h1 className="max-w-3xl font-display text-[clamp(2.8rem,7vw,6.4rem)] leading-[0.92] text-parchment-100">
              Code with a <span className="text-brass-400">human</span> touch.
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
              Thoughtful design, reliable technology, and a shared belief that digital spaces should feel as welcoming as the academy itself.
            </p>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="relative rounded-[1.5rem] border border-brass-500/25 bg-ink-900/70 p-6 shadow-[0_22px_60px_-38px_rgb(197_155_39_/_0.45)] sm:p-8"
          >
            <div className="flex items-start justify-between gap-5">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-brass-400">Project note</span>
              <FiArrowUpRight className="text-xl text-brass-400" />
            </div>
            <p className="mt-8 font-display text-2xl leading-tight text-parchment-100 sm:text-3xl">Built for discipline, shaped for daily use.</p>
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-parchment-100/10 pt-5">
              <div><p className="font-display text-2xl text-brass-400">02</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">Developers</p></div>
              <div><p className="font-display text-2xl text-brass-400">01</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">Shared vision</p></div>
            </div>
          </motion.aside>
        </section> */}

        <section className="mt-0 sm:mt-0" aria-labelledby="developer-profiles-heading">
          <div className="mb-7 flex items-end justify-between gap-5 border-b border-parchment-100/10 pb-4">
            <div>
              <p className="eyebrow mb-2">The team</p>
              <h2 id="developer-profiles-heading" className="font-display text-2xl text-parchment-100 sm:text-3xl">Meet the builders</h2>
            </div>
            <span className="hidden text-xs uppercase tracking-[0.16em] text-slate-500 sm:block">Design / Develop / Deliver</span>
          </div>

          <div className="grid gap-6 md:grid-cols-2 md:gap-8">
            {DEVELOPERS.map((developer, index) => (
              <DeveloperCard key={developer.email} developer={developer} index={index} />
            ))}
          </div>
        </section>
      </div>
    </main>
  </PublicLayout>
);

export default DevelopersPage;
