/**
 * formatTime — Convert 24-hour "HH:MM" to 12-hour "h:MM AM/PM"
 */
export function formatTime(time24) {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${period}`;
}

/**
 * getGoogleCalendarUrl(event)
 * Returns a Google Calendar "add event" deep-link URL.
 *
 * @param {{ title: string, date: string, time: string, duration: number, description: string }} event
 * @returns {string}
 */
export function getGoogleCalendarUrl({ title, date, time, duration, description }) {
  const [y, mo, d] = date.split('-').map(Number);
  const [h, m]     = time.split(':').map(Number);
  const start      = new Date(y, mo - 1, d, h, m);
  const end        = new Date(start.getTime() + duration * 60_000);

  const fmt = (dt) => dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const params = new URLSearchParams({
    action:  'TEMPLATE',
    text:    title,
    dates:   `${fmt(start)}/${fmt(end)}`,
    details: description,
    add:     'Lumierastudios@gmail.com',
  });

  return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`;
}

/**
 * generateIcsFile(event)
 * Dynamically generates and triggers the download of an .ics file.
 * Compatible with Apple Calendar, Google Calendar import, and Outlook.
 *
 * @param {{ title: string, date: string, time: string, duration: number, description: string, location?: string }} event
 */
export function generateIcsFile({ title, date, time, duration, description, location = '' }) {
  const [y, mo, d] = date.split('-').map(Number);
  const [h, m]     = time.split(':').map(Number);
  const start      = new Date(y, mo - 1, d, h, m);
  const end        = new Date(start.getTime() + duration * 60_000);

  const fmtICS = (dt) => dt.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'PRODID:-//Studio Portfolio//Booking//EN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@lumierastudios`,
    `DTSTAMP:${fmtICS(new Date())}`,
    `DTSTART:${fmtICS(start)}`,
    `DTEND:${fmtICS(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'ORGANIZER;CN=Lumiera Studios:mailto:Lumierastudios@gmail.com',
    'ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=Lumiera Studios:mailto:Lumierastudios@gmail.com',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  Object.assign(document.createElement('a'), { href: url, download: 'booking.ics' }).click();
  URL.revokeObjectURL(url);
}

