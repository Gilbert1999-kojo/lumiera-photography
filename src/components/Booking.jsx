import { useState } from 'react';
import { services, timeSlots } from '../data/servicesData';
import { formatTime, getGoogleCalendarUrl, generateIcsFile } from '../utils/calendarUtils';
import BookingCalendar from './BookingCalendar';
import {
  CheckCircle2, Clock, Calendar, CalendarCheck,
  ChevronRight, ChevronLeft, ExternalLink, Download,
} from 'lucide-react';

const STEPS = ['Service', 'Date & Time', 'Details', 'Confirm'];

export default function Booking() {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState({
    service: null,
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  // --- Step validation ---
  const validateStep = () => {
    if (step === 0) return !!booking.service;
    if (step === 1) return !!booking.date && !!booking.time;
    if (step === 2) {
      const e = {};
      if (!booking.name.trim())  e.name  = 'Name is required';
      if (!booking.email.trim()) e.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(booking.email))
        e.email = 'Enter a valid email';
      setErrors(e);
      return Object.keys(e).length === 0;
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep((s) => s + 1); };
  const back = () => setStep((s) => s - 1);

  const selectedService = services.find((s) => s.id === booking.service);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const calEventData = selectedService
    ? {
        title: `${selectedService.name} — Booking`,
        date:  booking.date,
        time:  booking.time,
        duration: selectedService.duration,
        description: `Booked by ${booking.name}\nService: ${selectedService.name}\nNotes: ${booking.notes || 'None'}`,
      }
    : null;

  if (submitted) return <BookingSuccess booking={booking} service={selectedService} calEventData={calEventData} />;

  return (
      <section id="booking" className="py-20 bg-white dark:bg-brand-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-orange mb-3 block">
            Book a Session
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-black dark:text-white mb-4">
            Let’s Make Something Beautiful
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400">
            Choose your session type, pick a date, and let’s start creating.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10 gap-0">
          {STEPS.map((label, idx) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                    transition-all
                    ${idx < step
                      ? 'bg-brand-orange text-white'
                      : idx === step
                      ? 'bg-brand-orange text-white ring-4 ring-brand-orange/20'
                      : 'bg-neutral-100 dark:bg-brand-dark-line text-neutral-400 dark:text-neutral-600'
                    }`}
                >
                  {idx < step ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span
                  className={`mt-1.5 text-xs font-medium hidden sm:block
                    ${idx <= step ? 'text-brand-orange' : 'text-neutral-400 dark:text-neutral-600'}`}
                >
                  {label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`w-12 sm:w-20 h-0.5 mb-4 mx-1 transition-colors
                    ${idx < step ? 'bg-brand-orange' : 'bg-neutral-200 dark:bg-brand-dark-line'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step panels */}
        <div className="bg-neutral-50 dark:bg-brand-dark-surface rounded-2xl border border-neutral-100 dark:border-brand-dark-line p-6 sm:p-8">
          {step === 0 && (
            <StepService booking={booking} setBooking={setBooking} />
          )}
          {step === 1 && (
            <StepDateTime booking={booking} setBooking={setBooking} />
          )}
          {step === 2 && (
            <StepDetails booking={booking} setBooking={setBooking} errors={errors} />
          )}
          {step === 3 && (
            <StepConfirm booking={booking} service={selectedService} onSubmit={handleSubmit} />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          {step > 0 ? (
            <button
              onClick={back}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl
                         border border-neutral-200 dark:border-brand-dark-line
                         text-neutral-600 dark:text-neutral-400
                         hover:border-brand-orange hover:text-brand-orange transition-colors font-medium text-sm"
            >
              <ChevronLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}
          {step < 3 && (
            <button
              onClick={next}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                         bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold text-sm
                         transition-colors shadow-md shadow-brand-orange/20"
            >
              Continue <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Step 0: Choose Service ───────────────────────────────── */
function StepService({ booking, setBooking }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-black dark:text-white mb-1">Choose a Service</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        Select the type of session you'd like to book.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {services.map((svc) => (
          <button
            key={svc.id}
            onClick={() => setBooking((b) => ({ ...b, service: svc.id }))}
            className={`text-left p-4 rounded-xl border-2 transition-all
              ${booking.service === svc.id
                ? 'border-brand-orange bg-brand-orange-pale dark:bg-brand-orange/10'
                : 'border-neutral-200 dark:border-brand-dark-line hover:border-brand-orange/50 dark:hover:border-brand-orange/50 bg-white dark:bg-brand-dark-elevated'
              }`}
          >
            <div className="text-2xl mb-2">{svc.icon}</div>
            <div className="font-bold text-black dark:text-white text-sm">{svc.name}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{svc.description}</div>
            <div className="flex items-center gap-3 mt-3">
              <span className="flex items-center gap-1 text-xs text-brand-orange font-semibold">
                <span className="text-[11px]">₪</span>{svc.price.replace('₪', '')}
              </span>
              <span className="flex items-center gap-1 text-xs text-neutral-400">
                <Clock size={11} />{svc.duration} min
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 1: Date & Time ──────────────────────────────────── */
function StepDateTime({ booking, setBooking }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-black dark:text-white mb-1">Pick a Date & Time</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        Choose an available slot from the calendar below.
      </p>
      <BookingCalendar
        selectedDate={booking.date}
        onSelectDate={(d) => setBooking((b) => ({ ...b, date: d, time: '' }))}
      />

      {booking.date && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
            Available times for{' '}
            {new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {timeSlots.map((t) => (
              <button
                key={t}
                onClick={() => setBooking((b) => ({ ...b, time: t }))}
                className={`py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${booking.time === t
                    ? 'bg-orange-500 text-white shadow shadow-orange-500/30'
                    : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-orange-400 hover:text-orange-500'
                  }`}
              >
                {formatTime(t)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Step 2: Contact Details ──────────────────────────────── */
function StepDetails({ booking, setBooking, errors }) {
  const field = (key) => ({
    value: booking[key],
    onChange: (e) => setBooking((b) => ({ ...b, [key]: e.target.value })),
  });

  return (
    <div>
      <h3 className="text-lg font-bold text-black dark:text-white mb-1">Your Details</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        We'll use these to send your booking confirmation.
      </p>

      <div className="space-y-4">
        <Field label="Full Name" error={errors.name} required>
          <input
            type="text"
            placeholder="Jane Smith"
            {...field('name')}
            className={inputCls(errors.name)}
          />
        </Field>

        <Field label="Email Address" error={errors.email} required>
          <input
            type="email"
            placeholder="jane@example.com"
            {...field('email')}
            className={inputCls(errors.email)}
          />
        </Field>

        <Field label="Phone Number">
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...field('phone')}
            className={inputCls()}
          />
        </Field>

        <Field label="Additional Notes">
          <textarea
            rows={3}
            placeholder="Anything you'd like me to know beforehand..."
            {...field('notes')}
            className={`${inputCls()} resize-none`}
          />
        </Field>
      </div>
    </div>
  );
}

function inputCls(error) {
  return `w-full px-4 py-3 rounded-xl border text-sm text-black dark:text-white
          bg-white dark:bg-neutral-800
          placeholder-neutral-400 dark:placeholder-neutral-600
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent
          transition-colors
          ${error
            ? 'border-red-400 dark:border-red-600'
            : 'border-neutral-200 dark:border-neutral-700'
          }`;
}

function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/* ─── Step 3: Confirm ─────────────────────────────────────── */
function StepConfirm({ booking, service, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <h3 className="text-lg font-bold text-black dark:text-white mb-1">Confirm Your Booking</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        Review your details and confirm.
      </p>

      <div className="space-y-3 mb-8">
        <SummaryRow icon={<Calendar size={15} />} label="Service" value={service?.name} />
        <SummaryRow
          icon={<CalendarCheck size={15} />}
          label="Date"
          value={
            booking.date
              ? new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                })
              : '—'
          }
        />
        <SummaryRow icon={<Clock size={15} />} label="Time" value={booking.time ? formatTime(booking.time) : '—'} />
        <SummaryRow icon={<Clock size={15} />} label="Duration" value={service ? `${service.duration} min` : '—'} />
        <SummaryRow icon={<span className="text-sm font-bold">₪</span>} label="Price" value={service?.price} />
        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3 mt-3" />
        <SummaryRow label="Name" value={booking.name} />
        <SummaryRow label="Email" value={booking.email} />
        {booking.phone && <SummaryRow label="Phone" value={booking.phone} />}
        {booking.notes && <SummaryRow label="Notes" value={booking.notes} />}
      </div>

      <button
        type="submit"
        className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700
                   text-white font-bold text-base transition-colors
                   shadow-lg shadow-orange-500/25"
      >
        Confirm Booking
      </button>
    </form>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 font-medium min-w-[80px]">
        {icon}
        {label}
      </span>
      <span className="text-black dark:text-white font-semibold text-right">{value}</span>
    </div>
  );
}

/* ─── Success screen ─────────────────────────────────────── */
function BookingSuccess({ booking, service, calEventData }) {
  const googleUrl = calEventData ? getGoogleCalendarUrl(calEventData) : '#';

  return (
    <section id="booking" className="py-20 bg-white dark:bg-black">
      <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-950/40
                        flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-orange-500" />
        </div>

        <h2 className="text-3xl font-black text-black dark:text-white mb-3">
          You're Booked!
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">
          Thanks, <strong className="text-black dark:text-white">{booking.name}</strong>!
          A confirmation will be sent to <strong className="text-orange-500">{booking.email}</strong>.
        </p>

        {/* Calendar add buttons */}
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 mb-6">
          <p className="text-sm font-semibold text-black dark:text-white mb-4">
            Add to your calendar
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                         border-2 border-neutral-200 dark:border-neutral-700
                         hover:border-orange-400 hover:text-orange-500
                         text-neutral-700 dark:text-neutral-300 font-medium text-sm transition-colors"
            >
              <ExternalLink size={15} />
              Google Calendar
            </a>
            <button
              onClick={() => calEventData && generateIcsFile(calEventData)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                         border-2 border-neutral-200 dark:border-neutral-700
                         hover:border-orange-400 hover:text-orange-500
                         text-neutral-700 dark:text-neutral-300 font-medium text-sm transition-colors"
            >
              <Download size={15} />
              Apple / Outlook (.ics)
            </button>
          </div>
          <p className="text-xs text-neutral-400 mt-4">
            The .ics file works with Apple Calendar, Outlook, and any calendar app that supports iCalendar.
          </p>
        </div>

        {/* Google Calendar API note */}
        <div className="text-xs text-neutral-400 dark:text-neutral-600 bg-neutral-50 dark:bg-neutral-900
                        border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-4">
          <span className="font-semibold text-neutral-500 dark:text-neutral-500">
            Full two-way calendar sync:
          </span>{' '}
          Connect Google Calendar API or Calendly below to automatically block the client's calendar and send reminders.
          <br />
          <a
            href="https://developers.google.com/calendar/api/guides/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:underline"
          >
            Google Calendar API docs →
          </a>
        </div>
      </div>
    </section>
  );
}
