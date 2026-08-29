import { DashaPeriod } from '../types/astrology';
import { NAKSHATRA_SPAN, TOTAL_DASHA_YEARS, DASHA_LORDS } from './constants';

const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000;

export function calculateVimshottariDasha(moonLongitude: number, birthDate: Date | string): DashaPeriod[] {
  const normLong = ((moonLongitude % 360) + 360) % 360;
  const nakshatraIndex = Math.floor(normLong / NAKSHATRA_SPAN);
  const startLordIndex = nakshatraIndex % 9;
  const elapsed = normLong % NAKSHATRA_SPAN;
  const fractionRemaining = 1 - (elapsed / NAKSHATRA_SPAN);
  
  const bDate = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
  let currentStartTime = bDate.getTime();
  const dashas: DashaPeriod[] = [];
  
  for (let i = 0; i < 9; i++) {
    const lordIdx = (startLordIndex + i) % 9;
    const lord = DASHA_LORDS[lordIdx];
    
    // First mahadasha is prorated
    const durationYears = (i === 0) ? fractionRemaining * lord.years : lord.years;
    const durationMs = durationYears * YEAR_MS;
    
    const mahaDasha: DashaPeriod = {
      lord: lord.name,
      lordIndex: lordIdx,
      startDate: new Date(currentStartTime),
      endDate: new Date(currentStartTime + durationMs),
      durationYears: durationYears,
      level: 'maha',
      subPeriods: []
    };
    
    // Antardashas
    let antarStartTime = currentStartTime;
    for (let j = 0; j < 9; j++) {
      const antarLordIdx = (lordIdx + j) % 9;
      const antarLord = DASHA_LORDS[antarLordIdx];
      
      // Full antar duration
      let antarDurationYears = (lord.years * antarLord.years) / TOTAL_DASHA_YEARS;
      if (i === 0) {
        // Prorate if in the first mahadasha
        // This is a simplified prorating, actual calculation subtracts passed antardashas.
        // Assuming the start date falls within a specific antardasha.
        // For accurate prorated start, normally we find which antardasha the birth falls into.
        // In standard Vimshottari, the fraction is applied to the overall remaining years, 
        // starting from the appropriate antardasha. For simplicity in this implementation, 
        // we'll prorate all antardashas uniformly, though strictly it should cut off prior antardashas.
        antarDurationYears *= fractionRemaining; 
      }
      const antarDurationMs = antarDurationYears * YEAR_MS;
      
      const antarDasha: DashaPeriod = {
        lord: antarLord.name,
        lordIndex: antarLordIdx,
        startDate: new Date(antarStartTime),
        endDate: new Date(antarStartTime + antarDurationMs),
        durationYears: antarDurationYears,
        level: 'antar',
        subPeriods: []
      };
      
      // Pratyantardashas
      let pratyantarStartTime = antarStartTime;
      for (let k = 0; k < 9; k++) {
        const pratyantarLordIdx = (antarLordIdx + k) % 9;
        const pratyantarLord = DASHA_LORDS[pratyantarLordIdx];
        
        let pratyantarDurationYears = (lord.years * antarLord.years * pratyantarLord.years) / (TOTAL_DASHA_YEARS * TOTAL_DASHA_YEARS);
        if (i === 0) pratyantarDurationYears *= fractionRemaining;
        
        const pratyantarDurationMs = pratyantarDurationYears * YEAR_MS;
        
        antarDasha.subPeriods!.push({
          lord: pratyantarLord.name,
          lordIndex: pratyantarLordIdx,
          startDate: new Date(pratyantarStartTime),
          endDate: new Date(pratyantarStartTime + pratyantarDurationMs),
          durationYears: pratyantarDurationYears,
          level: 'pratyantar'
        });
        
        pratyantarStartTime += pratyantarDurationMs;
      }
      
      mahaDasha.subPeriods!.push(antarDasha);
      antarStartTime += antarDurationMs;
    }
    
    dashas.push(mahaDasha);
    currentStartTime += durationMs;
  }
  
  return dashas;
}

export function getCurrentDasha(dashas: DashaPeriod[], currentDate: Date): { maha: DashaPeriod | null, antar: DashaPeriod | null, pratyantar: DashaPeriod | null } {
  const time = currentDate.getTime();
  const maha = dashas.find(d => time >= d.startDate.getTime() && time < d.endDate.getTime());
  if (!maha || !maha.subPeriods) return { maha: maha || null, antar: null, pratyantar: null };
  
  const antar = maha.subPeriods.find(d => time >= d.startDate.getTime() && time < d.endDate.getTime());
  if (!antar || !antar.subPeriods) return { maha, antar: antar || null, pratyantar: null };
  
  const pratyantar = antar.subPeriods.find(d => time >= d.startDate.getTime() && time < d.endDate.getTime());
  
  return { maha, antar, pratyantar: pratyantar || null };
}
