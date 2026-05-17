# Vendor Invoice Payment Management System (MVP)

Premium fintech-style dashboard MVP for vendor invoice intake, AI extraction, approvals, and payments.

## Features (MVP)
- Vendor management
- Invoice upload and status tracking
- AI extraction stub (Gemini-ready)
- Work verification and approvals workflow placeholders
- Payment tracking and overdue alerts
- Founder dashboard with KPI overview

## Tech Stack
- React + Vite
- Tailwind CSS
- Firebase (Auth, Firestore, Storage)
- Gemini API (stubbed)
- Vercel deployment-ready

## Getting Started
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Environment Variables
Create a `.env` file from `.env.example`.

Required:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_GEMINI_API_KEY`

## Firebase Collections
- `vendors`
- `invoices`
- `approvals`
- `payments`
- `users`
- `activity_logs`

## Project Notes
- Dashboard UI is in [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx).
- Vendor management UI is in [src/pages/Vendors.jsx](src/pages/Vendors.jsx).
- Firebase setup is stubbed in [src/lib/firebase.js](src/lib/firebase.js).
- Gemini extraction stub is in [src/services/gemini.js](src/services/gemini.js).

## Next Steps
- Wire Firebase CRUD for vendors, invoices, approvals, and payments
- Implement invoice upload flow (Storage + Firestore)
- Connect Gemini API for extraction
