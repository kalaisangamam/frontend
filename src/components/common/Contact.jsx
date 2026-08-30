import React from 'react';
import { HomeSectionLink, HOME_SECTIONS } from '../../utils/homeSectionNavigation.jsx';
import { motion } from 'framer-motion';
import SectionHeading from '../common/SectionHeading';
import { FiMapPin, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi';

const DEFAULT_BRANCH = {
  name: 'Main Branch',
  address: 'Dindigul, Tamil Nadu, India',
  phone: '+91 89730 13120',
  email: 'kalaisangamamdgl@gmail.com',
  mapEmbedUrl: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d793.9458038325159!2d77.98182557616998!3d10.367722516243099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00abec39f95dab%3A0x66f43716e8303425!2sKalai%20Sangamam!5e1!3m2!1sen!2sin!4v1786606339142!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
};

// Google's "Embed a map" dialog copies the entire <iframe ...></iframe> tag,
// not just the URL. Accept either form so a pasted embed snippet still works
// instead of producing a broken/blank map (a 404 iframe, no navigation).
const extractMapSrc = (value = '') => {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : trimmed;
};

const ContactDetail = ({ icon: Icon, label, value }) => (
  <div className="cc-detail">
    <span className="cc-detail__icon inline-flex items-center justify-center rounded-full bg-brass-500/10 text-brass-500 border border-brass-500/20">
      <Icon />
    </span>
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="text-sm text-parchment-100 mt-0.5 break-words">{value}</p>
    </div>
  </div>
);

/**
 * CommonContact
 *
 * Reusable "main branch + CTA" contact block for use across public pages
 * (Home, About, Programs, Masters, Achievements, Gallery, Events, etc.).
 * This is intentionally NOT the full contact experience — no form, no
 * multi-branch listing. It surfaces the Main Branch essentials and routes
 * visitors to the dedicated /contact page for anything more.
 *
 * Styling lives entirely in this file (a scoped <style> block below) so the
 * component ships as a single import with no companion CSS file.
 *
 * Props:
 *  - site: optional data object. Falls back to DEFAULT_BRANCH per field so
 *          the component renders sensibly even before a backend is wired up.
 *      site.branchName    — e.g. "Main Branch"
 *      site.address
 *      site.phone
 *      site.email
 *      site.mapEmbedUrl   — full Google Maps embed src; placeholder shown if omitted
 *  - className: optional extra classes on the outer <section>
 */
const CommonContact = ({ site, className = '' }) => {
  const branch = {
    name: site?.branchName || DEFAULT_BRANCH.name,
    address: site?.address || DEFAULT_BRANCH.address,
    phone: site?.phone || DEFAULT_BRANCH.phone,
    email: site?.email || DEFAULT_BRANCH.email,
    mapEmbedUrl: extractMapSrc(site?.mapEmbedUrl || DEFAULT_BRANCH.mapEmbedUrl),
  };

  return (
    <section id="contact" className={`cc-section py-10 ${className}`} aria-labelledby="common-contact-heading">
      <style>{`
        .cc-section {
          --cc-gap: clamp(1.75rem, 1.2rem + 2vw, 3rem);
          overflow-x: hidden; /* guards against sub-pixel overflow at odd widths */
        }

        /* ---------- Grid ---------- */

        .cc-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--cc-gap);
          align-items: stretch;
        }

        @media (min-width: 1024px) {
          .cc-grid {
            grid-template-columns: 1.05fr 0.95fr;
          }
        }

        @media (min-width: 1920px) {
          .cc-section .container-xl {
            max-width: 1600px;
          }
        }

        /* ---------- Cards ---------- */

        .cc-info-card,
        .cc-cta-card {
          display: flex;
          flex-direction: column;
          padding: clamp(1.5rem, 1.2rem + 1vw, 2.25rem);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .cc-info-card:hover,
        .cc-cta-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 24px 60px -28px rgba(0, 0, 0, 0.55);
        }

        .cc-map {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: 0.6rem;
          overflow: hidden;
          margin-bottom: clamp(1.25rem, 1rem + 0.6vw, 1.75rem);
          border: 1px solid rgba(245, 236, 224, 0.1);
        }

        .cc-map iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
          transition: transform 0.5s ease;
        }

        .cc-info-card:hover .cc-map iframe {
          transform: scale(1.03);
        }

        .cc-map__placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1rem;
          font-size: 0.75rem;
          border: 1px dashed rgba(245, 236, 224, 0.15);
          border-radius: 0.6rem;
        }

        .cc-details {
          display: flex;
          flex-direction: column;
          gap: clamp(0.85rem, 0.7rem + 0.4vw, 1.15rem);
          margin-top: auto;
        }

        .cc-detail {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .cc-detail__icon {
          flex-shrink: 0;
          width: 2.1rem;
          height: 2.1rem;
          font-size: 0.95rem;
          transition: transform 0.25s ease, background-color 0.25s ease;
        }

        .cc-detail:hover .cc-detail__icon {
          transform: scale(1.08);
        }

        /* ---------- CTA card ---------- */

        .cc-cta-card {
          justify-content: center;
        }

        .cc-cta__heading {
          font-size: clamp(1.5rem, 1.25rem + 1vw, 2rem);
          line-height: 1.15;
          margin-top: 0.25rem;
        }

        .cc-cta__desc {
          font-size: clamp(0.875rem, 0.83rem + 0.2vw, 0.95rem);
          line-height: 1.65;
          margin-top: 1rem;
          max-width: 42ch;
        }

        .cc-cta__button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: clamp(1.5rem, 1.25rem + 1vw, 2rem);
          width: fit-content;
        }

        .cc-cta__arrow {
          transition: transform 0.25s ease;
        }

        .cc-cta__button:hover .cc-cta__arrow {
          transform: translateX(4px);
        }

        /* ---------- Fine-tuning at common device widths ---------- */

        @media (max-width: 430px) {
          .cc-cta__desc {
            max-width: none;
          }
          .cc-cta__button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .cc-grid {
            gap: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
          }
        }

        /* ---------- Motion preferences ---------- */

        @media (prefers-reduced-motion: reduce) {
          .cc-info-card,
          .cc-cta-card,
          .cc-map iframe,
          .cc-detail__icon,
          .cc-cta__arrow {
            transition: none !important;
          }
          .cc-info-card:hover,
          .cc-cta-card:hover {
            transform: none;
          }
        }
      `}</style>

      <SectionHeading
  eyebrow="CONTACT US"
  title="Let’s Connect With Kalai Sangamam"
/>

      <div className="container-xl">
        <div className="cc-grid">
          {/* Left — Main Branch info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="card cc-info-card"
          >
            <p className="eyebrow mb-4">{branch.name}</p>

            <div className="cc-map">
              {branch.mapEmbedUrl ? (
                <iframe
                  src={branch.mapEmbedUrl}
                  title={`${branch.name} location map`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="cc-map__placeholder text-slate-500">
                  Map embed placeholder — add a Google Maps iframe here
                </div>
              )}
            </div>

            <div className="cc-details">
              <ContactDetail icon={FiMapPin} label="Address" value={branch.address} />
              <ContactDetail icon={FiPhone} label="Phone" value={branch.phone} />
              <ContactDetail icon={FiMail} label="Email" value={branch.email} />
            </div>
          </motion.div>

          {/* Right — CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.12, ease: 'easeOut' }}
            className="card cc-cta-card"
          >
            <p className="eyebrow mb-3">Have a Question?</p>
            <h2 id="common-contact-heading" className="cc-cta__heading font-display text-parchment-100">
              We&apos;re Here to Help
            </h2>
            <p className="cc-cta__desc text-slate-300">
              Reach out for general enquiries, upcoming event registration, training and
              program details, or information about our other academy branches — our team
              is ready to help on the dedicated contact page.
            </p>
            <HomeSectionLink to="/contact" section={HOME_SECTIONS.contact} className="btn-primary cc-cta__button">
              <span>View Contact Page</span>
              <FiArrowRight className="cc-cta__arrow" aria-hidden="true" />
            </HomeSectionLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommonContact;
