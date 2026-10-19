# Data Model & UI Entities: KangleiAstro & SuryaSiddha Full UX/UI Redesign

## 1. Design Token Architecture

```typescript
export interface ColorTokens {
  // Midnight Indigo Base
  midnight950: '#090D16';
  midnight900: '#0F172A';
  midnight850: '#141E33';
  midnight800: '#1E293B';
  midnight700: '#334155';

  // Royal Gold Accents
  gold700: '#B45309';
  gold600: '#D97706';
  gold500: '#F59E0B';
  gold400: '#FBBF24';
  gold100: '#FEF3C7';

  // Spiritual Accents
  saffron500: '#EA580C';
  emerald500: '#10B981'; // Auspicious / Shubh
  crimson500: '#EF4444'; // Ashubh / Rahu Kalam
}

export interface TypographyTokens {
  headingSerif: "'Cinzel', 'Cormorant Garamond', serif";
  bodySans: "'Outfit', 'Inter', system-ui, sans-serif";
  regionalManipuri: "'Blipi15', 'Budha', sans-serif";
}
```

## 2. Navigation & History State

```typescript
export type MainTabType = 'panchang' | 'kundli' | 'muhurta' | 'settings';

export interface NavigationHistoryState {
  tab: MainTabType;
  modalOpen?: string | null;
  date?: string;
}
```

## 3. UI Component Contract: Panchang Display Card

```typescript
export interface PanchangHeroSummary {
  date: string;
  vikramSamvat: number;
  sakaSamvat: number;
  sunRashi: string;
  moonRashi: string;
  sunrise: string;
  sunset: string;
  tithi: {
    name: string;
    paksha: 'Shukla' | 'Krishna';
    endTime: string;
  };
  nakshatra: {
    name: string;
    pada: number;
    endTime: string;
  };
  shubhMuhurta: {
    abhijit: { start: string; end: string };
  };
  ashubhMuhurta: {
    rahuKalam: { start: string; end: string };
    yamaganda: { start: string; end: string };
  };
}
```
