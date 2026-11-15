/**
 * ─────────────────────────────────────────────────────────────
 *  All wedding details live in this one file.
 *
 *  Leave a field as an empty string ('') until it's decided.
 *  Empty fields show "To be announced" on the site, so nothing
 *  is ever made up. Fill them in, commit, and Vercel redeploys.
 * ─────────────────────────────────────────────────────────────
 */

export const wedding = {
  couple: {
    partnerOne: 'Gabirel Horknox',
    partnerTwo: 'Jo Jofell',
    /** Used for the signature in the footer. */
    signature: 'Gabirel & Jo',
  },

  ceremony: {
    /** As you'd like it written, e.g. 'Saturday, 14 February 2027'. */
    date: '',
    /** e.g. '8:00 PM' */
    time: '',
    /** e.g. 'EST (UTC−5)' or 'Server time (UTC)' */
    timezone: '',
    /**
     * Optional. The exact start as an ISO date-time WITH its UTC offset,
     * e.g. '2027-02-14T20:00:00-05:00'. When set, guests also see the
     * start time converted to their own time zone.
     */
    startsAt: '',
    /** e.g. 'Aether', 'Light', 'Mana' */
    dataCenter: '',
    /** e.g. 'Gilgamesh' */
    world: '',
    /** Where guests should gather, e.g. a venue or housing ward. */
    venue: '',
    /** Optional extra line under the venue, e.g. 'Please arrive 15 minutes early.' */
    venueNote: '',
  },

  rsvp: {
    /**
     * Link to an RSVP form you've made elsewhere (Google Forms, Tally, etc.).
     * Leave empty to hide the RSVP button.
     */
    url: '',
    /** Optional, e.g. 'Kindly reply by 1 February 2027'. */
    note: '',
    buttonLabel: 'Reply to the invitation',
  },

  site: {
    /**
     * Your public address, e.g. 'https://gabirel-and-jo.vercel.app'.
     * Used for social previews. If empty, Vercel's production URL is used
     * automatically during deployment.
     */
    url: '',
    title: 'Gabirel & Jo · An Eternal Bond',
    description:
      'Join Gabirel Horknox & Jo Jofell for their Ceremony of Eternal Bonding in Eorzea.',
    /** Image shown when the link is shared (lives in /public). */
    shareImage: '/og-image.png',
  },

  images: {
    /** The couple's portrait on the ornament front (lives in /public). */
    portrait: '/images/couple-portrait.png',
    portraitAlt:
      "Gabirel and Jo's characters side by side: one with red hair, glasses and cat ears; the other with long dark hair and white flowers.",
  },

  /** Shown wherever a detail hasn't been filled in yet. */
  placeholder: 'To be announced',
} as const;

export type WeddingConfig = typeof wedding;
