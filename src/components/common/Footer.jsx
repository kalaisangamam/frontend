import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiYoutube, FiMapPin, FiPhone, FiMail, FiMessageCircle } from 'react-icons/fi';

const whatsappUrl = (value) => {
  if (!value) return '';
  return /^https?:\/\//i.test(value) ? value : `https://wa.me/${value.replace(/\D/g, '')}`;
};

const Footer = ({ site }) => (
  <footer className="border-t border-parchment-100/10 bg-ink-900/90 pt-16 pb-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
    <div className="container-xl grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <h3 className="font-display text-xl font-semibold text-parchment-100 mb-3">Kalai <span className="text-brass-500">Sangamam</span></h3>
        <p className="text-sm leading-relaxed text-parchment-300">A Dindigul academy for Silambam, Karate, Yoga, Skating, Archery and Hindi — discipline built one session at a time.</p>
        <div className="flex gap-4 mt-5 text-lg text-parchment-300">
          {site?.whatsapp && <a href={whatsappUrl(site.whatsapp)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="transition-colors hover:text-brass-400"><FiMessageCircle /></a>}
          {site?.facebook && <a href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="transition-colors hover:text-brass-400"><FiFacebook /></a>}
          {site?.instagram && <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="transition-colors hover:text-brass-400"><FiInstagram /></a>}
          {site?.youtube && <a href={site.youtube} target="_blank" rel="noreferrer" aria-label="YouTube" className="transition-colors hover:text-brass-400"><FiYoutube /></a>}
        </div>
      </div>
      <div><h4 className="text-parchment-100 font-display text-sm uppercase tracking-wide mb-4">Quick Links</h4><ul className="space-y-2 text-sm text-parchment-300"><li><Link to="/about" className="transition-colors hover:text-brass-400">About Us</Link></li><li><Link to="/masters" className="transition-colors hover:text-brass-400">Masters</Link></li><li><Link to="/gallery" className="transition-colors hover:text-brass-400">Gallery</Link></li><li><Link to="/events" className="transition-colors hover:text-brass-400">Upcoming Events</Link></li><li><Link to="/contact" className="transition-colors hover:text-brass-400">Contact</Link></li></ul></div>
      <div><h4 className="text-parchment-100 font-display text-sm uppercase tracking-wide mb-4">Training Programs</h4><ul className="space-y-2 text-sm text-parchment-300">{['Silambam', 'Karate', 'Yoga', 'Skating', 'Archery', 'Hindi'].map((program) => <li key={program}>{program}</li>)}</ul></div>
      <div><h4 className="text-parchment-100 font-display text-sm uppercase tracking-wide mb-4">Contact</h4><ul className="space-y-3 text-sm text-parchment-300"><li className="flex items-start gap-2"><FiMapPin className="mt-0.5 text-brass-500 shrink-0" /> {site?.address || 'Dindigul, Tamil Nadu'}</li><li className="flex items-center gap-2"><FiPhone className="text-brass-500 shrink-0" /> {site?.phone || '+91 00000 00000'}</li><li className="flex items-center gap-2"><FiMail className="text-brass-500 shrink-0" /> {site?.email || 'info@kalaisangamam.com'}</li></ul><div className="flex gap-3 mt-5"><Link to="/student/login" className="text-xs text-brass-500 underline underline-offset-4 hover:text-brass-400">Student Login</Link><Link to="/admin/login" className="text-xs text-slate-500 underline underline-offset-4 hover:text-brass-400">Admin Login</Link></div></div>
    </div>
    <div className="container-xl mt-12 pt-6 border-t border-parchment-100/10 text-xs text-slate-500 flex flex-col sm:flex-row justify-between gap-2"><p>&copy; {new Date().getFullYear()} Kalai Sangamam, Dindigul. All rights reserved.</p><p>Built for discipline, tradition and modern athletic excellence.</p></div>
  </footer>
);

export default Footer;
