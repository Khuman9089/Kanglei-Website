export interface ManipurFestival {
  id: string;
  nameEn: string;
  nameBengali: string;
  nameMeetei: string;
  isGeneralHoliday: boolean;
  category: 'traditional' | 'national' | 'state';
}

/**
 * Evaluates whether a given calendar day is a festival or general holiday in Manipur.
 * NOTE: As per user instruction, KUT festival is explicitly excluded.
 */
export function getManipurFestival(
  day: number,
  month: number, // 1 - 12 (Gregorian)
  year: number,
  manipuriMonthCode: number, // 1 to 12 (Sajibu to Lamta)
  tithiNumber: number, // 1 to 30
  souraDate?: number
): ManipurFestival | null {
  // -------------------------------------------------------------
  // 1. FIXED GREGORIAN / NATIONAL / STATE HOLIDAYS
  // -------------------------------------------------------------
  if (month === 1 && day === 26) {
    return {
      id: 'republic_day',
      nameEn: 'Republic Day',
      nameBengali: 'প্রজাতন্ত্র দিবস',
      nameMeetei: 'ꯔꯤꯄꯕ꯭ꯂꯤꯛ ꯗꯦ',
      isGeneralHoliday: true,
      category: 'national',
    };
  }

  if (month === 2 && day === 15) {
    return {
      id: 'lui_ngai_ni',
      nameEn: 'Lui-Ngai-Ni',
      nameBengali: 'লুই-ঙাই-নি',
      nameMeetei: 'ꯂꯨꯏ-ꯉꯥꯏ-ꯅꯤ',
      isGeneralHoliday: true,
      category: 'state',
    };
  }

  if (month === 4 && (day === 13 || day === 14) && souraDate === 1) {
    return {
      id: 'cheiraoba_charak',
      nameEn: 'Cheiraoba (Vaishnav)',
      nameBengali: 'চৈরাওবা (চরক পূজা)',
      nameMeetei: 'ꯆꯩꯔꯥꯑꯣꯕ',
      isGeneralHoliday: true,
      category: 'traditional',
    };
  }

  if (month === 8 && day === 13) {
    return {
      id: 'patriots_day',
      nameEn: "Patriots' Day",
      nameBengali: 'দেশভক্ত দিবস',
      nameMeetei: 'ꯄꯦꯠꯔꯤꯌꯣꯠꯁ ꯗꯦ',
      isGeneralHoliday: true,
      category: 'state',
    };
  }

  if (month === 8 && day === 15) {
    return {
      id: 'independence_day',
      nameEn: 'Independence Day',
      nameBengali: 'স্বাধীনতা দিবস',
      nameMeetei: 'ꯏꯟꯗꯤꯄꯦꯟꯗꯦꯟꯁ ꯗꯦ',
      isGeneralHoliday: true,
      category: 'national',
    };
  }

  if (month === 10 && day === 2) {
    return {
      id: 'gandhi_jayanti',
      nameEn: 'Gandhi Jayanti',
      nameBengali: 'গান্ধী জয়ন্তী',
      nameMeetei: 'ꯒꯥꯟꯙꯤ ꯖꯌꯟꯇꯤ',
      isGeneralHoliday: true,
      category: 'national',
    };
  }

  if (month === 5 && day === 1) {
    return {
      id: 'may_day',
      nameEn: "May Day (Workers' Day)",
      nameBengali: 'মে দিবস (শ্রমিক দিবস)',
      nameMeetei: 'ꯃꯦ ꯗꯦ',
      isGeneralHoliday: true,
      category: 'national',
    };
  }

  // NOTE: KUT festival on November 1 is explicitly EXCLUDED per user requirements!

  if (month === 12 && day === 12) {
    return {
      id: 'nupi_lan',
      nameEn: 'Nupi Lan Day',
      nameBengali: 'নুপী লাল দিবস',
      nameMeetei: 'ꯅꯨꯄꯤ ꯂꯥꯜ ꯅꯨꯃꯤꯠ',
      isGeneralHoliday: true,
      category: 'state',
    };
  }

  if (month === 12 && day === 25) {
    return {
      id: 'christmas',
      nameEn: 'Christmas Day',
      nameBengali: 'খ্রিষ্টমাস (বোরোদিন)',
      nameMeetei: 'ꯈ꯭ꯔꯤꯁ꯭ꯇꯃꯥꯁ',
      isGeneralHoliday: true,
      category: 'national',
    };
  }

  // -------------------------------------------------------------
  // 2. MANIPURI LUNAR / TRADITIONAL FESTIVALS
  // -------------------------------------------------------------

  // Month 1: Sajibu (ꯁꯖꯤꯕꯨ)
  if (manipuriMonthCode === 1 && tithiNumber === 1) {
    return {
      id: 'sajibu_cheiraoba',
      nameEn: 'Sajibu Cheiraoba (Manipuri New Year)',
      nameBengali: 'শজিবু চৈরাওবা (নোংমাপানবা)',
      nameMeetei: 'ꯁꯖꯤꯕꯨ ꯆꯩꯔꯥꯑꯣꯕ',
      isGeneralHoliday: true,
      category: 'traditional',
    };
  }

  // Month 3: Ingaa (ꯏꯉꯥ)
  if (manipuriMonthCode === 3 && tithiNumber === 2) {
    return {
      id: 'kang_rath_yatra',
      nameEn: 'Kang (Rath Yatra)',
      nameBengali: 'কাং (রথ যাত্রা)',
      nameMeetei: 'ꯀꯥꯡ (ꯔꯊ ꯌꯥꯠꯔꯥ)',
      isGeneralHoliday: true,
      category: 'traditional',
    };
  }
  if (manipuriMonthCode === 3 && tithiNumber === 10) {
    return {
      id: 'kanglen',
      nameEn: 'Kanglen (Punaryatra)',
      nameBengali: 'কাংলেন (পুনর্যাত্রা)',
      nameMeetei: 'ꯀꯥꯡꯂꯦꯟ',
      isGeneralHoliday: true,
      category: 'traditional',
    };
  }

  // Month 5: Thawaan (ꯊꯋꯥꯟ)
  // Krishna Janmashtami (Krishna Ashtami, tithi 23)
  if (manipuriMonthCode === 5 && tithiNumber === 23) {
    return {
      id: 'janmashtami',
      nameEn: 'Krishna Janmashtami',
      nameBengali: 'শ্রীকৃষ্ণ জন্ম (জন্মাষ্টমী)',
      nameMeetei: 'ꯀ꯭ꯔꯤꯁ꯭ꯅ ꯖꯟꯃꯥꯁ꯭ꯇꯃꯤ',
      isGeneralHoliday: true,
      category: 'national',
    };
  }

  // Month 6: Laangban (ꯂꯥꯡꯕꯟ)
  // Heikru Hidongba (Langban Shukla Ekadashi, tithi 11)
  if (manipuriMonthCode === 6 && tithiNumber === 11) {
    return {
      id: 'heikru_hidongba',
      nameEn: 'Heikru Hidongba',
      nameBengali: 'হৈক্রু হিদোংবা',
      nameMeetei: 'ꯍꯩꯀ꯭ꯔꯨ ꯍꯤꯗꯣꯡꯕ',
      isGeneralHoliday: true,
      category: 'traditional',
    };
  }
  // Langban Tarpan begins (Krishna Pratipada, tithi 16)
  if (manipuriMonthCode === 6 && tithiNumber === 16) {
    return {
      id: 'tarpan_houba',
      nameEn: 'Langban Tarpan Houba',
      nameBengali: 'লাংবন তর্পণ হৌবা',
      nameMeetei: 'ꯂꯥꯡꯕꯟ ꯇꯔꯄꯟ ꯍꯧꯕ',
      isGeneralHoliday: false,
      category: 'traditional',
    };
  }

  // Month 7: Mera (ꯃꯦꯔꯥ)
  if (manipuriMonthCode === 7 && tithiNumber === 1) {
    return {
      id: 'mera_chaoren_houba',
      nameEn: 'Mera Chaoren Houba',
      nameBengali: 'মেরা চাউরেন হৌবা',
      nameMeetei: 'ꯃꯦꯔꯥ ꯆꯥꯑꯣꯔꯦꯟ ꯍꯧꯕ',
      isGeneralHoliday: false,
      category: 'traditional',
    };
  }
  if (manipuriMonthCode === 7 && tithiNumber === 8) {
    return {
      id: 'durga_ashtami',
      nameEn: 'Durga Ashtami',
      nameBengali: 'মহা অষ্টমী (দুর্গা পূজা)',
      nameMeetei: 'ꯗꯨꯔꯒꯥ ꯑꯁ꯭ꯇꯃꯤ',
      isGeneralHoliday: true,
      category: 'national',
    };
  }
  if (manipuriMonthCode === 7 && tithiNumber === 10) {
    return {
      id: 'dussehra',
      nameEn: 'Dussehra / Vijaya Dashami',
      nameBengali: 'বিজয়া দশমী (দশেরা)',
      nameMeetei: 'ꯗꯁꯦꯔꯥ / ꯕꯤꯖꯌꯥ ꯗꯁꯃꯤ',
      isGeneralHoliday: true,
      category: 'national',
    };
  }
  if (manipuriMonthCode === 7 && tithiNumber === 15) {
    return {
      id: 'mera_hou_chongba',
      nameEn: 'Mera Hou Chongba',
      nameBengali: 'মেরা হৌচোংবা (একতা দিবস)',
      nameMeetei: 'ꯃꯦꯔꯥ ꯍꯧꯆꯣꯡꯕ',
      isGeneralHoliday: true,
      category: 'traditional',
    };
  }

  // Month 8: Hiyaanggei (ꯍꯤꯌꯥꯡꯒꯩ)
  if (manipuriMonthCode === 8 && tithiNumber === 2) {
    return {
      id: 'ningol_chakkouba',
      nameEn: 'Ningol Chakkouba',
      nameBengali: 'নিঙোল চাক্কৌবা',
      nameMeetei: 'ꯅꯤꯡꯉꯣꯜ ꯆꯥꯛꯀꯧꯕ',
      isGeneralHoliday: true,
      category: 'traditional',
    };
  }
  if (manipuriMonthCode === 8 && tithiNumber === 30) {
    return {
      id: 'diwali',
      nameEn: 'Diwali (Deepavali)',
      nameBengali: 'দীপাবলী (দেওয়ালী)',
      nameMeetei: 'ꯗꯤꯋꯥꯂꯤ',
      isGeneralHoliday: true,
      category: 'national',
    };
  }

  // Month 10: Waakching (ꯋꯥꯛꯆꯤꯡ)
  if (manipuriMonthCode === 10 && tithiNumber === 12) {
    return {
      id: 'imoinu_iratpa',
      nameEn: 'Imoinu Iratpa',
      nameBengali: 'ইমোইনু ইরাৎপা',
      nameMeetei: 'ꯏꯃꯣꯏꯅꯨ ꯏꯔꯥꯠꯄ',
      isGeneralHoliday: true,
      category: 'traditional',
    };
  }
  if (manipuriMonthCode === 10 && tithiNumber === 13) {
    return {
      id: 'gaan_ngai',
      nameEn: 'Gaan-Ngai',
      nameBengali: 'গান-ঙাই',
      nameMeetei: 'ꯒꯥꯟ-ꯉꯥꯏ',
      isGeneralHoliday: true,
      category: 'state',
    };
  }

  // Month 12: Lamtaa (ꯂꯝꯇꯥ)
  if (manipuriMonthCode === 12 && tithiNumber === 15) {
    return {
      id: 'yaoshang_day1',
      nameEn: 'Yaoshang (1st Day / Meithaba)',
      nameBengali: 'য়াওশং (অহানবা নুমিৎ)',
      nameMeetei: 'ꯌꯥꯑꯣꯁꯪ (꯱ꯁꯨꯕ ꯅꯨꯃꯤꯠ)',
      isGeneralHoliday: true,
      category: 'traditional',
    };
  }
  if (manipuriMonthCode === 12 && tithiNumber === 16) {
    return {
      id: 'yaoshang_day2',
      nameEn: 'Yaoshang (2nd Day)',
      nameBengali: 'য়াওশং (অনিশুবা নুমিৎ)',
      nameMeetei: 'ꯌꯥꯑꯣꯁꯪ (꯲ꯁꯨꯕ ꯅꯨꯃꯤꯠ)',
      isGeneralHoliday: true,
      category: 'traditional',
    };
  }

  return null;
}
