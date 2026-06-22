# 🛡️ CyberSafe Gurugram

**Scam Hotspot Map & Complaint Intelligence Portal**

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-cybersafe--gurugram.netlify.app-brightgreen?style=for-the-badge)](https://cybersafe-gurugram.netlify.app/)
[![Netlify Status](https://api.netlify.com/api/v1/badges/cybersafe-gurugram/deploy-status)](https://cybersafe-gurugram.netlify.app/)

> 🌐 **Live at:** [https://cybersafe-gurugram.netlify.app/](https://cybersafe-gurugram.netlify.app/)

A full-featured civic intelligence SPA built for the **Gurugram Police Cybercrime Unit**. It gives citizens a live visual view of cyber-crime hotspots across Gurugram, lets them file and track complaints, and provides police analysts with an administrative dashboard for trend analysis and investigation management.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [All Pages & Features](#all-pages--features)
  - [Public Pages](#-public-pages-citizen-facing)
  - [Admin Dashboard](#-admin-dashboard-police-analyst)
- [Authentication](#authentication)
- [Data Layer](#data-layer)
- [Map Component](#map-component)
- [Scripts Reference](#scripts-reference)
- [Connecting a Real Backend](#connecting-a-real-backend)
- [Roadmap](#roadmap)

---

## Overview

CyberSafe Gurugram has two portals under one app:

| Portal | Audience | Access |
|--------|----------|--------|
| **Public Portal** | Citizens of Gurugram | Open (no login required to browse) |
| **Admin Dashboard** | Police analysts / officers | Login required with an `admin` email |

All data is currently **mock-only** (no real server needed) but the API layer is designed to be swapped for a live REST backend with zero changes to the UI components.

---

## Features

### Public (Citizen) Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Scam Hotspot Map** | Interactive choropleth map of Gurugram showing scam risk zones color-coded by severity (High / Medium / Low) |
| 🔍 **Area Detail Sidebar** | Click any zone to see complaint count, total financial loss, top scam types, and police station info |
| 🎛️ **Map Filters** | Filter map by Scam Type, Date Range, Police Station, and Risk Level simultaneously |
| 📚 **Awareness Hub** | Educational cards for all 10 scam types with red flags, prevention tips, and response steps |
| 📝 **Complaint Filing** | Multi-field form to submit a new cyber crime complaint with validation |
| 🔎 **Complaint Tracking** | Enter a reference ID (e.g. `CMP-2023042`) to see the current processing stage of your complaint |
| 📋 **How to Report** | Step-by-step guide on using Helpline 1930, cybercrime.gov.in, and local police stations |

### Admin Features

| Feature | Description |
|---------|-------------|
| 📊 **Overview Dashboard** | KPI cards for total complaints, total financial loss, high-risk areas, and a weekly trend sparkline |
| 🗺️ **Admin Intelligence Map** | Full-detail map with modus operandi text and investigation playbooks per zone |
| 📈 **Analytics** | Recharts-powered graphs: monthly trend, scam type distribution, channel breakdown, age band & gender split |
| 📋 **Complaints Table** | Searchable, filterable table of all complaint records (by keyword, scam type, risk level, police station) |
| ⚙️ **Risk Configuration** | Adjustable thresholds that define when an area is classified as High / Medium / Low risk |
| 👥 **User Management** | Manage analyst accounts and their roles |
| 🔔 **Notifications Panel** | System-level alert notifications for admins |

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | **React** | 18 |
| Language | **TypeScript** | 5+ |
| Build Tool | **Vite** | 6+ |
| Package Manager | **pnpm** (monorepo) | 9+ |
| Client Routing | **wouter** | 3.3 |
| Styling | **Tailwind CSS** + **shadcn/ui** | 4+ |
| Component Primitives | **Radix UI** | various |
| Charts | **Recharts** | 2.15 |
| Maps | **MapLibre GL JS** via `react-map-gl` | 5.24 |
| Map Tiles | **MapTiler Streets v4** | — |
| Server State | **TanStack React Query** | 5+ |
| Forms | **React Hook Form** + **Zod** | — |
| Icons | **Lucide React** | — |
| Animations | **Framer Motion** | — |

---

## Project Structure

```
Cyber-Scam-Map/                          ← pnpm monorepo root
├── pnpm-workspace.yaml
└── artifacts/
    └── cybersafe-gurugram/              ← ✅ Main SPA (work here)
        ├── .env                         ← MapTiler API key (see below)
        ├── package.json
        ├── vite.config.ts
        ├── tsconfig.json
        ├── index.html
        └── src/
            ├── main.tsx                 ← React entry point
            ├── App.tsx                  ← All routes
            ├── index.css                ← Tailwind base + CSS tokens
            ├── lib/
            │   ├── mockData.ts          ← All static data (areas, complaints, stats)
            │   ├── api.ts               ← Fake async API (wraps mockData)
            │   └── types.ts             ← Shared TypeScript interfaces
            ├── features/
            │   ├── auth/
            │   │   ├── AuthProvider.tsx ← Auth context + useAuth hook
            │   │   └── LoginPage.tsx
            │   ├── public/
            │   │   ├── HomePage.tsx
            │   │   ├── PublicMapPage.tsx
            │   │   ├── AwarenessPage.tsx
            │   │   ├── HowToReportPage.tsx
            │   │   ├── PublicReportPage.tsx
            │   │   ├── ComplaintTrackPage.tsx
            │   │   └── AreaDetailModal.tsx
            │   └── admin/
            │       ├── overview/        ← AdminOverviewPage
            │       ├── map/             ← AdminMapPage
            │       ├── analytics/       ← AdminAnalyticsPage
            │       ├── complaints/      ← AdminComplaintsPage
            │       ├── config/          ← AdminConfigPage
            │       ├── users/           ← AdminUsersPage
            │       └── notifications/   ← AdminNotificationsPanel
            └── components/
                ├── layout/
                │   ├── PublicLayout.tsx ← Public header + footer
                │   └── AdminLayout.tsx  ← Admin sidebar + shell
                ├── map/
                │   ├── CyberMap.tsx     ← Core MapLibre map component
                │   └── MapFallback.tsx  ← SVG fallback (no WebGL)
                └── ui/                  ← shadcn/ui primitives
```

---

## Prerequisites

Make sure the following are installed on your machine:

- **Node.js** ≥ 18 — [nodejs.org](https://nodejs.org)
- **npm** ≥ 9 (ships with Node.js, used to bootstrap pnpm)

You do **not** need to install pnpm globally — the setup commands below use `npx` to invoke it.

---

## Setup & Installation

### 1. Clone or download the project

```bash
git clone <your-repo-url> Cyber-Scam-Map
cd Cyber-Scam-Map
```

### 2. Install all dependencies

Run this from the **monorepo root** (`Cyber-Scam-Map/`):

```bash
npx -y pnpm install
```

This installs all workspace packages including the main SPA.

### 3. Configure the environment file

The map requires a **MapTiler API key**. The `.env` file is already pre-configured at:

```
artifacts/cybersafe-gurugram/.env
```

It contains:
```env
VITE_MAP_STYLE=https://api.maptiler.com/maps/streets-v4/style.json?key=<API_KEY>
```

> ⚠️ **To use your own key:** Sign up at [maptiler.com](https://www.maptiler.com/), create an API key, and replace the value of `VITE_MAP_STYLE` with your URL.

If you skip this step, the map will fall back to MapLibre's free demo tiles (lower quality, no street detail).

---

## Running the Project

### ▶️ Start the development server

From the **monorepo root** (`Cyber-Scam-Map/`):

```bash
npx -y pnpm --filter @workspace/cybersafe-gurugram run dev
```

Open your browser at:

```
http://localhost:5173
```

The Vite dev server supports **Hot Module Replacement (HMR)** — source file changes update the browser instantly.

### 📦 Build for production

```bash
npx -y pnpm --filter @workspace/cybersafe-gurugram run build
```

Output goes to `artifacts/cybersafe-gurugram/dist/`.

### 👁️ Preview the production build

```bash
npx -y pnpm --filter @workspace/cybersafe-gurugram run serve
```

Serves the production bundle at `http://localhost:4173`.

### ✅ Type-check only

```bash
npx -y pnpm --filter @workspace/cybersafe-gurugram run typecheck
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_MAP_STYLE` | Recommended | Full MapTiler (or any MapLibre-compatible) style URL including API key. Falls back to free MapLibre demo tiles if omitted. |

All Vite environment variables **must** be prefixed with `VITE_` to be accessible in the browser bundle.

---

## All Pages & Features

### 🌐 Public Pages (Citizen-Facing)

#### `/` — Home Page
The landing page of the portal.
- Hero banner with the portal name and mission statement.
- **Live stats cards:** Total complaints filed, total financial loss reported, and the most prevalent scam type.
- Quick navigation tiles to the Map, Awareness Hub, and How to Report pages.
- Prominent link to Helpline **1930** (National Cyber Crime Helpline).

---

#### `/map` — Scam Hotspot Map ⭐ (Core Feature)

The centrepiece of the portal — an interactive choropleth map of Gurugram.

**Map:**
- **Polygon Zones:** Each of the 10 localities is a filled GeoJSON polygon.
  - 🔴 Red = High Risk | 🟡 Amber = Medium Risk | 🟢 Green = Low Risk
- **Hover tooltip:** Area name, complaint count, and risk level.
- **Click to select:** Highlights the polygon and loads area details in the sidebar.
- **3D perspective:** pitch 45° + bearing −20° for a cinematic feel.

**Sidebar — City Overview (default):** Total complaints, loss, high-risk count, top scam types, and a list of all 10 areas.

**Sidebar — Area Details (after click):** Area name, police station, risk badge, complaint count, total loss, top scam types, and a "View Full Details" button.

**Filters:** Scam Type · Date Range · Police Station · Risk Level — all work simultaneously.

**Area Detail Modal:** Modus operandi, all top scam types, red flags, response steps, and a "File Complaint" link.

---

#### `/awareness` — Awareness Hub
Educational content for all 10 scam types.

Each card contains: description, red flags, what to do, and modus operandi for: UPI Fraud, QR Code Scam, Task Fraud, Sextortion, Investment Scam, Job Scam, Fake KYC, Electricity Bill Scam, OTP Fraud, Social Media Fraud.

---

#### `/how-to-report` — How to Report
Step-by-step reporting guide:
1. Call **1930** (National Cyber Crime Helpline)
2. File at [cybercrime.gov.in](https://cybercrime.gov.in)
3. Visit the nearest Gurugram Police Station
4. Use this portal's complaint form

---

#### `/report` — File a Complaint
Validated complaint submission form with fields for: Date, Scam Type, Channel, Locality, Police Station, Amount Lost, Age Band, Gender, Risk Level. Returns a reference ID on submission.

---

#### `/track` — Track Your Complaint
Enter a reference ID (format: `CMP-XXXXXXX` or `CYB-XXXX-NNNN`) to see a visual 5-stage progress timeline:
**Received → Under Review → Forwarded to PS → In Investigation → Closed**

---

#### `/login` — Login Page
Enter any email and password. Role is derived from the email (see [Authentication](#authentication)).

---

### 🔐 Admin Dashboard (Police Analyst)

> Access by logging in with an email containing `admin`, e.g. `admin@police.gov.in`

| Route | Page | Key Content |
|-------|------|-------------|
| `/admin` | Overview | KPI cards + weekly trend chart + top scam types |
| `/admin/map` | Intelligence Map | Full map with MO text + playbooks per zone |
| `/admin/analytics` | Analytics | Monthly trend, scam type, channel, age, gender charts |
| `/admin/complaints` | Complaints Table | Searchable/filterable complaint records |
| `/admin/config` | Risk Config | Set High/Medium risk score thresholds |
| `/admin/users` | Users | Manage analyst accounts and roles |

---

## Authentication

The app uses **simulated role-based auth** backed by `localStorage`.

```
Email contains "admin"  →  role: admin   →  /admin dashboard
Any other email         →  role: public  →  / homepage
```

**Test credentials:**

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@police.gov.in` | (anything) |
| Public | `citizen@example.com` | (anything) |

The `useAuth()` hook exposes: `user`, `isAuthenticated`, `isAdmin`, `login()`, `logout()`.

---

## Data Layer

### `src/lib/mockData.ts`
All static data:
- `mockAreas` — 10 localities with risk scores, complaint counts, scam types, modus operandi, and GeoJSON polygon boundaries
- `mockComplaints` — 50 randomly generated complaint records (reset on page reload)
- `mockStats` — aggregate monthly/weekly trends, scam type & channel distributions
- `playbooks` — investigation playbooks for all 10 scam types

### `src/lib/api.ts`
Fake async API wrapping mockData. Returns `Promise<T>` with 300–600ms delay.
Every function has a `// TODO: GET/POST /api/...` comment pointing to the real endpoint it should call.

### `src/lib/types.ts`
Shared TypeScript interfaces: `AreaPolygon`, `MapFilters`, `ComplaintFilters`, `CreateComplaintPayload`, `ComplaintStatus`, `RiskThresholdConfig`, `ApiResponse<T>`.

---

## Map Component

**`src/components/map/CyberMap.tsx`**

| Prop | Type | Description |
|------|------|-------------|
| `areas` | `Area[]` | Localities to render |
| `selectedAreaId` | `number \| null` | Currently highlighted area |
| `onAreaClick` | `(id: number) => void` | Click callback |
| `className` | `string?` | Wrapper CSS class |

MapLibre render layers (in order): choropleth fill polygons → subtle circle anchors → locality name labels (zoom ≥ 12) → hover popup.

Falls back to `<MapFallback>` SVG pseudo-map if WebGL is unavailable.

---

## Scripts Reference

All commands run from the **monorepo root** (`Cyber-Scam-Map/`):

| Command | Description |
|---------|-------------|
| `npx -y pnpm install` | Install all dependencies |
| `npx -y pnpm --filter @workspace/cybersafe-gurugram run dev` | **Start dev server** → `localhost:5173` |
| `npx -y pnpm --filter @workspace/cybersafe-gurugram run build` | Production build → `dist/` |
| `npx -y pnpm --filter @workspace/cybersafe-gurugram run serve` | Preview production build → `localhost:4173` |
| `npx -y pnpm --filter @workspace/cybersafe-gurugram run typecheck` | TypeScript check (no output) |
| `npx -y pnpm run typecheck` | Type-check all workspace packages |

---

## Connecting a Real Backend

Every function in `src/lib/api.ts` has a `TODO` comment. To go live:

1. Replace each function body with `fetch()` / `axios` calls to your backend.
2. Keep the **return types identical** — UI needs zero changes.
3. Replace `AuthProvider` fake login with a real JWT/session call.
4. Swap mock polygon coordinates with real Haryana GIS boundary shapefiles.

**Example:**
```ts
// BEFORE (mock)
getComplaints: async (): Promise<Complaint[]> => {
  return delay(mockComplaints);
},

// AFTER (real backend)
getComplaints: async (): Promise<Complaint[]> => {
  const res = await fetch('/api/admin/complaints', {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return res.json();
},
```

---

## Roadmap

- [ ] Real Node.js / Express + PostgreSQL backend
- [ ] PostGIS for spatial complaint aggregation
- [ ] Precise Gurugram ward/PS GIS boundary shapefiles
- [ ] Integration with cybercrime.gov.in complaint feed
- [ ] OAuth 2.0 / SSO for police staff
- [ ] Real-time push notifications (WebSocket / SSE)
- [ ] Offline PWA support
- [ ] PDF / Excel complaint export
- [ ] Mobile-responsive admin layout

---

## License

This project is built for educational and civic purposes. All complaint data is entirely synthetic and does not represent real individuals or cases.
