# Neo-Brutalist Pop Portfolio — Design Spec

**Date:** 2026-06-01
**Status:** Approved

## Purpose

A trendy, interactive single-page-plus portfolio website for a full-funnel digital
marketer. The primary goal is to help the marketer land a full-time job by impressing
recruiters and hiring managers. The visual mood is **bold & playful**, rendered in a
**Neo-Brutalist Pop** style: chunky type, hard drop-shadows, sticker-like chips, and
loud color blocks.

## Audience & Goals

- **Audience:** recruiters and hiring managers.
- **Primary goal:** convince them this marketer owns the full funnel (SEO, paid media,
  email, content, CRO) and gets measurable results.
- **Success criteria:** the site is memorable, skimmable in under a minute, shows real
  metrics, and offers a clear path to contact / download CV.

## Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Email:** Resend (via a Next.js route handler)
- **Theme:** next-themes (class strategy)
- **Hosting:** Vercel, deployed from `github.com/arvind-kr4/br-portfolio-site`

## Visual System

- **Palette:** yellow `#FFE14D`, purple `#7B61FF`, teal `#00E0B8`, red `#FF5A5F`,
  ink `#111`, plus white. Dark mode keeps these accents on a near-black canvas.
- **Borders & shadows:** 3-4px solid ink borders with offset hard shadows
  (e.g. `box-shadow: 4px 4px 0 #111`).
- **Type:** very heavy weights (800-900), tight negative letter-spacing on headings,
  highlighted words via colored inline blocks.
- **Shape language:** rounded rectangles (10-14px radius), sticker-like chips/badges.

## Routes

| Route          | Purpose                                                        |
| -------------- | -------------------------------------------------------------- |
| `/`            | Scrolling homepage with all sections + anchor nav              |
| `/work/[slug]` | Per-project case study (problem → approach → results)          |
| `/api/contact` | Route handler that validates and sends the contact form email  |

Unknown `[slug]` values call Next.js `notFound()` to render a 404.

## Homepage Sections (in order)

1. **Sticky nav** — `BR.` logo, anchor links (Work / About / Skills), red Contact
   button, and the dark-mode toggle.
2. **Hero** — large chunky headline with a highlighted word, one-line pitch, two
   buttons: "See my work" (scrolls to work) and "Download CV" (links to a PDF).
3. **Stats bar** — three metric cards (e.g. avg. organic traffic, blended ROAS,
   brands scaled) on a purple block.
4. **About** — avatar block + short bio.
5. **Selected work** — responsive grid of `ProjectCard`s (thumbnail, title, channels,
   result badge). Each links to its `/work/[slug]` case study.
6. **Toolkit / Skills** — chip row of channels and tools.
7. **Contact** — bold closing CTA on black with the working contact form.
8. **Footer** — small print, social links.

## Data Model (single source of truth)

`lib/projects.ts` exports a typed array. Each project:

```ts
type Project = {
  slug: string;          // url-safe id, used for /work/[slug]
  title: string;
  client: string;        // e.g. "D2C Skincare"
  category: string;      // e.g. "Paid + Email + CRO"
  channels: string[];    // tags shown on the card
  summary: string;       // one line for the card
  thumbLabel: string;    // text shown in the card thumbnail block
  problem: string;       // case study section
  approach: string[];    // bullet points
  results: { label: string; value: string }[]; // metric badges
  featured?: boolean;
};
```

`lib/profile.ts` exports name, role, bio, headline stats, skills, CV file path, email,
and social links. All placeholder content lives in these two files so real details can
be swapped in one place later.

## Components (`components/`)

`Nav`, `ThemeToggle`, `Hero`, `Stats`, `About`, `WorkGrid`, `ProjectCard`, `Skills`,
`ContactForm`, `Footer`, `CaseStudy`. Each has one clear purpose and reads its content
from the `lib/` data files via props.

## Interactions (Framer Motion)

- Sections reveal on scroll with a pop/slide (`whileInView`, run once).
- Cards lift and intensify their hard shadow on hover.
- Buttons shift their offset shadow on press for a tactile "stamp" feel.
- Respect `prefers-reduced-motion`.

## Dark Mode

`next-themes` with Tailwind `class` strategy. Toggle lives in the nav. The dark variant
swaps the canvas to near-black while keeping the bold accent colors and hard shadows
(shadows become a lighter ink so they stay visible).

## Contact Form

- Client component collects name, email, message.
- Client-side validation (required fields, email format) with inline errors.
- Submits `POST /api/contact`.
- The route handler re-validates server-side and sends the email via Resend using a
  `RESEND_API_KEY` environment variable.
- If `RESEND_API_KEY` is not set, the handler returns HTTP 503 with a friendly
  "contact not configured yet" message so the build and page never break. The form UI
  surfaces this as a clear (non-crashing) error state.
- UI shows clear loading / success / error states.

## Error Handling

- Contact: client + server validation; graceful handling of missing API key and Resend
  failures.
- Case study pages: unknown slug → `notFound()`.

## Testing

- Unit test for contact form validation logic.
- Unit test for the project lookup helper (known slug returns project, unknown returns
  undefined).

## Deployment

- Push to `github.com/arvind-kr4/br-portfolio-site`.
- Connect the repo to Vercel (zero-config Next.js build).
- Document the one-time `RESEND_API_KEY` setup in Vercel for the live contact form.

## Out of Scope (YAGNI)

- CMS / admin UI (content lives in typed TS files).
- Blog.
- Multi-language support.
- Authentication.
