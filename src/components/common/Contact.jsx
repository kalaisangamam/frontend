import React from 'react';
import {
  HomeSectionLink,
  HOME_SECTIONS,
} from '../../utils/homeSectionNavigation.jsx';
import { motion } from 'framer-motion';
import SectionHeading from '../common/SectionHeading';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiArrowRight,
  FiExternalLink,
} from 'react-icons/fi';

const DEFAULT_BRANCH = {
  name: 'Main Branch',
  address: 'Dindigul, Tamil Nadu, India',
  phone: '+91 99769 14993',
  email: 'kalaisangamamdgl@gmail.com',
  mapEmbedUrl:
    '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d793.9458038325159!2d77.98182557616998!3d10.367722516243099!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00abec39f95dab%3A0x66f43716e8303425!2sKalai%20Sangamam!5e1!3m2!1sen!2sin!4v1786606339142!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
};

/* ============================================================
   EXTRACT GOOGLE MAP URL
============================================================ */

const extractMapSrc = (value = '') => {
  const trimmed = value.trim();

  if (!trimmed) return '';

  const match = trimmed.match(/src=["']([^"']+)["']/i);

  return match ? match[1] : trimmed;
};

/* ============================================================
   CONTACT DETAIL
============================================================ */

const ContactDetail = ({
  icon: Icon,
  label,
  value,
  href,
}) => {
  const content = (
    <>
      {/* Icon */}
      <span className="cc-detail__icon">
        <Icon aria-hidden="true" />
      </span>

      {/* Content */}
      <span className="cc-detail__content">
        <span className="cc-detail__label">
          {label}
        </span>

        <span className="cc-detail__value">
          {value}
        </span>
      </span>

      {/* Arrow */}
      {href && (
        <span className="cc-detail__action">
          <FiExternalLink aria-hidden="true" />
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="cc-detail"
        aria-label={`${label}: ${value}`}
      >
        {content}
      </a>
    );
  }

  return (
    <div className="cc-detail">
      {content}
    </div>
  );
};

/* ============================================================
   COMMON CONTACT
============================================================ */

const CommonContact = ({
  site,
  className = '',
}) => {
  const branch = {
    name:
      site?.branchName ||
      DEFAULT_BRANCH.name,

    address:
      site?.address ||
      DEFAULT_BRANCH.address,

    phone:
      site?.phone ||
      DEFAULT_BRANCH.phone,

    email:
      site?.email ||
      DEFAULT_BRANCH.email,

    mapEmbedUrl: extractMapSrc(
      site?.mapEmbedUrl ||
        DEFAULT_BRANCH.mapEmbedUrl
    ),
  };

  /* ==========================================================
     PHONE + EMAIL LINKS
  ========================================================== */

  const phoneHref = `tel:${branch.phone.replace(
    /[^\d+]/g,
    ''
  )}`;

  const emailHref = `mailto:${branch.email}`;

  return (
    <section
      id="contact"
      className={`cc-section py-12 sm:py-16 lg:py-20 ${className}`}
      aria-labelledby="common-contact-heading"
    >
      <style>{`

        /* =====================================================
           BASE
        ====================================================== */

        .cc-section {
          --cc-gap: clamp(
            1.25rem,
            1rem + 1.5vw,
            2rem
          );

          /* -----------------------------------------------
             Default = DARK THEME
          ------------------------------------------------ */

          /* Resolve through the global semantic palette so the home contact
             section follows the same runtime theme switch as every page. */
          --cc-text-primary: rgb(var(--theme-foreground));
          --cc-text-secondary: rgb(var(--theme-foreground-secondary));
          --cc-text-muted: rgb(var(--theme-foreground-muted));

          --cc-card-bg:
            linear-gradient(
              145deg,
              rgb(var(--theme-surface) / 0.98),
              rgb(var(--theme-surface-raised) / 0.96)
            );

          --cc-card-border:
            rgb(var(--theme-border) / 0.12);

          --cc-detail-bg:
            rgb(var(--theme-surface-raised) / 0.5);

          --cc-detail-border:
            rgb(var(--theme-border) / 0.1);

          --cc-map-border:
            rgb(var(--theme-border) / 0.12);

          --cc-shadow:
            rgb(var(--theme-canvas) / 0.18);

          overflow-x: hidden;
        }


        /* =====================================================
           LIGHT THEME
        ====================================================== */

        .light .cc-section,
        [data-theme="light"] .cc-section,
        html.light .cc-section,
        body.light .cc-section {

          --cc-text-primary: #1f2937;

          --cc-text-secondary: #475569;

          --cc-text-muted: #64748b;

          --cc-card-bg:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.98),
              rgba(248, 250, 252, 0.96)
            );

          --cc-card-border:
            rgba(15, 23, 42, 0.09);

          --cc-detail-bg:
            rgba(15, 23, 42, 0.025);

          --cc-detail-border:
            rgba(15, 23, 42, 0.08);

          --cc-map-border:
            rgba(15, 23, 42, 0.08);

          --cc-shadow:
            rgba(15, 23, 42, 0.08);
        }


        /* =====================================================
           DARK THEME
        ====================================================== */

        .dark .cc-section,
        [data-theme="dark"] .cc-section,
        html.dark .cc-section,
        body.dark .cc-section {

          --cc-text-primary: #f5ece0;

          --cc-text-secondary: #94a3b8;

          --cc-text-muted: #64748b;

          --cc-card-bg:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.012)
            );

          --cc-card-border:
            rgba(197, 155, 39, 0.14);

          --cc-detail-bg:
            rgba(255, 255, 255, 0.018);

          --cc-detail-border:
            rgba(255, 255, 255, 0.055);

          --cc-map-border:
            rgba(255, 255, 255, 0.08);

          --cc-shadow:
            rgba(0, 0, 0, 0.18);
        }


        /* =====================================================
           GRID
        ====================================================== */

        .cc-grid {
          display: grid;

          grid-template-columns: 1fr;

          gap: var(--cc-gap);

          align-items: stretch;
        }


        @media (min-width: 1024px) {

          .cc-grid {
            grid-template-columns:
              1.1fr
              0.9fr;
          }

        }


        @media (min-width: 1440px) {

          .cc-grid {
            grid-template-columns:
              1.08fr
              0.92fr;
          }

        }


        /* =====================================================
           CARDS
        ====================================================== */

        .cc-info-card,
        .cc-cta-card {

          position: relative;

          overflow: hidden;

          border-radius: 1rem;

          border:
            1px solid var(--cc-card-border);

          background:
            var(--cc-card-bg);

          box-shadow:
            0 20px 50px
            var(--cc-shadow);

          transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }


        .cc-info-card::before,
        .cc-cta-card::before {

          content: '';

          position: absolute;

          top: 0;
          left: 0;

          width: 100%;
          height: 2px;

          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(197, 155, 39, 0.8),
              transparent
            );

          opacity: 0.7;
        }


        .cc-info-card:hover,
        .cc-cta-card:hover {

          transform:
            translateY(-4px);

          border-color:
            rgba(197, 155, 39, 0.3);

          box-shadow:
            0 28px 70px
            var(--cc-shadow);
        }


        /* =====================================================
           LEFT CARD
        ====================================================== */

        .cc-info-card {

          padding:
            clamp(
              1rem,
              1rem + 1vw,
              1.75rem
            );
        }


        /* =====================================================
           BRANCH HEADER
        ====================================================== */

        .cc-branch-header {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 1rem;

          margin-bottom: 1.15rem;
        }


        .cc-branch-name {

          display: flex;

          align-items: center;

          gap: 0.65rem;
        }


        .cc-branch-dot {

          width: 0.5rem;

          height: 0.5rem;

          flex-shrink: 0;

          border-radius: 999px;

          background:
            #c59b27;

          box-shadow:
            0 0 0 5px
            rgba(197, 155, 39, 0.09);
        }


        .cc-branch-label {

          font-size: 0.68rem;

          font-weight: 600;

          letter-spacing: 0.18em;

          text-transform: uppercase;

          color: #c59b27;
        }


        /* =====================================================
           MAP
        ====================================================== */

        .cc-map {

          position: relative;

          width: 100%;

          aspect-ratio: 16 / 9;

          overflow: hidden;

          border-radius: 0.8rem;

          margin-bottom: 1.25rem;

          border:
            1px solid var(--cc-map-border);

          background:
            rgba(0, 0, 0, 0.08);
        }


        .cc-map::after {

          content: '';

          position: absolute;

          inset: 0;

          pointer-events: none;

          border-radius: inherit;

          box-shadow:
            inset 0 0 35px
            rgba(0, 0, 0, 0.18);
        }


        .cc-map iframe {

          position: absolute;

          inset: 0;

          width: 100%;

          height: 100%;

          border: 0;

          transition:
            transform 0.5s ease;
        }


        .cc-info-card:hover
        .cc-map iframe {

          transform:
            scale(1.015);
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

          color:
            var(--cc-text-muted);
        }


        /* =====================================================
           CONTACT DETAILS
        ====================================================== */

        .cc-details {

          display: grid;

          grid-template-columns: 1fr;

          gap: 0.65rem;
        }


        .cc-detail {

          position: relative;

          display: flex;

          align-items: center;

          gap: 0.8rem;

          min-width: 0;

          padding: 0.75rem;

          border-radius: 0.7rem;

          border:
            1px solid
            var(--cc-detail-border);

          background:
            var(--cc-detail-bg);

          text-decoration: none;

          transition:
            background-color 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
        }


        a.cc-detail {

          cursor: pointer;
        }


        a.cc-detail:hover {

          transform:
            translateX(3px);

          background:
            rgba(197, 155, 39, 0.06);

          border-color:
            rgba(197, 155, 39, 0.22);
        }


        /* =====================================================
           ICON
        ====================================================== */

        .cc-detail__icon {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          width: 2.15rem;

          height: 2.15rem;

          flex-shrink: 0;

          border-radius: 0.6rem;

          color: #c59b27;

          background:
            rgba(197, 155, 39, 0.08);

          border:
            1px solid
            rgba(197, 155, 39, 0.14);

          font-size: 0.95rem;

          transition:
            transform 0.25s ease,
            background-color 0.25s ease;
        }


        .cc-detail:hover
        .cc-detail__icon {

          transform:
            scale(1.06);

          background:
            rgba(197, 155, 39, 0.13);
        }


        /* =====================================================
           TEXT
        ====================================================== */

        .cc-detail__content {

          display: flex;

          flex-direction: column;

          min-width: 0;

          flex: 1;
        }


        .cc-detail__label {

          font-size: 0.62rem;

          font-weight: 600;

          letter-spacing: 0.16em;

          text-transform: uppercase;

          color:
            var(--cc-text-muted);
        }


        .cc-detail__value {

          margin-top: 0.15rem;

          font-size: 0.82rem;

          line-height: 1.4;

          color:
            var(--cc-text-primary);

          word-break: break-word;
        }


        /* =====================================================
           EXTERNAL ICON
        ====================================================== */

        .cc-detail__action {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          color:
            var(--cc-text-muted);

          font-size: 0.8rem;

          transition:
            color 0.2s ease,
            transform 0.2s ease;
        }


        .cc-detail:hover
        .cc-detail__action {

          color:
            #c59b27;

          transform:
            translate(
              2px,
              -2px
            );
        }


        /* =====================================================
           CTA CARD
        ====================================================== */

        .cc-cta-card {

          display: flex;

          flex-direction: column;

          justify-content: center;

          padding:
            clamp(
              1.5rem,
              1.3rem + 1.3vw,
              2.75rem
            );
        }


        .cc-cta-card::after {

          content: '';

          position: absolute;

          width: 180px;

          height: 180px;

          right: -80px;

          bottom: -90px;

          border-radius: 50%;

          background:
            rgba(197, 155, 39, 0.05);

          pointer-events: none;
        }


        /* =====================================================
           CTA EYEBROW
        ====================================================== */

        .cc-cta__eyebrow {

          display: inline-flex;

          align-items: center;

          gap: 0.5rem;

          margin-bottom: 0.8rem;
        }


        .cc-cta__line {

          width: 24px;

          height: 1px;

          background:
            #c59b27;
        }


        /* =====================================================
           CTA HEADING
        ====================================================== */

        .cc-cta__heading {

          max-width: 12ch;

          font-size:
            clamp(
              1.7rem,
              1.4rem + 1.5vw,
              2.45rem
            );

          line-height: 1.08;

          letter-spacing: -0.02em;

          color:
            var(--cc-text-primary);
        }


        /* =====================================================
           CTA DESCRIPTION
        ====================================================== */

        .cc-cta__desc {

          max-width: 48ch;

          margin-top: 1rem;

          font-size:
            clamp(
              0.84rem,
              0.8rem + 0.2vw,
              0.95rem
            );

          line-height: 1.75;

          color:
            var(--cc-text-secondary);
        }


        /* =====================================================
           CTA BUTTON
        ====================================================== */

        .cc-cta__button {

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 0.55rem;

          width: fit-content;

          margin-top: 1.5rem;
        }


        .cc-cta__arrow {

          transition:
            transform 0.25s ease;
        }


        .cc-cta__button:hover
        .cc-cta__arrow {

          transform:
            translateX(4px);
        }


        /* =====================================================
           LIGHT THEME - EXTRA CONTRAST
        ====================================================== */

        .light .cc-detail__value,
        [data-theme="light"] .cc-detail__value,
        html.light .cc-detail__value,
        body.light .cc-detail__value {

          color: #1e293b;
        }


        .light .cc-cta__heading,
        [data-theme="light"] .cc-cta__heading,
        html.light .cc-cta__heading,
        body.light .cc-cta__heading {

          color: #111827;
        }


        .light .cc-cta__desc,
        [data-theme="light"] .cc-cta__desc,
        html.light .cc-cta__desc,
        body.light .cc-cta__desc {

          color: #475569;
        }


        .light .cc-detail,
        [data-theme="light"] .cc-detail,
        html.light .cc-detail,
        body.light .cc-detail {

          box-shadow:
            0 2px 10px
            rgba(15, 23, 42, 0.025);
        }


        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 640px) {

          .cc-section {

            padding-top: 2.5rem;

            padding-bottom: 2.5rem;
          }


          .cc-info-card,
          .cc-cta-card {

            border-radius: 0.85rem;
          }


          .cc-map {

            aspect-ratio: 16 / 10;
          }


          .cc-detail {

            padding: 0.7rem;
          }


          .cc-detail__value {

            font-size: 0.78rem;
          }


          .cc-cta__heading {

            max-width: 100%;
          }


          .cc-cta__button {

            width: 100%;
          }
        }


        /* =====================================================
           TABLET
        ====================================================== */

        @media (
          min-width: 768px
        ) and (
          max-width: 1023px
        ) {

          .cc-grid {

            gap:
              clamp(
                1.5rem,
                1.2rem + 1.5vw,
                2.5rem
              );
          }
        }


        /* =====================================================
           LARGE SCREENS
        ====================================================== */

        @media (min-width: 1920px) {

          .cc-section
          .container-xl {

            max-width: 1600px;
          }
        }


        /* =====================================================
           REDUCED MOTION
        ====================================================== */

        @media (prefers-reduced-motion: reduce) {

          .cc-info-card,
          .cc-cta-card,
          .cc-map iframe,
          .cc-detail,
          .cc-detail__icon,
          .cc-detail__action,
          .cc-cta__arrow {

            transition: none !important;
          }


          .cc-info-card:hover,
          .cc-cta-card:hover,
          a.cc-detail:hover {

            transform: none;
          }


          .cc-info-card:hover
          .cc-map iframe {

            transform: none;
          }
        }

      `}</style>


      {/* ======================================================
          SECTION HEADING
      ======================================================= */}

      <SectionHeading
        eyebrow="CONTACT US"
        title="Let’s Connect With Kalai Sangamam"
      />


      <div className="container-xl">

        <div className="cc-grid">


          {/* ==================================================
              LEFT — MAIN BRANCH
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: '-80px',
            }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
            }}
            className="cc-info-card"
          >

            {/* Branch Header */}

            <div className="cc-branch-header">

              <div className="cc-branch-name">

                <span
                  className="cc-branch-dot"
                  aria-hidden="true"
                />

                <span className="cc-branch-label">
                  {branch.name}
                </span>

              </div>

            </div>


            {/* Map */}

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

                <div className="cc-map__placeholder">
                  Map embed placeholder
                </div>

              )}

            </div>


            {/* Contact Details */}

            <div className="cc-details">

              {/* ADDRESS */}

              <ContactDetail
                icon={FiMapPin}
                label="Address"
                value={branch.address}
              />


              {/* PHONE */}

              <ContactDetail
                icon={FiPhone}
                label="Call Us"
                value={branch.phone}
                href={phoneHref}
              />


              {/* EMAIL */}

              <ContactDetail
                icon={FiMail}
                label="Email Us"
                value={branch.email}
                href={emailHref}
              />

            </div>

          </motion.div>


          {/* ==================================================
              RIGHT — CTA
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: '-80px',
            }}
            transition={{
              duration: 0.5,
              delay: 0.12,
              ease: 'easeOut',
            }}
            className="cc-cta-card"
          >

            {/* CTA Eyebrow */}

            <div className="cc-cta__eyebrow">

              <span
                className="cc-cta__line"
                aria-hidden="true"
              />

              <span className="eyebrow">
                Have a Question?
              </span>

            </div>


            {/* Heading */}

            <h2
              id="common-contact-heading"
              className="cc-cta__heading font-display"
            >
              We&apos;re Here to Help
            </h2>


            {/* Description */}

            <p className="cc-cta__desc">

              Reach out for general enquiries,
              upcoming event registration,
              training and program details,
              or information about our other
              academy branches. Our team is ready
              to assist you.

            </p>


            {/* CTA */}

            <HomeSectionLink
              to="/contact"
              section={HOME_SECTIONS.contact}
              className="btn-primary cc-cta__button"
            >

              <span>
                View Contact Page
              </span>

              <FiArrowRight
                className="cc-cta__arrow"
                aria-hidden="true"
              />

            </HomeSectionLink>

          </motion.div>

        </div>

      </div>

    </section>
  );
};

export default CommonContact;
