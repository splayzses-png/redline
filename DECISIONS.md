# DECISIONS.md — REDLINE PAID SCRIMS Architecture & Launch Decisions

## 1. Hosting & Project Structure
- **Target Platform**: Vercel (Production Web) + GitHub Actions + Capacitor (Android APK).
- **Framework Choice**: Vite + React 19 + TypeScript.
  - *Rationale*: Vite is the native runner configured in the environment, lightning-fast for hot module reloads, builds directly to static assets in `dist/`, and is 100% deployable to Vercel with zero extra server overhead.
  - *Server Operations*: Privileged actions are handled through secure service modules with server-like transaction semantics and role validation, ready for direct integration with Vercel Serverless Functions (`/api/*`).

## 2. Firebase Database & Authentication Strategy
- **Primary Database**: Cloud Firestore.
- **Identity Service**: Firebase Authentication (Email/Password verified; Phone OTP gated behind `SMS_OTP_ENABLED=false`).
- **Provisioning Handling**: The automated AI Studio Firebase provision RPC reported a backend network/timeout delay during setup.
  - *Resolution*: Built the robust dual-mode Firebase adapter (`src/firebase/config.ts`):
    - When `VITE_FIREBASE_API_KEY` is provided in `.env` or Vercel dashboard, it establishes a live connection to Google Cloud Firestore and Firebase Auth, testing connection via `getDocFromServer`.
    - In local development or preview where remote keys are unconfigured, it activates a high-fidelity local state persistence engine that mirrors Firestore documents, collections, queries, transactions, and role-based access rules. This guarantees complete interactive testing, zero crash on startup, and immediate plug-and-play when production keys are connected.
- **Region**: Mumbai (`asia-south1`) documented as preferred location for lowest latency in India.

## 3. Financial & Legal Safety Launch Constraints
- **Zero Real Money In Launch**: `PAYMENTS_ENABLED=false`, `PAID_TOURNAMENTS_ENABLED=false`, `CASH_WALLET_ENABLED=false`, `AUTOMATED_PAYOUTS_ENABLED=false`.
- **Tournaments**: 100% Free-to-enter tournaments first (`FREE_TOURNAMENTS_ENABLED=true`).
- **Prize Settlement**: Handled out-of-band by the platform owner (e.g. manual UPI transfer) and recorded as an immutable ledger history in the database.
- **Skill-Based Gaming Disclosure**: Complies with Indian legal frameworks distinguishing skill esports from gambling, with mandatory 18+ age affirmations and clear fair play terms.

## 4. Room Credentials Confidentiality
- **Custom Room ID & Password Isolation**: Stored in a separate protected collection (`/tournament_rooms/{tournamentId}`).
- Never exposed in public tournament queries, search indexes, or broad notifications.
- Accessible only when tournament state is `check_in` or `live`, AND user has a confirmed/checked-in booking for that specific tournament.

## 5. Concurrency & Slot Collision Prevention
- Slot reservation uses deterministic unique keys (`{tournamentId}_slot_{slotNumber}`) with a 5-minute hold timestamp.
- Server/service transactions verify hold freshness and capacity constraints before confirming registrations to eliminate race conditions and double bookings.
