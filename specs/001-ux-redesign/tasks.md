---
description: "Task list for KangleiAstro & SuryaSiddha Full UX/UI Redesign"
---

# Tasks: KangleiAstro & SuryaSiddha Full UX/UI Redesign

**Input**: Design documents from `specs/001-ux-redesign/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`

## Organization
Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Belongs to user story (US1, US2, US3, US4)

---

## Phase 1: Setup & Design System Tokens

**Purpose**: Core styling variables and shared tokens

- [x] T001 Initialize Spec Kit integration in project with `specify init --here --force --non-interactive --integration agy --script ps`
- [x] T002 Formulate project constitution in `.specify/memory/constitution.md`
- [x] T003 Formulate feature specification, implementation plan, research, and data model in `specs/001-ux-redesign/`
- [x] T004 Refine global tokens and typography in `src/app/globals.css` (Midnight indigo, royal gold, font definitions, glassmorphism utilities)
- [x] T005 [P] Refine global tokens in `SuryaSiddha/src/index.css` (Smooth scroll, safe-area insets, cosmic background)

---

## Phase 2: User Story 1 - Immersive & Premium Astrological Web Portal (Priority: P1)

**Goal**: Elevate the web portal interface with modern typography, glassmorphism, responsive navigation, and high-impact visual design.

- [ ] T006 [US1] Redesign navigation bar in `src/components/layout/Navbar.tsx` with backdrop blur, golden accents, and clean mobile menu drawer
- [x] T007 [P] [US1] Redesign mobile bottom dock in `src/components/layout/MobileBottomNav.tsx` with floating pill style and safe-area insets
- [ ] T008 [US1] Redesign Hero Section in `src/components/home/HeroSection.tsx` with cosmic radiance, astrological badges, and high-conversion CTAs
- [x] T009 [P] [US1] Redesign Featured Services in `src/components/home/FeaturedServices.tsx` with glassmorphic cards, gold price tags, and micro-hover animations
- [ ] T010 [P] [US1] Polish Top Astrologers in `src/components/home/TopAstrologersSection.tsx` with verified badges and streamlined consultation buttons
- [ ] T011 [P] [US1] Polish Trust Pillars & Footer in `src/components/home/TrustPillars.tsx` and `src/components/layout/Footer.tsx`

---

## Phase 3: User Story 2 - Elevated SuryaSiddha Vedic App Interface & Navigation (Priority: P1)

**Goal**: Deliver a seamless mobile experience in SuryaSiddha with status-bar safe padding, smooth tab switching, and intuitive back-navigation.

- [x] T012 [US2] Enhance `SuryaSiddha/src/components/layout/StickyHeader.tsx` with safe-area status bar spacing and sleek location chip
- [x] T013 [US2] Enhance `SuryaSiddha/src/components/navigation/BottomNavigation.tsx` with active indicator animations and comfortable touch targets
- [ ] T014 [US2] Polish `SuryaSiddha/src/components/panchang/PanchangScreen.tsx` with cosmic contrast cards for Tithi, Nakshatra, and Muhurta timings
- [x] T015 [US2] Validate history state popstate handler in `SuryaSiddha/src/App.tsx` ensuring hardware Back returns to previous tab/modal without closing app

---

## Phase 4: User Story 3 - Resilient Offline Experience & Asset Synchronization (Priority: P2)

**Goal**: Ensure SuryaSiddha PWA remains 100% functional offline with fast asset caching and synchronized public builds.

- [x] T016 [US3] Verify PWA service worker caching and offline fallback in `SuryaSiddha/public/sw.js`
- [x] T017 [US3] Build and sync SuryaSiddha distribution bundles to `public/suryasiddha/` and `android-twa/app/src/main/assets/`

---

## Phase 5: Verification & Production Release Gates

**Goal**: Confirm build integrity, zero regressions on PayU and Facebook cron routes, and ads.txt crawler compliance.

- [x] T018 Validate Next.js production build (`npm run build`)
- [x] T019 Validate SuryaSiddha production build (`npm run build` in `SuryaSiddha/`)
- [x] T020 Validate ads.txt / app-ads.txt endpoints (`/ads.txt`, `/app-ads.txt`)
