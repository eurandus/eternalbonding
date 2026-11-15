import { wedding } from '../config/wedding';

const filled = (v: string) => v.trim().length > 0;

/** Joins the parts that have been filled in; falls back to the placeholder. */
export function show(...parts: string[]): { text: string; pending: boolean } {
  const done = parts.filter(filled);
  return done.length ? { text: done.join(' '), pending: false } : { text: wedding.placeholder, pending: true };
}

export function dateLine() {
  return show(wedding.ceremony.date);
}

export function timeLine() {
  return show(wedding.ceremony.time, wedding.ceremony.timezone);
}

export function realmLine() {
  const { dataCenter, world } = wedding.ceremony;
  if (filled(dataCenter) && filled(world)) return { text: `${world} · ${dataCenter} Data Center`, pending: false };
  if (filled(world)) return { text: world, pending: false };
  if (filled(dataCenter)) return { text: `${dataCenter} Data Center`, pending: false };
  return { text: wedding.placeholder, pending: true };
}

export function venueLine() {
  return show(wedding.ceremony.venue);
}

/** The start time in the guest's own time zone, or null if no exact start is configured. */
export function localStartTime(): string | null {
  const iso = wedding.ceremony.startsAt.trim();
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    if (import.meta.env.DEV) console.warn(`[wedding] ceremony.startsAt "${iso}" is not a valid ISO date-time.`);
    return null;
  }
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(d);
  } catch {
    return null;
  }
}

export function rsvpUrl(): string | null {
  const url = wedding.rsvp.url.trim();
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null;
  } catch {
    if (import.meta.env.DEV) console.warn(`[wedding] rsvp.url "${url}" is not a valid link, so the RSVP button is hidden.`);
    return null;
  }
}
