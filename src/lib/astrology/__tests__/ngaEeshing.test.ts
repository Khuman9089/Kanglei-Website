import { calculateNgaEeshing } from '../ngaEeshing';

describe('ঙা-ঈশিং (Nga-Eeshing) Matrimonial Engine', () => {
  test('User Example 1: Bride Aries (0) and Groom Pisces (11) -> ঙা-ঈশিং তাদে', () => {
    const res = calculateNgaEeshing({
      brideRashi: 0,
      groomRashi: 11,
    });

    expect(res.isNgaEeshing).toBe(false);
    expect(res.verdictText).toBe('ঙা-ঈশিং তাদে ॥');
    expect(res.holder).toBeNull();
    // Groom 11 is ঈশিং, Bride 0 is ঙা -> different
    expect(res.natureStatement).toBe('নুপানা ঈশিং নি, নুপীনা ঙা নি');
  });

  test('User Example 2: Bride Aries (0) and Groom Capricorn (9) -> ঙা-ঈশিং তাই (নুপীনা)', () => {
    const res = calculateNgaEeshing({
      brideRashi: 0,
      groomRashi: 9,
    });

    expect(res.isNgaEeshing).toBe(true);
    expect(res.verdictText).toBe('ঙা-ঈশিং তাই ॥');
    expect(res.holder).toBe('নুপী');
    expect(res.holderStatement).toBe('নুপীনা ঙা-ঈশিং তাই');
    // Groom 9 is ঈশিং, Bride 0 is ঙা -> different
    expect(res.natureStatement).toBe('নুপানা ঈশিং নি, নুপীনা ঙা নি');
    expect(res.remedyGuidance).toBeDefined();
    expect(res.potchangText).toContain('শোন্নপুং উরেন মখোংগী');
    expect(res.laironText).toContain('তেংবানবা মপু ইবুংঙো');
  });

  test('User Example 3: Bride Capricorn (9) and Groom Aries (0) -> ঙা-ঈশিং তাই (নুপানা)', () => {
    const res = calculateNgaEeshing({
      brideRashi: 9,
      groomRashi: 0,
    });

    expect(res.isNgaEeshing).toBe(true);
    expect(res.verdictText).toBe('ঙা-ঈশিং তাই ॥');
    expect(res.holder).toBe('নুপা');
    expect(res.holderStatement).toBe('নুপানা ঙা-ঈশিং তাই');
    // Groom 0 is ঙা, Bride 9 is ঈশিং -> different
    expect(res.natureStatement).toBe('নুপানা ঙা নি, নুপীনা ঈশিং নি');
  });

  test('Same nature test: Both ঙা (e.g. Groom Aries 0, Bride Gemini 2)', () => {
    const res = calculateNgaEeshing({
      groomRashi: 0,
      brideRashi: 2,
    });
    // 0 + 9 = 9 != 2; 2 + 9 = 11 != 0
    expect(res.isNgaEeshing).toBe(false);
    expect(res.natureStatement).toBe('নুপাসু ঙা নি, নুপীসু ঙা নি');
  });

  test('Same nature test: Both ঈশিং (e.g. Groom Taurus 1, Bride Cancer 3)', () => {
    const res = calculateNgaEeshing({
      groomRashi: 1,
      brideRashi: 3,
    });
    // 1 + 9 = 10 != 3; 3 + 9 = 12 -> 0 != 1
    expect(res.isNgaEeshing).toBe(false);
    expect(res.natureStatement).toBe('নুপাসু ঈশিং নি, নুপীসু ঈশিং নি');
  });
});
