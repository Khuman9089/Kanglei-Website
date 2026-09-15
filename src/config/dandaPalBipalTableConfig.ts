/**
 * Danda-Pal-Bipal 3x8 Table Configuration
 * 
 * Contains exactly the 3 columns x 8 rows (1 to 24) matching authentic Manipuri Panjika:
 * 
 * Column 1 (Tithi / Weekday):
 *   [1]  Weekday No. (1-7)
 *   [4]  Tithi 1 No. (1-30)
 *   [7]  Tithi 1 Ending Danda
 *   [10] Tithi 1 Ending Pal
 *   [13] Tithi 1 Ending Bipal
 *   [16] Tithi 2 Ending Danda (Hidden if not dual)
 *   [19] Tithi 2 Ending Pal   (Hidden if not dual)
 *   [22] Tithi 2 Ending Bipal (Hidden if not dual)
 * 
 * Column 2 (Nakshatra / Karana):
 *   [2]  Nakshatra 1 No. (1-27)
 *   [5]  Nakshatra 1 Ending Danda
 *   [8]  Nakshatra 1 Ending Pal
 *   [11] Nakshatra 1 Ending Bipal
 *   [14] Nakshatra 2 Ending Danda (Hidden if not dual)
 *   [17] Nakshatra 2 Ending Pal   (Hidden if not dual)
 *   [20] Nakshatra 2 Ending Bipal (Hidden if not dual)
 *   [23] Karana No. (1-11)
 * 
 * Column 3 (Yoga / Solar Day):
 *   [3]  Yoga 1 No. (1-27)
 *   [6]  Yoga 1 Ending Danda
 *   [9]  Yoga 1 Ending Pal
 *   [12] Yoga 1 Ending Bipal
 *   [15] Yoga 2 Ending Danda (Hidden if not dual)
 *   [18] Yoga 2 Ending Pal   (Hidden if not dual)
 *   [21] Yoga 2 Ending Bipal (Hidden if not dual)
 *   [24] Sankranti / Bengali Solar Day (1-31)
 */

export interface Table3x8Row {
  rowNum: number;
  col1: number | string;
  col2: number | string;
  col3: number | string;
}

export const SAMPLE_3X8_TABLE: Table3x8Row[] = [
  // Row 1: 1 = Weekday No. | 2 = Nakshatra 1 No. | 3 = Yoga 1 No.
  { rowNum: 1, col1: 1, col2: 2, col3: 3 },
  // Row 2: 4 = Tithi 1 No. | 5 = Nakshatra 1 Danda | 6 = Yoga 1 Danda
  { rowNum: 2, col1: 4, col2: 5, col3: 6 },
  // Row 3: 7 = Tithi 1 Danda | 8 = Nakshatra 1 Pal | 9 = Yoga 1 Pal
  { rowNum: 3, col1: 7, col2: 8, col3: 9 },
  // Row 4: 10 = Tithi 1 Pal | 11 = Nakshatra 1 Bipal | 12 = Yoga 1 Bipal
  { rowNum: 4, col1: 10, col2: 11, col3: 12 },
  // Row 5: 13 = Tithi 1 Bipal | 14 = Nakshatra 2 Danda* | 15 = Yoga 2 Danda*
  { rowNum: 5, col1: 13, col2: 14, col3: 15 },
  // Row 6: 16 = Tithi 2 Danda* | 17 = Nakshatra 2 Pal* | 18 = Yoga 2 Pal*
  { rowNum: 6, col1: 16, col2: 17, col3: 18 },
  // Row 7: 19 = Tithi 2 Pal* | 20 = Nakshatra 2 Bipal* | 21 = Yoga 2 Bipal*
  { rowNum: 7, col1: 19, col2: 20, col3: 21 },
  // Row 8: 22 = Tithi 2 Bipal* | 23 = Karana No. | 24 = Bengali Solar Day
  { rowNum: 8, col1: 22, col2: 23, col3: 24 },
];
