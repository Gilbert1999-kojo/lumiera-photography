import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, CalendarCheck2, ExternalLink, Download } from 'lucide-react';
import { timeSlots } from '../data/servicesData';
import { formatTime, getGoogleCalendarUrl, generateIcsFile } from '../utils/calendarUtils';

const DAYS   = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July',    'August',   'September', 'October', 'November', 'December',
];

/**
 * BookingCalendar
 * Props:
 *   selectedDate  — ISO date string (YYYY-MM-DD) or ''
 *   selectedTime  — 24-h time string (HH:MM) or ''
 *   onSelectDate  — (isoDate: string) => void
 *   onSelectTime  — (time: string) => void
 *   eventDetails  — optional { title, duration, description } — when provided, enables
 *                   the inline "Confirm Booking" / calendar-sync panel below the time slots.
 */
export default function BookingCalendar({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  eventDetails = null,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [cursor, setCursor] = useState({
    year:  today.getFullYear(),
    month: today.getMonth(),
  });

  const { year: cy, month: cm } = cursor;

  const firstDay    = new Date(cy, cm, 1).getDay();
  const daysInMonth = new Date(cy, cm + 1, 0).getDate();

  const prevMonth = () =>
    setCursor(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );
  const nextMonth = () =>
    setCursor(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );

  const toISO      = (d) => `${cy}-${String(cm + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const isPast     = (d) => new Date(cy, cm, d) < today;
  const isSelected = (d) => selectedDate === toISO(d);
  const isToday    = (d) => new Date(cy, cm, d).getTime() === today.getTime();

  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  /* Build the event object used by calendarUtils */
  const calEvent =
    eventDetails && selectedDate && selectedTime
      ? {
          title:       eventDetails.title       ?? 'Studio Booking',
          date:        selectedDate,
          time:        selectedTime,
          duration:    eventDetails.duration    ?? 60,
          description: eventDetails.description ?? '',
        }
      : null;

  return (
    <div className="space-y-4">

      {/* ── Monthly grid ───────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-brand-dark-line bg-white dark:bg-brand-dark-surface">

        {/* Month navigation */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100 dark:border-brand-dark-line">
          <button
            onClick={prevMonth}
            aria-label="Previous month"
            className="p-2 rounded-lg hover:bg-brand-orange/10 text-neutral-400 dark:text-brand-dark-subtle hover:text-brand-orange transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-bold text-neutral-800 dark:text-white">
            {MONTHS[cm]} {cy}
          </span>
          <button
            onClick={nextMonth}
            aria-label="Next month"
            className="p-2 rounded-lg hover:bg-brand-orange/10 text-neutral-400 dark:text-brand-dark-subtle hover:text-brand-orange transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 px-4 pt-3 pb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[11px] font-bold uppercase tracking-widest text-neutral-400 dark:text-brand-dark-subtle">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-0.5 px-4 pb-4 pt-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`e${i}`} />;
            const past     = isPast(day);
            const selected = isSelected(day);
            const todayMark = isToday(day);

            return (
              <button
                key={day}
                disabled={past}
                onClick={() => !past && onSelectDate(toISO(day))}
                aria-label={`${MONTHS[cm]} ${day}, ${cy}`}
                aria-pressed={selected}
                className={`cal-day mx-auto flex items-center justify-center
                            w-9 h-9 rounded-full text-sm font-medium
                            transition-all duration-150
                            ${
                              past
                                ? 'text-neutral-300 dark:text-brand-dark-muted cursor-not-allowed'
                                : selected
                                ? 'bg-brand-orange text-white font-bold shadow-lg shadow-brand-orange/30 scale-105'
                                : todayMark
                                ? 'ring-2 ring-brand-orange text-brand-orange font-bold hover:bg-brand-orange/10'
                                : 'text-neutral-700 dark:text-neutral-200 hover:bg-brand-orange/10 hover:text-brand-orange cursor-pointer'
                            }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Time slot grid (shown after a date is picked) ─── */}
      {selectedDate && (
        <div className="rounded-2xl border border-neutral-200 dark:border-brand-dark-line bg-white dark:bg-brand-dark-surface p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} className="text-brand-orange shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-brand-dark-subtle">
              Available times —{' '}
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {timeSlots.map((t) => (
              <button
                key={t}
                onClick={() => onSelectTime(t)}
                className={`py-2.5 rounded-xl text-sm font-semibold text-center
                            transition-all duration-150
                  ${
                    selectedTime === t
                      ? 'bg-brand-orange text-white shadow-md shadow-brand-orange/25 scale-105'
                      : 'bg-neutral-50 dark:bg-brand-dark-elevated border border-neutral-200 dark:border-brand-dark-line text-neutral-600 dark:text-neutral-300 hover:border-brand-orange hover:text-brand-orange hover:bg-brand-orange/5'
                  }`}
              >
                {formatTime(t)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Confirm Booking / Calendar Sync panel ─────────── */}
      {/*   Shown when date + time are both selected AND       */}
      {/*   eventDetails were passed in (standalone usage).   */}
      {calEvent && (
        <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/5 dark:bg-brand-orange/10 p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarCheck2 size={16} className="text-brand-orange shrink-0" />
            <p className="text-sm font-bold text-neutral-800 dark:text-white">
              Confirm Booking &amp; Add to Calendar
            </p>
          </div>

          <p className="text-xs text-neutral-500 dark:text-brand-dark-subtle mb-4 leading-relaxed">
            <span className="font-semibold text-brand-orange">
              {new Date(calEvent.date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric',
              })}
            </span>
            {' at '}
            <span className="font-semibold text-brand-orange">{formatTime(calEvent.time)}</span>
            {' · '}
            {calEvent.duration} min
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            {/* Google Calendar deep-link */}
            <a
              href={getGoogleCalendarUrl(calEvent)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                         bg-brand-orange hover:bg-brand-orange-dark text-white
                         font-semibold text-sm shadow-md shadow-brand-orange/25
                         transition-all active:scale-95"
            >
              <ExternalLink size={14} />
              Add to Google Calendar
            </a>

            {/* ICS download — Apple Calendar / Outlook */}
            <button
              onClick={() => generateIcsFile(calEvent)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl
                         border-2 border-brand-orange text-brand-orange
                         hover:bg-brand-orange hover:text-white
                         font-semibold text-sm transition-all active:scale-95"
            >
              <Download size={14} />
              Download .ics (Apple / Outlook)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
