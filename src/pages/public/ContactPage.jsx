import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiAlertTriangle,
  FiAlertCircle,
  FiExternalLink,
} from 'react-icons/fi';

import PublicLayout from '../../layouts/PublicLayout.jsx';
import SectionHeading from '../../components/common/SectionHeading';
import api from '../../services/api';
import { publicService } from '../../services/publicService';

/* ============================================================================
 * FALLBACK DATA
 * ========================================================================== */

const FALLBACK_BRANCHES = [
  {
    id: 'main',
    name: 'Main Branch',
    address:
      '123 Example Street, Dindigul, Tamil Nadu, India - 624001',
    phoneNumbers: [
      '+91 00000 00001',
      '+91 00000 00002',
      '+91 00000 00003',
    ],
    email: 'info@kalaisangamam.com',
    mapEmbedUrl:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d932.6204839220475!2d77.98110643453097!3d10.368136634556027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00abec39f95dab%3A0x66f43716e8303425!2sKalai%20Sangamam!5e1!3m2!1sen!2sin!4v1786627467451!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
  },
  {
    id: 'branch-2',
    name: '2nd Branch',
    address: 'Add the 2nd branch address here',
    phoneNumbers: ['+91 00000 00004'],
    email: 'branch2@kalaisangamam.com',
    mapEmbedUrl:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d932.6204839220475!2d77.98110643453097!3d10.368136634556027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00abec39f95dab%3A0x66f43716e8303425!5e1!3m2!1sen!2sin!4v1786631017427!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
  },
  {
    id: 'branch-3',
    name: '3rd Branch',
    address: 'Add the 3rd branch address here',
    phoneNumbers: ['+91 00000 00005'],
    email: 'branch3@kalaisangamam.com',
    mapEmbedUrl:
      '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d932.6204839220475!2d77.98110643453097!3d10.368136634556027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00abec39f95dab%3A0x66f43716e8303425!2sKalai%20Sangamam!5e1!3m2!1sen!2sin!4v1786631017427!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>',
  },
];

const GAME_OPTIONS = [
  'Silambam',
  'Karate',
  'Yoga',
  'Skating',
  'Archery',
  'Hindi',
];

const SUBJECT_OPTIONS = [
  'General Enquiry',
  'Programs & Training',
  'Fees & Membership',
  'Feedback',
  'Other',
];

const GENERIC_ERROR_MESSAGE =
  'Something went wrong. Please try again.';

/* ============================================================================
 * UTILS
 * ========================================================================== */

const extractMapSrc = (value = '') => {
  const trimmed = String(value || '').trim();

  if (!trimmed) return '';

  const match = trimmed.match(
    /src=["']([^"']+)["']/i
  );

  return match ? match[1] : trimmed;
};

const isRequired = (value = '') =>
  value.trim().length > 0;

const isValidEmail = (value = '') =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value.trim()
  );

const isValidPhone = (value = '') => {
  const digitsOnly = value.replace(/\D/g, '');

  return (
    /^[+]?[\d\s()-]{7,17}$/.test(
      value.trim()
    ) &&
    digitsOnly.length >= 7 &&
    digitsOnly.length <= 15
  );
};

const getPhoneHref = (number = '') =>
  `tel:${number.replace(/[^\d+]/g, '')}`;

/* ============================================================================
 * FORM SUBMIT
 * ========================================================================== */

const submitEnquiry = (payload) =>
  api.post('/contact-enquiries', payload);

function useFormSubmit(
  submitFn = submitEnquiry
) {
  const [status, setStatus] =
    useState('idle');

  const [errorMessage, setErrorMessage] =
    useState('');

  const submit = useCallback(
    async (payload) => {
      setStatus('submitting');
      setErrorMessage('');

      try {
        await submitFn(payload);

        setStatus('success');

        return true;
      } catch (err) {
        setStatus('error');
        setErrorMessage(
          GENERIC_ERROR_MESSAGE
        );

        return false;
      }
    },
    [submitFn]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setErrorMessage('');
  }, []);

  return {
    status,
    errorMessage,
    submit,
    reset,
  };
}

/* ============================================================================
 * FORM FIELD
 * ========================================================================== */

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

  const describedBy = error
    ? errorId
    : undefined;

  return (
    <div className="contact-field">

      <label
        htmlFor={fieldId}
        className="contact-field__label"
      >
        {label}

        {required && (
          <span
            className="contact-required"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      {as === 'textarea' && (
        <textarea
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          rows={rows}
          placeholder={placeholder}
          className={`contact-input contact-textarea ${
            error
              ? 'contact-input--error'
              : ''
          }`}
        />
      )}

      {as === 'select' && (
        <select
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`contact-input ${
            error
              ? 'contact-input--error'
              : ''
          }`}
        >
          <option
            value=""
            disabled
          >
            {placeholder ||
              'Select an option'}
          </option>

          {options?.map((option) => {
            const optValue =
              option?.value ?? option;

            const optLabel =
              option?.label ?? option;

            return (
              <option
                key={optValue}
                value={optValue}
              >
                {optLabel}
              </option>
            );
          })}
        </select>
      )}

      {as === 'input' && (
        <input
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          type={type}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`contact-input ${
            error
              ? 'contact-input--error'
              : ''
          }`}
        />
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="contact-field__error"
        >
          <FiAlertCircle
            aria-hidden="true"
          />

          {error}
        </p>
      )}
    </div>
  );
};

/* ============================================================================
 * DETAIL ROW
 * ========================================================================== */

const DetailRow = ({
  icon: Icon,
  label,
  children,
}) => (
  <div className="contact-detail">

    <span className="contact-detail__icon">
      <Icon aria-hidden="true" />
    </span>

    <div className="contact-detail__content">

      <p className="contact-detail__label">
        {label}
      </p>

      <div className="contact-detail__value">
        {children}
      </div>

    </div>
  </div>
);

/* ============================================================================
 * BRANCH CARD
 * ========================================================================== */

const BranchCard = ({
  branch,
  index = 0,
}) => {
  const mapSrc = extractMapSrc(
    branch.mapEmbedUrl
  );

  return (
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
        delay: index * 0.08,
        ease: 'easeOut',
      }}
      className="contact-card contact-branch-card"
    >

      {/* Branch header */}

      <div className="contact-branch-header">

        <div className="contact-branch-title">

          <span className="contact-branch-dot" />

          <span>
            {branch.name}
          </span>

        </div>

      </div>


      {/* Map */}

      <div className="contact-map">

        {mapSrc ? (
          <iframe
            src={mapSrc}
            title={`${branch.name} location map`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="contact-map-placeholder">
            Map embed placeholder
          </div>
        )}

      </div>


      {/* Details */}

      <div className="contact-details">

        {/* Address */}

        <DetailRow
          icon={FiMapPin}
          label="Address"
        >
          {branch.address}
        </DetailRow>


        {/* Phone */}

        {branch.phoneNumbers?.length >
          0 && (
          <DetailRow
            icon={FiPhone}
            label={
              branch.phoneNumbers.length >
              1
                ? 'Phone Numbers'
                : 'Phone Number'
            }
          >

            <div className="contact-link-list">

              {branch.phoneNumbers.map(
                (number) => (
                  <a
                    key={number}
                    href={getPhoneHref(
                      number
                    )}
                    className="contact-action-link"
                  >
                    <span>
                      {number}
                    </span>

                    <FiExternalLink
                      aria-hidden="true"
                    />
                  </a>
                )
              )}

            </div>

          </DetailRow>
        )}


        {/* Email */}

        {branch.email && (
          <DetailRow
            icon={FiMail}
            label="Email"
          >
            <a
              href={`mailto:${branch.email}`}
              className="contact-action-link"
            >
              <span>
                {branch.email}
              </span>

              <FiExternalLink
                aria-hidden="true"
              />
            </a>
          </DetailRow>
        )}

      </div>

    </motion.div>
  );
};

/* ============================================================================
 * CONTACT HERO
 * ========================================================================== */

const ContactHero = () => (
  <header className="contact-hero">

    <SectionHeading
      eyebrow="CONTACT US"
      title="Let's Connect With Kalai Sangamam"
    />

    <p className="contact-hero__description">
      Reach out for general enquiries,
      program enrolment, upcoming events,
      or details about any of our academy
      branches — our team is ready to help.
    </p>

  </header>
);

/* ============================================================================
 * GENERAL ENQUIRY
 * ========================================================================== */

const GENERAL_INITIAL = {
  fullName: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
};

const validateGeneral = (values) => {
  const errors = {};

  if (
    !isRequired(values.fullName)
  ) {
    errors.fullName =
      'Please enter your full name.';
  }

  if (
    !isRequired(values.phone)
  ) {
    errors.phone =
      'Please enter a phone number.';
  } else if (
    !isValidPhone(values.phone)
  ) {
    errors.phone =
      'Enter a valid phone number.';
  }

  if (
    isRequired(values.email) &&
    !isValidEmail(values.email)
  ) {
    errors.email =
      'Enter a valid email address.';
  }

  if (
    !isRequired(values.subject)
  ) {
    errors.subject =
      'Please select a subject.';
  }

  return errors;
};

const GeneralEnquiryForm = () => {
  const [values, setValues] =
    useState(GENERAL_INITIAL);

  const [errors, setErrors] =
    useState({});

  const {
    status,
    errorMessage,
    submit,
    reset,
  } = useFormSubmit();

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors =
      validateGeneral(values);

    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length >
      0
    ) {
      return;
    }

    const ok = await submit({
      enquiry_type: 'general',
      name: values.fullName,
      phone: values.phone,
      email: values.email,
      subject: values.subject,
      message: values.message,
    });

    if (ok) {
      setValues(GENERAL_INITIAL);
    }
  };

  if (status === 'success') {
    return (
      <div className="contact-card contact-success-card">

        <FiCheckCircle className="contact-success-icon" />

        <h3 className="contact-success-title">
          Thank You
        </h3>

        <p className="contact-success-text">
          Your enquiry has been submitted
          successfully.
        </p>

        <button
          type="button"
          onClick={reset}
          className="btn-secondary contact-reset-button"
        >
          Send Another Enquiry
        </button>

      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="contact-card contact-form"
    >

      <div className="contact-form-header">

        <p className="eyebrow">
          General Enquiry
        </p>

        <p className="contact-form-description">
          Have a question? Send us a message
          and we'll respond as soon as we can.
        </p>

      </div>


      <FormField
        label="Full Name"
        name="fullName"
        required
        value={values.fullName}
        onChange={handleChange}
        error={errors.fullName}
        placeholder="Your name"
        autoComplete="name"
      />


      <div className="contact-form-grid">

        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          required
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="+91 00000 00000"
          autoComplete="tel"
        />

        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
        />

      </div>


      <FormField
        as="select"
        label="Subject / Enquiry Type"
        name="subject"
        required
        value={values.subject}
        onChange={handleChange}
        error={errors.subject}
        placeholder="Select a subject"
        options={SUBJECT_OPTIONS}
      />


      <FormField
        as="textarea"
        label="Message"
        name="message"
        rows={4}
        value={values.message}
        onChange={handleChange}
        placeholder="Tell us what you're interested in"
      />


      {status === 'error' && (
        <p
          role="alert"
          className="contact-form-error"
        >
          <FiAlertTriangle />

          {errorMessage}
        </p>
      )}


      <button
        type="submit"
        disabled={
          status === 'submitting'
        }
        className="btn-primary contact-submit"
      >
        {status === 'submitting'
          ? 'Sending...'
          : 'Submit Enquiry'}
      </button>

    </form>
  );
};

/* ============================================================================
 * GAME ENROLMENT
 * ========================================================================== */

const ENROL_INITIAL = {
  studentName: '',
  phone: '',
  email: '',
  game: '',
  age: '',
  preferredBranch: '',
  message: '',
};

const validateEnrolment = (values) => {
  const errors = {};

  if (
    !isRequired(values.studentName)
  ) {
    errors.studentName =
      "Please enter the student's name.";
  }

  if (
    !isRequired(values.phone)
  ) {
    errors.phone =
      'Please enter a phone number.';
  } else if (
    !isValidPhone(values.phone)
  ) {
    errors.phone =
      'Enter a valid phone number.';
  }

  if (
    isRequired(values.email) &&
    !isValidEmail(values.email)
  ) {
    errors.email =
      'Enter a valid email address.';
  }

  if (!isRequired(values.game)) {
    errors.game =
      'Please select a program.';
  }

  if (!isRequired(values.age)) {
    errors.age =
      "Please enter the student's age.";
  } else if (
    Number(values.age) < 3 ||
    Number(values.age) > 80
  ) {
    errors.age =
      'Enter an age between 3 and 80.';
  }

  if (
    !isRequired(
      values.preferredBranch
    )
  ) {
    errors.preferredBranch =
      'Please select a preferred branch.';
  }

  return errors;
};

const GameEnrolmentForm = ({
  branches,
}) => {
  const [values, setValues] =
    useState(ENROL_INITIAL);

  const [errors, setErrors] =
    useState({});

  const {
    status,
    errorMessage,
    submit,
    reset,
  } = useFormSubmit();

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors =
      validateEnrolment(values);

    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length >
      0
    ) {
      return;
    }

    const ok = await submit({
      enquiry_type: 'enrolment',
      name: values.studentName,
      phone: values.phone,
      email: values.email,
      game: values.game,
      age: values.age,
      preferred_branch:
        values.preferredBranch,
      message: values.message,
    });

    if (ok) {
      setValues(ENROL_INITIAL);
    }
  };

  if (status === 'success') {
    return (
      <div className="contact-card contact-success-card">

        <FiCheckCircle className="contact-success-icon" />

        <h3 className="contact-success-title">
          Enrolment Request Sent
        </h3>

        <p className="contact-success-text">
          Your enrolment request has been
          submitted successfully.
        </p>

        <button
          type="button"
          onClick={reset}
          className="btn-secondary contact-reset-button"
        >
          Submit Another Request
        </button>

      </div>
    );
  }

  return (
    <form
      id="enrol-form"
      onSubmit={handleSubmit}
      noValidate
      className="contact-card contact-form"
    >

      <div className="contact-form-header">

        <p className="eyebrow">
          Enrol in a Program
        </p>

        <p className="contact-form-description">
          Tell us a little about the student
          and we'll take it from there.
        </p>

      </div>


      <FormField
        label="Student Name"
        name="studentName"
        required
        value={values.studentName}
        onChange={handleChange}
        error={errors.studentName}
        placeholder="Student's full name"
      />


      <div className="contact-form-grid">

        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          required
          value={values.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="+91 00000 00000"
          autoComplete="tel"
        />

        <FormField
          label="Email Address"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
        />

      </div>


      <div className="contact-form-grid">

        <FormField
          as="select"
          label="Select Game / Program"
          name="game"
          required
          value={values.game}
          onChange={handleChange}
          error={errors.game}
          placeholder="Choose a program"
          options={GAME_OPTIONS}
        />

        <FormField
          label="Age"
          name="age"
          type="number"
          required
          value={values.age}
          onChange={handleChange}
          error={errors.age}
          placeholder="Student's age"
        />

      </div>


      <FormField
        as="select"
        label="Preferred Branch"
        name="preferredBranch"
        required
        value={values.preferredBranch}
        onChange={handleChange}
        error={errors.preferredBranch}
        placeholder="Choose a branch"
        options={branches.map(
          (branch) => branch.name
        )}
      />


      <FormField
        as="textarea"
        label="Message / Additional Information"
        name="message"
        rows={3}
        value={values.message}
        onChange={handleChange}
        placeholder="Anything else we should know?"
      />


      {status === 'error' && (
        <p
          role="alert"
          className="contact-form-error"
        >
          <FiAlertTriangle />

          {errorMessage}
        </p>
      )}


      <button
        type="submit"
        disabled={
          status === 'submitting'
        }
        className="btn-primary contact-submit"
      >
        {status === 'submitting'
          ? 'Sending...'
          : 'Submit Enrolment Request'}
      </button>

    </form>
  );
};

/* ============================================================================
 * EVENT ENQUIRY
 * ========================================================================== */

const EVENT_INITIAL = {
  name: '',
  phone: '',
  email: '',
  eventName: '',
  message: '',
};

const validateEvent = (values) => {
  const errors = {};

  if (!isRequired(values.name)) {
    errors.name =
      'Please enter your name.';
  }

  if (!isRequired(values.phone)) {
    errors.phone =
      'Please enter a phone number.';
  } else if (
    !isValidPhone(values.phone)
  ) {
    errors.phone =
      'Enter a valid phone number.';
  }

  if (
    isRequired(values.email) &&
    !isValidEmail(values.email)
  ) {
    errors.email =
      'Enter a valid email address.';
  }

  if (
    !isRequired(values.eventName)
  ) {
    errors.eventName =
      'Please enter an event name.';
  }

  if (!isRequired(values.message)) {
    errors.message =
      'Please add a short message.';
  }

  return errors;
};

const EventEnquiry = () => {
  const [values, setValues] =
    useState(EVENT_INITIAL);

  const [errors, setErrors] =
    useState({});

  const {
    status,
    errorMessage,
    submit,
    reset,
  } = useFormSubmit();

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors =
      validateEvent(values);

    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length >
      0
    ) {
      return;
    }

    const ok = await submit({
      enquiry_type: 'event',
      name: values.name,
      phone: values.phone,
      email: values.email,
      event_name:
        values.eventName,
      message: values.message,
    });

    if (ok) {
      setValues(EVENT_INITIAL);
    }
  };

  if (status === 'success') {
    return (
      <div className="contact-card contact-success-card">

        <FiCheckCircle className="contact-success-icon" />

        <h3 className="contact-success-title">
          Enquiry Sent
        </h3>

        <p className="contact-success-text">
          Your event enquiry has been
          submitted successfully.
        </p>

        <button
          type="button"
          onClick={reset}
          className="btn-secondary contact-reset-button"
        >
          Send Another Enquiry
        </button>

      </div>
    );
  }

  return (
    <div className="contact-card contact-form">

      <div className="contact-form-header">

        <p className="eyebrow">
          Upcoming Events & Enquiries
        </p>

        <p className="contact-form-description">
          Ask about upcoming competitions,
          event registration, participation
          details, schedules, or registration
          deadlines.
        </p>

      </div>


      <form
        id="event-enquiry"
        onSubmit={handleSubmit}
        noValidate
        className="space-y-4"
      >

        <div className="contact-form-grid">

          <FormField
            label="Name"
            name="name"
            required
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Your name"
            autoComplete="name"
          />

          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            required
            value={values.phone}
            onChange={handleChange}
            error={errors.phone}
            placeholder="+91 00000 00000"
            autoComplete="tel"
          />

        </div>


        <FormField
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
        />


        <FormField
          label="Event Name"
          name="eventName"
          required
          value={values.eventName}
          onChange={handleChange}
          error={errors.eventName}
          placeholder="Enter the event name"
        />


        <FormField
          as="textarea"
          label="Message"
          name="message"
          required
          rows={3}
          value={values.message}
          onChange={handleChange}
          error={errors.message}
          placeholder="What is your query about this event?"
        />


        {status === 'error' && (
          <p
            role="alert"
            className="contact-form-error"
          >
            <FiAlertTriangle />

            {errorMessage}
          </p>
        )}


        <button
          type="submit"
          disabled={
            status === 'submitting'
          }
          className="btn-primary contact-submit"
        >
          {status === 'submitting'
            ? 'Sending...'
            : 'Send Event Enquiry'}
        </button>

      </form>

    </div>
  );
};

/* ============================================================================
 * DIVIDER
 * ========================================================================== */

const SectionDivider = () => (
  <div
    className="contact-divider"
    aria-hidden="true"
  />
);

/* ============================================================================
 * API BRANCH TRANSFORM
 * ========================================================================== */

const toContactBranch = (
  branch
) => ({
  ...branch,

  phoneNumbers: [
    branch.contact_number_1,
    branch.contact_number_2,
    branch.contact_number_3,
  ].filter(Boolean),

  mapEmbedUrl:
    branch.map_url,
});

/* ============================================================================
 * CONTACT PAGE
 * ========================================================================== */

const Contact = () => {
  const [branches, setBranches] =
    useState(FALLBACK_BRANCHES);

  useEffect(() => {
    publicService
      .getBranches()
      .then(({ data }) => {
        const liveBranches =
          (data.data || []).map(
            toContactBranch
          );

        if (liveBranches.length) {
          setBranches(liveBranches);
        }
      })
      .catch(() => {});
  }, []);

  const mainBranch =
    branches.find(
      (branch) =>
        branch.id === 'main' ||
        branch.display_order === 1
    ) || branches[0];

  const otherBranches =
    branches.filter(
      (branch) =>
        branch.id !== mainBranch?.id
    );

  return (
    <PublicLayout>

      {/* ======================================================
          PAGE STYLES
      ======================================================= */}

      <style>{`

        /* =====================================================
           THEME VARIABLES
        ====================================================== */

        .contact-page {
          /* These aliases intentionally resolve through the one global theme
             palette; this page must not maintain a second light/dark system. */
          --contact-heading: rgb(var(--theme-foreground));
          --contact-body: rgb(var(--theme-foreground-secondary));
          --contact-muted: rgb(var(--theme-foreground-muted));

          --contact-card-bg:
            linear-gradient(
              145deg,
              rgb(var(--theme-surface) / 0.98),
              rgb(var(--theme-surface-raised) / 0.96)
            );

          --contact-card-border:
            rgb(var(--theme-border) / 0.12);

          --contact-input-bg:
            rgb(var(--theme-canvas) / 0.82);

          --contact-input-border:
            rgb(var(--theme-border) / 0.14);

          --contact-input-text:
            rgb(var(--theme-foreground));

          --contact-input-placeholder:
            rgb(var(--theme-foreground-muted));

          --contact-divider:
            rgb(var(--theme-border) / 0.12);

          --contact-shadow:
            rgb(var(--theme-canvas) / 0.18);
        }


        /* =====================================================
           PAGE
        ====================================================== */

        .contact-page {
          color: var(--contact-heading);
          overflow-x: hidden;
        }


        /* =====================================================
           HERO
        ====================================================== */

        .contact-hero {
          max-width: 48rem;
          margin: 0 auto 3.5rem;
          text-align: center;
        }


        .contact-hero__description {
          max-width: 42rem;
          margin: 1.25rem auto 0;
          font-size: 0.95rem;
          line-height: 1.75;
          color: var(--contact-body);
        }


        /* =====================================================
           CARD
        ====================================================== */

        .contact-card {
          position: relative;
          overflow: hidden;

          border:
            1px solid
            var(--contact-card-border);

          border-radius: 1rem;

          background:
            var(--contact-card-bg);

          box-shadow:
            0 20px 50px
            var(--contact-shadow);

          transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            box-shadow 0.3s ease;
        }


        .contact-card::before {
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
              rgba(197,155,39,0.75),
              transparent
            );
        }


        .contact-branch-card {
          padding:
            clamp(
              1rem,
              1rem + 1vw,
              1.75rem
            );
        }


        .contact-card:hover {
          border-color:
            rgba(197,155,39,0.28);

          box-shadow:
            0 28px 70px
            var(--contact-shadow);
        }


        /* =====================================================
           BRANCH
        ====================================================== */

        .contact-branch-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.15rem;
        }


        .contact-branch-title {
          display: flex;
          align-items: center;
          gap: 0.65rem;

          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;

          color: #c59b27;
        }


        .contact-branch-dot {
          width: 0.5rem;
          height: 0.5rem;

          flex-shrink: 0;

          border-radius: 999px;

          background: #c59b27;

          box-shadow:
            0 0 0 5px
            rgba(197,155,39,0.09);
        }


        /* =====================================================
           MAP
        ====================================================== */

        .contact-map {
          position: relative;

          width: 100%;

          aspect-ratio: 16 / 9;

          overflow: hidden;

          border-radius: 0.8rem;

          margin-bottom: 1.25rem;

          border:
            1px solid
            var(--contact-card-border);

          background:
            rgba(0,0,0,0.08);
        }


        .contact-map iframe {
          position: absolute;

          inset: 0;

          width: 100%;
          height: 100%;

          border: 0;

          transition:
            transform 0.5s ease;
        }


        .contact-branch-card:hover
        .contact-map iframe {
          transform: scale(1.015);
        }


        .contact-map-placeholder {
          position: absolute;

          inset: 0;

          display: flex;

          align-items: center;
          justify-content: center;

          text-align: center;

          color:
            var(--contact-muted);

          font-size: 0.75rem;
        }


        /* =====================================================
           DETAILS
        ====================================================== */

        .contact-details {
          display: flex;

          flex-direction: column;

          gap: 0.75rem;
        }


        .contact-detail {
          display: flex;

          align-items: flex-start;

          gap: 0.8rem;

          padding: 0.7rem;

          border-radius: 0.7rem;

          border:
            1px solid
            var(--contact-card-border);

          background:
            rgba(255,255,255,0.015);
        }


        .light .contact-detail,
        [data-theme="light"] .contact-detail,
        html.light .contact-detail,
        body.light .contact-detail {
          background:
            rgba(15,23,42,0.025);
        }


        .contact-detail__icon {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          width: 2.15rem;
          height: 2.15rem;

          flex-shrink: 0;

          border-radius: 0.6rem;

          color: #c59b27;

          background:
            rgba(197,155,39,0.08);

          border:
            1px solid
            rgba(197,155,39,0.14);
        }


        .contact-detail__content {
          min-width: 0;
          flex: 1;
        }


        .contact-detail__label {
          margin: 0;

          font-size: 0.62rem;
          font-weight: 600;

          letter-spacing: 0.16em;
          text-transform: uppercase;

          color:
            var(--contact-muted);
        }


        .contact-detail__value {
          margin-top: 0.15rem;

          font-size: 0.82rem;

          line-height: 1.5;

          color:
            var(--contact-heading);

          word-break: break-word;
        }


        /* =====================================================
           LINKS
        ====================================================== */

        .contact-link-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }


        .contact-action-link {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 0.5rem;

          width: fit-content;
          max-width: 100%;

          color:
            var(--contact-heading);

          text-decoration: none;

          transition:
            color 0.2s ease;
        }


        .contact-action-link:hover {
          color: #c59b27;
        }


        .contact-action-link svg {
          flex-shrink: 0;

          font-size: 0.75rem;

          opacity: 0.6;

          transition:
            transform 0.2s ease;
        }


        .contact-action-link:hover svg {
          transform:
            translate(
              2px,
              -2px
            );

          opacity: 1;
        }


        /* =====================================================
           FORM
        ====================================================== */

        .contact-form {
          padding:
            clamp(
              1.25rem,
              1.2rem + 1vw,
              2rem
            );
        }


        .contact-form-header {
          margin-bottom: 1.4rem;
        }


        .contact-form-description {
          margin-top: 0.5rem;

          font-size: 0.84rem;

          line-height: 1.65;

          color:
            var(--contact-body);
        }


        .contact-form-grid {
          display: grid;

          grid-template-columns:
            1fr;

          gap: 1rem;
        }


        @media (min-width: 640px) {
          .contact-form-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }


        /* =====================================================
           INPUT
        ====================================================== */

        .contact-field {
          width: 100%;
        }


        .contact-field__label {
          display: block;

          margin-bottom: 0.45rem;

          font-size: 0.68rem;

          font-weight: 500;

          letter-spacing: 0.04em;

          color:
            var(--contact-body);
        }


        .contact-required {
          margin-left: 0.2rem;

          color: #c59b27;
        }


        .contact-input {
          display: block;

          width: 100%;

          min-height: 2.75rem;

          padding:
            0.7rem
            0.85rem;

          border-radius: 0.55rem;

          border:
            1px solid
            var(--contact-input-border);

          outline: none;

          background:
            var(--contact-input-bg);

          color:
            var(--contact-input-text);

          font-size: 0.84rem;

          transition:
            border-color 0.2s ease,
            background-color 0.2s ease,
            box-shadow 0.2s ease;
        }


        .contact-input::placeholder {
          color:
            var(--contact-input-placeholder);
        }


        .contact-input:focus {
          border-color:
            rgba(197,155,39,0.65);

          box-shadow:
            0 0 0 3px
            rgba(197,155,39,0.08);
        }


        .contact-input option {
          background: rgb(var(--theme-surface));
          color: rgb(var(--theme-foreground));
        }


        .contact-textarea {
          min-height: auto;

          resize: vertical;
        }


        .contact-input--error {
          border-color:
            rgba(239,68,68,0.65);
        }


        .contact-field__error {
          display: flex;

          align-items: center;

          gap: 0.4rem;

          margin-top: 0.4rem;

          font-size: 0.68rem;

          color: #ef4444;
        }


        /* =====================================================
           FORM ERROR
        ====================================================== */

        .contact-form-error {
          display: flex;

          align-items: flex-start;

          gap: 0.5rem;

          font-size: 0.72rem;

          color: #ef4444;
        }


        .contact-form-error svg {
          margin-top: 0.1rem;

          flex-shrink: 0;
        }


        /* =====================================================
           SUBMIT
        ====================================================== */

        .contact-submit {
          width: 100%;

          margin-top: 0.35rem;
        }


        .contact-submit:disabled {
          opacity: 0.6;

          cursor: not-allowed;
        }


        /* =====================================================
           SUCCESS
        ====================================================== */

        .contact-success-card {
          min-height: 25rem;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;

          padding: 2rem;

          gap: 0.75rem;
        }


        .contact-success-icon {
          width: 2.25rem;
          height: 2.25rem;

          color: #c59b27;
        }


        .contact-success-title {
          margin: 0;

          font-family:
            inherit;

          font-size: 1.2rem;

          font-weight: 600;

          color:
            var(--contact-heading);
        }


        .contact-success-text {
          max-width: 22rem;

          margin: 0;

          font-size: 0.82rem;

          line-height: 1.6;

          color:
            var(--contact-body);
        }


        .contact-reset-button {
          margin-top: 0.5rem;
        }


        /* =====================================================
           DIVIDER
        ====================================================== */

        .contact-divider {
          border-top:
            1px solid
            var(--contact-divider);
        }


        /* =====================================================
           MOBILE
        ====================================================== */

        @media (max-width: 639px) {

          .contact-hero {
            margin-bottom: 2.5rem;
          }


          .contact-hero__description {
            font-size: 0.84rem;

            padding:
              0 0.5rem;
          }


          .contact-branch-card,
          .contact-form {
            border-radius:
              0.85rem;
          }


          .contact-map {
            aspect-ratio:
              16 / 10;
          }


          .contact-detail {
            padding:
              0.65rem;
          }


          .contact-detail__value {
            font-size:
              0.78rem;
          }


          .contact-action-link {
            max-width:
              100%;

            word-break:
              break-all;
          }


          .contact-success-card {
            min-height:
              20rem;
          }
        }


        /* =====================================================
           REDUCED MOTION
        ====================================================== */

        @media (prefers-reduced-motion: reduce) {

          .contact-card,
          .contact-map iframe,
          .contact-input,
          .contact-action-link,
          .contact-action-link svg {
            transition: none !important;
          }


          .contact-card:hover {
            transform: none;
          }


          .contact-branch-card:hover
          .contact-map iframe {
            transform: none;
          }

        }

      `}</style>


      {/* ======================================================
          PAGE CONTENT
      ======================================================= */}

      <div className="contact-page pt-20 lg:pt-24">

        {/* ====================================================
            SECTION 1
        ===================================================== */}

        <section className="py-12 sm:py-16">

          <div className="container-xl">

            <ContactHero />


            <div className="grid lg:grid-cols-2 gap-8 items-stretch">

              <BranchCard
                branch={mainBranch}
              />

              <GeneralEnquiryForm />

            </div>

          </div>

        </section>


        <SectionDivider />


        {/* ====================================================
            SECTION 2
        ===================================================== */}

        <section className="py-12 sm:py-16">

          <div className="container-xl">

            <div className="text-center max-w-2xl mx-auto mb-12">

              <p className="eyebrow mb-3">
                Join The Academy
              </p>

              <h2
                className="section-heading"
                style={{
                  color:
                    'var(--contact-heading)',
                }}
              >
                Enrol In A Program
              </h2>

            </div>


            <div className="grid lg:grid-cols-2 gap-8 items-stretch">

              <GameEnrolmentForm
                branches={branches}
              />

              <EventEnquiry />

            </div>

          </div>

        </section>


        <SectionDivider />


        {/* ====================================================
            SECTION 3
        ===================================================== */}

        <section className="py-12 sm:py-16">

          <div className="container-xl">

            <div className="text-center max-w-2xl mx-auto mb-12">

              <p className="eyebrow mb-3">
                Find Us
              </p>

              <h2
                className="section-heading"
                style={{
                  color:
                    'var(--contact-heading)',
                }}
              >
                Other Academy Branches
              </h2>

            </div>


            {otherBranches.length >
              0 && (

              <div className="grid lg:grid-cols-2 gap-8">

                {otherBranches.map(
                  (branch, index) => (
                    <BranchCard
                      key={branch.id}
                      branch={branch}
                      index={index}
                    />
                  )
                )}

              </div>

            )}

          </div>

        </section>

      </div>

    </PublicLayout>
  );
};

export default Contact;
