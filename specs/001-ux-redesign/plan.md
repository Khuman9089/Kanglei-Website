# Implementation Plan: KangleiAstro & SuryaSiddha Full UX/UI Redesign

**Branch**: `001-ux-redesign` | **Date**: 2026-10-07 | **Spec**: [spec.md](file:///c:/Users/MayNard/Desktop/kangleiAstro/specs/001-ux-redesign/spec.md)

**Input**: Feature specification from `specs/001-ux-redesign/spec.md`

## Summary

Complete UX/UI redesign of both the KangleiAstro Next.js web portal and the SuryaSiddha Vedic Calendar PWA/Android application. Delivers a unified royal midnight-gold design system, fixed status-bar insets, history-driven back navigation, offline resilience, and high-conversion aesthetic polish.

## Technical Context

**Language/Version**: TypeScript 5.7+ / Node.js 20+  
**Primary Dependencies**: Next.js 15, Tailwind CSS, Lucide Icons, Framer Motion / CSS Transitions, Vite 6, React 19  
**Storage**: LocalStorage (`suryasiddha_user_profile_v1`, `suryasiddha_admin_config`), IndexedDB / ServiceWorker Cache  
**Testing**: Production bundle validation (`npm run build`, SuryaSiddha build, Android Gradle build)  
**Target Platform**: Responsive Web (Desktop, Tablet, Mobile) & Android PWA / TWA (APK/AAB)  
**Project Type**: Monorepo-style dual web application + Android wrapper  
**Performance Goals**: Core Web Vitals LCP < 2.5s, CLS < 0.1, 60fps animations  
**Constraints**: Zero regression on PayU payments, Facebook cron endpoints, and ads.txt verification  
**Scale/Scope**: 2 applications (Next.js web portal + SuryaSiddha app), ~15 core screens and components  

## Constitution Check

- [x] **Principle I (Visual Excellence)**: Midnight & gold palettes, Cinzel & Outfit typography, glassmorphism, responsive micro-animations.
- [x] **Principle II (Seamless Mobile & Navigation UX)**: Safe-area status bar insets and history popstate back navigation implemented.
- [x] **Principle III (Offline Resilience)**: Client-side ephemeris calculation and ServiceWorker caching active.
- [x] **Principle IV (Zero-Regression)**: PayU, Facebook cron, Supabase, and ads.txt routes protected.
- [x] **Principle V (Performance & Next.js Hygiene)**: All changes adhere to clean App Router conventions and pass production build.

## Project Structure

### Documentation (this feature)

```text
specs/001-ux-redesign/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Technical research & architectural decisions
├── data-model.md        # UI tokens and state models
├── quickstart.md        # Verification and preview guide
└── tasks.md             # Actionable task list
```

### Source Code

```text
# Web Portal (Next.js)
src/
├── app/
│   ├── globals.css              # Global tokens & design utilities
│   ├── layout.tsx               # Root layout & font injections
│   └── page.tsx                 # Redesigned home landing page
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx           # Redesigned glassmorphic header
│   │   ├── Footer.tsx           # High-trust footer
│   │   └── MobileBottomNav.tsx  # Mobile navigation dock
│   └── home/
│       ├── HeroSection.tsx      # High-impact cosmic hero
│       ├── FeaturedServices.tsx # Polished consultation cards
│       ├── TopAstrologersSection.tsx # Verified pandit cards
│       └── ZodiacGrid.tsx       # Daily rashifal selector

# Mobile PWA / Android (SuryaSiddha)
SuryaSiddha/
├── src/
│   ├── index.css                # PWA cosmic tokens & typography
│   ├── App.tsx                  # Back-button navigation & state
│   └── components/
│       ├── layout/
│       │   └── StickyHeader.tsx # Fixed status-bar inset header
│       ├── navigation/
│       │   └── BottomNavigation.tsx # Ergonomic bottom tab bar
│       ├── panchang/
│       │   └── PanchangScreen.tsx   # Redesigned daily panchang cards
│       └── kundli/
│           └── KundliScreen.tsx     # Modernized Vedic chart cards
```

## Complexity Tracking

No constitution violations detected. Standard CSS variables, React state, and existing Next.js App Router patterns are utilized.
