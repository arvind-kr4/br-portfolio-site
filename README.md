# br-portfolio-site

Neo-Brutalist Pop portfolio for a full-funnel digital marketer.
Built with Next.js (App Router), Tailwind CSS v4, Framer Motion, and next-themes.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Content

All copy lives in `src/lib/profile.ts` and `src/lib/projects.ts`. Edit those to swap in real details. Replace `public/cv.pdf` with the real CV.

## Contact form

Set `RESEND_API_KEY` (from https://resend.com) locally in `.env.local` and in Vercel project settings. Without it, the form shows a friendly "not configured" message instead of failing. Update the `to` address via `profile.email` and the verified `from` domain in `src/app/api/contact/route.ts`.

## Test, lint, build

```bash
npm test
npm run lint
npm run build
```

## Deploy (Vercel)

1. Import `github.com/arvind-kr4/br-portfolio-site` in Vercel.
2. The Next.js framework preset is auto-detected, so no extra config is needed.
3. Add the `RESEND_API_KEY` environment variable.
4. Deploy.
