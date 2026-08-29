export const NAKSHATRA_SPAN = 13.333333333;
export const TOTAL_DASHA_YEARS = 120;

export const ZODIAC_SIGNS = [
  { index: 0, name: 'Aries', lord: 'Mars', element: 'Fire', quality: 'Movable' },
  { index: 1, name: 'Taurus', lord: 'Venus', element: 'Earth', quality: 'Fixed' },
  { index: 2, name: 'Gemini', lord: 'Mercury', element: 'Air', quality: 'Dual' },
  { index: 3, name: 'Cancer', lord: 'Moon', element: 'Water', quality: 'Movable' },
  { index: 4, name: 'Leo', lord: 'Sun', element: 'Fire', quality: 'Fixed' },
  { index: 5, name: 'Virgo', lord: 'Mercury', element: 'Earth', quality: 'Dual' },
  { index: 6, name: 'Libra', lord: 'Venus', element: 'Air', quality: 'Movable' },
  { index: 7, name: 'Scorpio', lord: 'Mars', element: 'Water', quality: 'Fixed' },
  { index: 8, name: 'Sagittarius', lord: 'Jupiter', element: 'Fire', quality: 'Dual' },
  { index: 9, name: 'Capricorn', lord: 'Saturn', element: 'Earth', quality: 'Movable' },
  { index: 10, name: 'Aquarius', lord: 'Saturn', element: 'Air', quality: 'Fixed' },
  { index: 11, name: 'Pisces', lord: 'Jupiter', element: 'Water', quality: 'Dual' }
];

export const DASHA_LORDS = [
  { index: 0, name: 'Ketu', years: 7 },
  { index: 1, name: 'Venus', years: 20 },
  { index: 2, name: 'Sun', years: 6 },
  { index: 3, name: 'Moon', years: 10 },
  { index: 4, name: 'Mars', years: 7 },
  { index: 5, name: 'Rahu', years: 18 },
  { index: 6, name: 'Jupiter', years: 16 },
  { index: 7, name: 'Saturn', years: 19 },
  { index: 8, name: 'Mercury', years: 17 }
];

export const PLANETS = [
  { id: 'su', name: 'Sun', shortName: 'Su', isNaturalBenefic: false },
  { id: 'mo', name: 'Moon', shortName: 'Mo', isNaturalBenefic: true },
  { id: 'ma', name: 'Mars', shortName: 'Ma', isNaturalBenefic: false },
  { id: 'me', name: 'Mercury', shortName: 'Me', isNaturalBenefic: true },
  { id: 'ju', name: 'Jupiter', shortName: 'Ju', isNaturalBenefic: true },
  { id: 've', name: 'Venus', shortName: 'Ve', isNaturalBenefic: true },
  { id: 'sa', name: 'Saturn', shortName: 'Sa', isNaturalBenefic: false },
  { id: 'ra', name: 'Rahu', shortName: 'Ra', isNaturalBenefic: false },
  { id: 'ke', name: 'Ketu', shortName: 'Ke', isNaturalBenefic: false }
];

export const NAKSHATRAS = [
  { index: 0, name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras', symbol: 'Horse head' },
  { index: 1, name: 'Bharani', lord: 'Venus', deity: 'Yama', symbol: 'Yoni' },
  { index: 2, name: 'Krittika', lord: 'Sun', deity: 'Agni', symbol: 'Razor' },
  { index: 3, name: 'Rohini', lord: 'Moon', deity: 'Brahma', symbol: 'Chariot' },
  { index: 4, name: 'Mrigashira', lord: 'Mars', deity: 'Soma', symbol: 'Deer head' },
  { index: 5, name: 'Ardra', lord: 'Rahu', deity: 'Rudra', symbol: 'Teardrop' },
  { index: 6, name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi', symbol: 'Quiver' },
  { index: 7, name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati', symbol: 'Cow udder' },
  { index: 8, name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas', symbol: 'Serpent' },
  { index: 9, name: 'Magha', lord: 'Ketu', deity: 'Pitris', symbol: 'Royal Throne' },
  { index: 10, name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga', symbol: 'Front legs of bed' },
  { index: 11, name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman', symbol: 'Back legs of bed' },
  { index: 12, name: 'Hasta', lord: 'Moon', deity: 'Savitar', symbol: 'Hand' },
  { index: 13, name: 'Chitra', lord: 'Mars', deity: 'Vishvakarma', symbol: 'Pearl' },
  { index: 14, name: 'Swati', lord: 'Rahu', deity: 'Vayu', symbol: 'Shoot of plant' },
  { index: 15, name: 'Vishakha', lord: 'Jupiter', deity: 'Indra/Agni', symbol: 'Archway' },
  { index: 16, name: 'Anuradha', lord: 'Saturn', deity: 'Mitra', symbol: 'Lotus' },
  { index: 17, name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra', symbol: 'Umbrella' },
  { index: 18, name: 'Mula', lord: 'Ketu', deity: 'Nirriti', symbol: 'Roots' },
  { index: 19, name: 'Purva Ashadha', lord: 'Venus', deity: 'Apah', symbol: 'Elephant tusk' },
  { index: 20, name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvedevas', symbol: 'Elephant tusk' },
  { index: 21, name: 'Shravana', lord: 'Moon', deity: 'Vishnu', symbol: 'Ear' },
  { index: 22, name: 'Dhanishta', lord: 'Mars', deity: 'Vasus', symbol: 'Drum' },
  { index: 23, name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna', symbol: 'Empty circle' },
  { index: 24, name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada', symbol: 'Front legs of funeral cot' },
  { index: 25, name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahir Budhyana', symbol: 'Back legs of funeral cot' },
  { index: 26, name: 'Revati', lord: 'Mercury', deity: 'Pushan', symbol: 'Fish' }
].map(n => ({
  ...n,
  startDegree: n.index * NAKSHATRA_SPAN,
  endDegree: (n.index + 1) * NAKSHATRA_SPAN
}));
