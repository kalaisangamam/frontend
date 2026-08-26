import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiExternalLink, FiInstagram, FiMail, FiPhone } from 'react-icons/fi';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import SectionHeading from '../../components/common/SectionHeading.jsx';

// Keep developer details in one place so the page can be updated without changing its UI.
const DEVELOPERS = [
  {
    name: 'Kishor Kumar S',
    designation: 'Full-Stack Developer | Devops Engineer',
    image: '',
    email: 'pskishor196@gmail.com',
    phone: '+91 9659844778',
    instagram: 'https://instagram.com/',
    portfolio: 'https://kishors-portfolio.vercel.app/',
  },
  {
    name: 'Manoj Kumar V',
    designation: 'Full-Stack Developer | Data Analyst',
    image: '',
    email: 'kumarvmanoj329@gmail.com',
    phone: '+91 9500885468',
    instagram: 'https://instagram.com/',
    portfolio: 'https://mkv-portfolio.vercel.app/',
  },
];

const contactItems = (developer) => [
  { label: 'Email', href: `mailto:${developer.email}`, icon: FiMail },
  { label: 'Call', href: `tel:${developer.phone.replace(/\s/g, '')}`, icon: FiPhone },
  { label: 'Instagram', href: developer.instagram, icon: FiInstagram, external: true },
  { label: 'Portfolio', href: developer.portfolio, icon: FiExternalLink, external: true },
];

const DevelopersPage = () => (
  <PublicLayout>
    <div className="container-xl pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-28 lg:pt-40">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="eyebrow mb-3">THE PEOPLE BEHIND THE PLATFORM</p>
        <SectionHeading title="Meet the Developers" align="center" />
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Bringing thoughtful design and reliable technology together to create a seamless digital experience for Kalai Sangamam.
        </p>
      </motion.div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
        {DEVELOPERS.map((developer, index) => (
          <motion.article
            key={developer.email}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="group flex flex-col overflow-hidden rounded-md border border-parchment-100/10 bg-ink-900/70 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.75)] transition-[border-color,box-shadow] duration-300 hover:border-brass-500/35 hover:shadow-[0_28px_60px_-30px_rgba(200,145,55,0.35)]"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
              <img
                src={developer.image}
                alt={`${developer.name}, ${developer.designation}`}
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0" />
              
            </div>

            {/* Body — grows to fill the card so footers align across the row */}
            <div className="flex flex-1 flex-col items-center px-6 py-7 text-center sm:px-8">
              <h2 className="font-display text-2xl text-parchment-100">{developer.name}</h2>
              <p className="mt-1 text-sm text-brass-400">{developer.designation}</p>

              {/* Divider separates identity from actions */}
              <div className="mt-6 h-px w-10 bg-parchment-100/15" />

              {/* Icon-only contact row, evenly centered */}
              <div className="mt-6 flex items-center justify-center gap-3">
                {contactItems(developer).map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noreferrer' : undefined}
                    title={item.label}
                    aria-label={item.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-parchment-100/10 bg-ink-950/45 text-parchment-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-brass-500/40 hover:bg-brass-500/10 hover:text-brass-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/70"
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