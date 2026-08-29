import { MatchingResult } from '../types/astrology';
import { getNakshatraInfo } from './nakshatras';

// Zodiac sign elements / Varna: 0=Brahmin, 1=Kshatriya, 2=Vaishya, 3=Shudra
const SIGN_VARNA = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]; // Aries(1), Tau(2), Gem(3), Can(0)...

// Moon Lords for 12 signs
const SIGN_LORDS = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

// Gana for 27 Nakshatras (0: Deva, 1: Manushya, 2: Rakshasa)
const NAKSHATRA_GANA = [
  0, 1, 2, 1, 0, 1, 0, 0, 2, // Ashwini to Ashlesha
  2, 1, 1, 0, 2, 0, 2, 0, 2, // Magha to Jyeshta
  2, 1, 1, 0, 2, 2, 1, 1, 0  // Mula to Revati
];

// Nadi for 27 Nakshatras (0: Aadi, 1: Madhya, 2: Antya)
const NAKSHATRA_NADI = [
  0, 1, 2, 2, 1, 0, 0, 1, 2,
  0, 1, 2, 2, 1, 0, 0, 1, 2,
  0, 1, 2, 2, 1, 0, 0, 1, 2
];

// Yoni (Animal) for 27 Nakshatras (0-13)
const NAKSHATRA_YONI = [
  0, 1, 2, 3, 2, 4, 5, 1, 5,  // Ashwini to Ashlesha
  6, 6, 7, 8, 9, 10, 10, 11, 11, // Magha to Jyeshta
  12, 13, 13, 7, 0, 12, 8, 3, 1 // Mula to Revati
];

export function calculateGunMilan(groomLongitude: number, brideLongitude: number): MatchingResult {
  const groomNak = getNakshatraInfo(groomLongitude);
  const brideNak = getNakshatraInfo(brideLongitude);

  const groomSign = Math.floor(groomLongitude / 30) % 12;
  const brideSign = Math.floor(brideLongitude / 30) % 12;

  // 1. Varna (1 Point)
  const groomVarna = SIGN_VARNA[groomSign];
  const brideVarna = SIGN_VARNA[brideSign];
  let varnaPts = 0;
  if (groomVarna <= brideVarna) {
    varnaPts = 1;
  }

  // 2. Vashya (2 Points)
  let vashyaPts = 1;
  if (groomSign === brideSign) {
    vashyaPts = 2;
  } else if (Math.abs(groomSign - brideSign) === 6) {
    vashyaPts = 0;
  }

  // 3. Tara (3 Points)
  const groomTaraDiff = ((brideNak.index - groomNak.index + 27) % 9) + 1;
  const brideTaraDiff = ((groomNak.index - brideNak.index + 27) % 9) + 1;
  const goodTaras = [2, 4, 6, 8, 9];
  let taraPts = 0;
  if (goodTaras.includes(groomTaraDiff)) taraPts += 1.5;
  if (goodTaras.includes(brideTaraDiff)) taraPts += 1.5;

  // 4. Yoni (4 Points)
  const groomYoni = NAKSHATRA_YONI[groomNak.index];
  const brideYoni = NAKSHATRA_YONI[brideNak.index];
  let yoniPts = 2;
  if (groomYoni === brideYoni) {
    yoniPts = 4;
  } else if (Math.abs(groomYoni - brideYoni) === 1) {
    yoniPts = 3;
  } else if (Math.abs(groomYoni - brideYoni) > 6) {
    yoniPts = 1;
  }

  // 5. Graha Maitri (5 Points)
  const groomLord = SIGN_LORDS[groomSign];
  const brideLord = SIGN_LORDS[brideSign];
  let grahaPts = 3;
  if (groomLord === brideLord) {
    grahaPts = 5;
  } else if (
    (groomLord === 'Sun' && brideLord === 'Jupiter') ||
    (groomLord === 'Jupiter' && brideLord === 'Sun') ||
    (groomLord === 'Moon' && brideLord === 'Mercury')
  ) {
    grahaPts = 4;
  }

  // 6. Gana (6 Points)
  const groomGana = NAKSHATRA_GANA[groomNak.index];
  const brideGana = NAKSHATRA_GANA[brideNak.index];
  let ganaPts = 0;
  if (groomGana === brideGana) {
    ganaPts = 6;
  } else if ((groomGana === 0 && brideGana === 1) || (groomGana === 1 && brideGana === 0)) {
    ganaPts = 5;
  } else if ((groomGana === 1 && brideGana === 2) || (groomGana === 2 && brideGana === 1)) {
    ganaPts = 1;
  }

  // 7. Bhakoot (7 Points)
  const signDiff = (Math.abs(groomSign - brideSign) + 12) % 12;
  let bhakootPts = 7;
  if (signDiff === 2 || signDiff === 10 || signDiff === 5 || signDiff === 7 || signDiff === 6) {
    bhakootPts = 0; // Bhakoot Dosh (2/12, 5/9, 6/8)
  }

  // 8. Nadi (8 Points)
  const groomNadi = NAKSHATRA_NADI[groomNak.index];
  const brideNadi = NAKSHATRA_NADI[brideNak.index];
  let nadiPts = 8;
  if (groomNadi === brideNadi) {
    nadiPts = 0; // Nadi Dosh (Same Nadi)
  }

  const totalScore = Math.round((varnaPts + vashyaPts + taraPts + yoniPts + grahaPts + ganaPts + bhakootPts + nadiPts) * 10) / 10;

  return {
    totalScore,
    maxScore: 36,
    breakdown: {
      Varna: varnaPts,
      Vashya: vashyaPts,
      Tara: taraPts,
      Yoni: yoniPts,
      GrahaMaitri: grahaPts,
      Gana: ganaPts,
      Bhakoot: bhakootPts,
      Nadi: nadiPts,
    },
  };
}
