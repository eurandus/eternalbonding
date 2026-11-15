# An Eternal Bond — Gabirel & Jo

A digital wedding invitation for a Final Fantasy XIV Ceremony of Eternal Bonding. Guests can turn a hanging ceramic ornament with a drag or a swipe: the front is a keepsake, the back is the invitation.

Built with React 19, Vite and TypeScript. There's no backend, no API keys and no paid services. Fonts and images are all inside the project.

---

## Run it on your computer

You need [Node.js](https://nodejs.org) version 20.19 or newer (the "LTS" download is fine).

```bash
npm install      # once, downloads the dependencies
npm run dev      # opens a live preview at http://localhost:5173
npm run build    # checks the code and creates the finished site in /dist
npm run preview  # serves the finished /dist site locally
```

---

## Fill in the wedding details

Everything lives in **`src/config/wedding.ts`**. Open it in any text editor.

Each detail starts as an empty string `''`. While a field is empty, the site shows "To be announced", so nothing is ever made up. Type your details between the quotes:

```ts
ceremony: {
  date: 'Saturday, 14 February 2027',
  time: '8:00 PM',
  timezone: 'EST (UTC−5)',
  startsAt: '2027-02-14T20:00:00-05:00',
  dataCenter: 'Crystal',
  world: 'Balmung',
  venue: 'The Sanctum of the Twelve',
  venueNote: 'Please arrive 15 minutes early.',
},
```

(Those values are only an example of the format.)

| Field | What it does |
|---|---|
| `date`, `time`, `timezone` | Written exactly as you type them. |
| `startsAt` | Optional. The exact start with its UTC offset. When set, the invitation card also shows each guest the start time in **their own** time zone, which helps for a game with players everywhere. |
| `dataCenter`, `world` | Shown as "World · Data Center". |
| `venue`, `venueNote` | Where guests gather, plus an optional extra line. |
| `rsvp.url` | A link to an RSVP form you've made elsewhere (Google Forms, Tally, etc.). **While it's empty, the RSVP button is hidden.** |
| `rsvp.note` | Optional, e.g. "Kindly reply by 1 February 2027". |
| `site.url` | Your public address, used for link previews. Optional on Vercel (see below). |

The ornament's back has limited room, so very long values end with "…" there. The invitation card below the ornament always shows everything in full.

---

## Publish it: GitHub, then Vercel

### 1. Put the project on GitHub

**Easiest (no command line):**
1. Sign in at [github.com](https://github.com) and click **New repository**. Name it, for example `gabirel-and-jo`. Leave every "Add…" option unticked, then click **Create repository**.
2. On the next page, click **uploading an existing file**.
3. Drag in everything from this project folder **except** `node_modules` and `dist` (if they exist). Click **Commit changes**.

**With Git installed:**
```bash
git init
git add .
git commit -m "Wedding invitation"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/gabirel-and-jo.git
git push -u origin main
```

`.gitignore` already keeps `node_modules` and `dist` out.

### 2. Import it into Vercel

1. Sign in at [vercel.com](https://vercel.com) with your GitHub account.
2. Click **Add New… → Project**, find your repository and click **Import**.
3. Vercel detects **Vite** automatically (the included `vercel.json` sets it too). Leave the settings as they are and click **Deploy**.
4. After about a minute you get a public link such as `gabirel-and-jo.vercel.app`. That's your invitation.

You can rename the address under **Project → Settings → Domains**, or connect a domain you own there.

Link previews (the image shown when you paste the link into Discord, messaging apps, etc.) use Vercel's address automatically. If you add your own domain, put it in `site.url` so previews point there.

### 3. Update it later

Edit `src/config/wedding.ts` and save the change to GitHub, either with the pencil icon on github.com or with `git commit` and `git push`. **Vercel redeploys on its own** within a minute or two.

---

## Replace the pictures

All images are in `public/`.

| File | Used for |
|---|---|
| `public/images/couple-portrait.png` | The characters on the ornament front. |
| `public/og-image.png` | The preview image when the link is shared (1200 × 630). |
| `public/ornament-reference.png` | Your original reference, kept for comparison. The site doesn't display it. |
| `public/favicon.svg` | The browser tab icon. |

**Swapping the character portrait:** use a PNG with a **transparent background** for the best result, roughly 1000 × 620 px or larger with the two characters side by side. Either save it over `couple-portrait.png`, or save it with a new name and update `images.portrait` in the config. Also update `images.portraitAlt`, the description read aloud by screen readers.

To get a clean shot in game, `/gpose` with a plain background works well. Any free background-removal tool can then make it transparent. The bottom of the portrait is covered by the flower garland, so don't worry about framing below the shoulders.

**About the current portrait:** it was cut from the reference image, where the characters are only about 460 px wide, so it's slightly soft on high-resolution phones. The grey backdrop was removed and the old names and date were cropped away. A fresh in-game screenshot will look noticeably sharper.

**Changing the names or title text** on the ornament: the names come from the config file. The fixed phrases ("Eternally Bonded", "You Are Cordially Invited", and so on) are in `src/components/OrnamentFront.tsx` and `OrnamentBack.tsx`.

**Redoing the share image:** any 1200 × 630 image saved as `public/og-image.png` works. A screenshot of the ornament on a pink background with your names beside it is a good choice.

---

## How it's put together

```text
public/
  images/couple-portrait.png   characters, cut out of the reference
  og-image.png                 link-preview image
  ornament-reference.png       the original reference
  favicon.svg
src/
  config/wedding.ts            ← all wedding details
  components/
    HangingOrnament.tsx        drag / swipe / momentum / sway / controls
    OrnamentFront.tsx          front face artwork and text
    OrnamentBack.tsx           back face invitation
    Florals.tsx                SVG flowers, leaves, sprigs, sparkles
    InvitationCard.tsx         the details card below the ornament
    FloatingPetals.tsx         drifting petals and twinkles
  hooks/usePrefersReducedMotion.ts
  lib/details.ts               formatting, local time, RSVP link checks
  App.tsx                      page layout
  index.css                    all styles and colours
vite.config.ts                 also writes the page title and share tags from the config
vercel.json
```

**The ornament.** It's a real 3D object built with CSS `perspective`, `preserve-3d` and `rotateY`. It has separate front and back faces with `backface-visibility: hidden`, plus a stack of thin discs that forms the ceramic edge you see when it turns side-on. All movement runs in one `requestAnimationFrame` loop that writes transforms directly to the page. React only re-renders when the visible face changes, which keeps it smooth on older phones. The loop pauses while the ornament is scrolled off screen.

**Interaction**
- **Drag or swipe sideways** to turn it. A quick flick keeps spinning, then settles onto the nearest face.
- **Tap** the ornament, or use **Flip Ornament**, to turn it over. **Reset** brings the front back.
- **Keyboard:** Tab to the ornament, then use ← → to turn it, Enter or Space to flip, and Esc or Home to reset.
- **Vertical swipes still scroll the page** on phones (`touch-action: pan-y`).
- **Screen readers** only hear the face that's showing. A short announcement says which side is visible after it turns.

**Reduced motion.** When a guest's device asks for reduced motion, the idle sway, the opening swing, the falling petals and the spin momentum are all switched off. Flips happen instantly, and dragging still works.

**Colours** are defined once at the top of `src/index.css`. Rose is darkened where it's used for small text so it stays readable.

Framer Motion isn't used. A single small animation loop gave smoother, more physical results with less code.

---

## Troubleshooting

- **The RSVP button doesn't appear.** `rsvp.url` is empty or isn't a full link. It must start with `https://`.
- **The "in your time zone" line doesn't appear.** `startsAt` needs the format `YYYY-MM-DDTHH:MM:SS±HH:MM`, for example `2027-02-14T20:00:00-05:00`.
- **The link preview shows an old image.** Messaging apps cache previews. Discord and others refresh after a while, and Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/) can force a refresh.
- **The Vercel build fails.** Run `npm run build` locally. It reports the exact file and line, which is usually a missing quote or comma in `wedding.ts`.

---

*Final Fantasy XIV is a trademark of Square Enix. This is a personal, non-commercial fan invitation.*
