import { calculateRunningAge, calculateYumsharol } from '../yumsharol';

describe('Yumsharol Traditional Calculation Engine', () => {
  describe('Time-Aware Running Age Calculation', () => {
    test('DOB + TOB exactly matches current moment -> age rounded appropriately (completed age)', () => {
      // Born on 2000-01-15 at 10:00:00
      const dob = '2000-01-15';
      const tob = '10:00:00';
      // Target is exactly 23 years later at the exact same second
      const targetExact = new Date(2023, 0, 15, 10, 0, 0, 0);

      const age = calculateRunningAge(dob, tob, targetExact);
      // Completed age = 23; strictly at exact anniversary moment -> running age = 23
      expect(age).toBe(23);
    });

    test('DOB + TOB is 1 minute past anniversary -> rolls over to the next running age', () => {
      const dob = '2000-01-15';
      const tob = '10:00:00';
      // Target is 1 minute past the 23rd anniversary
      const targetPast = new Date(2023, 0, 15, 10, 1, 0, 0);

      const age = calculateRunningAge(dob, tob, targetPast);
      // Completed age = 23; past anniversary -> running age rolls over to 24
      expect(age).toBe(24);
    });

    test('Prompt Example: 23 years, 0 months, 0 days, 2 hours past birth time -> 24', () => {
      const dob = '2000-01-15';
      const tob = '10:00:00';
      const targetTwoHours = new Date(2023, 0, 15, 12, 0, 0, 0);

      const age = calculateRunningAge(dob, tob, targetTwoHours);
      expect(age).toBe(24);
    });

    test('Prompt Example: 23 years, 1 month, 23 days -> 24', () => {
      const dob = '2000-01-15';
      const tob = '10:00:00';
      // 1 month 23 days later = approx March 10
      const targetLater = new Date(2023, 2, 10, 10, 0, 0, 0);

      const age = calculateRunningAge(dob, tob, targetLater);
      expect(age).toBe(24);
    });

    test('DOB + TOB 1 minute before anniversary -> running age equals completed year in progress', () => {
      const dob = '2000-01-15';
      const tob = '10:00:00';
      const targetBefore = new Date(2023, 0, 15, 9, 59, 0, 0);

      const age = calculateRunningAge(dob, tob, targetBefore);
      // Has not completed 23 yet; running 23rd year
      expect(age).toBe(23);
    });

    test('Newborn baby bounds to minimum running age of 1', () => {
      const dob = '2024-05-10';
      const tob = '12:00:00';
      const targetNewborn = new Date(2024, 4, 10, 12, 0, 0, 0);

      const age = calculateRunningAge(dob, tob, targetNewborn);
      expect(age).toBe(1);
    });

    test('Prevents future DOB/TOB combinations with descriptive error', () => {
      const dob = '2025-01-01';
      const tob = '12:00:00';
      const pastTarget = new Date(2020, 0, 1, 12, 0, 0, 0);

      expect(() => {
        calculateRunningAge(dob, tob, pastTarget);
      }).toThrow('Date of birth and time of birth cannot be in the future.');
    });

    test('Gracefully handles Feb 29 leap year births in non-leap anniversary years', () => {
      // Born Feb 29, 2000
      const dob = '2000-02-29';
      const tob = '14:30:00';
      // 2023 is not a leap year
      const targetPast = new Date(2023, 2, 1, 14, 30, 0, 0); // March 1st 2023

      const age = calculateRunningAge(dob, tob, targetPast);
      expect(isNaN(age)).toBe(false);
      expect(age).toBe(24);
    });
  });

  describe('Excel Compatibility & Modulo 8 Calculation', () => {
    test('Excel check 1: Running Age 24, Nakshatra 10, Constant 15 -> SUM = 49 -> standardMod = 1, traditionalIndex = 1', () => {
      // We simulate runningAge = 24: DOB 2000-01-15 10:00, target 2023-01-15 12:00
      const res = calculateYumsharol({
        dob: '2000-01-15',
        tob: '10:00',
        nakshatra: 10, // Magha
        constantValue: 15,
        targetDateTime: new Date(2023, 0, 15, 12, 0, 0, 0),
      });

      expect(res.runningAge).toBe(24);
      expect(res.sum).toBe(49);
      expect(res.standardMod).toBe(1);
      expect(res.traditionalIndex).toBe(1);
      expect(res.directionInfo.name).toContain('Dhwaja');
      expect(res.directionInfo.direction).toBe('East');
      expect(res.directionInfo.quality).toBe('Auspicious');
    });

    test('Excel check 2: SUM = 48 -> standardMod = 0, traditionalIndex = 8', () => {
      // Running Age 24, Nakshatra 9 (Ashlesha), Constant 15 -> SUM = 48
      const res = calculateYumsharol({
        dob: '2000-01-15',
        tob: '10:00',
        nakshatra: 9,
        constantValue: 15,
        targetDateTime: new Date(2023, 0, 15, 12, 0, 0, 0),
      });

      expect(res.runningAge).toBe(24);
      expect(res.sum).toBe(48);
      expect(res.standardMod).toBe(0);
      expect(res.traditionalIndex).toBe(8);
      expect(res.directionInfo.name).toContain('Kaka');
      expect(res.directionInfo.direction).toBe('North-East');
    });

    test('Validates Nakshatras between 1 and 27', () => {
      expect(() => {
        calculateYumsharol({
          dob: '2000-01-15',
          nakshatra: 28,
        });
      }).toThrow('Invalid Nakshatra: 28');

      expect(() => {
        calculateYumsharol({
          dob: '2000-01-15',
          nakshatra: 0,
        });
      }).toThrow('Invalid Nakshatra: 0');
    });

    test('Maps correct traditional Meetei prophecy for each remainder 0 to 7', () => {
      // Test all remainders 0-7 with mock or controlled sums
      const expectedTexts: Record<number, string> = {
        0: '0 El§a lzjaen| Kuidzmo_+a feo_| Amz-yah~eTaz k=mem| iSba nz@|',
        1: '1 El§a ifralda E~ley, ln-Tum caR~K\\il|',
        2: '2 El§a E~mKuin, feo_, E~meh; lazepak nzgiL| Ec(I yum oh~rbsu h~muz Zmxmk mih laz@| f\\et|',
        3: '3 El§a EnazSain, mah~ pakpa caR~K\\pa, yumTuna Saba Zm@, E~fey|',
        4: '4 El§a lmHh~in, El;iSz taNduna Etak@, waeTak laneTak@, maz tak@|',
        5: '5 El§id ih-yah~ Apan-Arz Zmxmk fze~j@, ln tuzh~, yamxa E~f@|',
        6: '6 El§id Elalaen| Ana-Aeyk Etah~na nz@| Ku\\#-Ku\\lah~na ESakpa pnba, yumSaba, R~#ba mIga, yu§uga K\\ne~cnba nz@|',
        7: '7 El§id Samuen| mana minl nah~dna yum Saba Zme~j@| ln-Tum caR~K\\il|',
      };

      for (let r = 0; r <= 7; r++) {
        // runningAge = 24. We want (24 + nak + 15) % 8 = r
        // 39 % 8 = 7. If nak = 1, sum = 40 % 8 = 0.
        // nak = r + 1 gives: for r=0 -> nak=1 (sum 40 -> mod 0); for r=1 -> nak=2 (sum 41 -> mod 1), etc.
        const targetNak = (r === 0) ? 1 : r + 1;
        const res = calculateYumsharol({
          dob: '2000-01-15',
          tob: '10:00',
          nakshatra: targetNak,
          constantValue: 15,
          targetDateTime: new Date(2023, 0, 15, 12, 0, 0, 0), // runningAge = 24
        });
        expect(res.standardMod).toBe(r);
        expect(res.remainderPrediction).toBe(expectedTexts[r]);
      }
    });
  });
});
