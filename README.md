# TopSpeech — Daily Lesson Prototype

> Built for the TopSpeech Health engineer assignment, May 2026.
> A working PWA for one day of speech-therapy practice (the R sound).

**Live demo:** _add Vercel URL after deploy_
**Source:** _this repo_

---

## Why this design

My cousin has difficulty speaking clearly, and I've watched them avoid words that
start with R since they were a kid. The hardest part of speech therapy isn't the
exercises — it's the daily courage to keep trying when you're already
self-conscious about how you sound. So this prototype is built to remove every
micro-moment of shame from the learning loop.

That principle, more than any single feature, is what I wanted to defend.

---

## What I kept from Duolingo

- A **short, daily loop** — 4 exercises, about 5 minutes
- A **visible progress bar** — segmented so the user always knows how many steps remain
- A **reward at the end** — XP and a practice-day count
- **Smooth animated transitions** — every state feels deliberate

## What I deliberately changed

- **No red "wrong" state.** Replaced with *Felt off / Almost / Nailed it* —
  the user rates themselves, never the other way around. *(See Innovation below.)*
- **No streak punishment.** Missing a day doesn't reset anything. The streak
  reframes as "practice days" — a positive count, never a thing you can lose.
- **No mascot.** No cartoon owl celebrating or guilting. The voice is a calm clinician.
- **No confetti.** The end screen is a slow exhale — a soft halo settling and a
  small XP number counting up. Quiet celebration suits a clinical product.
- **A breath anchor before lesson start.** Tense jaws make the R harder. This
  isn't decorative — it's borrowed from real speech-therapy session structure.

---

## The Innovation — Patient Self-Monitoring

After every production-task attempt, the user picks one of three buttons:
**Felt off · Almost · Nailed it.** The app never tells the user they were wrong.

This mirrors a core principle of speech-language pathology called *self-monitoring*:
therapy succeeds when the patient can hear their own errors **outside** the
therapy room. Duolingo's "the app judges you" model never builds this skill —
and a free in-browser PWA can't reliably grade phoneme accuracy on the R sound
anyway, *especially* for users whose R is the problem. So I designed around
that limitation, and the limitation became the feature. The user is the judge;
the app is the coach.

Card 4 (Self-Calibration Sentence) extends this further: after reading a full
sentence aloud, the user can tap any R-word that felt off — granular, per-word
data the system uses to shape tomorrow's lesson.

---

## What's in the prototype

| # | Card type | What it teaches | How it differs from Duolingo |
|---|---|---|---|
| 1 | Listen-and-Repeat | Hear and imitate the target word | Self-rating replaces app judgment |
| 2 | Minimal-pair word selection | Distinguish *rabbit* from *wabbit* — the classic R/W substitution that SLPs target | Wrong answer is sage-amber, never red; copy is a "listen again" nudge |
| 3 | Mirror Mode | Visual phonetic placement — where the tongue goes for R | Doesn't exist in Duolingo; borrowed directly from clinical SLP practice |
| 4 | Self-Calibration Sentence | Carry the sound into full speech | Per-word self-tagging — the innovation extended |

Plus a Start screen, a 5-second breath anchor, and an End screen with a
calm reward moment.

---

## Tech stack

| Tool | Why |
|---|---|
| **Vite + React** | Sub-second HMR; ideal for iterating on visual craft inside a 5-hour budget |
| **Tailwind CSS** | Utility-first design tokens; lets the visual system stay in one file (`tailwind.config.js`) |
| **Framer Motion** | Spring-physics transitions, `AnimatePresence` for card swaps, `prefers-reduced-motion` honored natively |
| **vite-plugin-pwa** | Generates manifest + service worker; installable on iOS Safari and Android Chrome |
| **Lucide React** | Lightweight, clean icons that match the calm aesthetic |
| **Vercel** | Auto-deploys on every `git push` |

Deliberately *not* used: TypeScript (saved type-friction time; would add for
production), automated tests (manual QA only for a 5-hour build), Next.js
(no SSR needed for a single-flow static PWA), real speech recognition (mocked
per the assignment, and discussed in the Innovation section above).

---

## Run it locally

```bash
npm install
npm run dev
# open http://localhost:5173
```

For the installable PWA: `npm run build && npm run preview`, then visit the
preview URL on a real phone and use "Add to Home Screen."

---

## Project structure

```
src/
├── App.jsx                  Phase router (start → breath → cards → end)
├── main.jsx                 Entry point
├── index.css                Tailwind layers + reduced-motion override
├── components/
│   ├── ProgressBar.jsx      Segmented, spring-filled
│   ├── CardWrapper.jsx      Shared slide-up envelope
│   ├── SelfRating.jsx       THE INNOVATION (3-button self-rate)
│   ├── StartScreen.jsx      Calm, low-pressure first impression
│   ├── BreathAnchor.jsx     5-second pre-lesson regulation
│   └── EndScreen.jsx        Slow-exhale completion
├── cards/
│   ├── ListenAndRepeat.jsx  Card 1
│   ├── WordSelection.jsx    Card 2 (only card with app feedback, never red)
│   ├── MirrorMode.jsx       Card 3 (SVG tongue placement)
│   └── SelfCalibration.jsx  Card 4 (per-word self-tagging)
└── lib/
    ├── content.js           Static lesson data
    └── lessonState.jsx      Reducer-based state machine
```

---

## What I'd do with more time

- **Real audio with waveform comparison** — let the user record themselves and
  visually compare their R waveform with the target. (Web Audio + AudioContext.)
- **Adaptive difficulty** — if the user self-rates "felt off" twice in a row,
  the next card softens (shorter word, more visual cues).
- **Voice journaling** — a 10-second daily recording stored locally so the
  user can hear their own progress week over week. Compounds metacognition.
- **A real PNG icon set** — SVG-only icon works on modern browsers, but
  iOS Safari pre-16.4 prefers PNG.
- **A clinician dashboard** — the per-word self-rating data is structured;
  a real SLP could review it asynchronously to shape sessions.

---

## How I used Claude Code

I used Claude as a *design partner first, typing tool second.* The first 30
minutes were spent aligning on strategy — that the assignment's hidden brief
was "warmth and clinical credibility," that the user is an adult with a real
vulnerability, and that the innovation should be rooted in actual SLP
practice. Only then did any code get written. The scaffolding (Vite config,
Tailwind tokens, state machine) was AI-fast; the design judgment (calm
palette, no red, self-monitoring framing, cousin-as-anchor) was the human
work that made it worth shipping.

---

Built with care, in five hours.
