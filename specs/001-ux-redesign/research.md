# Phase 0 Research: KangleiAstro & SuryaSiddha Full UX/UI Redesign

## Research Findings & Architecture Decisions

### Decision 1: Visual Theme & Design Tokens System
- **Chosen Approach**: Standardized Dual Cosmic Palette across Next.js and SuryaSiddha.
  - Base Surfaces: Deep Midnight Slate (`#0B0F19`, `#0F172A`), Elevated Dark Surfaces (`#131B2E`, `#1E293B`).
  - Accents: Royal Gold (`#F59E0B`, `#D97706`, `#FBBF24`), Spiritual Saffron (`#EA580C`), Subtle Emerald (`#10B981` for auspicious timings), and Crimson (`#EF4444` for inauspicious Rahu Kalam).
  - Borders & Glass: `rgba(255, 255, 255, 0.08)` borders with backdrop blur (`backdrop-blur-md`).
- **Rationale**: Elevates perceived trust, antiquity, and spiritual elegance without feeling dark or dingy.
- **Alternatives Considered**: Light-only theme (rejected: Vedic astronomy apps have significantly higher retention with starry/cosmic dark themes).

### Decision 2: Typography Stack
- **Chosen Approach**:
  - Headings: `Cinzel` (or `Cormorant Garamond` fallback) for majestic astrological titles.
  - Body & UI: `Outfit` and `Inter` for clean, high-legibility numerical and tabular data (tithi, degrees, nakshatras).
  - Manipuri / Regional: Preserved custom `Blipi15` & `Budha` font faces for native Meitei Mayek script rendering.
- **Rationale**: Combining a classical serif header with a modern geometric sans-serif body provides instant visual impact while retaining readability.

### Decision 3: SuryaSiddha Header & Android Status Bar Insets
- **Chosen Approach**: Native safe-area insets with dynamic CSS padding:
  - Top padding: `pt-[max(0.75rem,env(safe-area-inset-top,0.75rem))]` in `StickyHeader.tsx`.
  - Android `MainActivity.java` already configured with `fitsSystemWindows = false` and `ViewCompat.setOnApplyWindowInsetsListener`.
  - Bottom padding: `pb-[max(0.5rem,env(safe-area-inset-bottom,0.5rem))]` in `BottomNavigation.tsx`.
- **Rationale**: Resolves the user-reported issue where the status bar mixed up with the header UI on Android notches and hole-punch displays.

### Decision 4: History-Driven Back Navigation
- **Chosen Approach**: Tab and modal state synchronized with `window.history.pushState({ tab })` and `window.addEventListener('popstate')`.
  - Pressing hardware Back or gesture Back steps through open dialogs, then previous tabs, returning to `panchang` before native exit.
- **Rationale**: Directly solves user request ("while click back button the app close mean if a person want to return to previous page it close").

### Decision 5: Offline First Ephemeris & Service Worker
- **Chosen Approach**:
  - Core astronomical engine (`src/utils/astronomy/engine.ts`) runs 100% in pure client-side TypeScript with astronomical VSOP87 / Surya Siddhanta formulas.
  - PWA service worker caches all static JS/CSS bundles, icons, and fonts via Stale-While-Revalidate and Cache-First strategies.
- **Rationale**: The app functions completely offline without internet for daily calculations.
