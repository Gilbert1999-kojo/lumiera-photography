import { google } from 'googleapis';
import nodemailer from 'nodemailer';

/* ─── Helpers ────────────────────────────────────────────── */
function buildICS({ title, startISO, endISO, description, clientEmail }) {
  const fmt = (iso) => iso.replace(/[-:.]/g, '').slice(0, 15) + 'Z';
  const start = new Date(startISO);
  const end   = new Date(endISO);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'PRODID:-//Lumiera Studios//Booking//EN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@lumierastudios`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    'ORGANIZER;CN=Lumiera Studios:mailto:Lumierastudios@gmail.com',
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=Lumiera Studios:mailto:Lumierastudios@gmail.com`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=${clientEmail}:mailto:${clientEmail}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/* ─── Main handler ───────────────────────────────────────── */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  const { service, date, time, name, email, phone, notes, duration } = req.body ?? {};

  if (!service || !date || !time || !name || !email) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  const [h, m]    = time.split(':').map(Number);
  const [y, mo, d] = date.split('-').map(Number);
  const startDate  = new Date(Date.UTC(y, mo - 1, d, h, m));
  const endDate    = new Date(startDate.getTime() + (duration ?? 120) * 60_000);

  const eventTitle = `${service} — ${name}`;
  const eventDesc  = [
    `Client: ${name}`,
    `Email:  ${email}`,
    phone  ? `Phone:  ${phone}`  : null,
    notes  ? `Notes:  ${notes}`  : null,
  ].filter(Boolean).join('\n');

  const errors = [];

  /* ── 1. Google Calendar ─────────────────────────────────── */
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? '{}');
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID ?? 'primary',
      requestBody: {
        summary:     eventTitle,
        description: eventDesc,
        start: { dateTime: startDate.toISOString() },
        end:   { dateTime: endDate.toISOString()   },
        attendees: [
          { email: 'Lumierastudios@gmail.com', displayName: 'Lumiera Studios' },
          { email },
        ],
        sendUpdates: 'all',
      },
    });
  } catch (err) {
    console.error('[Google Calendar]', err.message);
    errors.push({ service: 'google', message: err.message });
  }

  /* ── 2. Apple Calendar via email (.ics) ─────────────────── */
  try {
    const icsContent = buildICS({
      title:       eventTitle,
      startISO:    startDate.toISOString(),
      endISO:      endDate.toISOString(),
      description: eventDesc,
      clientEmail: email,
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'Lumierastudios@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from:    '"Lumiera Studios" <Lumierastudios@gmail.com>',
      to:      'Lumierastudios@gmail.com',
      subject: `📅 New Booking: ${eventTitle}`,
      text: [
        `New booking received!`,
        '',
        eventDesc,
        '',
        `Date:  ${startDate.toDateString()}`,
        `Time:  ${time}`,
        '',
        'Open the attached .ics file to add this to Apple Calendar.',
      ].join('\n'),
      attachments: [{
        filename:    'lumiera-booking.ics',
        content:     icsContent,
        contentType: 'text/calendar; method=REQUEST',
      }],
    });
  } catch (err) {
    console.error('[Apple Calendar / Email]', err.message);
    errors.push({ service: 'apple', message: err.message });
  }

  /* ── Response ───────────────────────────────────────────── */
  return res.status(200).json({
    success: true,
    errors:  errors.length ? errors : undefined,
  });
}
