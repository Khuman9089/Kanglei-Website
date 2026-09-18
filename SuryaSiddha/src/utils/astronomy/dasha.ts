// 120-Year Vimshottari Dasha Engine
import { VimshottariDashaNode } from '../../types/astronomy';
import { NAKSHATRAS } from '../../data/nakshatras';

export interface PlanetDashaPeriod {
  planet: string;
  sanskritName: string;
  years: number;
}

export const DASHA_PLANETS_ORDER: PlanetDashaPeriod[] = [
  { planet: 'Ketu', sanskritName: 'केतु', years: 7 },
  { planet: 'Venus', sanskritName: 'शुक्र', years: 20 },
  { planet: 'Sun', sanskritName: 'सूर्य', years: 6 },
  { planet: 'Moon', sanskritName: 'चन्द्र', years: 10 },
  { planet: 'Mars', sanskritName: 'मंगल', years: 7 },
  { planet: 'Rahu', sanskritName: 'राहु', years: 18 },
  { planet: 'Jupiter', sanskritName: 'बृहस्पति', years: 16 },
  { planet: 'Saturn', sanskritName: 'शनि', years: 19 },
  { planet: 'Mercury', sanskritName: 'बुध', years: 17 },
];

export interface DashaCalculationResult {
  birthBalance: {
    planet: string;
    years: number;
    months: number;
    days: number;
  };
  tree: VimshottariDashaNode[];
  activePath: {
    maha: string;
    antar: string;
    pratyantar: string;
  };
  currentMahadashaNode: VimshottariDashaNode | null;
  currentAntardashaNode: VimshottariDashaNode | null;
}

function addDaysToDate(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setTime(result.getTime() + days * 24 * 60 * 60 * 1000);
  return result;
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateVimshottariDasha(
  moonLong: number,
  dobStr: string,
  targetDate: Date = new Date()
): DashaCalculationResult {
  const norm = ((moonLong % 360) + 360) % 360;
  const nakIndex = Math.floor(norm / (360 / 27));
  const nak = NAKSHATRAS[nakIndex];

  const nakSpan = 360 / 27; // 13.333333 degrees
  const degInNak = norm - nak.startDegree;
  const fractionSpent = degInNak / nakSpan;
  const fractionRemaining = Math.max(0, Math.min(1, 1 - fractionSpent));

  // Find index in dasha planet cycle
  const dashaLordIndex = DASHA_PLANETS_ORDER.findIndex((p) => p.planet === nak.lord);
  const birthLord = DASHA_PLANETS_ORDER[dashaLordIndex];

  const balanceYearsTotal = birthLord.years * fractionRemaining;
  const balanceYears = Math.floor(balanceYearsTotal);
  const balanceMonths = Math.floor((balanceYearsTotal - balanceYears) * 12);
  const balanceDays = Math.round(((balanceYearsTotal - balanceYears) * 12 - balanceMonths) * 30);

  const [dobY, dobM, dobD] = dobStr.split('-').map(Number);
  const birthDate = new Date(dobY, dobM - 1, dobD);

  const tree: VimshottariDashaNode[] = [];
  let currentCursor = new Date(birthDate.getTime());
  const targetTime = targetDate.getTime();

  let activeMaha = '';
  let activeAntar = '';
  let activePratyantar = '';
  let currentMahadashaNode: VimshottariDashaNode | null = null;
  let currentAntardashaNode: VimshottariDashaNode | null = null;

  // Generate 9 Mahadashas (120 years)
  for (let i = 0; i < 9; i++) {
    const cycleIdx = (dashaLordIndex + i) % 9;
    const mahaLord = DASHA_PLANETS_ORDER[cycleIdx];

    // First mahadasha uses balance duration
    const mahaDurationYears = i === 0 ? balanceYearsTotal : mahaLord.years;
    const mahaDurationDays = mahaDurationYears * 365.25;

    const mahaStart = new Date(currentCursor.getTime());
    const mahaEnd = addDaysToDate(mahaStart, mahaDurationDays);
    currentCursor = new Date(mahaEnd.getTime());

    const isMahaActive = targetTime >= mahaStart.getTime() && targetTime <= mahaEnd.getTime();
    if (isMahaActive) {
      activeMaha = mahaLord.planet;
    }

    const mahaProgress = isMahaActive
      ? Math.min(100, Math.max(0, Math.round(((targetTime - mahaStart.getTime()) / (mahaEnd.getTime() - mahaStart.getTime())) * 100)))
      : targetTime > mahaEnd.getTime()
      ? 100
      : 0;

    // Generate 9 Antardashas for this Mahadasha
    const antardashas: VimshottariDashaNode[] = [];
    let antarCursor = new Date(mahaStart.getTime());

    for (let j = 0; j < 9; j++) {
      const antarIdx = (cycleIdx + j) % 9;
      const antarLord = DASHA_PLANETS_ORDER[antarIdx];

      // Antardasha proportion of full Mahadasha
      const fullMahaYears = mahaLord.years;
      const antarDurationYears = (fullMahaYears * antarLord.years) / 120;
      // If in balance dasha, scale proportionally
      const actualAntarYears = i === 0 ? (antarDurationYears * balanceYearsTotal) / fullMahaYears : antarDurationYears;
      const antarDurationDays = actualAntarYears * 365.25;

      const antarStart = new Date(antarCursor.getTime());
      const antarEnd = addDaysToDate(antarStart, antarDurationDays);
      antarCursor = new Date(antarEnd.getTime());

      const isAntarActive = isMahaActive && targetTime >= antarStart.getTime() && targetTime <= antarEnd.getTime();
      if (isAntarActive) {
        activeAntar = antarLord.planet;
      }

      const antarProgress = isAntarActive
        ? Math.min(100, Math.max(0, Math.round(((targetTime - antarStart.getTime()) / (antarEnd.getTime() - antarStart.getTime())) * 100)))
        : targetTime > antarEnd.getTime()
        ? 100
        : 0;

      // Generate Pratyantardashas if active or desired
      const pratyantardashas: VimshottariDashaNode[] = [];
      let pratyCursor = new Date(antarStart.getTime());

      for (let k = 0; k < 9; k++) {
        const pratyIdx = (antarIdx + k) % 9;
        const pratyLord = DASHA_PLANETS_ORDER[pratyIdx];
        const pratyDurationYears = (actualAntarYears * pratyLord.years) / 120;
        const pratyDays = pratyDurationYears * 365.25;

        const pratyStart = new Date(pratyCursor.getTime());
        const pratyEnd = addDaysToDate(pratyStart, pratyDays);
        pratyCursor = new Date(pratyEnd.getTime());

        const isPratyActive = isAntarActive && targetTime >= pratyStart.getTime() && targetTime <= pratyEnd.getTime();
        if (isPratyActive) {
          activePratyantar = pratyLord.planet;
        }

        const pratyProgress = isPratyActive
          ? Math.min(100, Math.max(0, Math.round(((targetTime - pratyStart.getTime()) / (pratyEnd.getTime() - pratyStart.getTime())) * 100)))
          : targetTime > pratyEnd.getTime()
          ? 100
          : 0;

        pratyantardashas.push({
          planet: pratyLord.planet,
          sanskritName: pratyLord.sanskritName,
          startDate: formatDate(pratyStart),
          endDate: formatDate(pratyEnd),
          durationYears: pratyDurationYears,
          level: 'Pratyantardasha',
          isActive: isPratyActive,
          progressPercent: pratyProgress,
        });
      }

      const antarNode: VimshottariDashaNode = {
        planet: antarLord.planet,
        sanskritName: antarLord.sanskritName,
        startDate: formatDate(antarStart),
        endDate: formatDate(antarEnd),
        durationYears: actualAntarYears,
        level: 'Antardasha',
        isActive: isAntarActive,
        progressPercent: antarProgress,
        children: pratyantardashas,
      };

      if (isAntarActive) {
        currentAntardashaNode = antarNode;
      }

      antardashas.push(antarNode);
    }

    const mahaNode: VimshottariDashaNode = {
      planet: mahaLord.planet,
      sanskritName: mahaLord.sanskritName,
      startDate: formatDate(mahaStart),
      endDate: formatDate(mahaEnd),
      durationYears: mahaDurationYears,
      level: 'Mahadasha',
      isActive: isMahaActive,
      progressPercent: mahaProgress,
      children: antardashas,
    };

    if (isMahaActive) {
      currentMahadashaNode = mahaNode;
    }

    tree.push(mahaNode);
  }

  return {
    birthBalance: {
      planet: birthLord.planet,
      years: balanceYears,
      months: balanceMonths,
      days: balanceDays,
    },
    tree,
    activePath: {
      maha: activeMaha || tree[0].planet,
      antar: activeAntar || (tree[0].children ? tree[0].children[0].planet : ''),
      pratyantar: activePratyantar,
    },
    currentMahadashaNode,
    currentAntardashaNode,
  };
}
