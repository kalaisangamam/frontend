import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiCalendar, FiCheckCircle, FiAlertTriangle, FiAlertCircle } from 'react-icons/fi';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import SectionHeading from '../../components/common/SectionHeading';
import api from '../../services/api';
import { publicService } from '../../services/publicService';

/* ============================================================================
 * NOTE — FRONTEND-ONLY CONTACT PAGE
 * ----------------------------------------------------------------------------
 * This page is currently a UI-only demo. All three forms (General Enquiry,
 * Game Enrolment, Event Enquiry) validate on the client and show a success
 * state, but they do NOT call any API, Supabase, or EmailJS integration, and
 * they do NOT persist or transmit form data anywhere. There is intentionally
 * no import of an email/contact service here. When backend support is ready,
 * swap `simulateSubmit` (see useFormSubmit below) for a real submit function.
 * ==========================================================================*/

/* ============================================================================
 * DATA — placeholder branch/program data, structured for a future backend
 * swap. Replace values here, or fetch them and pass the shape through.
 * ==========================================================================*/

const FALLBACK_BRANCHES = [
  {
    id: 'main',
    name: 'Main Branch',
    address: '123 Example Street, Dindigul, Tamil Nadu, India - 624001',
    phoneNumbers: ['+91 00000 00001', '+91 00000 00002', '+91 00000 00003'],
    email: 'info@kalaisangamam.com',
    mapEmbedUrl: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d932.6204839220475!2d77.98110643453097!3d10.368136634556027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00abec39f95dab%3A0x66f43716e8303425!2sKalai%20Sangamam!5e1!3m2!1sen!2sin!4v1786627467451!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
  },
  {
    id: 'branch-2',
    name: '2nd Branch',
    address: 'Add the 2nd branch address here',
    phoneNumbers: ['+91 00000 00004'],
    email: 'branch2@kalaisangamam.com',
    mapEmbedUrl: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d932.6204839220475!2d77.98110643453097!3d10.368136634556027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00abec39f95dab%3A0x66f43716e8303425!2sKalai%20Sangamam!5e1!3m2!1sen!2sin!4v1786631017427!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
  },
  {
    id: 'branch-3',
    name: '3rd Branch',
    address: 'Add the 3rd branch address here',
    phoneNumbers: ['+91 00000 00005'],
    email: 'branch3@kalaisangamam.com',
    mapEmbedUrl: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d932.6204839220475!2d77.98110643453097!3d10.368136634556027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00abec39f95dab%3A0x66f43716e8303425!2sKalai%20Sangamam!5e1!3m2!1sen!2sin!4v1786631017427!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
  },
];

const GAME_OPTIONS = ['Silambam', 'Karate', 'Yoga', 'Skating', 'Archery', 'Hindi'];
const SUBJECT_OPTIONS = ['General Enquiry', 'Programs & Training', 'Fees & Membership', 'Feedback', 'Other'];

const GENERIC_ERROR_MESSAGE = 'Something went wrong. Please try again.';

/* ============================================================================
 * UTILS — map-embed parsing + validators
 * ==========================================================================*/

// Google's "Embed a map" dialog copies the entire <iframe ...></iframe> tag,
// not just the src URL. Accept either form so a pasted embed snippet works.
const extractMapSrc = (value = '') => {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  const match = trimmed.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : trimmed;
};

const isRequired = (value = '') => value.trim().length > 0;
const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const isValidPhone = (value = '') => {
  const digitsOnly = value.replace(/\D/g, '');
  return /^[+]?[\d\s()-]{7,17}$/.test(value.trim()) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
};

/* ============================================================================
 * HOOK — shared loading / success / error state for every form.
 *
 * FRONTEND-ONLY: `simulateSubmit` does not perform any network request, does
 * not call Supabase, and does not call EmailJS. It only simulates a brief
 * loading state (so the existing loading UI still has something to show) and
 * then resolves successfully. No form data is stored or sent anywhere.
 * ==========================================================================*/

const submitEnquiry = (payload) => api.post('/contact-enquiries', payload);

function useFormSubmit(submitFn = submitEnquiry) {
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const submit = useCallback(
    async (payload) => {
      setStatus('submitting');
      setErrorMessage('');
      try {
        await submitFn(payload);
        setStatus('success');
        return true;
      } catch (err) {
        // Never surface raw errors to the user.
        setStatus('error');
        setErrorMessage(GENERIC_ERROR_MESSAGE);
        return false;
      }
    },
    [submitFn]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMessage('');
  }, []);

  return { status, errorMessage, submit, reset };
}

/* ============================================================================
 * FormField — shared accessible input/select/textarea
 * ==========================================================================*/

const baseFieldClasses =
  'w-full bg-ink-950 border rounded-sm px-4 py-2.5 text-sm text-parchment-100 outline-none transition-colors placeholder:text-slate-500 focus:border-brass-500';

const FormField = ({
  as = 'input',
  type = 'text',
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  options,
  rows = 4,
  autoComplete,
}) => {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const describedBy = error ? errorId : undefined;
  const borderClass = error ? 'border-red-500/60 focus:border-red-500' : 'border-parchment-100/10';
  const sharedProps = {
    id: fieldId,
    name,
    value,
    onChange,
    onBlur,
    required,
    'aria-invalid': !!error,
    'aria-describedby': describedBy,
    className: `${baseFieldClasses} ${borderClass}`,
  };

  return (
    <div>
      <label htmlFor={fieldId} className="text-xs text-slate-400 mb-1.5 block">
        {label}
        {required && (
          <span className="text-brass-500 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {as === 'textarea' && (
        <textarea {...sharedProps} rows={rows} placeholder={placeholder} className={`${sharedProps.className} resize-none`} />
      )}

      {as === 'select' && (
        <select {...sharedProps}>
          <option value="" disabled>
            {placeholder || 'Select an option'}
          </option>
          {options?.map((option) => {
            const optValue = option?.value ?? option;
            const optLabel = option?.label ?? option;
            return (
              <option key={optValue} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>
      )}

      {as === 'input' && <input {...sharedProps} type={type} placeholder={placeholder} autoComplete={autoComplete} />}

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5">
          <FiAlertCircle className="shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

/* ============================================================================
 * BranchCard — map, address, phone number(s), email. Reused for Main Branch
 * and the two other branches so the markup isn't duplicated three times.
 * ==========================================================================*/

const DetailRow = ({ icon: Icon, label, children }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-brass-500/10 text-brass-500 border border-brass-500/20">
      <Icon className="text-sm" aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <div className="text-sm text-parchment-100 mt-0.5 break-words">{children}</div>
    </div>
  </div>
);

const BranchCard = ({ branch, index = 0 }) => {
  const mapSrc = extractMapSrc(branch.mapEmbedUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      className="card p-6 sm:p-7 flex flex-col h-full transition-shadow duration-300 hover:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]"
    >
      <p className="eyebrow mb-4">{branch.name}</p>

      <div className="relative w-full aspect-[16/10] rounded-md overflow-hidden border border-parchment-100/10 mb-6">
        {mapSrc ? (
          <iframe
            src={mapSrc}
            title={`${branch.name} location map`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-center px-4 text-xs text-slate-500 border border-dashed border-parchment-100/15 rounded-md">
            Map embed placeholder — add a Google Maps iframe here
          </div>
        )}
      </div>

      <div className="space-y-5 mt-auto">
        <DetailRow icon={FiMapPin} label="Address">
          {branch.address}
        </DetailRow>

        {branch.phoneNumbers?.length > 0 && (
          <DetailRow icon={FiPhone} label={branch.phoneNumbers.length > 1 ? 'Phone Numbers' : 'Phone Number'}>
            <div className="space-y-0.5">
              {branch.phoneNumbers.map((number) => (
                <a key={number} href={`tel:${number.replace(/\s+/g, '')}`} className="block hover:text-brass-400 transition-colors">
                  {number}
                </a>
              ))}
            </div>
          </DetailRow>
        )}

        {branch.email && (
          <DetailRow icon={FiMail} label="Email">
            <a href={`mailto:${branch.email}`} className="hover:text-brass-400 transition-colors break-all">
              {branch.email}
            </a>
          </DetailRow>
        )}
      </div>
    </motion.div>
  );
};

/* ============================================================================
 * ContactHero
 * ==========================================================================*/

const ContactHero = () => (
  <header className="max-w-3xl mx-auto text-center mb-14 sm:mb-16">
    <SectionHeading eyebrow="CONTACT US" title="Let's Connect With Kalai Sangamam" />
    <p className="mt-5 text-slate-300 text-sm sm:text-base leading-relaxed">
      Reach out for general enquiries, program enrolment, upcoming events, or details
      about any of our academy branches — our team is ready to help.
    </p>
  </header>
);

/* ============================================================================
 * GeneralEnquiryForm
 * Required: Full Name, Phone, Subject. Optional: Email, Message.
 * FRONTEND-ONLY: validates, shows loading state, then a success message.
 * No API / Supabase / EmailJS call is made, and no data is stored.
 * ==========================================================================*/

const GENERAL_INITIAL = { fullName: '', phone: '', email: '', subject: '', message: '' };

const validateGeneral = (values) => {
  const errors = {};
  if (!isRequired(values.fullName)) errors.fullName = 'Please enter your full name.';
  if (!isRequired(values.phone)) errors.phone = 'Please enter a phone number.';
  else if (!isValidPhone(values.phone)) errors.phone = 'Enter a valid phone number.';
  // Email is optional — only validate its format if the person entered one.
  if (isRequired(values.email) && !isValidEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (!isRequired(values.subject)) errors.subject = 'Please select a subject.';
  // Message is optional — no validation.
  return errors;
};

const GeneralEnquiryForm = () => {
  const [values, setValues] = useState(GENERAL_INITIAL);
  const [errors, setErrors] = useState({});
  const { status, errorMessage, submit, reset } = useFormSubmit();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateGeneral(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const ok = await submit({ enquiry_type: 'general', name: values.fullName, phone: values.phone, email: values.email, subject: values.subject, message: values.message });
    if (ok) setValues(GENERAL_INITIAL);
  };

  if (status === 'success') {
    return (
      <div className="card p-7 sm:p-8 h-full flex flex-col items-center justify-center text-center gap-3 min-h-[22rem]">
        <FiCheckCircle className="text-3xl text-brass-500" aria-hidden="true" />
        <p className="text-parchment-100 font-display text-xl">Thank you</p>
        <p className="text-slate-400 text-sm max-w-xs">
          Your enquiry has been submitted successfully.
        </p>
        <button type="button" onClick={reset} className="btn-secondary mt-2">
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="card p-7 sm:p-8 space-y-4">
      <div>
        <p className="eyebrow mb-2">General Enquiry</p>
        <p className="text-slate-400 text-sm">Have a question? Send us a message and we'll respond as soon as we can.</p>
      </div>

      <FormField
        label="Full Name" name="fullName" required
        value={values.fullName} onChange={handleChange} error={errors.fullName}
        placeholder="Your name" autoComplete="name"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          label="Phone Number" name="phone" type="tel" required
          value={values.phone} onChange={handleChange} error={errors.phone}
          placeholder="+91 00000 00000" autoComplete="tel"
        />
        <FormField
          label="Email Address" name="email" type="email"
          value={values.email} onChange={handleChange} error={errors.email}
          placeholder="you@example.com" autoComplete="email"
        />
      </div>

      <FormField
        as="select" label="Subject / Enquiry Type" name="subject" required
        value={values.subject} onChange={handleChange} error={errors.subject}
        placeholder="Select a subject" options={SUBJECT_OPTIONS}
      />

      <FormField
        as="textarea" label="Message" name="message" rows={4}
        value={values.message} onChange={handleChange} error={errors.message}
        placeholder="Tell us what you're interested in"
      />

      {status === 'error' && (
        <p role="alert" className="flex items-start gap-2 text-xs text-red-400">
          <FiAlertTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
          {errorMessage}
        </p>
      )}

      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
        {status === 'submitting' ? 'Sending...' : 'Submit Enquiry'}
      </button>
    </form>
  );
};

/* ============================================================================
 * GameEnrolmentForm
 * Required: Student Name, Phone, Game, Preferred Branch, Age.
 * Optional: Email, Message.
 * FRONTEND-ONLY: validates, shows loading state, then a success message.
 * No API / Supabase / EmailJS call is made, and no data is stored.
 * ==========================================================================*/

const ENROL_INITIAL = {
  studentName: '', phone: '', email: '',
  game: '', age: '', preferredBranch: '', message: '',
};

const validateEnrolment = (values) => {
  const errors = {};
  if (!isRequired(values.studentName)) errors.studentName = "Please enter the student's name.";
  if (!isRequired(values.phone)) errors.phone = 'Please enter a phone number.';
  else if (!isValidPhone(values.phone)) errors.phone = 'Enter a valid phone number.';
  // Email is optional — only validate its format if the person entered one.
  if (isRequired(values.email) && !isValidEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (!isRequired(values.game)) errors.game = 'Please select a program.';
  if (!isRequired(values.age)) errors.age = "Please enter the student's age.";
  else if (Number(values.age) < 3 || Number(values.age) > 80) errors.age = 'Enter an age between 3 and 80.';
  if (!isRequired(values.preferredBranch)) errors.preferredBranch = 'Please select a preferred branch.';
  // Message is optional — no validation.
  return errors;
};

const GameEnrolmentForm = ({ branches }) => {
  const [values, setValues] = useState(ENROL_INITIAL);
  const [errors, setErrors] = useState({});
  const { status, errorMessage, submit, reset } = useFormSubmit();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateEnrolment(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const ok = await submit({ enquiry_type: 'enrolment', name: values.studentName, phone: values.phone, email: values.email, game: values.game, age: values.age, preferred_branch: values.preferredBranch, message: values.message });
    if (ok) setValues(ENROL_INITIAL);
  };

  if (status === 'success') {
    return (
      <div className="card p-7 sm:p-8 h-full flex flex-col items-center justify-center text-center gap-3 min-h-[26rem]">
        <FiCheckCircle className="text-3xl text-brass-500" aria-hidden="true" />
        <p className="text-parchment-100 font-display text-xl">Enrolment request sent</p>
        <p className="text-slate-400 text-sm max-w-xs">
          Your enrolment request has been submitted successfully.
        </p>
        <button type="button" onClick={reset} className="btn-secondary mt-2">
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form id="enrol-form" onSubmit={handleSubmit} noValidate className="card p-7 sm:p-8 space-y-4">
      <div>
        <p className="eyebrow mb-2">Enrol in a Program</p>
        <p className="text-slate-400 text-sm">Tell us a little about the student and we'll take it from there.</p>
      </div>

      <FormField
        label="Student Name" name="studentName" required
        value={values.studentName} onChange={handleChange} error={errors.studentName}
        placeholder="Student's full name"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          label="Phone Number" name="phone" type="tel" required
          value={values.phone} onChange={handleChange} error={errors.phone}
          placeholder="+91 00000 00000" autoComplete="tel"
        />
        <FormField
          label="Email Address" name="email" type="email"
          value={values.email} onChange={handleChange} error={errors.email}
          placeholder="you@example.com" autoComplete="email"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FormField
          as="select" label="Select Game / Program" name="game" required
          value={values.game} onChange={handleChange} error={errors.game}
          placeholder="Choose a program" options={GAME_OPTIONS}
        />
        <FormField
          label="Age" name="age" type="number" required
          value={values.age} onChange={handleChange} error={errors.age}
          placeholder="Student's age"
        />
      </div>

      <FormField
        as="select" label="Preferred Branch" name="preferredBranch" required
        value={values.preferredBranch} onChange={handleChange} error={errors.preferredBranch}
        placeholder="Choose a branch" options={branches.map((b) => b.name)}
      />

      <FormField
        as="textarea" label="Message / Additional Information" name="message" rows={3}
        value={values.message} onChange={handleChange}
        placeholder="Anything else we should know?"
      />

      {status === 'error' && (
        <p role="alert" className="flex items-start gap-2 text-xs text-red-400">
          <FiAlertTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
          {errorMessage}
        </p>
      )}

      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
        {status === 'submitting' ? 'Sending...' : 'Submit Enrolment Request'}
      </button>
    </form>
  );
};

/* ============================================================================
 * EventEnquiry
 * Required: Name, Phone, Event Name, Message. Optional: Email.
 * Event Name is a free-text input (not a dropdown).
 * FRONTEND-ONLY: validates, shows loading state, then a success message.
 * No API / Supabase / EmailJS call is made, and no data is stored.
 * ==========================================================================*/

const EVENT_INITIAL = { name: '', phone: '', email: '', eventName: '', message: '' };

const validateEvent = (values) => {
  const errors = {};
  if (!isRequired(values.name)) errors.name = 'Please enter your name.';
  if (!isRequired(values.phone)) errors.phone = 'Please enter a phone number.';
  else if (!isValidPhone(values.phone)) errors.phone = 'Enter a valid phone number.';
  // Email is optional — only validate its format if the person entered one.
  if (isRequired(values.email) && !isValidEmail(values.email)) errors.email = 'Enter a valid email address.';
  if (!isRequired(values.eventName)) errors.eventName = 'Please enter an event name.';
  if (!isRequired(values.message)) errors.message = 'Please add a short message.';
  return errors;
};

const EventEnquiry = () => {
  const [values, setValues] = useState(EVENT_INITIAL);
  const [errors, setErrors] = useState({});
  const { status, errorMessage, submit, reset } = useFormSubmit();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validateEvent(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const ok = await submit({ enquiry_type: 'event', name: values.name, phone: values.phone, email: values.email, event_name: values.eventName, message: values.message });
    if (ok) setValues(EVENT_INITIAL);
  };

  if (status === 'success') {
    return (
      <div className="card p-7 sm:p-8 h-full flex flex-col items-center justify-center text-center gap-3 min-h-[22rem]">
        <FiCheckCircle className="text-3xl text-brass-500" aria-hidden="true" />
        <p className="text-parchment-100 font-display text-xl">Enquiry sent</p>
        <p className="text-slate-400 text-sm max-w-xs">
          Your event enquiry has been submitted successfully.
        </p>
        <button type="button" onClick={reset} className="btn-secondary mt-2">
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="card p-7 sm:p-8">
      <div className="eyebrow mb-2">
         Upcoming Events & Enquiries
      </div>
      <p className="text-slate-400 text-sm mb-6">
        Ask about upcoming competitions, event registration, participation details, schedules, or registration deadlines.
      </p>

      <form id="event-enquiry" onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            label="Name" name="name" required
            value={values.name} onChange={handleChange} error={errors.name}
            placeholder="Your name" autoComplete="name"
          />
          <FormField
            label="Phone Number" name="phone" type="tel" required
            value={values.phone} onChange={handleChange} error={errors.phone}
            placeholder="+91 00000 00000" autoComplete="tel"
          />
        </div>

        <FormField
          label="Email" name="email" type="email"
          value={values.email} onChange={handleChange} error={errors.email}
          placeholder="you@example.com" autoComplete="email"
        />

        <FormField
          label="Event Name" name="eventName" required
          value={values.eventName} onChange={handleChange} error={errors.eventName}
          placeholder="Enter the event name"
        />

        <FormField
          as="textarea" label="Message" name="message" required rows={3}
          value={values.message} onChange={handleChange} error={errors.message}
          placeholder="What is your query about this event?"
        />

        {status === 'error' && (
          <p role="alert" className="flex items-start gap-2 text-xs text-red-400">
            <FiAlertTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
            {errorMessage}
          </p>
        )}

        <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
          {status === 'submitting' ? 'Sending...' : 'Send Event Enquiry'}
        </button>
      </form>
    </div>
  );
};

/* ============================================================================
 * Page
 * ==========================================================================*/

const SectionDivider = () => <div className="border-t border-parchment-100/10" aria-hidden="true" />;

const toContactBranch = (branch) => ({
  ...branch,
  phoneNumbers: [branch.contact_number_1, branch.contact_number_2, branch.contact_number_3].filter(Boolean),
  mapEmbedUrl: branch.map_url,
});

const Contact = () => {
  const [branches, setBranches] = useState(FALLBACK_BRANCHES);
  useEffect(() => {
    publicService.getBranches().then(({ data }) => {
      const liveBranches = (data.data || []).map(toContactBranch);
      if (liveBranches.length) setBranches(liveBranches);
    }).catch(() => {});
  }, []);
  // Live branch IDs are UUIDs. The first display-order branch is the main one;
  // use its actual ID when excluding it from the "Other" section.
  const mainBranch = branches.find((b) => b.id === 'main' || b.display_order === 1) || branches[0];
  const otherBranches = branches.filter((b) => b.id !== mainBranch?.id);

  return (
    <PublicLayout>
      <div className="pt-20 lg:pt-24">
        {/* Hero */}
        <section className="py-12 sm:py-16">
          <div className="container-xl">
            <ContactHero />

            {/* Section 1 — Main Branch & General Enquiry */}
            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              <BranchCard branch={mainBranch} />
              <GeneralEnquiryForm />
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Section 2 — Game Enrolment & Upcoming Events */}
        <section className="py-12 sm:py-16">
          <div className="container-xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="eyebrow mb-3">Join The Academy</p>
              <h2 className="section-heading">Enrol In A Program</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-stretch">
              <GameEnrolmentForm branches={branches} />
              <EventEnquiry />
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Section 3 — Other Academy Branches */}
        <section className="py-12 sm:py-16">
          <div className="container-xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="eyebrow mb-3">Find Us</p>
              <h2 className="section-heading">Other Academy Branches</h2>
            </div>

            {otherBranches.length > 0 && (
              <div className="grid lg:grid-cols-2 gap-8">
                {otherBranches.map((branch, index) => (
                  <BranchCard key={branch.id} branch={branch} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default Contact;
