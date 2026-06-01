# Neo-Brutalist Pop Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a bold, interactive Neo-Brutalist Pop portfolio for a full-funnel digital marketer, hosted on Vercel from `github.com/arvind-kr4/br-portfolio-site`.

**Architecture:** A Next.js (App Router) site. All content lives in two typed data files (`src/lib/profile.ts`, `src/lib/projects.ts`) that feed both the homepage and per-project case study pages. Presentational components in `src/components/` read data via props. Dark mode via `next-themes` (class strategy). Scroll/hover animation via Framer Motion. A working contact form posts to a route handler that emails via Resend, degrading gracefully when no API key is set.

**Tech Stack:** Next.js (App Router, TypeScript), Tailwind CSS v4, Framer Motion, next-themes, Resend, Vitest + Testing Library.

---

## File Structure

```
src/
  app/
    layout.tsx                 # root layout: fonts, ThemeProvider, <html suppressHydrationWarning>
    page.tsx                   # homepage: assembles all sections
    globals.css                # Tailwind import, @theme tokens, @custom-variant dark, base styles
    work/[slug]/page.tsx       # case study page (generateStaticParams + notFound)
    api/contact/route.ts       # POST handler -> Resend (graceful 503 if unconfigured)
  components/
    theme-provider.tsx         # next-themes wrapper (client)
    theme-toggle.tsx           # dark/light toggle button (client)
    reveal.tsx                 # Framer Motion scroll-reveal wrapper (client)
    nav.tsx                    # sticky top nav
    hero.tsx                   # hero section
    stats.tsx                  # stats bar
    about.tsx                  # about section
    project-card.tsx           # single project card
    work-grid.tsx              # grid of project cards
    skills.tsx                 # toolkit chips
    contact-form.tsx           # contact form (client)
    contact.tsx                # contact section wrapper
    footer.tsx                 # footer
    ui/brutal.tsx              # shared brutalist primitives: Button, Badge, Label, Card
  lib/
    profile.ts                 # name, bio, stats, skills, socials, cv path
    projects.ts                # Project[] + getProject(slug) + getAllSlugs()
    validate-contact.ts        # pure validation for the contact payload
tests/
  projects.test.ts
  validate-contact.test.ts
```

---

### Task 0: Scaffold the Next.js app and connect the repo

**Files:**
- Create: entire Next.js scaffold under repo root (uses `src/` dir)

- [ ] **Step 1: Scaffold into the current repo**

The repo already exists with `.git`, `.gitignore`, and `docs/`. Scaffold in place. Run from the repo root:

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
```

When prompted that the directory is not empty / to overwrite, choose to proceed (it keeps `.git`, `docs/`, `.gitignore`). If it refuses, scaffold into a temp dir and copy:

```bash
npx create-next-app@latest /tmp/brsite --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
rsync -a --exclude='.git' /tmp/brsite/ ./
```

- [ ] **Step 2: Install runtime + test dependencies**

```bash
npm install framer-motion next-themes resend
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Add test script and Vitest config**

Add to `package.json` `"scripts"`: `"test": "vitest run"`.

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

- [ ] **Step 4: Verify the app builds**

Run: `npm run build`
Expected: build completes with no errors (default starter page).

- [ ] **Step 5: Connect remote and push**

```bash
git remote get-url origin 2>/dev/null || git remote add origin https://github.com/arvind-kr4/br-portfolio-site.git
git add -A
git commit -m "chore: scaffold Next.js app with Tailwind, Framer Motion, next-themes, Vitest"
git branch -M main
git push -u origin main
```
Expected: push succeeds to `main`.

---

### Task 1: Design tokens, fonts, and global styles

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace `src/app/globals.css`**

```css
@import "tailwindcss";

/* next-themes uses class="dark" on <html>; wire Tailwind v4 dark variant to it */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-ink: #111111;
  --color-paper: #ffffff;
  --color-pop-yellow: #ffe14d;
  --color-pop-purple: #7b61ff;
  --color-pop-teal: #00e0b8;
  --color-pop-red: #ff5a5f;

  --font-display: var(--font-display), system-ui, sans-serif;
  --font-sans: var(--font-sans), system-ui, sans-serif;
}

:root {
  --bg: #ffe14d;
  --surface: #ffffff;
  --fg: #111111;
  --shadow-color: #111111;
}

.dark {
  --bg: #0f0f12;
  --surface: #1a1a20;
  --fg: #f5f5f0;
  --shadow-color: #f5f5f0;
}

body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* Brutalist hard shadow utilities driven by the theme shadow color */
@utility shadow-brutal {
  box-shadow: 4px 4px 0 0 var(--shadow-color);
}
@utility shadow-brutal-lg {
  box-shadow: 6px 6px 0 0 var(--shadow-color);
}
@utility border-brutal {
  border: 3px solid var(--shadow-color);
}
```

- [ ] **Step 2: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { profile } from "@/lib/profile";
import "./globals.css";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});
const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${sans.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit** (layout imports `@/components/theme-provider` and `@/lib/profile`, created in Tasks 2-3; build is deferred until after Task 3)

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: brutalist design tokens, fonts, and dark variant"
```

---

### Task 2: Data layer (profile, projects, lookup) + test

**Files:**
- Create: `src/lib/profile.ts`
- Create: `src/lib/projects.ts`
- Test: `tests/projects.test.ts`

- [ ] **Step 1: Write the failing test** — `tests/projects.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { getProject, getAllSlugs, projects } from "@/lib/projects";

describe("projects data", () => {
  it("returns a project for a known slug", () => {
    const first = projects[0];
    expect(getProject(first.slug)).toEqual(first);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
  });

  it("exposes every slug via getAllSlugs", () => {
    expect(getAllSlugs().sort()).toEqual(projects.map((p) => p.slug).sort());
  });

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- projects`
Expected: FAIL — cannot resolve `@/lib/projects`.

- [ ] **Step 3: Create `src/lib/projects.ts`**

```ts
export type Result = { label: string; value: string };

export type Project = {
  slug: string;
  title: string;
  client: string;
  category: string;
  channels: string[];
  summary: string;
  thumbLabel: string;
  accent: "yellow" | "purple" | "teal" | "red";
  problem: string;
  approach: string[];
  results: Result[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "d2c-skincare-launch",
    title: "Launch → $1M in 9 months",
    client: "D2C Skincare Brand",
    category: "Paid + Email + CRO",
    channels: ["Meta Ads", "Klaviyo", "CRO"],
    summary: "Took a pre-revenue skincare brand from launch to $1M ARR.",
    thumbLabel: "D2C SKINCARE",
    accent: "yellow",
    problem:
      "A founder-led skincare brand had a great product but no acquisition engine and a leaky checkout funnel.",
    approach: [
      "Built a Meta Ads prospecting + retargeting structure around UGC creative.",
      "Set up Klaviyo flows: welcome, abandoned cart, post-purchase, win-back.",
      "Ran CRO experiments on the PDP and checkout to lift conversion rate.",
    ],
    results: [
      { label: "Revenue", value: "+312%" },
      { label: "ROAS", value: "4.6x" },
      { label: "Email rev. share", value: "31%" },
    ],
    featured: true,
  },
  {
    slug: "b2b-saas-organic-engine",
    title: "An organic growth engine",
    client: "B2B SaaS Startup",
    category: "SEO + Content",
    channels: ["SEO", "Content", "GA4"],
    summary: "Built an SEO + content engine that 3x'd inbound demo signups.",
    thumbLabel: "B2B SAAS",
    accent: "teal",
    problem:
      "A Series A SaaS depended entirely on paid demos with rising CAC and no organic pipeline.",
    approach: [
      "Ran keyword + intent research to map a bottom-of-funnel content cluster.",
      "Shipped 24 comparison and use-case articles with on-page SEO.",
      "Instrumented GA4 + attribution to tie content to demo signups.",
    ],
    results: [
      { label: "Demo signups", value: "3x" },
      { label: "Organic traffic", value: "+212%" },
      { label: "CAC", value: "-29%" },
    ],
    featured: true,
  },
  {
    slug: "mobile-app-growth",
    title: "Profitable app growth",
    client: "Consumer Mobile App",
    category: "ASO + Paid Social",
    channels: ["ASO", "TikTok Ads", "Meta Ads"],
    summary: "Scaled installs while cutting cost per acquisition by 38%.",
    thumbLabel: "MOBILE APP",
    accent: "purple",
    problem:
      "A consumer app was buying expensive, low-retention installs with no creative testing system.",
    approach: [
      "Optimized App Store listing (ASO) for the highest-intent keywords.",
      "Built a weekly creative testing sprint across TikTok and Meta.",
      "Shifted budget to retained-user cohorts using post-install events.",
    ],
    results: [
      { label: "CAC", value: "-38%" },
      { label: "Installs", value: "+140%" },
      { label: "D7 retention", value: "+22%" },
    ],
  },
  {
    slug: "local-retail-rebrand",
    title: "Rebrand + local ads",
    client: "Local Retail Chain",
    category: "Brand + Meta Ads",
    channels: ["Brand", "Meta Ads", "Local SEO"],
    summary: "Repositioned a 4-store chain and drove a 5.2x return on ad spend.",
    thumbLabel: "LOCAL RETAIL",
    accent: "red",
    problem:
      "A regional retailer had an outdated brand and flat foot traffic across four stores.",
    approach: [
      "Led a brand refresh: voice, visual identity, and offer architecture.",
      "Launched geo-targeted Meta campaigns tied to in-store promotions.",
      "Cleaned up Google Business Profiles and local SEO for each location.",
    ],
    results: [
      { label: "ROAS", value: "5.2x" },
      { label: "Foot traffic", value: "+47%" },
      { label: "Avg. order value", value: "+18%" },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return projects.map((p) => p.slug);
}
```

- [ ] **Step 4: Create `src/lib/profile.ts`**

```ts
export const profile = {
  name: "Aravind R.",
  initials: "BR.",
  role: "Full-Funnel Digital Marketer",
  tagline:
    "SEO, paid media, email & content — one marketer who runs the whole funnel and obsesses over the numbers.",
  email: "hello@example.com",
  cvPath: "/cv.pdf",
  bio: "5+ years running growth across the full funnel. I pair sharp creative instincts with relentless analytics — equally at home in Figma, GA4, or a spreadsheet at 1am. I've helped D2C, B2B SaaS, mobile, and local brands turn spend into measurable revenue.",
  heroStats: [
    { value: "+212%", label: "avg. organic traffic" },
    { value: "4.1x", label: "blended ROAS" },
    { value: "9", label: "brands scaled" },
  ],
  skills: [
    "SEO",
    "Google Ads",
    "Meta Ads",
    "TikTok Ads",
    "Email / Klaviyo",
    "GA4",
    "Content Strategy",
    "CRO",
    "Landing Pages",
    "Figma",
    "Attribution",
    "Lifecycle",
  ],
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "X / Twitter", href: "https://x.com" },
    { label: "Email", href: "mailto:hello@example.com" },
  ],
} as const;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- projects`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/projects.ts src/lib/profile.ts tests/projects.test.ts
git commit -m "feat: typed project + profile data with lookup helpers and tests"
```

---

### Task 3: Theme provider, toggle, and shared brutalist UI primitives

**Files:**
- Create: `src/components/theme-provider.tsx`
- Create: `src/components/theme-toggle.tsx`
- Create: `src/components/ui/brutal.tsx`

- [ ] **Step 1: Create `src/components/theme-provider.tsx`**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 2: Create `src/components/ui/brutal.tsx`** (shared primitives, reused everywhere — keeps the brutalist styling DRY)

```tsx
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const accentBg: Record<string, string> = {
  yellow: "bg-pop-yellow",
  purple: "bg-pop-purple text-paper",
  teal: "bg-pop-teal",
  red: "bg-pop-red text-paper",
  ink: "bg-ink text-paper",
  paper: "bg-paper text-ink",
};

export function Label({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-md bg-ink px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-pop-yellow">
      {children}
    </span>
  );
}

export function Badge({
  children,
  accent = "purple",
}: {
  children: ReactNode;
  accent?: keyof typeof accentBg;
}) {
  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-extrabold ${accentBg[accent]}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-brutal shadow-brutal rounded-xl bg-paper text-ink ${className}`}
    >
      {children}
    </div>
  );
}

type ButtonProps = {
  children: ReactNode;
  accent?: keyof typeof accentBg;
} & (
  | ({ href: string } & ComponentProps<typeof Link>)
  | ({ href?: undefined } & ComponentProps<"button">)
);

export function BrutalButton({ children, accent = "teal", ...props }: ButtonProps) {
  const cls = `border-brutal shadow-brutal inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-extrabold transition-transform duration-100 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none ${accentBg[accent]}`;
  if ("href" in props && props.href) {
    return (
      <Link className={cls} {...(props as ComponentProps<typeof Link>)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...(props as ComponentProps<"button">)}>
      {children}
    </button>
  );
}
```

- [ ] **Step 3: Create `src/components/theme-toggle.tsx`** (avoids hydration mismatch by rendering only after mount)

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  return (
    <button
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="border-brutal shadow-brutal flex h-9 w-9 items-center justify-center rounded-lg bg-paper text-ink transition-transform duration-100 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
    >
      {mounted ? (isDark ? "☀" : "☾") : "☾"}
    </button>
  );
}
```

- [ ] **Step 4: Build to verify the layout + theme wiring compiles**

Run: `npm run build`
Expected: build succeeds (layout from Task 1 now resolves its imports).

- [ ] **Step 5: Commit**

```bash
git add src/components/theme-provider.tsx src/components/theme-toggle.tsx src/components/ui/brutal.tsx
git commit -m "feat: theme provider, dark-mode toggle, and brutalist UI primitives"
```

---

### Task 4: Scroll-reveal animation wrapper

**Files:**
- Create: `src/components/reveal.tsx`

- [ ] **Step 1: Create `src/components/reveal.tsx`** (one reusable Framer Motion wrapper; respects reduced motion)

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/reveal.tsx
git commit -m "feat: reusable Framer Motion scroll-reveal wrapper"
```

---

### Task 5: Nav

**Files:**
- Create: `src/components/nav.tsx`

- [ ] **Step 1: Create `src/components/nav.tsx`**

```tsx
import Link from "next/link";
import { profile } from "@/lib/profile";
import { ThemeToggle } from "@/components/theme-toggle";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-[var(--shadow-color)] bg-ink text-paper">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="font-display text-lg">
          {profile.initials}
        </Link>
        <div className="flex items-center gap-3 text-xs font-bold sm:gap-5 sm:text-sm">
          <Link href="/#work" className="hover:text-pop-yellow">Work</Link>
          <Link href="/#about" className="hover:text-pop-yellow">About</Link>
          <Link href="/#skills" className="hover:text-pop-yellow">Skills</Link>
          <Link
            href="/#contact"
            className="rounded-md bg-pop-red px-3 py-1.5 text-paper"
          >
            Contact ↗
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/nav.tsx
git commit -m "feat: sticky brutalist nav with anchor links and theme toggle"
```

---

### Task 6: Hero

**Files:**
- Create: `src/components/hero.tsx`

- [ ] **Step 1: Create `src/components/hero.tsx`**

```tsx
import { profile } from "@/lib/profile";
import { Label, BrutalButton } from "@/components/ui/brutal";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section className="bg-pop-yellow text-ink">
      <div className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
        <Reveal>
          <Label>{profile.role}</Label>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="font-display mt-4 text-5xl leading-[0.95] tracking-tight sm:text-7xl">
            I help brands turn clicks into{" "}
            <span className="bg-pop-purple px-2 text-paper">customers.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-base leading-relaxed sm:text-lg">
            {profile.tagline}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap gap-3">
            <BrutalButton href="/#work" accent="teal">See my work →</BrutalButton>
            <BrutalButton href={profile.cvPath} accent="paper">Download CV</BrutalButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/hero.tsx
git commit -m "feat: hero section"
```

---

### Task 7: Stats bar

**Files:**
- Create: `src/components/stats.tsx`

- [ ] **Step 1: Create `src/components/stats.tsx`**

```tsx
import { profile } from "@/lib/profile";
import { Card } from "@/components/ui/brutal";
import { Reveal } from "@/components/reveal";

export function Stats() {
  return (
    <section className="border-y-[3px] border-[var(--shadow-color)] bg-pop-purple">
      <div className="mx-auto grid max-w-5xl gap-4 px-5 py-12 sm:grid-cols-3">
        {profile.heroStats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <Card className="px-5 py-6">
              <div className="font-display text-4xl">{s.value}</div>
              <div className="mt-1 text-sm font-semibold">{s.label}</div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/stats.tsx
git commit -m "feat: stats bar"
```

---

### Task 8: About

**Files:**
- Create: `src/components/about.tsx`

- [ ] **Step 1: Create `src/components/about.tsx`**

```tsx
import { profile } from "@/lib/profile";
import { Label } from "@/components/ui/brutal";
import { Reveal } from "@/components/reveal";

export function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-paper text-ink">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-20 sm:flex-row sm:items-center">
        <Reveal>
          <div className="border-brutal shadow-brutal-lg h-40 w-40 flex-none rounded-2xl bg-pop-red" />
        </Reveal>
        <Reveal delay={0.1} className="flex-1">
          <Label>About</Label>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl">
            {profile.name}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed">{profile.bio}</p>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/about.tsx
git commit -m "feat: about section"
```

---

### Task 9: Project card + work grid

**Files:**
- Create: `src/components/project-card.tsx`
- Create: `src/components/work-grid.tsx`

- [ ] **Step 1: Create `src/components/project-card.tsx`**

```tsx
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { Badge } from "@/components/ui/brutal";

const thumbBg: Record<Project["accent"], string> = {
  yellow: "bg-pop-yellow",
  purple: "bg-pop-purple text-paper",
  teal: "bg-pop-teal",
  red: "bg-pop-red text-paper",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="border-brutal shadow-brutal group block overflow-hidden rounded-xl bg-paper text-ink transition-transform duration-100 hover:-translate-x-0.5 hover:-translate-y-1"
    >
      <div
        className={`font-display flex h-28 items-center justify-center border-b-[3px] border-[var(--shadow-color)] text-sm tracking-wide ${thumbBg[project.accent]}`}
      >
        {project.thumbLabel}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg">{project.title}</h3>
        <p className="mt-1 text-sm text-ink/70">{project.category}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.results.slice(0, 1).map((r) => (
            <Badge key={r.label} accent="purple">
              {r.value} {r.label}
            </Badge>
          ))}
          <span className="text-sm font-bold group-hover:underline">View case study →</span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create `src/components/work-grid.tsx`**

```tsx
import { projects } from "@/lib/projects";
import { Label } from "@/components/ui/brutal";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "@/components/project-card";

export function WorkGrid() {
  return (
    <section id="work" className="scroll-mt-20 border-t-[3px] border-[var(--shadow-color)] bg-pop-teal">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <Reveal>
          <Label>Selected work</Label>
          <h2 className="font-display mt-3 text-3xl text-ink sm:text-4xl">
            Proof, not promises.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/project-card.tsx src/components/work-grid.tsx
git commit -m "feat: project card and work grid"
```

---

### Task 10: Skills

**Files:**
- Create: `src/components/skills.tsx`

- [ ] **Step 1: Create `src/components/skills.tsx`**

```tsx
import { profile } from "@/lib/profile";
import { Label } from "@/components/ui/brutal";
import { Reveal } from "@/components/reveal";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-20 border-t-[3px] border-[var(--shadow-color)] bg-pop-red text-paper">
      <div className="mx-auto max-w-5xl px-5 py-20">
        <Reveal>
          <Label>Toolkit</Label>
          <h2 className="font-display mt-3 text-3xl sm:text-4xl">
            The full-funnel stack.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-3">
            {profile.skills.map((s) => (
              <span
                key={s}
                className="border-brutal shadow-brutal rounded-lg bg-paper px-3 py-2 text-sm font-extrabold text-ink"
              >
                {s}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/skills.tsx
git commit -m "feat: skills/toolkit section"
```

---

### Task 11: Contact validation (pure) + test

**Files:**
- Create: `src/lib/validate-contact.ts`
- Test: `tests/validate-contact.test.ts`

- [ ] **Step 1: Write the failing test** — `tests/validate-contact.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { validateContact } from "@/lib/validate-contact";

describe("validateContact", () => {
  it("accepts a valid payload", () => {
    const r = validateContact({ name: "Jo", email: "jo@x.com", message: "Hello there" });
    expect(r.ok).toBe(true);
  });

  it("rejects a missing name", () => {
    const r = validateContact({ name: "", email: "jo@x.com", message: "Hello there" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.name).toBeDefined();
  });

  it("rejects a bad email", () => {
    const r = validateContact({ name: "Jo", email: "nope", message: "Hello there" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.email).toBeDefined();
  });

  it("rejects a too-short message", () => {
    const r = validateContact({ name: "Jo", email: "jo@x.com", message: "hi" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.message).toBeDefined();
  });

  it("rejects non-object input", () => {
    const r = validateContact(null);
    expect(r.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- validate-contact`
Expected: FAIL — cannot resolve `@/lib/validate-contact`.

- [ ] **Step 3: Create `src/lib/validate-contact.ts`**

```ts
export type ContactInput = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;
export type ValidateResult =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactErrors };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: unknown): ValidateResult {
  const errors: ContactErrors = {};
  const v = (input ?? {}) as Record<string, unknown>;
  const name = typeof v.name === "string" ? v.name.trim() : "";
  const email = typeof v.email === "string" ? v.email.trim() : "";
  const message = typeof v.message === "string" ? v.message.trim() : "";

  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL.test(email)) errors.email = "Please enter a valid email.";
  if (message.length < 10) errors.message = "Message must be at least 10 characters.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, message } };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- validate-contact`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/validate-contact.ts tests/validate-contact.test.ts
git commit -m "feat: contact payload validation with tests"
```

---

### Task 12: Contact API route (Resend, graceful 503)

**Files:**
- Create: `src/app/api/contact/route.ts`
- Create: `.env.local.example`

- [ ] **Step 1: Create `src/app/api/contact/route.ts`**

```ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateContact } from "@/lib/validate-contact";
import { profile } from "@/lib/profile";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Contact form isn't configured yet. Email me directly for now." },
      { status: 503 },
    );
  }

  const { name, email, message } = result.data;
  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: profile.email,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again." },
      { status: 502 },
    );
  }
}
```

- [ ] **Step 2: Create `.env.local.example`**

```
# Get a key at https://resend.com (free tier). Add this in Vercel project settings too.
RESEND_API_KEY=
```

- [ ] **Step 3: Build to verify the route compiles**

Run: `npm run build`
Expected: build succeeds; `/api/contact` listed as a route.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/contact/route.ts .env.local.example
git commit -m "feat: contact API route with Resend and graceful fallback"
```

---

### Task 13: Contact form + contact section

**Files:**
- Create: `src/components/contact-form.tsx`
- Create: `src/components/contact.tsx`

- [ ] **Step 1: Create `src/components/contact-form.tsx`** (client component with loading/success/error states)

```tsx
"use client";

import { useState } from "react";
import type { ContactErrors } from "@/lib/validate-contact";

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    setMessage("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      message: String(form.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        return;
      }
      if (res.status === 422 && data.errors) setErrors(data.errors);
      setStatus("error");
      setMessage(data.error ?? "Please fix the highlighted fields.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const field =
    "border-brutal w-full rounded-lg bg-paper px-3 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:shadow-brutal";

  if (status === "success") {
    return (
      <div className="border-brutal shadow-brutal rounded-xl bg-pop-teal p-6 text-ink">
        <p className="font-display text-xl">Message sent! 🎉</p>
        <p className="mt-1 text-sm font-semibold">I&apos;ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <div>
        <input name="name" placeholder="Your name" className={field} />
        {errors.name && <p className="mt-1 text-xs font-bold text-pop-yellow">{errors.name}</p>}
      </div>
      <div>
        <input name="email" type="email" placeholder="you@email.com" className={field} />
        {errors.email && <p className="mt-1 text-xs font-bold text-pop-yellow">{errors.email}</p>}
      </div>
      <div>
        <textarea name="message" rows={4} placeholder="What are you working on?" className={field} />
        {errors.message && <p className="mt-1 text-xs font-bold text-pop-yellow">{errors.message}</p>}
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="border-brutal shadow-brutal rounded-lg bg-pop-yellow px-5 py-3 font-extrabold text-ink transition-transform duration-100 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message →"}
      </button>
      {status === "error" && message && (
        <p className="text-sm font-bold text-pop-yellow">{message}</p>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Create `src/components/contact.tsx`**

```tsx
import { profile } from "@/lib/profile";
import { Label } from "@/components/ui/brutal";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "@/components/contact-form";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 border-t-[3px] border-[var(--shadow-color)] bg-ink text-paper">
      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-20 sm:grid-cols-2">
        <Reveal>
          <Label>Let&apos;s work together</Label>
          <h2 className="font-display mt-3 text-4xl leading-tight">
            Looking for a marketer who owns the whole funnel?
          </h2>
          <p className="mt-4 text-paper/70">
            Or email me directly at{" "}
            <a className="font-bold text-pop-yellow underline" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            .
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/contact-form.tsx src/components/contact.tsx
git commit -m "feat: contact form and section with states"
```

---

### Task 14: Footer + assemble homepage

**Files:**
- Create: `src/components/footer.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create `src/components/footer.tsx`**

```tsx
import { profile } from "@/lib/profile";

export function Footer() {
  return (
    <footer className="border-t-[3px] border-[var(--shadow-color)] bg-paper text-ink">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <p className="text-sm font-bold">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex gap-4 text-sm font-bold">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.href} className="hover:text-pop-purple">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Replace `src/app/page.tsx`**

```tsx
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { About } from "@/components/about";
import { WorkGrid } from "@/components/work-grid";
import { Skills } from "@/components/skills";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <About />
        <WorkGrid />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Build to verify the whole homepage compiles**

Run: `npm run build`
Expected: build succeeds; `/` is statically rendered.

- [ ] **Step 4: Commit**

```bash
git add src/components/footer.tsx src/app/page.tsx
git commit -m "feat: footer and assembled homepage"
```

---

### Task 15: Case study pages (`/work/[slug]`)

**Files:**
- Create: `src/app/work/[slug]/page.tsx`

- [ ] **Step 1: Create `src/app/work/[slug]/page.tsx`** (static params + notFound for unknown slugs)

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getAllSlugs } from "@/lib/projects";
import { profile } from "@/lib/profile";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Label, Card } from "@/components/ui/brutal";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Not found" };
  return { title: `${project.title} — ${profile.name}`, description: project.summary };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <Nav />
      <main className="bg-paper text-ink">
        <section className="bg-pop-yellow">
          <div className="mx-auto max-w-3xl px-5 py-16">
            <Link href="/#work" className="text-sm font-bold hover:underline">
              ← Back to work
            </Link>
            <div className="mt-4">
              <Label>{project.client}</Label>
            </div>
            <h1 className="font-display mt-3 text-4xl leading-tight sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg">{project.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.channels.map((c) => (
                <span
                  key={c}
                  className="border-brutal rounded-md bg-paper px-2.5 py-1 text-xs font-extrabold"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-5 py-16">
          <div className="grid gap-4 sm:grid-cols-3">
            {project.results.map((r) => (
              <Card key={r.label} className="px-4 py-5">
                <div className="font-display text-3xl">{r.value}</div>
                <div className="mt-1 text-sm font-semibold">{r.label}</div>
              </Card>
            ))}
          </div>

          <h2 className="font-display mt-12 text-2xl">The problem</h2>
          <p className="mt-3 leading-relaxed">{project.problem}</p>

          <h2 className="font-display mt-10 text-2xl">The approach</h2>
          <ul className="mt-3 space-y-3">
            {project.approach.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-display flex h-7 w-7 flex-none items-center justify-center rounded-md bg-pop-purple text-paper">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <Link
              href="/#contact"
              className="border-brutal shadow-brutal inline-flex rounded-lg bg-pop-teal px-5 py-3 font-extrabold transition-transform duration-100 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Want results like these? Let&apos;s talk →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Build to verify static params + pages compile**

Run: `npm run build`
Expected: build succeeds; four `/work/[slug]` pages prerendered.

- [ ] **Step 3: Commit**

```bash
git add src/app/work
git commit -m "feat: per-project case study pages"
```

---

### Task 16: Final verification, docs, and deploy

**Files:**
- Modify: `README.md`
- Create: `public/cv.pdf` (placeholder)

- [ ] **Step 1: Add a placeholder CV so the Download CV link resolves**

```bash
printf '%%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\ntrailer<</Root 1 0 R>>\n%%%%EOF\n' > public/cv.pdf
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: all tests pass (projects + validate-contact).

- [ ] **Step 3: Run lint and build**

Run: `npm run lint && npm run build`
Expected: no lint errors; production build succeeds.

- [ ] **Step 4: Manual smoke check**

Run: `npm run dev` then open `http://localhost:3000`.
Verify: hero, stats, about, work grid, skills, contact all render; dark-mode toggle flips theme; clicking a project opens its `/work/<slug>` case study; visiting `/work/nope` shows a 404; submitting the contact form (without a key) shows the friendly "not configured" message.

- [ ] **Step 5: Replace `README.md`**

```markdown
# br-portfolio-site

Neo-Brutalist Pop portfolio for a full-funnel digital marketer.
Built with Next.js (App Router), Tailwind CSS v4, Framer Motion, and next-themes.

## Develop

```bash
npm install
npm run dev
```

## Content

All copy lives in `src/lib/profile.ts` and `src/lib/projects.ts`. Edit those to swap in real details. Replace `public/cv.pdf` with the real CV.

## Contact form

Set `RESEND_API_KEY` (from https://resend.com) locally in `.env.local` and in Vercel project settings. Without it the form shows a friendly "not configured" message. Update the `to` address in `profile.email` and the verified `from` domain in `src/app/api/contact/route.ts`.

## Deploy (Vercel)

1. Import `github.com/arvind-kr4/br-portfolio-site` in Vercel.
2. Framework preset auto-detects Next.js — no config needed.
3. Add the `RESEND_API_KEY` environment variable.
4. Deploy.
```

- [ ] **Step 6: Commit and push**

```bash
git add README.md public/cv.pdf
git commit -m "docs: README with setup + deploy notes; placeholder CV"
git push
```

- [ ] **Step 7: Deploy on Vercel**

In the Vercel dashboard: New Project → import `arvind-kr4/br-portfolio-site` → keep defaults → add `RESEND_API_KEY` env var → Deploy. Confirm the live URL renders the site. (This step is performed by the user in the Vercel UI; the agent should pause and hand off here.)

---

## Self-Review Notes

- **Spec coverage:** stack (Task 0-1), data model (Task 2), dark mode (Task 3), animations (Tasks 4 + applied throughout), nav/hero/stats/about/work/skills/contact/footer sections (Tasks 5-14), contact form + Resend + 503 fallback (Tasks 11-13), case study pages with notFound (Task 15), tests for validation + project lookup (Tasks 2, 11), deploy + RESEND docs (Task 16). All spec sections map to a task.
- **No placeholders:** every code step contains complete, runnable code.
- **Type consistency:** `Project`/`Result` types (Task 2) are reused by `project-card`, `work-grid`, and case study page; `ContactErrors`/`validateContact` (Task 11) are reused by the API route (Task 12) and form (Task 13); `accent` union values match the `accentBg`/`thumbBg` maps.
