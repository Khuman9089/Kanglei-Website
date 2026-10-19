# KangleiAstro & SuryaSiddha Project Constitution

## Core Principles

### I. Premium Visual Excellence & Rich Aesthetics
The interface across both the web portal (KangleiAstro) and the mobile PWA/Android app (SuryaSiddha) must deliver a stunning, trustworthy, and modern Vedic aesthetic:
- Curated color palettes: Deep cosmic midnight/indigo (`#0b0f19`, `#121829`), radiant gold/amber accents (`#f59e0b`, `#d97706`, `#fbbf24`), subtle spiritual saffron, and refined dark/light mode balance.
- Modern typography: Elegant headings (Cinzel / Outfit) and legible body fonts (Inter / Outfit) instead of system fallbacks.
- Glassmorphism, smooth border glows, subtle ambient gradients, and responsive micro-animations for high perceived quality.
- Strictly avoid generic, flat, or bare-minimum MVP looks.

### II. Seamless Mobile & App Navigation UX
- Flawless Android & mobile viewport handling: full support for edge-to-edge status bar insets and bottom navigation bars.
- Browser and hardware back button behavior must navigate history steps smoothly rather than exiting the application prematurely.
- Instant feedback on touch targets (minimum 44x44px touch sizes) with haptic/active states.

### III. Offline Resilience & Reliability
- SuryaSiddha calendar, panchang tables, and core astrological reference tools must function seamlessly offline via robust service worker caching.
- Network requests must gracefully degrade with informative offline banners or cached fallbacks instead of broken blank views.

### IV. Zero-Regression Architecture
- Existing critical business capabilities must NEVER be broken:
  - PayU payment gateway integration (`src/lib/payu.ts`, payment verification endpoints)
  - Facebook auto-posting and astrology cron jobs (`src/app/api/cron/...`, `src/lib/facebook.ts`)
  - Authentication flows (`src/app/api/auth/...`)
  - Kundli calculation engines and ephemeris accuracy
- App-ads.txt and ads.txt verification routes must remain strictly reachable.

### V. Performance & Clean App Router Conventions
- Strictly follow Next.js App Router rules.
- Fast initial page load times, optimized image assets, and clean hydration.
- Maintain build hygiene (`npm run build` passes with zero TypeScript or route compilation errors).

## Governance
- All UI/UX redesigns and functional changes must align with these constitutional principles.
- Code changes must be verified through builds and runtime checks before release.

**Version**: 1.0.0 | **Ratified**: 2026-10-07 | **Last Amended**: 2026-10-07
