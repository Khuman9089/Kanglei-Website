# Feature Specification: KangleiAstro & SuryaSiddha Full UX/UI Redesign

**Feature Branch**: `001-ux-redesign`

**Created**: 2026-10-07

**Status**: Draft

**Input**: User description: "let redesign the whole project to make it better user experience first let install spec kit from github"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Immersive & Premium Astrological Web Portal (Priority: P1)

As a visitor exploring KangleiAstro for horoscope calculations, astrology consultations, or auspicious dates (Kuthi Yengba / Meitei Panjika), I want to experience a visually stunning, responsive, and trustworthy interface with rich cosmic aesthetics, elegant typography, and clear calls-to-action so that I feel confident in the accuracy, authenticity, and professionalism of the services.

**Why this priority**: The web portal is the primary digital gateway for customers across Manipur and globally seeking astrology services, shopping for spiritual items, or booking pandits/astrologers. Elevating the visual hierarchy directly boosts engagement, conversion, and trust.

**Independent Test**: Can be tested by navigating the home landing page, service listings, and consultation booking across desktop, tablet, and mobile browsers, validating responsive typography, rich color palettes, and interactive transitions.

**Acceptance Scenarios**:
1. **Given** a user lands on the KangleiAstro homepage, **When** the page loads, **Then** they see a cohesive royal midnight-indigo and warm gold cosmic theme, crystal-clear typography (Cinzel & Outfit/Inter), glassmorphic highlight cards, and smooth hover micro-animations.
2. **Given** a mobile user navigating the site, **When** scrolling through featured services, astrological tools, or booking, **Then** touch targets are easily clickable (>=44px), content never overflows horizontally, and the mobile bottom navigation bar floats cleanly above Android and iOS safe-area insets.
3. **Given** a user explores services or astrology tools, **When** they interact with cards, tabs, or modal triggers, **Then** visual feedback is instant, legible, and uncluttered.

---

### User Story 2 - Elevated SuryaSiddha Vedic App Interface & Navigation (Priority: P1)

As a daily user of the SuryaSiddha Vedic Calendar & Panchang mobile application on Android/PWA, I want an uncluttered, modern Vedic user interface with seamless header status-bar alignment, quick-glance daily panchang metrics, and intuitive gestures so that my daily spiritual calculations are effortless and delightful.

**Why this priority**: Addresses direct user feedback regarding mobile status bar insets mixing up with UI elements, clunky navigation, and outdated UI presentation in the Google Play store release.

**Independent Test**: Can be tested directly on the PWA and inside Android WebView / TWA by loading Panchang, Kundli, Muhurta, and Settings screens, verifying status-bar edge-to-edge padding, top header branding, and bottom tab bar active states.

**Acceptance Scenarios**:
1. **Given** an Android user opens the SuryaSiddha app, **When** the app renders on devices with camera cutouts or status bars, **Then** the header content is comfortably padded below the top status bar with zero overlap or awkward visual clipping.
2. **Given** a user navigates between Panchang, Kundli, Muhurta, and Ephemeris screens, **When** tapping the bottom navigation tabs, **Then** smooth animated indicator pills highlight the active tab, and pressing hardware/gesture Back returns to the previous screen rather than closing the app.
3. **Given** a user reviews daily panchang timings (Tithi, Nakshatra, Yoga, Karana, Rahu Kalam, Sunrise/Sunset), **When** viewing the primary card, **Then** the astrological data is formatted in high-contrast cosmic cards with crisp iconography and regional language toggle support.

---

### User Story 3 - Resilient Offline Experience & Fast State Continuity (Priority: P2)

As an on-the-go user who frequently encounters intermittent or zero internet connectivity in remote areas, I want SuryaSiddha's astronomical calculations and core panchang reference data to remain fully available offline with a clear status indicator, so that I can look up auspicious times anytime without disruption.

**Why this priority**: Essential for a reliable daily utility app; mobile users expect core calendar and planetary chart functions to remain operational when offline.

**Independent Test**: Can be tested by toggling network offline in DevTools or airplane mode on an Android device and verifying that calendar navigation, Kundli generation, and cached app views load instantly without error screens.

**Acceptance Scenarios**:
1. **Given** the device goes offline, **When** the user opens SuryaSiddha, **Then** the service worker serves cached shell assets and client-side ephemeris algorithms calculate Panchang data locally.
2. **Given** an offline state, **When** the user attempts an action requiring internet (e.g. cloud sync or ads), **Then** an unobtrusive offline notification badge is shown without crashing or freezing the UI.

---

### User Story 4 - Consistent Design System & Reusable UI Tokens (Priority: P2)

As a developer and stakeholder maintaining both web and mobile experiences, I want a shared, unified design token architecture (Tailwind / CSS variables for colors, elevation, border-radii, glassmorphism, and typography) so that future features maintain visual harmony and brand consistency.

**Why this priority**: Prevents design drift and ensures high maintainability across both Next.js and SuryaSiddha codebases.

**Independent Test**: Can be tested by verifying token definitions in CSS and checking that components reuse shared tokens rather than arbitrary ad-hoc inline styles.

**Acceptance Scenarios**:
1. **Given** the UI stylesheets, **When** examining design variables, **Then** standardized color tokens (`--midnight-*`, `--gold-*`, `--surface-*`), shadows, and font stacks are centrally defined and documented.
2. **Given** component modifications, **When** updating themes or typography, **Then** changes cascade cleanly without broken contrast ratios.

---

### Edge Cases

- **Variable Mobile Screen Heights & Foldables**: Layouts must use fluid grid/flex scaling and safe-area variables (`env(safe-area-inset-top)` / `env(safe-area-inset-bottom)`) so that screens with notches, navigation pills, or split-screen views never clip crucial CTA buttons.
- **Extreme Font Scaling / Accessibility**: High accessibility font sizes (125%-150% text scaling on Android) must wrap text gracefully without breaking badge badges or card borders.
- **Corrupted or Cleared Local Storage**: If local storage is wiped, the app must smoothly hydrate default astronomical coordinates (New Delhi / Imphal) without throwing unhandled exceptions.
- **Slow Network & Asset Loading**: All web fonts (Cinzel, Outfit, Inter) must include `font-display: swap` and system fallbacks so content remains readable during font loading without layout shift (CLS).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST implement a unified cosmic color system featuring deep midnight indigo surfaces (`#090D16`, `#0F172A`), royal gold accents (`#F59E0B`, `#D97706`), and subtle spiritual saffron gradients.
- **FR-002**: The web portal homepage MUST feature an overhauled hero section with clear value propositions, dynamic astrological badges, and direct links to Kuthi consultation, Panchang, and store.
- **FR-003**: The web navigation header and footer MUST be redesigned with clean sticky glassmorphism, intuitive dropdowns, prominent contact/booking actions, and mobile bottom drawer access.
- **FR-004**: Service cards (Featured Services, Astrologer profiles, E-Store items) MUST use consistent glassmorphic card layouts with subtle hover elevations, badge highlights, and clear pricing/booking triggers.
- **FR-005**: SuryaSiddha mobile application MUST ensure the top sticky header respects mobile status bar insets with minimum safe padding, eliminating any overlay issues on notched or punch-hole displays.
- **FR-006**: SuryaSiddha mobile application MUST provide an animated, ergonomic bottom navigation bar with active state indicators and haptic-friendly touch targets.
- **FR-007**: SuryaSiddha daily Panchang view MUST be restructured into high-readability cards:
  - Hero Astronomical Summary (Sun/Moon rashi, Sunrise/Sunset, Vikram Samvat / Saka Era)
  - Core Panchang Attributes (Tithi, Nakshatra, Yoga, Karana, Paksha)
  - Auspicious & Inauspicious Timings (Abhijit Muhurta, Rahu Kalam, Yamaganda, Gulika)
- **FR-008**: The app MUST retain history stack synchronization so Android hardware/gesture back presses traverse modal states and previous tabs rather than abruptly exiting the app.
- **FR-009**: The app and web portal MUST maintain 100% backward compatibility with existing PayU payment flows, Facebook auto-posting cron endpoints, and app-ads.txt/ads.txt verification URLs.

### Key Entities

- **DesignTokenSystem**: Definitions of primary midnight palettes, gold gradients, typography tokens, border radii, glass surfaces, and safe-area insets.
- **PanchangDisplayCard**: Visual component encapsulating daily celestial coordinates, auspicious muhurta bands, and tithi durations.
- **NavigableTabState**: Browser history state model mapping active routes and dialogs to URL hashes for Android back-button handling.
- **ServiceShowcaseItem**: Data model for featured consultation services, pricing, astrologer credentials, and booking actions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% elimination of status bar overlap and touch interference on mobile and Android WebView environments across all screen sizes.
- **SC-002**: Page load time on mobile 3G/4G network under 2.5 seconds with zero Cumulative Layout Shift (CLS < 0.1) from custom fonts.
- **SC-003**: SuryaSiddha core Panchang and Kundli screens remain 100% operable and responsive when completely disconnected from network.
- **SC-004**: Hardware and gesture back presses in mobile app successfully step back through open modals and previous tabs 100% of the time instead of closing the application.
- **SC-005**: All Next.js and SuryaSiddha build tasks (`npm run build`, `npm run build` in SuryaSiddha) complete with 0 errors and 0 lint failures.

## Assumptions

- Both web and mobile applications share common brand aesthetics (KangleiAstro and SuryaSiddha) while serving their specific form factors (Next.js responsive web and Vite/React Android PWA).
- Existing backend API routes and external integrations (PayU, Facebook Graph API, Supabase) remain intact and are not replaced by this UI redesign.
- Modern browsers (Chrome, Edge, Safari, Android WebView >= 90) are targeted with modern CSS support for variables, flexbox, grid, and `env(safe-area-inset-*)`.
