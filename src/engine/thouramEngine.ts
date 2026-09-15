/**
 * Manipuri Subha Karma (Afaba Thouram) Real-Time Computation Engine
 * Evaluates traditional rites against real-time Panchang factors and generates
 * authentic Panjika book sentences & Muhurta windows.
 */

import { THOURAM_REGISTRY, ThouramRule } from '@/config/thouramRegistry';
import {
  formatManipuriClockTimeBengali,
  formatManipuriClockTimeMeetei,
  formatManipuriClockTimeBlipi
} from './manipuriPanchangBook';

export interface EvaluatedThouram {
  rule: ThouramRule;
  isEligible: boolean;
  suitabilityScore: number; // 0 - 100
  status: 'RECOMMENDED' | 'PERMISSIBLE' | 'INELIGIBLE';
  timeWindowBengali?: string;
  timeWindowMeetei?: string;
  timeWindowBlipi?: string;
  reasons: string[];
}

export interface GrahaPujaEvaluation {
  isAvailable: boolean;
  statusBengali: string;
  statusMeetei: string;
  statusBlipi: string;
  timeWindowBengali?: string;
  timeWindowMeetei?: string;
  timeWindowBlipi?: string;
  reasonBengali: string;
  reasonMeetei: string;
  reasonBlipi: string;
  fullTextBengali: string;
  fullTextMeetei: string;
  fullTextBlipi: string;
}

export interface ThouramDayEvaluation {
  primaryWindow: {
    startHourDec: number;
    endHourDec: number;
    bengali: string;
    meetei: string;
    blipi: string;
  };
  secondaryWindow: {
    startHourDec: number;
    endHourDec: number;
    bengali: string;
    meetei: string;
    blipi: string;
  };
  fullTextBengali: string;
  fullTextMeetei: string;
  fullTextBlipi: string;
  grahaPuja: GrahaPujaEvaluation;
  evaluatedRites: EvaluatedThouram[];
  recommendedRites: EvaluatedThouram[];
}

export interface ThouramEvaluationInput {
  tithiNumber: number; // 1 - 30 (1-15 Shukla, 16-30 Krishna)
  nakshatraIndex: number; // 1 - 27
  weekdayIndex: number; // 0=Sun, 1=Mon ... 6=Sat
  sunriseDec: number; // Decimal hours (e.g. 5.12)
  sunsetDec: number; // Decimal hours (e.g. 17.85)
  karanaEndingClockDec: number;
  lagnaRashiIndex?: number; // 0=Mesha ... 11=Meena
  avoidYoginiRashiIndex?: number;
  yogaIndex?: number;
  isVishtiToday?: boolean;
}

/**
 * Evaluates all Subha Karma rites and generates traditional book text
 */
export function evaluateSubhaKarmaThourams(
  input: ThouramEvaluationInput
): ThouramDayEvaluation {
  const {
    tithiNumber,
    nakshatraIndex,
    weekdayIndex,
    sunriseDec,
    sunsetDec,
    karanaEndingClockDec,
    lagnaRashiIndex = 1,
    yogaIndex,
    isVishtiToday
  } = input;

  const isShukla = tithiNumber <= 15;
  const tithi15 = ((tithiNumber - 1) % 15) + 1; // 1 to 15
  const isRikta = [4, 9, 14].includes(tithi15);
  const isAmavasya = tithiNumber === 30;

  // 1. Compute Auspicious Muhurta Time Windows matching the book format
  // Morning Window: e.g. 08:08 to 13:08 (Punyaha, Shilparambha, Shantiswastyayan, Pot Chaiba/Yonba, Gari Leiba/Yonba)
  const m1Start = (sunriseDec + 3.1) % 24;
  const m1End = (sunriseDec + 8.1) % 24;

  // Afternoon/Evening Window: 3-hour window ending at Sandhya twilight (sunsetDec + 0.2)
  const m2End = (sunsetDec + 0.2) % 24;
  const m2Start = (m2End - 3.0 + 24) % 24;

  const m1Bengali = `${formatManipuriClockTimeBengali(m1Start)} দগী ${formatManipuriClockTimeBengali(m1End)} ফাওবা`;
  const m1Meetei = `${formatManipuriClockTimeMeetei(m1Start)} ꯗꯒꯤ ${formatManipuriClockTimeMeetei(m1End)} ꯐꯥꯑꯣꯕ`;
  const m1Blipi = `${formatManipuriClockTimeBlipi(m1Start)} dgI ${formatManipuriClockTimeBlipi(m1End)} faoba`;

  const m2Bengali = `${formatManipuriClockTimeBengali(m2Start)} দগী ${formatManipuriClockTimeBengali(m2End)} ফাওবা`;
  const m2Meetei = `${formatManipuriClockTimeMeetei(m2Start)} ꯗꯒꯤ ${formatManipuriClockTimeMeetei(m2End)} ꯐꯥꯑꯣꯕ`;
  const m2Blipi = `${formatManipuriClockTimeBlipi(m2Start)} dgI ${formatManipuriClockTimeBlipi(m2End)} faoba`;

  // 2. Evaluate each registered ritual
  const evaluatedRites: EvaluatedThouram[] = THOURAM_REGISTRY.map((rule) => {
    const reasons: string[] = [];
    let score = 0;

    // Check prohibited tithis
    const isProhibitedTithi =
      (rule.prohibitedTithis && rule.prohibitedTithis.includes(tithiNumber)) ||
      (rule.prohibitedTithis && rule.prohibitedTithis.includes(tithi15)) ||
      (isRikta && rule.category === 'Sanskara') ||
      (isAmavasya && rule.category !== 'Spiritual');

    if (isProhibitedTithi) {
      reasons.push(isAmavasya ? 'অমাবস্যা নিষিদ্ধ (Amavasya Prohibited)' : 'রিক্তা তিথি নিষিদ্ধ (Rikta Tithi Prohibited)');
    }

    // Check Shukla Paksha requirement
    if (rule.requiresShuklaPaksha && !isShukla) {
      reasons.push('শুক্লপক্ষ আবশ্যক (Requires Shukla Paksha)');
    }

    // Check allowed Tithi
    const tithiOk = rule.allowedTithis.includes(tithi15);
    if (tithiOk) {
      score += 35;
    } else {
      reasons.push(`তিথি অনুকূল নয় (Tithi ${tithi15} not preferred)`);
    }

    // Check allowed Nakshatra
    const nakOk = rule.allowedNakshatras.includes(nakshatraIndex);
    if (nakOk) {
      score += 35;
    } else {
      reasons.push(`নক্ষত্র অনুকূল নয় (Nakshatra ${nakshatraIndex} not preferred)`);
    }

    // Check allowed Weekday
    const dayOk = rule.allowedWeekdays.includes(weekdayIndex);
    if (dayOk) {
      score += 20;
    } else {
      reasons.push(`বার অনুকূল নয় (Weekday not preferred)`);
    }

    // Check preferred Lagna
    const lagna1To12 = lagnaRashiIndex + 1;
    if (rule.preferredLagnas && rule.preferredLagnas.includes(lagna1To12)) {
      score += 10;
    }

    // Final eligibility determination
    const isEligible = !isProhibitedTithi && (!rule.requiresShuklaPaksha || isShukla) && (tithiOk || nakOk) && dayOk;
    
    let status: EvaluatedThouram['status'] = 'INELIGIBLE';
    if (isEligible && score >= 75) {
      status = 'RECOMMENDED';
    } else if (isEligible || score >= 50) {
      status = 'PERMISSIBLE';
    }

    // Assign time window
    const isCarpentryOrConstruction = ['sapumi_sapimun', 'yum_sarambha'].includes(rule.id);
    const windowB = isCarpentryOrConstruction ? m2Bengali : m1Bengali;
    const windowM = isCarpentryOrConstruction ? m2Meetei : m1Meetei;
    const windowBl = isCarpentryOrConstruction ? m2Blipi : m1Blipi;

    return {
      rule,
      isEligible,
      suitabilityScore: Math.min(100, score),
      status,
      timeWindowBengali: windowB,
      timeWindowMeetei: windowM,
      timeWindowBlipi: windowBl,
      reasons: reasons.length > 0 ? reasons : ['সকল গ্রহ ও তিথি শুভ এবং প্রশস্ত (All factors favorable)']
    };
  });

  const recommendedRites = evaluatedRites.filter(
    (r) => r.status === 'RECOMMENDED' || r.status === 'PERMISSIBLE'
  );

  // 3. Evaluate Graha Puja (Navagraha Shanti & Planetary Propitiation)
  const isVaidhritiOrVyatipata = yogaIndex === 27 || yogaIndex === 17;
  const isGrahaPujaProhibited = isRikta || isAmavasya || isVaidhritiOrVyatipata || !!isVishtiToday;
  const isGrahaPujaAvailable = !isGrahaPujaProhibited;

  let grahaReasonBengali = '';
  let grahaReasonMeetei = '';
  let grahaReasonBlipi = '';

  if (isGrahaPujaAvailable) {
    grahaReasonBengali = 'তিথি ও নক্ষত্র শুভ — নবগ্রহ শান্তি ও পূজা প্রশস্ত';
    grahaReasonMeetei = 'ꯇꯤꯊꯤ ꯑꯃꯁꯨꯡ ꯅꯛꯁꯠꯔ ꯁꯨꯚ — ꯅꯕꯒ꯭ꯔꯍ ꯁꯥꯟꯇꯤ ꯑꯃꯁꯨꯡ ꯄꯨꯖꯥ ꯄ꯭ꯔꯁꯁ꯭ꯇ';
    grahaReasonBlipi = 'itiT Amsuz nKSt/ suv — nbg/h saint Amsuz puja prSSt';
  } else {
    const reasonsB: string[] = [];
    const reasonsM: string[] = [];
    const reasonsBl: string[] = [];

    if (isRikta) {
      reasonsB.push('রিক্তা তিথি');
      reasonsM.push('ꯔꯤꯛꯇꯥ ꯇꯤꯊꯤ');
      reasonsBl.push('irKta itiT');
    }
    if (isAmavasya) {
      reasonsB.push('অমাবস্যা');
      reasonsM.push('ꯑꯃꯥꯕꯁ꯭ꯌꯥ');
      reasonsBl.push('AmabS/a');
    }
    if (isVaidhritiOrVyatipata) {
      const yNameB = yogaIndex === 27 ? 'বৈধৃতিযোগ' : 'ব্যতীপাতযোগ';
      const yNameM = yogaIndex === 27 ? 'ꯕꯩꯙ꯭ꯔꯤꯇꯤꯌꯣꯒ' : 'ꯕ꯭ꯌꯇꯤꯄꯥꯇꯌꯣꯒ';
      const yNameBl = yogaIndex === 27 ? 'EbD/itiEyag' : 'b/itipatEyag';
      reasonsB.push(yNameB);
      reasonsM.push(yNameM);
      reasonsBl.push(yNameBl);
    }
    if (isVishtiToday) {
      reasonsB.push('বিষ্টি (ভদ্রা) করণ');
      reasonsM.push('ꯕꯤꯁ꯭ꯇꯤ (ꯚꯗ꯭ꯔꯥ) ꯀꯔꯟ');
      reasonsBl.push('ibis/t (vdr) krn');
    }

    grahaReasonBengali = `${reasonsB.join(' ও ')}গীদমক গ্রহ পূজা য়াদবা (নিষিদ্ধ)`;
    grahaReasonMeetei = `${reasonsM.join(' ꯑꯃꯁꯨꯡ ')}ꯒꯤꯗꯃꯛ ꯒ꯭ꯔꯍ ꯄꯨꯖꯥ ꯌꯥꯗꯕ (ꯅꯤꯁꯤꯗ꯭ꯙ)`;
    grahaReasonBlipi = `${reasonsBl.join(' Amsuz ')}gIdmK g/h puja yadba (iniSid/)`;
  }

  const grahaPuja: GrahaPujaEvaluation = {
    isAvailable: isGrahaPujaAvailable,
    statusBengali: isGrahaPujaAvailable ? 'য়াবা (শুভ ও প্রশস্ত)' : 'য়াদবা (নিষিদ্ধ)',
    statusMeetei: isGrahaPujaAvailable ? 'ꯌꯥꯕ (ꯁꯨꯚ ꯑꯃꯁꯨꯡ ꯄ꯭ꯔꯁꯁ꯭ꯇ)' : 'ꯌꯥꯗꯕ (ꯅꯤꯁꯤꯗ꯭ꯙ)',
    statusBlipi: isGrahaPujaAvailable ? 'yaba (suv Amsuz prSSt)' : 'yadba (iniSid/)',
    timeWindowBengali: isGrahaPujaAvailable ? m1Bengali : undefined,
    timeWindowMeetei: isGrahaPujaAvailable ? m1Meetei : undefined,
    timeWindowBlipi: isGrahaPujaAvailable ? m1Blipi : undefined,
    reasonBengali: grahaReasonBengali,
    reasonMeetei: grahaReasonMeetei,
    reasonBlipi: grahaReasonBlipi,
    fullTextBengali: isGrahaPujaAvailable
      ? `গ্রহ পূজা: য়াবা — ${m1Bengali}গী মনুংদা নবগ্রহ শান্তি ও পূজা প্রশস্ত।`
      : `গ্রহ পূজা: য়াদবা — ${grahaReasonBengali}।`,
    fullTextMeetei: isGrahaPujaAvailable
      ? `ꯒ꯭ꯔꯍ ꯄꯨꯖꯥ: ꯌꯥꯕ — ${m1Meetei}ꯒꯤ ꯃꯅꯨꯡꯗ ꯅꯕꯒ꯭ꯔꯍ ꯁꯥꯟꯇꯤ ꯑꯃꯁꯨꯡ ꯄꯨꯖꯥ ꯄ꯭ꯔꯁꯁ꯭ꯇ꯫`
      : `ꯒ꯭ꯔꯍ ꯄꯨꯖꯥ: ꯌꯥꯗꯕ — ${grahaReasonMeetei}꯫`,
    fullTextBlipi: isGrahaPujaAvailable
      ? `g/h puja: yaba — ${m1Blipi}gI mnuzda nbg/h saint Amsuz puja prSSt|`
      : `g/h puja: yadba — ${grahaReasonBlipi}|`
  };

  // 4. Compose Authentic Book Paragraphs matching physical book excerpt
  // "অফবা থৌরম (শুভ অনুষ্ঠান ও কর্ম): নুংথিল পুং ৩ । ১৩ । ৪৮ দগী নুমিদাং পুং ৬ । ১৩ । ৪৮ ফাওবা সপুমী সপিমুন। অফবা থৌরম: - পুণ্যাহ, শিল্পারম্ভ শান্তিস্বস্ত্যয়ন অয়ুক পুং ৮ । ০৮ । ০০ দগী নুংথিল পুং ১ । ০৮ । ০০ ফাওবগী মনুংদা পোৎ চৈবা, পোৎ য়োনবা, গাড়ী লৈবা য়োনবা।"
  const fullTextBengali = `অফবা থৌরম (শুভ অনুষ্ঠান ও কর্ম): ${m2Bengali} সপুমী সপিমুন। অফবা থৌরম: - পুণ্যাহ, শিল্পারম্ভ শান্তিস্বস্ত্যয়ন ${m1Bengali}গী মনুংদা পোৎ চৈবা, পোৎ য়োনবা, গাড়ী লৈবা য়োনবা।`;

  const fullTextMeetei = `ꯑꯐꯕ ꯊꯧꯔꯝ (ꯁꯨꯚ ꯑꯅꯨꯁ꯭ꯊꯥꯟ ꯑꯃꯁꯨꯡ ꯊꯕꯛ): ${m2Meetei} ꯁꯄꯨꯃꯤ ꯁꯄꯤꯃꯨꯟ꯫ ꯑꯐꯕ ꯊꯧꯔꯝ: - ꯄꯨꯅ꯭ꯌꯥꯍ, ꯁꯤꯜꯄꯥꯔꯝꯚ ꯁꯥꯟꯇꯤꯁ꯭ꯕꯁ꯭ꯇ꯭ꯌꯌꯟ ${m1Meetei}ꯒꯤ ꯃꯅꯨꯡꯗ ꯄꯣꯠ ꯆꯩꯕ, ꯄꯣꯠ ꯌꯣꯟꯕ, ꯒꯥꯔꯤ ꯂꯩꯕ ꯌꯣꯟꯕ꯫`;

  const fullTextBlipi = `Afba ETarm (Afba Tbk To_rm): ${m2Blipi} spumI sipmun| Afba ETarm: - pun/aH, iSl_parMv saintSbSt/yn ${m1Blipi}gI mnuzda Epac\\ba, Epayanba, gadI E~lba yanba|`;

  return {
    primaryWindow: {
      startHourDec: m1Start,
      endHourDec: m1End,
      bengali: m1Bengali,
      meetei: m1Meetei,
      blipi: m1Blipi
    },
    secondaryWindow: {
      startHourDec: m2Start,
      endHourDec: m2End,
      bengali: m2Bengali,
      meetei: m2Meetei,
      blipi: m2Blipi
    },
    fullTextBengali,
    fullTextMeetei,
    fullTextBlipi,
    grahaPuja,
    evaluatedRites,
    recommendedRites
  };
}
