import { NakshatraInfo } from '../types/astrology';
import { NAKSHATRAS, NAKSHATRA_SPAN, DASHA_LORDS } from './constants';

export function getNakshatraInfo(longitude: number): NakshatraInfo {
  const normLong = ((longitude % 360) + 360) % 360;
  const index = Math.floor(normLong / NAKSHATRA_SPAN);
  const elapsed = normLong % NAKSHATRA_SPAN;
  const pada = Math.floor(elapsed / (NAKSHATRA_SPAN / 4)) + 1;
  
  const base = NAKSHATRAS[index];
  const lordIndex = index % 9;
  
  return {
    index,
    name: base.name,
    lord: base.lord,
    lordIndex,
    pada,
    startDegree: base.startDegree,
    endDegree: base.endDegree
  };
}

export function getMoonNakshatra(moonLongitude: number): NakshatraInfo {
  return getNakshatraInfo(moonLongitude);
}
