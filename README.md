# Samadhan.com ("Co-Pilot Life")

## Technical Documentation


## 1. Executive Summary

Samadhan.com ("Co-Pilot Life") is an AI + Human Hybrid Crisis and Decision Management platform. It helps individuals navigate complex, real-life problems — major life decisions, legal and bureaucratic procedures, emergencies, and situations that require expert human guidance — through a single, unified web application.

The platform combines:
- AI-driven analysis and guidance (structured decision support, step-by-step navigation) powered by Google Gemini
- A verified human expert marketplace (lawyers, career counselors, psychologists, financial planners)
- Real-time crisis/emergency response tooling

The system is split into two deployable services: a **Next.js frontend** and a **standalone Express.js API backend**, both talking to a shared **Supabase Postgres** database — the frontend via the backend API only, never directly.

---

## 2. Core Modules

### 2.1 Smart Decision Maker (Decision Matrix)
Users input a decision problem (e.g., career change, business vs. job) along with the options they are weighing. The system analyzes financial standing, risk tolerance, and relevant market data to generate:
- A structured Pros & Cons matrix
- A probability/confidence score for each option

AI analysis is performed by **Google Gemini** (`gemini-3.5-flash` depending on latency/cost needs), called from the Express backend.

### 2.2 Legal & Bureaucracy Navigator
Users describe a bureaucratic or legal problem (e.g., a lost land deed, trade license registration). The system returns a step-by-step guide in plain language: which office to visit, required fees, and which forms to complete.

### 2.3 Real-Time Crisis Support (Emergency Action Plan)
An SOS button triggers an immediate structured checklist for medical emergencies, cybercrime (account hacks, blackmail,), or financial fraud, along with contact numbers for relevant local support organizations.

### 2.4 Verified Expert Panel (Human-in-the-Loop)
Certified professionals — lawyers, career counselors, psychologists, financial planners — are available for direct chat or video consultation, either free (time-limited) or via a paid session.
### 2.5 Resume matcher and update 100% matcher


---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| Frontend Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode, frontend & backend) |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion 11 |
| Icons | Lucide React |
| Client State | **Redux Toolkit** (+ RTK Query for API data fetching/caching) |
| Validation | Zod 3 (frontend forms) / Zod or class-validator (backend DTOs) |
| Backend API Server | **Express.js** (Node 20, TypeScript) |
| ORM | **Prisma** |
| Database / Auth / Realtime / Storage | **Supabase** (PostgreSQL, Auth, Realtime, Storage) |
| AI Layer | **Google Gemini API** (`@google/genai`) |
| Containerization | Docker (separate images for frontend and backend) |
| CI/CD | GitHub Actions + Docker build pipeline |
| Hosting — Frontend | Vercel |
| Hosting — Backend | Docker container (Render / Railway / Fly.io / VPS — any Docker-compatible host) |
| PWA | next-pwa 5 |

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                  │
│   Next.js App Router (Server + Client Components)        │
│   Redux Toolkit store + RTK Query (API cache/state)       │
└───────────────────────────┬───────────────────────────────┘
                             │ HTTPS (REST/JSON)
┌───────────────────────────▼───────────────────────────────┐
│                  EXPRESS.JS API SERVER                     │
│  - Auth middleware (verifies Supabase JWT)                  │
│  - REST routes: /decisions /legal-cases /crisis /experts    │
│  - Prisma Client → Supabase Postgres                         │
│  - Gemini API integration (decision/legal/crisis generation) │
└──────────┬───────────────────────────────┬─────────────────┘
           │ Prisma (SQL over connection    │
           │ pooler / direct connection)     │
┌──────────▼─────────┐          ┌──────────▼─────────────┐
│   SUPABASE          │          │   GOOGLE GEMINI API      │
│ - PostgreSQL         │          │ - Decision analysis       │
│ - Auth (issues JWT)  │          │ - Legal/bureaucracy guide │
│ - Realtime           │          │ - Crisis checklist gen    │
│ - Storage (docs/IDs) │          └───────────────────────────┘
└──────────────────────┘
```

### 4.1 Authentication Flow
Supabase Auth remains the identity provider (it is the simplest way to get email/password + OAuth + JWT issuance without building this from scratch). The flow is:

1. User signs in through the Next.js frontend using the Supabase browser client (auth only — no data queries).
2. Supabase issues a JWT (access token).
3. The frontend attaches this JWT as a `Bearer` token on every request to the Express API (via RTK Query's `prepareHeaders`).
4. Express middleware verifies the JWT against Supabase's JWKS endpoint (or via `supabase-js` server client's `getUser(token)`), extracts `user_id` and `role`, and attaches it to `req.user`.
5. All subsequent authorization decisions (row ownership, role checks) happen in Express/Prisma application code, since Prisma bypasses Supabase's Row Level Security (RLS runs at the Postgres role level, and Prisma typically connects as a privileged database user). **RLS should not be relied upon as the primary authorization layer in this architecture** — see §7.

### 4.2 Request Flow (example: Decision Matrix)
1. User submits a decision problem via a Redux-connected form component.
2. An RTK Query mutation (`useCreateDecisionMutation`) POSTs to `Express: /api/decisions`.
3. Express validates the request body (Zod), calls the Gemini API with a structured prompt requesting strict JSON output.
4. Express parses/validates the Gemini response, persists it via `prisma.decision.create()`, and returns the result.
5. RTK Query caches the response; the Redux store updates and the UI renders the Pros & Cons matrix and probability score.

---

## 5. Repository & Folder Structure

This is now a **monorepo with two apps** (or two separate repos — monorepo shown below for simplicity).


---

## 6. Database Schema (Prisma → Supabase Postgres)

Prisma is the single source of truth for schema and migrations. `supabase db` / SQL migrations are no longer used for application tables; Prisma Migrate generates and applies them against the same Supabase Postgres instance.

### 6.1 `schema.prisma` (excerpt)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")       // pooled connection (pgbouncer)
  directUrl = env("DIRECT_URL")        // direct connection, used for migrations
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER
  EXPERT
  ADMIN
}

enum ConsultationStatus {
  PENDING
  CONFIRMED
  COMPLETED
  CANCELLED
}

model Profile {
  id          String   @id @default(uuid())
  authUserId  String   @unique          // maps to Supabase auth.users.id
  fullName    String?
  role        Role     @default(USER)
  phone       String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  decisions      Decision[]
  legalCases     LegalCase[]
  crisisReports  CrisisReport[]
  expertProfile  Expert?
  consultations  Consultation[]
}

model Decision {
  id                String   @id @default(uuid())
  userId            String
  profile           Profile  @relation(fields: [userId], references: [id])
  problemStatement  String
  options           Json
  aiResult          Json?
  status            String   @default("draft")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@index([userId])
}

model LegalCase {
  id              String   @id @default(uuid())
  userId          String
  profile         Profile  @relation(fields: [userId], references: [id])
  caseType        String
  description     String
  generatedSteps  Json?
  status          String   @default("open")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId])
}

model CrisisReport {
  id               String   @id @default(uuid())
  userId           String
  profile          Profile  @relation(fields: [userId], references: [id])
  category         String   // medical | cybercrime | financial_fraud
  description      String
  actionChecklist  Json?
  resolved         Boolean  @default(false)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@index([userId])
}

model Expert {
  id         String   @id @default(uuid())
  profileId  String   @unique
  profile    Profile  @relation(fields: [profileId], references: [id])
  specialty  String   // lawyer | career_counselor | psychologist | financial_planner
  verified   Boolean  @default(false)
  rating     Float?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  consultations Consultation[]
}

model Consultation {
  id            String              @id @default(uuid())
  userId        String
  profile       Profile             @relation(fields: [userId], references: [id])
  expertId      String
  expert        Expert              @relation(fields: [expertId], references: [id])
  scheduledAt   DateTime
  status        ConsultationStatus  @default(PENDING)
  sessionType   String              // chat | video
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt

  @@index([userId])
  @@index([expertId])
}
```

### 6.2 Migrations
```
apps/api/prisma/migrations/
├── 20260701_000001_init/
├── 20260705_000002_add_expert_rating/
└── ...
```
Run via `npx prisma migrate dev` (local) and `npx prisma migrate deploy` (CI/CD, production).

### 6.3 Soft Delete & Race Conditions
- No physical deletes on `Decision`, `LegalCase`, `CrisisReport`, `Consultation` — use the `status` field.
- Double-booking prevention for `Consultation` (equivalent to the seat-locking pattern) is implemented as a Prisma **interactive transaction** with `SELECT ... FOR UPDATE` via `$queryRaw`, since Prisma does not natively expose row locking:

```typescript
await prisma.$transaction(async (tx) => {
  const slot = await tx.$queryRaw`
    SELECT * FROM "Consultation"
    WHERE "expertId" = ${expertId} AND "scheduledAt" = ${scheduledAt}
    FOR UPDATE NOWAIT
  `;
  // check availability, then create/update
});
```

---

## 7. Authentication & Authorization (Revised for Express + Prisma)

Because Prisma connects to Postgres with a privileged role (bypassing Supabase RLS in practice), **authorization must be enforced in the Express application layer**, not assumed from RLS:

- `auth.middleware.ts` verifies the incoming Supabase JWT on every protected route and attaches `{ id, role }` to `req.user`.
- Every controller explicitly filters queries by `req.user.id` (e.g., `prisma.decision.findMany({ where: { userId: req.user.id } })`) — there is no database-level safety net.
- Role checks (`EXPERT`, `ADMIN`) are implemented as Express middleware (`requireRole('ADMIN')`) applied per route.
- Supabase RLS can optionally remain enabled on the tables as defense-in-depth for any direct/manual database access, but the Express API is the sole sanctioned data-access path for the application; the frontend never queries Supabase Postgres directly.
- Supabase Storage (for uploaded documents/IDs) can still be accessed with signed URLs issued by the Express backend, keeping the storage bucket private.

---

## 8. Redux Toolkit — State Management

- `store/index.ts` configures the store with `configureStore`, combining feature slices and the RTK Query API reducer(s).
- **RTK Query** (`store/api/*.ts`) is the primary data-fetching layer, replacing manual `fetch` + local component state. Each API slice defines endpoints per Express resource (`decisionsApi`, `legalApi`, `crisisApi`, `expertsApi`), with automatic caching, tag-based invalidation, and loading/error states.
- Local UI-only slices (`uiSlice` for modals/toasts, `authSlice` for the current session/user derived from the Supabase JWT) hold ephemeral client state that doesn't belong in the server cache.
- `prepareHeaders` in the base API config attaches the Supabase access token as `Authorization: Bearer <token>` on every RTK Query request.
- Persisting auth session state across reloads is handled by Supabase's own client-side session storage, not `redux-persist` — Redux only mirrors the current user for render purposes.

---

## 9. AI Integration Layer — Google Gemini

All Gemini calls happen **exclusively in the Express backend** (`services/gemini.service.ts`) — the API key must never reach the frontend bundle.


import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateDecisionAnalysis(problem: string, options: string[]) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: buildDecisionPrompt(problem, options),
    config: {
      responseMimeType: "application/json",
      responseSchema: decisionResultSchema, // structured output schema
    },
  });
  return JSON.parse(response.text);
}
```

| Module | Gemini Task | Output Format |
|---|---|---|
| Decision Matrix | Analyze options, generate pros/cons + score | Structured JSON via `responseSchema` |
| Legal Navigator | Generate step-by-step bureaucratic guidance | Structured JSON (steps, fees, forms) |
| Crisis Support | Generate an emergency action checklist | Structured JSON (ordered checklist + contacts) |

Gemini's native `responseSchema` / structured output mode is used instead of prompt-only "return only JSON" instructions where possible, with a Zod parse as a second validation pass before persisting via Prisma.

---

## 10. Containerization (Docker)

Two separate images are built: one for the Next.js frontend (used mainly for CI validation/preview, since production frontend hosting is Vercel) and one for the Express backend (the actual production runtime, since Vercel does not host long-running Express servers).

### 10.1 Backend Dockerfile (production runtime)
```dockerfile
# apps/api/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY apps/api/package.json apps/api/package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY apps/api .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 4000
CMD ["node", "dist/server.js"]
```


```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY apps/web/package.json apps/web/package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY apps/web .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```


```yaml
services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "4000:4000"
    env_file: apps/api/.env
    depends_on:
      - db

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    env_file: apps/web/.env.local
    depends_on:
      - api

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```
(Local dev can point `DATABASE_URL` at this local Postgres, or directly at a Supabase dev project — either works with Prisma.)

---


## 12. Deployment

### 12.1 Frontend (Vercel)
1. Connect the repo (root directory `apps/web`) to a Vercel project.
2. Set frontend environment variables (§13) in the Vercel dashboard.
3. `vercel.json` in `apps/web` retains the same security headers as before (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, no-cache on the service worker).

### 12.2 Backend (Docker host)
1. Provision a Docker-compatible host (Render/Railway/Fly.io/VPS) pointing at the `samadhan-api` image.
2. Set backend environment variables (§13) on that platform.
3. Ensure the host allows outbound HTTPS to `generativelanguage.googleapis.com` (Gemini) and to the Supabase Postgres connection endpoints.
4. Point the frontend's `NEXT_PUBLIC_API_BASE_URL` at the deployed backend's public URL.
5. Add CORS configuration in Express (`cors()` middleware) restricted to the frontend's origin(s).

### 12.3 Supabase Configuration
1. Add the production OAuth callback URL to Supabase Auth → Redirect URLs: `https://samadhan.vercel.app/auth/callback`.
2. Obtain both the **pooled** connection string (`DATABASE_URL`, via PgBouncer, used at runtime) and the **direct** connection string (`DIRECT_URL`, used by `prisma migrate deploy`) from the Supabase dashboard.

---

## 13. Environment Variables

### Frontend (`apps/web`)
| Variable | Scope | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Auth only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Auth only |
| `NEXT_PUBLIC_API_BASE_URL` | Public | URL of the Express API |
| `NEXT_PUBLIC_APP_URL` | Public | OAuth redirect base URL |

### Backend (`apps/api`)
| Variable | Scope | Notes |
|---|---|---|
| `DATABASE_URL` | Private | Pooled Prisma connection (PgBouncer) |
| `DIRECT_URL` | Private | Direct connection, for migrations |
| `SUPABASE_URL` | Private | For JWT verification / storage access |
| `SUPABASE_SERVICE_ROLE_KEY` | Private | Server-only; storage signed URLs, admin tasks |
| `GEMINI_API_KEY` | Private | Server-only; never exposed to the frontend |
| `CORS_ORIGIN` | Private | Allowed frontend origin(s) |
| `PORT` | Private | Express listen port (default 4000) |

---

## 14. Non-Functional Requirements

- **Security:** Authorization is enforced entirely in the Express application layer (§7); the Gemini and Supabase service role keys never leave the backend. CORS locked to known frontend origins.
- **Privacy:** Crisis reports and legal case data are sensitive; access restricted to the owning user and, where applicable, an assigned expert with explicit consent, enforced via `req.user.id` filtering in every Prisma query.
- **Reliability:** RTK Query's caching/retry behavior smooths transient network issues between frontend and backend. PWA offline fallback page for the crisis-support module so the SOS checklist remains partially accessible offline (cached static content only — live Gemini calls require connectivity to the backend).
- **Scalability:** Express backend and Next.js frontend scale independently; the backend can be horizontally scaled behind a load balancer since it is stateless (JWT-based auth, Prisma connection pooled via PgBouncer).
- **Localization:** UI copy supports Bengali and English; Gemini-generated content (legal steps, decision analysis, crisis checklists) is generated in the user's selected language via the prompt.
- **Auditability:** All AI-generated guidance is stored (via Prisma) alongside the original prompt/input for traceability and future review by human experts.

---

## 15. Roadmap (Suggested Phasing)

| Phase | Scope |
|---|---|
| Phase 1 | Supabase Auth, Express API skeleton + Prisma schema, Decision Matrix module (Gemini-only) |
| Phase 2 | Legal & Bureaucracy Navigator |
| Phase 3 | Crisis Support (SOS) + offline PWA fallback |
| Phase 4 | Expert Panel: verification, scheduling, chat, video consultation |
| Phase 5 | Payments for paid expert consultations |

---

## 16. Open Questions for Product Decisions

- Video consultation: build in-house (WebRTC) or integrate a third-party SDK (e.g., Daily, Twilio)?
- Payment provider for local (Bangladesh) payment methods (bKash, Nagad, cards)?
- Expert verification process: manual admin review vs. document-based automated verification?
- Data retention policy for crisis reports containing sensitive personal information?
- Backend hosting target for the Express/Docker service: Render, Railway, Fly.io, or a self-managed VPS?
- Gemini model choice per module: `gemini-2.5-pro` (higher quality, higher latency/cost) vs. `gemini-2.5-flash` (faster, cheaper) — likely pro for Decision Matrix/Legal Navigator, flash for Crisis Support where speed matters most.
#   s a m a d h a n - c l i e n t 
 
 