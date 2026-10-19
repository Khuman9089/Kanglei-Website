# Quickstart & Verification Guide: KangleiAstro & SuryaSiddha Full UX/UI Redesign

## Overview

This guide provides test commands and verification steps to validate the redesigned UI and ensure no regressions occurred.

## Verification Steps

### 1. Web Portal Verification (Next.js)

```bash
# Verify production compilation
npm run build

# Start local server to preview
npm run start
```

**Checklist:**
- [ ] Open `http://localhost:3000/` and verify the responsive hero section with royal midnight/gold color scheme.
- [ ] Verify Navbar glassmorphism on scroll.
- [ ] Verify mobile viewport (width < 640px): bottom navigation bar renders cleanly with correct safe areas.
- [ ] Verify `/ads.txt` and `/app-ads.txt` routes return valid crawler strings.

### 2. SuryaSiddha PWA Verification

```bash
cd SuryaSiddha
npm run build
```

**Checklist:**
- [ ] Top header has `env(safe-area-inset-top)` padding and does not clip on notch/status bar.
- [ ] Clicking bottom tabs updates the URL hash (`#panchang`, `#kundli`, `#muhurta`, `#settings`).
- [ ] Browser back button navigates to previous tab instead of closing the page.
- [ ] Test offline mode in Chrome DevTools (Network -> Offline) and refresh: app loads from service worker cache and computes ephemeris accurately.

### 3. Android Bundle Build Verification

```bash
# Build Android App Bundle (AAB) for Google Play release
./build_suryasiddha_aab.bat
```
