# Vedant Patil — Portfolio

Phase 1: foundation & design system for a full-stack developer portfolio.

## Stack

**Client** — React, TypeScript, Vite, Tailwind CSS v4, shadcn-style
components (Radix primitives + CVA), Framer Motion, Lucide icons,
React Router.

**Server** — Node.js, Express, TypeScript. Structural foundation only;
no persisted data yet (see [Phase 1 scope](#phase-1-scope)).

**Database** — MongoDB via Mongoose. Connection helper and one
reference model (`Project`) exist; nothing is seeded.

## Project structure

```
portfolio/
├── src/                  # client (Vite root)
│   ├── components/
│   │   ├── ui/           # Button, Card, Modal, Tabs, Toast, ...
│   │   ├── layout/       # Container, Section, TwoColumn, Footer, ...
│   │   ├── navigation/   # Navbar, NavLink, MobileMenu
│   │   └── shared/       # ThemeProvider, CornerBrackets, Reveal, ...
│   ├── pages/            # one file per route
│   ├── sections/         # homepage section components
│   ├── hooks/
│   ├── lib/              # cn(), motion presets
│   ├── services/         # API client stub
│   ├── types/            # Project, Certificate, Achievement, ...
│   ├── data/              # profile.ts — single source of identity/content
│   ├── constants/        # routes, nav links, design tokens (JS side)
│   └── index.css         # Tailwind v4 theme + design tokens (CSS side)
├── server/
│   └── src/
│       ├── config/       # env, database connection
│       ├── controllers/
│       ├── middleware/   # error handler, request logger
│       ├── models/       # Mongoose schemas
│       ├── routes/
│       ├── types/
│       └── server.ts
└── shared/                # reserved for cross-package contracts (Phase 2+)
```

## Getting started

### Client

```bash
npm install
npm run dev       # http://localhost:5173
```

### Server (optional in Phase 1 — nothing depends on it yet)

```bash
cd server
npm install
cp .env.example .env
npm run dev        # http://localhost:4000
```

## Design system

- **Color** — dark mode is a near-black `#0A0B0D` with a muted brass
  accent (`#E3B341`); light mode is a warm off-white, independently
  tuned rather than inverted. One primary accent, one supporting
  slate-blue accent used sparingly. Tokens live in `src/index.css`.
- **Type** — Manrope (display), Public Sans (body), IBM Plex Mono
  (code/labels). Scale defined as utility classes: `.text-display`,
  `.text-h1`–`.text-h3`, `.text-body*`, `.text-caption`, `.text-label`,
  `.text-code`.
- **Signature motif** — corner-bracket "calibration mark" frames
  (`<CornerBrackets />`), used sparingly on the hero panel and a few
  interactive surfaces instead of shadows/glassmorphism/gradients.
- **Motion** — centralized in `src/lib/motion.ts`. Fast, subtle,
  purposeful; respects `prefers-reduced-motion`.

## Editing your identity

Everything personal lives in **`src/data/profile.ts`**. It currently
has real values only for `name` and `title` — `location`, `github`,
`linkedin`, `email`, `resume` and `availability` are left blank on
purpose rather than filled with placeholder/fake data. Fill them in
and the navbar, footer, hero panel and contact section pick them up
automatically.

## Phase 1 scope

Built: architecture, routing shell, design system, dark/light theming,
core UI + layout + navigation components, typed data models, homepage
structural shell, footer, responsive + accessibility + motion
foundations, server/database architecture (not yet wired to real data).

Not built yet (by design): real project/certificate/achievement
content, GitHub activity feed, coding-stat integrations, resume file,
admin auth, and the API actually persisting/serving data. Each of
these has an honest empty state in the UI rather than fake content.
