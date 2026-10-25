# SkillNest — Project Analysis, Architectural Review & Task Tracking

**Last Updated:** 2026-10-25  
**Project Name:** SkillNest  
**Tagline:** The Right Skills, Right Around You  
**Target Market:** Boisar, Palghar, Tarapur MIDC, and surrounding regions in Maharashtra  
**Review Status:** Completed (Non-destructive structural & architectural review)

---

## 1. Executive Summary

This document serves as the central record for the structural analysis, backend integration verification, database evaluation against `PRD.txt`, identified gaps, security/architectural risks, and recommended next steps for **SkillNest**.

SkillNest is currently implemented as a high-fidelity, client-side Single Page Application (SPA) built with React 19, TypeScript, Vite 8, and Tailwind CSS v4. While the user-facing interface, local-matching engine, and interactive workflows are functional in the browser using `localStorage`, there is **no integrated backend, no API layer, and no relational database**. Unused dependencies (`express`, `@google/genai`, `dotenv`) are present in `package.json`, and client-side route protection is defined but not attached to routes.

---

## 2. Project Structure & Codebase Overview

### 2.1 Directory Layout
```
d:\skillnest\
├── frontend\
│   ├── .env.example              # Environment variables template (Gemini API key, App URL)
│   ├── .gitignore                # Git ignore rules
│   ├── bun.lock                  # Bun package lockfile
│   ├── index.html                # HTML entry point (Plus Jakarta Sans, JetBrains Mono, SEO meta)
│   ├── metadata.json             # AI Studio applet configuration & capabilities
│   ├── package.json              # Project dependencies & npm run scripts
│   ├── package-lock.json         # NPM lockfile
│   ├── PRD.txt                   # Product Requirements Document
│   ├── README.md                 # Full project documentation & user guide
│   ├── tsconfig.json             # TypeScript compiler settings
│   ├── vite.config.ts            # Vite bundler configuration (Tailwind v4, path alias `@`)
│   └── src\
│       ├── main.tsx              # React DOM mounting
│       ├── App.tsx               # Top-level application router & context wrapping
│       ├── index.css             # Tailwind CSS layer & base style definitions
│       ├── assets\
│       │   └── images\           # Curated visual assets for categories and hero banner
│       ├── components\
│       │   ├── auth\
│       │   │   └── ProtectedRoute.tsx    # Role-based route guard & demo switcher (unmounted)
│       │   ├── common\
│       │   │   ├── Modal.tsx             # Accessible dialog modal
│       │   │   └── ThemeToggle.tsx       # Dark/light theme switch button
│       │   ├── freelancers\
│       │   │   └── FreelancerCard.tsx    # Freelancer profile card with match score display
│       │   ├── layout\
│       │   │   ├── Navbar.tsx            # Top navigation bar with 1-click persona switcher
│       │   │   ├── Footer.tsx            # Regional footer with trust points & links
│       │   │   └── WorkspaceShell.tsx    # Responsive side-nav shell for dashboards
│       │   ├── modals\
│       │   │   ├── InquiryModal.tsx      # Direct inquiry & meeting preference modal
│       │   │   └── ProposalModal.tsx     # Bid/proposal submission modal with duplicate check
│       │   ├── projects\
│       │   │   └── ProjectCard.tsx       # Project listing card with budget and location tags
│       │   └── ui\                       # UI primitives (Badge, Button, EmptyState, GlassCard, Toast)
│       ├── context\
│       │   ├── AppContext.tsx            # Central marketplace state & localStorage persistence
│       │   └── ThemeContext.tsx          # Theme state provider
│       ├── data\
│       │   └── mockData.ts               # Seed data for Boisar/Palghar freelancers, projects, users
│       ├── lib\
│       │   └── utils.ts                  # Classnames merge helper (`clsx` + `tailwind-merge`)
│       ├── pages\
│       │   ├── HomePage.tsx              # Landing page (hero, search, categories, comparison)
│       │   ├── FreelancersPage.tsx       # Searchable directory with filters (skills, distance, solo/team)
│       │   ├── FreelancerDetailPage.tsx  # Profile view with portfolio showcase and inquiry modal
│       │   ├── ProjectsPage.tsx          # Browse open project requirements
│       │   ├── ProjectDetailPage.tsx     # Project details with live local matching recommendations
│       │   ├── PostProjectPage.tsx       # Multi-step project wizard with live match preview
│       │   ├── HowItWorksPage.tsx        # Workflow breakdown, comparison matrix, and FAQ
│       │   ├── AuthPage.tsx              # Login/signup form + 1-click demo persona switcher
│       │   ├── ClientDashboardPage.tsx   # Client workspace dashboard
│       │   ├── FreelancerDashboardPage.tsx # Freelancer workspace dashboard
│       │   ├── admin\
│       │   │   ├── AdminDashboardPage.tsx # Executive metrics & regional hub breakdown
│       │   │   ├── AdminProjectsPage.tsx  # Project moderation and status management
│       │   │   ├── AdminReviewsPage.tsx   # Client reviews audit
│       │   │   ├── AdminSettingsPage.tsx  # Regional parameters & fee settings
│       │   │   └── AdminUsersPage.tsx     # User status & role management
│       │   ├── client\
│       │   │   ├── ClientMessagesPage.tsx # Direct message threads & reply composer
│       │   │   ├── ClientProfilePage.tsx  # Client business profile form
│       │   │   ├── ClientProjectsPage.tsx # Client posted projects list with status tabs
│       │   │   └── ClientSavedPage.tsx    # Bookmarked freelancers
│       │   └── freelancer\
│       │       ├── FreelancerApplicationsPage.tsx # Proposal tracker with status badges
│       │       ├── FreelancerInquiriesPage.tsx    # Client inquiries received
│       │       ├── FreelancerPortfolioPage.tsx    # Portfolio item manager (add/delete)
│       │       ├── FreelancerProfilePage.tsx      # Profile editing (rates, bio, skills, area)
│       │       └── FreelancerSavedPage.tsx        # Bookmarked project opportunities
│       ├── types\
│       │   └── index.ts                  # TypeScript data models and interfaces
│       └── utils\
│           └── matching.ts               # Rule-based transparent matching algorithm
└── TASK.md                               # Project analysis and task tracking document (this file)
```

### 2.2 Key Dependencies & Scripts
- **Core Libraries:** React 19.0.1, React Router DOM 7.18.4, Tailwind CSS 4.3.3 (`@tailwindcss/vite`), Lucide React 0.546.0, Motion 12.23.24.
- **Unused Dependencies:**
  - `express` (`^4.21.2`) and `@types/express` (`^4.17.21`): No backend code exists.
  - `@google/genai` (`^2.4.0`): Google GenAI SDK declared but never imported or invoked.
  - `dotenv` (`^17.2.3`): Declared but unused in frontend build.
  - `tsx` (`^4.21.0`): TypeScript execution utility installed in `devDependencies` without server entrypoint.
- **Scripts:**
  - `npm run dev`: Starts Vite dev server on port 3000.
  - `npm run build`: Bundles the production frontend into `dist/` (build verified: succeeds in ~15s).
  - `npm run lint`: Runs `tsc --noEmit` (type check verified: exits code 0 with zero errors).
  - `npm run clean`: References `rm -rf dist server.js` (indicates legacy or planned `server.js`).

### 2.3 Route Architecture Analysis
All routes defined in `src/App.tsx`:
| Route | Component | Access Defined in PRD | Actual Protection Status |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage` | Public | Unrestricted (Correct) |
| `/freelancers` | `FreelancersPage` | Public | Unrestricted (Correct) |
| `/freelancer/:id` | `FreelancerDetailPage` | Public | Unrestricted (Correct) |
| `/projects` | `ProjectsPage` | Public | Unrestricted (Correct) |
| `/project/:id` | `ProjectDetailPage` | Public | Unrestricted (Correct) |
| `/post-project` | `PostProjectPage` | Client Protected | **Unprotected** in `App.tsx` |
| `/how-it-works` | `HowItWorksPage` | Public | Unrestricted (Correct) |
| `/login` | `AuthPage` | Public | Unrestricted (Correct) |
| `/signup` | `AuthPage` | Public | Unrestricted (Correct) |
| `/dashboard/client` | `ClientDashboardPage` | Client Protected | **Unprotected** in `App.tsx` |
| `/client/projects` | `ClientProjectsPage` | Client Protected | **Unprotected** in `App.tsx` |
| `/client/messages` | `ClientMessagesPage` | Client Protected | **Unprotected** in `App.tsx` |
| `/client/saved` | `ClientSavedPage` | Client Protected | **Unprotected** in `App.tsx` |
| `/client/profile` | `ClientProfilePage` | Client Protected | **Unprotected** in `App.tsx` |
| `/dashboard/freelancer` | `FreelancerDashboardPage` | Freelancer Protected | **Unprotected** in `App.tsx` |
| `/freelancer/applications` | `FreelancerApplicationsPage` | Freelancer Protected | **Unprotected** in `App.tsx` |
| `/freelancer/portfolio` | `FreelancerPortfolioPage` | Freelancer Protected | **Unprotected** in `App.tsx` |
| `/freelancer/inquiries` | `FreelancerInquiriesPage` | Freelancer Protected | **Unprotected** in `App.tsx` |
| `/freelancer/saved` | `FreelancerSavedPage` | Freelancer Protected | **Unprotected** in `App.tsx` |
| `/freelancer/profile` | `FreelancerProfilePage` | Freelancer Protected | **Unprotected** in `App.tsx` |
| `/admin` | `AdminDashboardPage` | Admin Protected | **Unprotected** in `App.tsx` |
| `/admin/users` | `AdminUsersPage` | Admin Protected | **Unprotected** in `App.tsx` |
| `/admin/projects` | `AdminProjectsPage` | Admin Protected | **Unprotected** in `App.tsx` |
| `/admin/reviews` | `AdminReviewsPage` | Admin Protected | **Unprotected** in `App.tsx` |
| `/admin/settings` | `AdminSettingsPage` | Admin Protected | **Unprotected** in `App.tsx` |

---

## 3. Backend Integration Status

### 3.1 Verification Findings
- **Backend Technology:** **None active**. No server process, backend framework, or runtime API is connected.
- **API Endpoints:** **Zero API endpoints**. No network requests (`fetch`, `axios`) exist in the application code.
- **State & Data Handling:**
  - All application data is held in React state initialized from `src/data/mockData.ts`.
  - Mutations (create project, submit proposal, send inquiry, reply, save, toggle status) are handled in `AppContext.tsx` and mirrored to `window.localStorage`.
- **Authentication:**
  - Client-side mock authentication only.
  - Users sign in by matching an email against preloaded or newly created users in `localStorage`.
  - Passwords entered in `AuthPage.tsx` are discarded and never validated, hashed, or compared.
  - A 1-click persona switcher bypasses authentication entirely for evaluation.
- **Server-Side AI Integration:**
  - `metadata.json` requests `"MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"`.
  - `.env.example` defines `GEMINI_API_KEY` and `APP_URL`.
  - `@google/genai` is in `package.json`, but no AI backend service, API endpoint, or client call has been implemented.

---

## 4. Database Structure & PRD Alignment Review

### 4.1 Current Storage Reality
- **Database Engine:** None (No PostgreSQL, MySQL, SQLite, MongoDB, etc.).
- **ORM / Migrations:** No schema migration tools (no Prisma, Drizzle, TypeORM, Knex, Sequelize).
- **Client Schemas:** Interfaces defined in `src/types/index.ts` serve as client-side contracts only.

### 4.2 Comparison Against `PRD.txt` Requirements & Required DB Schema

| PRD Entity / Concept | Current TS Interface | Production DB Table Needed | Status & Gaps Identified |
| :--- | :--- | :--- | :--- |
| **Users & Roles** | `User` (`role: 'client' \| 'freelancer' \| 'admin'`) | `users` | **Partial (Mock)**. Missing: `password_hash`, `email_verified_at`, session tokens, audit timestamps. |
| **Client Profiles** | Merged into `User` (`organization`, `bio`) | `client_profiles` | **Missing separate entity**. Clients need verified business entity fields (GST number, trade license, business address, contact person). |
| **Freelancer Profiles** | `Freelancer` | `freelancer_profiles` | **Partial (Mock)**. Redundant denormalized user fields (`name`, `avatar`, `location`). Needs foreign key `user_id REFERENCES users(id)`. |
| **Team Support** | `Freelancer.isTeam`, `teamMembers: string[]` | `agency_teams` & `team_members` | **Basic flag only**. No multi-user agency association; team members are simply string labels. |
| **Portfolios** | `PortfolioItem[]` (nested on Freelancer) | `portfolio_items` | **Nested array**. Needs table with `freelancer_id REFERENCES freelancer_profiles(id)`. |
| **Freelancer Services** | `FreelancerService[]` (nested) | `freelancer_services` | **Nested array**. Needs table with `freelancer_id REFERENCES freelancer_profiles(id)`. |
| **Projects** | `Project` | `projects` | **Partial (Mock)**. Denormalizes `clientName`, `clientOrganization`. Missing: `assigned_freelancer_id`, `created_at`, `updated_at`. |
| **Skills Junction** | `string[]` arrays on Project & Freelancer | `skills`, `project_skills`, `freelancer_skills` | **Unnormalized strings**. Inconsistent skill naming possible without standardized skill dictionary. |
| **Proposals** | `Proposal` | `proposals` | **Partial (Mock)**. Denormalizes freelancer headline, location, avatar. Needs unique constraint `(project_id, freelancer_id)`. |
| **Direct Inquiries** | `DirectInquiry` | `inquiries` (threads) & `inquiry_messages` | **Nested array in TS**. Needs 1-to-many message model for scalable conversations. |
| **Reviews & Trust** | `Review[]` (nested on Freelancer) | `reviews` | **Static nested mock**. Missing project linkage validation, review moderation status flags (`pending`, `published`, `flagged`). |
| **Bookmarks / Saved** | `string[]` in `localStorage` | `saved_freelancers`, `saved_projects` | **Client-only arrays**. Needs junction tables with `user_id`. |
| **Admin Configuration** | Hardcoded in `AdminSettingsPage.tsx` | `platform_settings` | **Not persisted**. Regional radius, commission policies, and hub definitions are not stored. |

---

## 5. Important Findings, Inconsistencies & Flaws

1. **Unmounted `ProtectedRoute` Guard:**
   - `src/components/auth/ProtectedRoute.tsx` is completely implemented with role checks and demo switcher fallbacks, but is **never imported or wrapped around routes in `src/App.tsx`**.
   - Consequence: Any unauthenticated user can directly access `/admin`, `/client/projects`, `/freelancer/portfolio`, etc.

2. **Client Profile Save Inactivity:**
   - In `ClientProfilePage.tsx`, `handleSave` only fires a toast (`addToast('Profile saved successfully')`). It does not invoke any context method or update `currentUser` / `users` in `localStorage`.

3. **Fallback Data Leaks Between Roles:**
   - In `ClientDashboardPage.tsx` and `ClientProjectsPage.tsx`, if the logged-in client has no projects, the code displays `projects.slice(0, 3)` (belonging to other businesses).
   - In `FreelancerApplicationsPage.tsx`, if the logged-in user does not match a freelancer, it defaults to `freelancers[0]` (Rahul Sharma).

4. **Authentication Form Password Bypassing:**
   - In `AuthPage.tsx`, `password` is a required input in the UI, but the handler only reads `email`, `role`, and `name`. No authentication check is executed against any password, allowing password-less access by email.

5. **Admin Access Vulnerability:**
   - `PRD.txt` explicitly requires: *"Admin registration is strictly prohibited through public forms"*.
   - While the signup tab restricts roles to 'client' and 'freelancer', typing `admin@skillnest.local` on the Sign In tab immediately logs anyone in as administrator without credential challenge.

6. **Dangling Dependencies & Build Warnings:**
   - `package.json` installs `express`, `@types/express`, `@google/genai`, and `dotenv`, which are unused.
   - Vite build emits a deprecation notice for `__dirname` in `vite.config.ts:11:27` (should use `import.meta.dirname`).

---

## 6. Risk Assessment

| Risk Category | Severity | Description | Impact |
| :--- | :--- | :--- | :--- |
| **Security / Auth** | **Critical** | No backend authentication, discarded passwords, and unmounted route guards (`ProtectedRoute`). | Unauthorized access to admin moderation tools and sensitive client inquiries in multi-user environments. |
| **Data Loss / Durability**| **High** | All state resides in browser `localStorage`. Clearing cache or switching browsers wipes all created projects, bids, and messages. | Data cannot be shared between separate client and freelancer devices in real life. |
| **Integrity & Concurrency** | **High** | Simultaneous client submissions or proposal negotiations cannot sync in real-time without a database and WebSocket / API backend. | Race conditions, duplicate bids, and lack of verified message timestamps. |
| **Regulatory & Privacy** | **Medium** | Phone numbers and business details stored in plaintext `localStorage` without encryption or access control. | Privacy exposure on shared or public computers. |

---

## 7. Recommended Next Steps

### Phase 1: Codebase Hygiene & Frontend Hardening (Completed)
- [x] Connect `ProtectedRoute` to all protected routes in `src/App.tsx` (Client, Freelancer, Admin).
- [x] Wire `ClientProfilePage.tsx` to `clientApi.updateProfile` with real backend persistence.
- [x] Fix `ClientProfilePage.tsx` disabled email field and typecheck errors.
- [x] Remove persona/demo role switchers from `Navbar`, `WorkspaceShell`, and `AuthPage`.
- [x] Resolve the `vite.config.ts` warning by replacing `__dirname` with `import.meta.dirname`.
- [x] Frontend typecheck (`npm run lint` / `tsc --noEmit`) verified clean with 0 errors.
- [x] Frontend production bundle build (`npm run build`) verified clean with 0 errors.

### Phase 2: Backend Architecture & API Development (Completed)
- [x] Express + TypeScript server built in `backend/` with modular routing structure.
- [x] Secure authentication with Argon2id password hashing and HTTP-only session cookies (`connect-pg-simple` / `express-session`).
- [x] Role-based access control middleware (`requireAuth`, `requireRole`, `requireAdmin`).
- [x] Zod validation schemas across all endpoints.
- [x] RESTful API endpoints implemented and registered:
  - Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
  - Freelancers: `/api/freelancers`, `/api/freelancers/:id`
  - Projects: `/api/projects`, `/api/projects/:id`, `/api/projects/match`
  - Proposals: `/api/proposals`
  - Inquiries & Messages: `/api/inquiries`, `/api/inquiries/:id/messages`
  - Reviews: `/api/reviews`
  - Saved: `/api/saved`
  - Clients: `/api/clients/profile`
  - Admin: `/api/admin/metrics`, `/api/admin/users`, `/api/admin/projects/:id`
- [x] Backend typecheck (`npm run typecheck` / `tsc --noEmit`) verified clean with 0 errors.

### Phase 3: Relational Database Integration & Frontend API Wiring (Completed)
- [x] Complete Prisma schema designed in `backend/prisma/schema.prisma` with all normalized entities, indexes, and relations.
- [x] Prisma Client generated (`@prisma/client`).
- [x] Comprehensive regional seed script created in `backend/src/seed.ts`.
- [x] `backend/.env` configured with local PostgreSQL database connection.
- [x] `frontend/.env` and `frontend/vite.config.ts` configured with `VITE_API_URL` and proxy to `http://localhost:4000/api`.
- [x] Executed database migration: `npx prisma migrate dev --name init` applied successfully to `skillnest_db`.
- [x] Seeded database with regional Boisar/Palghar sample data: `npm run db:seed`.
- [x] Executed automated integration test suite (`npm test` via Vitest): 18/18 tests passed across DB connectivity, auth, sessions, RBAC, Zod validation, and public marketplace endpoints.
- [x] Backend production build (`npm run build`) verified clean with 0 errors.
- [x] Full Frontend Integration in `AppContext.tsx`: Wired real backend persistence for `postProject`, `submitProposal`, `sendInquiry`, `replyToInquiry`, `toggleSaveFreelancer`, `toggleSaveProject`, and `updateUserStatus`.
- [x] Frontend production bundle build (`npm run build`) verified clean with 0 errors.
- [x] Delivered root-level `STARTUP.md` with complete installation, configuration, database setup, execution, verification, and troubleshooting steps.

### Phase 4: Account Identity, Dynamic Data & Conversation Persistence Fixes (Completed)
- [x] **Root Cause 1 - Freelancer Identity Leak ("Rahul Sharma")**:
  - *Cause*: In `AppContext.tsx`, newly registered users (e.g., "Mithu Don") did not exist in the in-memory `mockData.ts` array. Consequently, pages like `FreelancerDashboardPage`, `FreelancerProfilePage`, `FreelancerApplicationsPage`, `FreelancerInquiriesPage`, and `FreelancerPortfolioPage` fell back to `freelancers[0]`, displaying Rahul Sharma's seeded ratings, 95% profile strength, and portfolio.
  - *Fix*: Created a dedicated `currentFreelancerProfile` state in `AppContext.tsx`, backed by `freelancersApi.getMe()` and `/api/auth/me`. Stripped all `|| freelancers[0]` fallbacks. Provided empty profile defaults (0 reviews, unverified, empty bio/skills) for newly registered accounts.
  - *Dynamic Profile Strength*: Computed profile strength in `FreelancerDashboardPage` dynamically (0–100%) based on actual filled fields (headline, bio, skills, hourly rate, portfolio items).
- [x] **Root Cause 2 - Conversation Persistence Across Sessions**:
  - *Cause*:
    1. `inquiries.schema.ts` strictly validated `freelancerId` with `.cuid()`, rejecting seed-style IDs (e.g. `fl-1`), causing inquiries created from directory cards to fail with 400 Bad Request before database insertion.
    2. `inquiries.service.ts` had `take: 1` on messages, cutting off conversation thread history, and returned raw Prisma models without mapping to the frontend's expected `DirectInquiry` contract (`replies`, `clientName`, `clientEmail`, `meetingPreference`).
    3. `AppContext.tsx` lacked automatic retrieval of persisted inquiries on session restoration (`authApi.me()`) and login.
  - *Fix*: Relaxed `freelancerId` validation to `z.string().min(1)` in `inquiries.schema.ts`. Added automatic client profile creation if missing, resilient freelancer resolution (by profile ID, user ID, or seed ID prefix `fl-`), message history preservation, and full DTO transformation. Wired `inquiriesApi.mine()` into `syncUserData` on login and session restoration. All thread messages and replies are stored and retrieved from PostgreSQL. Participant authorization is enforced server-side (403 for unauthorized participants).
- [x] **Root Cause 3 - Client Dashboard and Project Data Isolation**:
  - *Cause*: In `ClientDashboardPage.tsx` and `ClientProjectsPage.tsx`, empty projects lists defaulted to `projects.slice(0, 3)` and counted other clients' proposals as the user's activity.
  - *Fix*: Scoped all project queries, proposal counters, and message threads strictly to `currentUser.id`. Replaced mock slice fallbacks with clear, actionable empty states ("You haven't posted any projects yet" + "Post Your First Project" action).
- [x] **Root Cause 4 - Proposal Submission Attribution**:
  - *Fix*: In `AppContext.tsx:submitProposal`, replaced `freelancers.find(...) || freelancers[0]` with `currentFreelancerProfile` and `currentUser`, guaranteeing proposals submitted by fresh accounts (e.g., Mithu Don) are never attributed to Rahul Sharma.
- [x] **Verification & Test Results**:
  - Frontend production build (`npm run build`): Passed cleanly with 0 errors.
  - Backend TypeScript compilation (`npm run typecheck`): Passed cleanly with 0 errors.
  - Automated integration test suite (`npm test`): 18/18 tests passed.
  - PostgreSQL database verified active with migrations applied.

### Phase 5: Gemini AI Integration (Future)
- [ ] Implement server-side Gemini API route (`/api/ai/project-assistant` or `/api/ai/match-explainer`) leveraging `@google/genai` to assist non-technical business owners in converting rough ideas into structured project scopes.

### Phase 6: Light Theme Visibility, Profile Builder, Discovery Cards & Direct Photo Upload (Completed)
- [x] **Light Theme Visibility & Contrast Overhaul**:
  - *Root Cause*: Hardcoded dark utility classes (`bg-white/5`, `border-white/10`, `text-white`, `bg-neutral-900`) caused labels, input borders, placeholders, dropdowns, and cards to become invisible against the light mode background.
  - *Fix*: Created centralized design tokens and reusable CSS classes in `frontend/src/index.css`: `.sn-input`, `.sn-textarea`, `.sn-select`, `.sn-label`, `.sn-helper`, `.sn-card-surface`, `.sn-card-subtle`, and `.sn-border-subtle`.
  - Added full light/dark variants to `Badge.tsx`, `Button.tsx`, `GlassCard.tsx`, and form controls.
  - Verified across `FreelancerProfilePage`, `ClientProfilePage`, `FreelancersPage`, `FreelancerDashboardPage`, `FreelancerApplicationsPage`, `FreelancerInquiriesPage`, and `FreelancerPortfolioPage`.
  - Seamless instant theme switching without page reload.
- [x] **Freelancer Profile Builder & Service Listing Overhaul**:
  - Built organized tabbed builder in `FreelancerProfilePage.tsx`:
    - **Basic Information**: Name, headline, location, bio, entity type toggle, and direct photo/logo upload.
    - **Skills & Expertise**: Add/remove skill chips, category picker, experience years, and contact preferences.
    - **Services Offered**: Full CRUD for service listings (title, category, description, deliverables, starting price in INR, delivery days).
    - **Portfolio & Previous Work**: Polished work sample grid, add/edit/delete modals with broken-image graceful fallback.
    - **Availability & Rates**: Project starting rates, hourly rates, availability status, and pricing model indicator.
    - **Profile Readiness & Preview**: Live completion score (0–100%) with actionable checklist and live preview card.
- [x] **Individual Specialists vs. Studio Teams**:
  - Full support for both individual freelancers and agencies/studios (PixelCraft Studio).
  - Studio profiles support team name, studio brand logo, team size, and member names/roles without corrupting individual freelancer accounts.
- [x] **Freelancer Discovery Card Upgrades**:
  - Detailed profiles (Rahul Sharma, PixelCraft Studio) showcase rich information, tags, ratings, and portfolio previews.
  - Incomplete/new profiles (Mithu Don) display intentional states: "New Pro" badge, "Pricing on request", friendly setup reminder only for the profile owner, and initials avatar fallback.
  - Zero fabricated data: No fake reviews, ratings, or verification badges.
  - Uniform card heights (`min-h-[410px]`) with aligned footers.
- [x] **Direct Photo Upload for Freelancers & Clients**:
  - Created reusable `frontend/src/components/common/PhotoUpload.tsx`.
  - Replaced raw URL inputs with direct device photo selection, drag-and-drop, and preview in both `FreelancerProfilePage` and `ClientProfilePage`.
  - Automatic client-side canvas compression/resizing (max 600x600, ~50-80KB) for instant loading, zero payload bloat, and fast PostgreSQL persistence.
  - Updated `clients.schema.ts` and `freelancers.schema.ts` to accept base64 data URLs.
  - Increased backend Express body parser limit to 10MB in `app.ts`.
  - Wired `updateClientProfile` into `AppContext.tsx` so client photos update globally in real time.
- [x] **Verification & Test Suite**:
  - Backend Typecheck (`npm run typecheck`): Passed with 0 errors.
  - Backend Integration Tests (`npm test` via Vitest): 18/18 tests passed.
  - Frontend Lint & Production Build (`npm run build`): Passed cleanly with 0 errors.

### Phase 7: Role-Based Navigation & Landing Page CTAs (Completed)
- [x] **Role-Based Public Navbar (`Navbar.tsx`)**:
  - **Client**: Displays `Home`, `Find Freelancers`, `Browse Projects`, `How It Works`, and `Client Dashboard`. Primary action button: **Post a Project** (`/post-project`).
  - **Freelancer**: Displays `Home`, `Browse Projects`, `How It Works`, and `Freelancer Hub`. Strict omission of "Find Freelancers" as a primary nav item. Primary action button adapts dynamically based on profile completion: **Complete My Profile** (`/freelancer/profile`) for setup-in-progress profiles, or **Manage Portfolio** (`/freelancer/portfolio`) for complete profiles.
  - **Admin**: Displays `Home`, `Find Freelancers`, `Browse Projects`, `How It Works`, and `Admin Dashboard`. Client-only and freelancer-only primary action buttons are hidden.
  - **Guest (Not Logged In)**: Displays `Find Freelancers`, `Browse Projects`, `How It Works`. Actions in Zone 3: `Sign In` (`/login`) and `Get Started` (`/signup`) with two-way dropdown for hiring talent or offering skills.
  - **Mobile Drawer**: Synchronized role-aware nav links, appearance toggle, and role-specific primary actions.
  - **Session & Logout Synchronization**: When logging out via the user menu, `currentUser` clears and the navbar immediately restores guest state without page reload.
- [x] **Role-Aware Landing Page & Hero Section (`HomePage.tsx`)**:
  - **Client View**:
    - Regional Badge: `Local-First Business Network · Boisar & Palghar District`
    - Headline: *"Find Verified Local Talent, Right Around You."*
    - Subtitle: Focused on reviewing authentic portfolios, communicating directly, and hiring with confidence.
    - Primary CTA: **Find a Freelancer** (`/freelancers`).
    - Secondary CTA: **Post a Project** (`/post-project`).
    - Integrated Hero Search: Searches freelancers by skill/service with location filter.
  - **Freelancer View**:
    - Regional Badge: `Freelancer Hub · Boisar, Palghar & Industrial MIDC`
    - Headline: *"Showcase Your Skills, Win Local Projects."*
    - Subtitle: Focused on discovering verified project opportunities in Boisar/Palghar/MIDC, submitting quotes, and collaborating with local businesses.
    - Primary CTA: **Browse Projects** (`/projects`) — does not encourage hiring other freelancers.
    - Secondary CTA: **Complete My Profile** (`/freelancer/profile`) or **Manage Portfolio** (`/freelancer/portfolio`).
    - Integrated Hero Search: Searches open project requirements by skill/title with location filter.
  - **Guest View**:
    - Preserves general marketplace headline: *"Find the Right Talent, Right Around You."*
    - Primary CTA: **Find a Freelancer** (`/freelancers`).
    - Secondary CTA: **Join as a Freelancer** (`/signup?role=freelancer`).
  - **Final CTA Section**: Role-adapted buttons for clients, freelancers, and guests.
- [x] **Verification & Test Results**:
  - Frontend production build (`npm run build`): Passed cleanly with 0 errors.
  - Backend TypeScript compilation (`npm run typecheck`): Passed cleanly with 0 errors.
  - Automated integration test suite (`npm test`): 18/18 tests passed.



