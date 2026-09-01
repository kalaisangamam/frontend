import React from "react";
import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail,
  FiMessageCircle,
} from "react-icons/fi";
import BrandIdentity from "./BrandIdentity.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

// MSME / Udyam Logo
import msmeLogo from "../../assets/images/msme-logo.png";

const whatsappUrl = (value) => {
  if (!value) return "";

  return /^https?:\/\//i.test(value)
    ? value
    : `https://wa.me/${value.replace(/\D/g, "")}`;
};

const Footer = ({ site }) => {
  const { user } = useAuth();

  return (
    <footer className="border-t border-parchment-100/10 bg-ink-900/90 pt-16 pb-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
    {/* =====================================================
        MAIN FOOTER
    ====================================================== */}
    <div className="container-xl grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {/* =====================================================
          BRAND
      ====================================================== */}
      <div>
        <BrandIdentity placement="footer" />

        <p className="text-sm leading-relaxed text-parchment-300">
          A Dindigul-based academy dedicated to traditional arts, disciplined
          training, and holistic development through Yoga, Skating, Karate,
          Silambam, Archery, and Hindi.
        </p>

        {/* Social Links */}
        <div className="mt-5 flex gap-4 text-lg text-parchment-300">
          {site?.whatsapp && (
            <a
              href={whatsappUrl(site.whatsapp)}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="transition-colors hover:text-brass-400"
            >
              <FiMessageCircle />
            </a>
          )}

          {site?.facebook && (
            <a
              href={site.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="transition-colors hover:text-brass-400"
            >
              <FiFacebook />
            </a>
          )}

          {site?.instagram && (
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-brass-400"
            >
              <FiInstagram />
            </a>
          )}

          {site?.youtube && (
            <a
              href={site.youtube}
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="transition-colors hover:text-brass-400"
            >
              <FiYoutube />
            </a>
          )}
        </div>
      </div>

      {/* =====================================================
          QUICK LINKS
      ====================================================== */}
      <div>
        <h4 className="mb-4 font-display text-sm uppercase tracking-wide text-parchment-100">
          Quick Links
        </h4>

        <ul className="space-y-2 text-sm text-parchment-300">
          <li>
            <Link
              to="/about"
              className="transition-colors hover:text-brass-400"
            >
              About Us
            </Link>
          </li>

          <li>
            <Link
              to="/masters"
              className="transition-colors hover:text-brass-400"
            >
              Masters
            </Link>
          </li>

          <li>
            <Link
              to="/gallery"
              className="transition-colors hover:text-brass-400"
            >
              Gallery
            </Link>
          </li>

          <li>
            <Link
              to="/achievements"
              className="transition-colors hover:text-brass-400"
            >
              Achievements
            </Link>
          </li>

          <li>
            <Link
              to="/events"
              className="transition-colors hover:text-brass-400"
            >
              Upcoming Events
            </Link>
          </li>

          <li>
            <Link
              to="/contact"
              className="transition-colors hover:text-brass-400"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* =====================================================
          TRAINING PROGRAMS
      ====================================================== */}
      <div>
        <h4 className="mb-4 font-display text-sm uppercase tracking-wide text-parchment-100">
          Training Programs
        </h4>

        <ul className="space-y-2 text-sm text-parchment-300">
          {["Yoga", "Skating", "Karate", "Silambam", "Archery", "Hindi"].map(
            (program) => (
              <li key={program}>{program}</li>
            ),
          )}
        </ul>
      </div>

      {/* =====================================================
          CONTACT
      ====================================================== */}
      <div>
        <h4 className="mb-4 font-display text-sm uppercase tracking-wide text-parchment-100">
          Contact
        </h4>

        <ul className="space-y-3 text-sm text-parchment-300">
          <li className="flex items-start gap-2">
            <FiMapPin className="mt-0.5 shrink-0 text-brass-500" />
            {site?.address || "Dindigul, Tamil Nadu , India"}
          </li>

          <li className="flex items-center gap-2">
            <FiPhone className="shrink-0 text-brass-500" />
            {site?.phone || "+91 89730 13120"}
          </li>

          <li className="flex items-center gap-2">
            <FiMail className="shrink-0 text-brass-500" />
            {site?.email || "kalaisangamamdgl@gmail.com"}
          </li>
        </ul>

        {!user && (
          <div className="mt-5">
            <Link
              to="/student/login"
              className="text-xs text-brass-500 underline underline-offset-4 transition-colors hover:text-brass-400"
            >
              Student Login
            </Link>
          </div>
        )}
      </div>
    </div>

    {/* =====================================================
        MSME REGISTRATION
    ====================================================== */}
    <div className="container-xl mt-10 border-t border-parchment-100/10 pt-6">
      <div className="flex flex-row items-center justify-center gap-4 sm:gap-6">
        {/* =================================================
            MSME LOGO
        ================================================== */}
        <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg border border-parchment-100/10 bg-white p-2 shadow-sm sm:h-16 sm:w-28">
          <img
            src={msmeLogo}
            alt="MSME Registered - Government of India"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* =================================================
            REGISTRATION DETAILS
        ================================================== */}
        <div className="min-w-0 text-left">
          <p className="font-display text-sm font-semibold text-parchment-100 sm:text-base">
            MSME Registered
          </p>

          <p className="mt-0.5 text-xs text-parchment-300 sm:text-sm">
            Government of India
          </p>

          <p className="mt-1 font-mono text-[0.6rem] tracking-[0.04em] text-brass-500 sm:text-xs sm:tracking-[0.08em]">
            Registration No: TN-06-0093598
          </p>
        </div>
      </div>
    </div>

    {/* =====================================================
        COPYRIGHT
    ====================================================== */}
    <div className="container-xl mt-8 flex flex-col justify-between gap-2 border-t border-parchment-100/10 pt-6 text-xs text-slate-500 sm:flex-row">
      <p>
        &copy; {new Date().getFullYear()} Kalai Sangamam, Dindigul. All rights
        reserved.
      </p>

      <p>Built for discipline, tradition and modern athletic excellence.</p>
    </div>
    </footer>
  );
};

export default Footer;
