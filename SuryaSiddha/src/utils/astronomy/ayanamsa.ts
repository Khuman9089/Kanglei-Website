// Lahiri (Chitrapaksha), Krishnamurti, and Raman Ayanamsa calculations
import { DMS } from '../../types/astronomy';
import { julianCenturies } from './sunCalculations';

export type AyanamsaType = 'Lahiri' | 'KP' | 'Raman';

export function calculateAyanamsa(jd: number, type: AyanamsaType = 'Lahiri'): number {
  const T = julianCenturies(jd); // Centuries since J2000.0 (JD 2451545.0)

  // Lahiri (Chitrapaksha Ayanamsa) - Official Indian standard
  // Base at J2000.0 = 23.857092° (23° 51' 25.53")
  // Precession rate = 50.290966 arcsec/year = 1.39697127778° / century
  if (type === 'Lahiri') {
    const ayan = 23.857092 + 1.39697127778 * T + 0.0003086 * T * T;
    return ayan;
  }

  // Krishnamurti Padhdhati (KP Ayanamsa)
  if (type === 'KP') {
    const ayan = 23.857092 - 0.098889 + 1.39697127778 * T;
    return ayan;
  }

  // Raman Ayanamsa
  if (type === 'Raman') {
    const ayan = 22.460166 + 1.39697127778 * T;
    return ayan;
  }

  return 23.857092 + 1.39697127778 * T;
}

export function degreesToDMS(deg: number): DMS {
  let normalized = deg % 360;
  if (normalized < 0) normalized += 360;

  const d = Math.floor(normalized);
  const minFloat = (normalized - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);

  return { deg: d, min: m, sec: s };
}

export function formatDMS(deg: number): string {
  const { deg: d, min: m, sec: s } = degreesToDMS(deg);
  return `${d}° ${String(m).padStart(2, '0')}' ${String(s).padStart(2, '0')}"`;
}
