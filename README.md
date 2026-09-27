# Vedant Patil — Portfolio

Phase 1: frontend foundation & design system.
Phase 2: backend, MongoDB data layer, and admin authentication.
Production: Vercel frontend + Render backend integration.

## Stack

**Client** — React, TypeScript, Vite, Tailwind CSS v4, shadcn-style
components (Radix primitives + CVA), Framer Motion, Lucide icons,
React Router.

**Server** — Node.js, Express, TypeScript, MongoDB/Mongoose, JWT
(httpOnly cookie), bcryptjs, Zod validation, Helmet, rate limiting.

## Project structure

```
portfolio/
├── src/                  # client (Vite root)
│   ├── components/
│   │   ├── ui/           # Button, Card, Modal, Tabs, Toast, ...
│   │   ├── layout/       # Container, Section, TwoColumn, Footer, ...
│   │   ├── navigation/   # Navbar, NavLink, MobileMenu
│   │   └── shared/       # ThemeProvider, AuthProvider, RequireAuth, ...
│   ├── pages/            # one file per route (incl. admin/)
│   ├── sections/         # homepage section components
│   ├── hooks/            # useAuth, useTheme, usePageTitle, ...
│   ├── lib/               # cn(), motion presets
│   ├── services/         # API client + one service file per resource
│   ├── types/             # Project, Certificate, ..., SafeAdmin
│   ├── data/               # profile.ts — single source of identity/content
│   ├── constants/         # routes, nav links, design tokens (JS side)
│   └── index.css          # Tailwind v4 theme + design tokens (CSS side)
├── server/
│   └── src/
│       ├── config/        # env (Zod-validated), database (Mongoose)
│       ├── controllers/   # auth + one controller per content resource
│       ├── middleware/    # authenticate, validate, error-handler, rate-limit, ...
│       ├── models/        # Admin, Project, Certificate, Achievement, Skill,
│       │                  # Education, Experience, Message, SiteSettings
│       ├── routes/
│       ├── scripts/       # seed-admin.ts
│       ├── types/         # api envelope, Zod schemas, Express augmentation
│       ├── utils/         # jwt, password, cookies, crud-factory, http-error
│       └── server.ts
└── shared/                 # reserved for cross-package contracts (Phase 3+)
```

## Getting started

### 1. Database

You need a MongoDB instance reachable at `MONGODB_URI` — local
(`mongodb://localhost:27017/portfolio`) or a hosted cluster (e.g.
MongoDB Atlas).

### 2. Server

```bash
cd server
npm install
cp .env.example .env      # fill in MONGODB_URI, JWT_SECRET, CLIENT_URL

npm run seed:admin        # requires ADMIN_NAME/ADMIN_EMAIL/ADMIN_PASSWORD in .env
npm run dev                # http://localhost:4000
```

`JWT_SECRET` should be a long random string in any real deployment —
`npx node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
is a quick way to generate one.

To receive an email whenever someone submits the contact form, also
set `RESEND_API_KEY` and `CONTACT_NOTIFICATION_EMAIL` (get a free key
at [resend.com](https://resend.com)) and, once you've verified a
sending domain there, `EMAIL_FROM`. All three are optional — without
them the contact form still validates, rate-limits and stores
messages for the admin inbox at `/admin/messages`; it just won't send
the notification email.

### 3. Client

```bash
npm install
npm run dev                # http://localhost:5173
```

The dev server proxies `/api/*` to `http://localhost:4000`, so the
client and server share an origin in development — no CORS
configuration needed locally, and the httpOnly auth cookie just works.
In production, set `CLIENT_URL` on the server to your deployed client
origin (CORS is configured to allow exactly that origin, with
credentials) and `VITE_API_BASE_URL` on the client if the API isn't
served from the same origin/proxy.

### 4. Sign in to /admin

Visit `http://localhost:5173/admin/login` and sign in with the
`ADMIN_EMAIL` / `ADMIN_PASSWORD` you seeded. `/admin` is protected —
visiting it without a session redirects to the login page and back
once you're signed in.

## Authentication model

- Password hashing: bcryptjs, 12 salt rounds.
- Session: JWT signed with `JWT_SECRET`, stored in an **httpOnly,
  sameSite=lax cookie** (not localStorage) — set on login, cleared on
  logout, verified + re-checked against the `Admin` collection
  (`isActive`) on every protected request.
- Login always returns the same generic "Invalid email or password"
  for both unknown-email and wrong-password cases.
- The login endpoint is rate-limited (10 attempts / 15 min / IP).
- `GET /api/auth/me` is how the frontend (`useAuth`) determines
  `loading` → `authenticated` / `unauthenticated` on load.

## API

Every response follows one envelope:

```json
{ "success": true, "data": {}, "message": "..." }
{ "success": false, "message": "...", "code": "..." }
```

Public reads exist for every content resource; mutating verbs
(`POST` / `PUT` / `PATCH` / `DELETE`) on the same routes require the
admin session (see each `routes/*.routes.ts` file — protection is
per-route rather than a separate `/admin/*` tree, since GET stays
public and only writes need auth). `POST /api/messages` (the contact
form) is the one public write. Content resources share a small CRUD
factory (`utils/crud-factory.ts`) to avoid repeating the same
list/get/create/update/delete logic seven times.

`Project` publicly only returns `status: "published"` documents —
drafts never leak through the public API.

## Editing your identity

`src/data/profile.ts` still drives the static frontend (nav, footer,
hero). `SiteSettings` in the database is the equivalent for
content that will eventually be admin-editable — they're
intentionally separate for now; a later phase can point the frontend
at `GET /api/settings` instead of the static file.

## Phase 2 scope

Built: server architecture, env validation, MongoDB connection with
graceful shutdown, all content + Admin + Message + SiteSettings
models with indexes, JWT/cookie authentication, admin seed script,
protected CRUD route foundation for every resource, Zod validation,
global error handling (Mongoose validation/cast/duplicate-key errors,
HttpErrors, generic fallback — no stack traces leaked in production),
Helmet + CORS + rate limiting, a typed client service layer, and a
working `/admin/login` → `/admin` (protected) flow.

Not built yet (by design, per this phase's scope): the full admin
dashboard/CRUD UI, the public Contact page actually submitting to
`POST /api/messages`, GitHub integration, file/image upload, and
email notifications. `src/services/message.service.ts` already wraps
the endpoint for whenever the Contact UI phase wires it up.

## Phase 9 scope

Built: the contact system end to end. `ContactSection` (rendered at
`/contact` and on the homepage) now submits name/email/optional
subject/message with client-side validation, a hidden honeypot field,
and idle/submitting/success/error states that disable the submit
button while a request is in flight. The backend independently
re-validates every field, rate-limits `POST /api/messages` (5 / 15 min
/ IP, stricter than the general API), and silently discards honeypot
hits without persisting or emailing anything — a bot gets the same
success response a real visitor would. Accepted messages are always
saved to MongoDB first; a best-effort notification email then goes out
via Resend's plain HTTPS API (`server/src/services/email.service.ts`,
no SMTP client, no new dependency — the same `fetch`-based pattern
`github.service.ts` already used). If the email fails or Resend isn't
configured, the message is still stored and the visitor still gets a
normal success response; the failure is only logged.

The admin CMS gained the inbox Phase 8 didn't build: `/admin/messages`
lists every submission (search, status filter, unread indicator),
opening one marks it read and shows the full message in a slide-over
with reply-by-email and status/delete controls, and the Overview page
now surfaces an "Unread messages" count alongside the existing content
counts.

Not built yet (out of scope by design — see `PHASE 9 — CONTACT
SYSTEM` §37): CAPTCHA, a visitor auto-reply, a second/duplicate inbox,
and any contact analytics beyond the unread count on Overview.
