/**
 * Manipuri Subha Karma (Afaba Thouram) Master Registry
 * Authentic traditional astrological rules for life rituals in Manipur Panjika
 */

export interface ThouramRule {
  id: string;
  nameMeetei: string; // Meetei Mayek script
  nameBengali: string; // Bengali script traditional in Panjika
  nameEnglish: string;
  category: 'Sanskara' | 'Property' | 'Commerce' | 'Spiritual' | 'Health';
  allowedTithis: number[]; // 1-15 (1=Pratipada, 15=Purnima; odd/even logic where needed)
  allowedNakshatras: number[]; // 1 to 27
  allowedWeekdays: number[]; // 0 = Sunday, 1 = Monday ... 6 = Saturday
  prohibitedTithis?: number[]; // Rikta (4, 9, 14), Amavasya (30)
  requiresShuklaPaksha?: boolean;
  requiresGuruShukraUdaya?: boolean;
  preferredLagnas?: number[]; // 1=Mesha, 2=Vrishabha ... 12=Meena
  avoidYoginiDirection?: boolean;
  notes: string;
}

export const THOURAM_REGISTRY: ThouramRule[] = [
  // ─────────────────────────────────────────────────────────────
  // 1. SANSKARA (LIFECYCLE SACRAMENTS)
  // ─────────────────────────────────────────────────────────────
  {
    id: 'chakumba',
    nameMeetei: 'ꯆꯥꯛ ꯎꯝꯕ',
    nameBengali: 'চাক উম্বা (অন্নপ্রাশন)',
    nameEnglish: 'Chakumba (First Rice Feeding / Annaprashana)',
    category: 'Sanskara',
    allowedTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    allowedNakshatras: [4, 5, 7, 8, 12, 13, 14, 15, 17, 21, 22, 23, 24, 26, 27],
    allowedWeekdays: [1, 3, 4, 5], // Mon, Wed, Thu, Fri
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: true,
    preferredLagnas: [2, 3, 4, 6, 7, 9, 11],
    avoidYoginiDirection: false,
    notes: 'Boys in 6th or 8th month; Girls in 5th or 7th month. Avoid Rikta tithis, Amavasya, and Nanda tithis.'
  },
  {
    id: 'luhongba',
    nameMeetei: 'ꯂꯨꯍꯣꯡꯕ',
    nameBengali: 'লুহোংবা (বিবাহ)',
    nameEnglish: 'Luhongba (Manipuri Sacred Wedding)',
    category: 'Sanskara',
    allowedTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    allowedNakshatras: [4, 5, 10, 12, 13, 15, 17, 19, 21, 26, 27],
    allowedWeekdays: [1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 15, 30],
    requiresShuklaPaksha: true,
    requiresGuruShukraUdaya: true,
    preferredLagnas: [2, 3, 4, 6, 7, 9, 11, 12],
    avoidYoginiDirection: true,
    notes: 'Requires auspicious Lagna, Jupiter/Venus direct, avoidance of Bhadra Karana, and alignment of Gotra/Yek Salai.'
  },
  {
    id: 'swasti_puja',
    nameMeetei: 'ꯁ꯭ꯕꯁ꯭ꯇꯤ ꯄꯨꯖꯥ',
    nameBengali: 'স্বস্তি পূজা / ষষ্ঠী পূজা',
    nameEnglish: 'Swasti Puja (Post-natal Blessing & Sasthi Puja)',
    category: 'Sanskara',
    allowedTithis: [1, 2, 3, 5, 6, 7, 10, 11, 13, 15],
    allowedNakshatras: [1, 4, 5, 8, 13, 17, 22, 27],
    allowedWeekdays: [0, 1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: false,
    preferredLagnas: [1, 2, 3, 5, 7, 9, 11],
    avoidYoginiDirection: false,
    notes: 'Protective child ceremony performed on 6th day or an auspicious planetary conjunction after birth.'
  },
  {
    id: 'nahutpa',
    nameMeetei: 'ꯅꯥꯍꯨꯠꯄ',
    nameBengali: 'নাহুৎপা (কর্ণবেধ / কান ফোড়ন)',
    nameEnglish: 'Nahutpa (Karna Vedha / Ear Piercing Ceremony)',
    category: 'Sanskara',
    allowedTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    allowedNakshatras: [5, 8, 13, 14, 17, 22, 23, 27],
    allowedWeekdays: [1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: true,
    preferredLagnas: [2, 3, 4, 6, 7, 9, 11],
    avoidYoginiDirection: false,
    notes: 'Best performed in morning hours during bright fortnight for child health and clarity of mind.'
  },
  {
    id: 'chudakarana',
    nameMeetei: 'ꯀꯣꯛ ꯁꯝꯖꯦꯠꯄ',
    nameBengali: 'কোক শমজেৎপা (চূড়াকরণ / মুণ্ডন)',
    nameEnglish: 'Chudakarana / Kok Samjetpa (Tonsure / First Haircut)',
    category: 'Sanskara',
    allowedTithis: [2, 3, 5, 7, 10, 11, 13],
    allowedNakshatras: [1, 5, 7, 8, 13, 14, 15, 22, 23, 24, 27],
    allowedWeekdays: [1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: true,
    requiresGuruShukraUdaya: true,
    preferredLagnas: [2, 3, 6, 7, 9, 11],
    avoidYoginiDirection: false,
    notes: 'Cleansing ritual performed in 1st, 3rd or 5th year of age during Uttarayana.'
  },
  {
    id: 'vidyarambha',
    nameMeetei: 'ꯂꯥꯏꯔꯤꯛ ꯇꯝꯕ ꯍꯧꯕ',
    nameBengali: 'লাইরিক তম্বা হৌবা (বিদ্যারম্ভ / অক্ষরজ্ঞান)',
    nameEnglish: 'Vidyarambha (First Day of School / Commencement of Studies)',
    category: 'Sanskara',
    allowedTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    allowedNakshatras: [1, 4, 5, 6, 7, 8, 13, 14, 15, 17, 22, 23, 24, 27],
    allowedWeekdays: [0, 3, 4, 5], // Sun, Wed, Thu, Fri
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: true,
    preferredLagnas: [3, 6, 9, 12], // Dual signs for intellectual adaptability
    avoidYoginiDirection: false,
    notes: 'Invocation to Saraswati and Ganesha; Mercury and Jupiter beneficially aspecting the Lagna.'
  },
  {
    id: 'upanyana',
    nameMeetei: 'ꯂꯨꯒꯨꯟ ꯊꯥꯡꯕ',
    nameBengali: 'লুগুন থাংবা (উপনয়ন / যজ্ঞোপবীত)',
    nameEnglish: 'Upanyana (Lugun Thangba / Sacred Thread Investiture)',
    category: 'Sanskara',
    allowedTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    allowedNakshatras: [1, 4, 5, 7, 8, 12, 13, 14, 15, 17, 21, 22, 23, 24, 26, 27],
    allowedWeekdays: [0, 1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: true,
    requiresGuruShukraUdaya: true,
    preferredLagnas: [1, 2, 3, 4, 5, 6, 7, 9, 11],
    avoidYoginiDirection: false,
    notes: 'Sacred spiritual initiation; strict avoidance of combustion of Jupiter or Venus and Dagdha tithis.'
  },

  // ─────────────────────────────────────────────────────────────
  // 2. PROPERTY & CONSTRUCTION
  // ─────────────────────────────────────────────────────────────
  {
    id: 'yum_panba',
    nameMeetei: 'ꯌꯨꯝ ꯄꯥꯟꯕ',
    nameBengali: 'য়ুম পানবা (গৃহপ্রবেশ)',
    nameEnglish: 'Yum Panba (Griha Pravesh / House Warming)',
    category: 'Property',
    allowedTithis: [2, 3, 5, 7, 10, 11, 12, 13, 15],
    allowedNakshatras: [4, 5, 8, 12, 13, 14, 17, 21, 22, 23, 24, 26, 27],
    allowedWeekdays: [1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: true,
    requiresGuruShukraUdaya: true,
    preferredLagnas: [2, 5, 8, 11], // Sthira (Fixed) Lagnas
    avoidYoginiDirection: true,
    notes: 'Moving into a new residence; must avoid Tuesday and Sunday. Sthira Lagna grants permanent prosperity.'
  },
  {
    id: 'yum_sarambha',
    nameMeetei: 'ꯌꯨꯝ ꯁꯥꯔꯝꯚ',
    nameBengali: 'য়ুম শারম্ভ (গৃহ নির্মাণারম্ভ / ভিত্তিস্থাপন)',
    nameEnglish: 'Yum Sarambha (Foundation Laying / House Construction)',
    category: 'Property',
    allowedTithis: [2, 3, 5, 7, 10, 11, 13, 15],
    allowedNakshatras: [4, 5, 12, 13, 14, 15, 17, 21, 26, 27],
    allowedWeekdays: [1, 3, 4, 5],
    prohibitedTithis: [4, 8, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: true,
    preferredLagnas: [2, 5, 8, 11],
    avoidYoginiDirection: true,
    notes: 'Commencing earth excavation, pillar installation, or stone foundation laying.'
  },
  {
    id: 'sapumi_sapimun',
    nameMeetei: 'ꯁꯄꯨꯃꯤ ꯁꯄꯤꯃꯨꯟ',
    nameBengali: 'সপুমী সপিমুন (কাষ্ঠ কর্ম ও গৃহ সজ্জা)',
    nameEnglish: 'Sapumi Sapimun (Carpentry, Wood Logging & Framework)',
    category: 'Property',
    allowedTithis: [2, 3, 5, 7, 10, 11, 13],
    allowedNakshatras: [4, 5, 7, 8, 12, 13, 14, 15, 17, 21, 22, 23, 27],
    allowedWeekdays: [1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: false,
    preferredLagnas: [2, 3, 6, 7, 10, 11],
    avoidYoginiDirection: false,
    notes: 'Cutting timber, joining structural beams, door frame installation, and carpentry works.'
  },
  {
    id: 'gari_leiba_yonba',
    nameMeetei: 'ꯒꯥꯔꯤ ꯂꯩꯕ ꯌꯣꯟꯕ',
    nameBengali: 'গাড়ী লৈবা য়োনবা (যানবাহন ক্রয় ও বিক্রয়)',
    nameEnglish: 'Gari Leiba, Yonba (Vehicle Purchase & Sale)',
    category: 'Property',
    allowedTithis: [2, 3, 5, 7, 10, 11, 12, 13, 15],
    allowedNakshatras: [1, 4, 7, 8, 13, 14, 15, 17, 22, 23, 24, 27],
    allowedWeekdays: [0, 1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: false,
    preferredLagnas: [2, 3, 4, 6, 7, 9, 11],
    avoidYoginiDirection: false,
    notes: 'Automobile, motorcycle, tractor, or boat acquisition and formal conveyance registration.'
  },
  {
    id: 'khetrapujan_louwathaba',
    nameMeetei: 'ꯂꯧ ꯎꯕ ꯍꯧꯕ',
    nameBengali: 'লৌ উবা হৌবা (ক্ষেত্রপূজন ও হলপ্রবাহ)',
    nameEnglish: 'Lou Uba Houba (Ploughing, Sowing & Agricultural Consecration)',
    category: 'Property',
    allowedTithis: [2, 3, 5, 7, 10, 11, 13, 15],
    allowedNakshatras: [4, 5, 8, 10, 12, 13, 14, 15, 17, 19, 21, 22, 23, 24, 26, 27],
    allowedWeekdays: [1, 3, 4, 5, 6],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: false,
    preferredLagnas: [2, 4, 6, 8, 10, 12],
    avoidYoginiDirection: false,
    notes: 'Blessing agricultural fields, first seasonal ploughing, paddy sowing, and irrigation inauguration.'
  },

  // ─────────────────────────────────────────────────────────────
  // 3. COMMERCE & TRADE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'dukan_hangba',
    nameMeetei: 'ꯗꯨꯀꯥꯟ ꯍꯥꯡꯕ',
    nameBengali: 'দোকান হাংবা (বাণিজ্য আরম্ভ)',
    nameEnglish: 'Dukan Hangba (Shop Opening & Commerce Initiation)',
    category: 'Commerce',
    allowedTithis: [2, 3, 5, 7, 10, 11, 13, 15],
    allowedNakshatras: [1, 4, 8, 12, 13, 14, 15, 17, 22, 23, 27],
    allowedWeekdays: [3, 4, 5], // Wed, Thu, Fri prime
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: true,
    preferredLagnas: [2, 5, 8, 11],
    avoidYoginiDirection: false,
    notes: 'Inaugurating commercial shop, boutique, office, or startup. Fixed sign ensures steady cashflow.'
  },
  {
    id: 'pot_chaiba_yonba',
    nameMeetei: 'ꯄꯣꯠ ꯆꯩꯕ, ꯄꯣꯠ ꯌꯣꯟꯕ',
    nameBengali: 'পোৎ চৈবা, পোৎ য়োনবা (ক্রয় ও বিক্রয়)',
    nameEnglish: 'Pot Chaiba, Pot Yonba (Buying & Selling Merchandise)',
    category: 'Commerce',
    allowedTithis: [2, 3, 5, 7, 10, 11, 12, 13, 15],
    allowedNakshatras: [1, 4, 5, 8, 13, 14, 15, 17, 22, 23, 27],
    allowedWeekdays: [1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: false,
    preferredLagnas: [2, 3, 6, 7, 9, 11],
    avoidYoginiDirection: false,
    notes: 'Wholesale trading, inventory procurement, commercial contracts, and profitable exchange of goods.'
  },
  {
    id: 'shilparambha',
    nameMeetei: 'ꯁꯤꯜꯄꯥꯔꯝꯚ',
    nameBengali: 'শিল্পারম্ভ (শিল্প, কলা ও কর্ম আরম্ভ)',
    nameEnglish: 'Shilparambha (Arts, Craftsmanship & Industrial Start)',
    category: 'Commerce',
    allowedTithis: [2, 3, 5, 7, 10, 11, 13, 15],
    allowedNakshatras: [4, 5, 7, 8, 13, 14, 15, 17, 22, 23, 24, 27],
    allowedWeekdays: [0, 1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: false,
    preferredLagnas: [1, 2, 3, 5, 6, 7, 9, 10, 11],
    avoidYoginiDirection: false,
    notes: 'Commencing textile weaving, pottery, jewelry design, fine arts, music, or mechanical manufacturing.'
  },
  {
    id: 'khutsa_heiba',
    nameMeetei: 'ꯈꯨꯠꯁꯥ ꯍꯩꯕ',
    nameBengali: 'খুৎশা হৈবা (বৃত্তিমূলক শিক্ষা ও কর্মদক্ষতা আরম্ভ)',
    nameEnglish: 'Khutsa Heiba (Vocational Training & Craft Apprenticeship)',
    category: 'Commerce',
    allowedTithis: [2, 3, 5, 7, 10, 11, 13, 15],
    allowedNakshatras: [1, 4, 13, 14, 15, 17, 22, 23, 27],
    allowedWeekdays: [1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: false,
    preferredLagnas: [2, 3, 6, 7, 10, 11],
    avoidYoginiDirection: false,
    notes: 'Learning traditional martial arts (Thang-Ta), modern software engineering, or skilled trades.'
  },
  {
    id: 'hinauba',
    nameMeetei: 'ꯍꯤ ꯅꯧꯕ',
    nameBengali: 'হী নৌবা (নৌকা ও জলযান চালন আরম্ভ)',
    nameEnglish: 'Hi Nauba (Watercraft Launching & Water Voyage)',
    category: 'Commerce',
    allowedTithis: [2, 3, 5, 7, 10, 11, 13, 15],
    allowedNakshatras: [1, 4, 5, 8, 13, 14, 15, 17, 22, 23, 24, 27],
    allowedWeekdays: [1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: false,
    preferredLagnas: [4, 8, 12], // Water signs
    avoidYoginiDirection: true,
    notes: 'Launching new boats into rivers, lakes (Loktak), or freight transport journeys.'
  },

  // ─────────────────────────────────────────────────────────────
  // 4. SPIRITUAL & RITUALS
  // ─────────────────────────────────────────────────────────────
  {
    id: 'punyaha',
    nameMeetei: 'ꯄꯨꯅ꯭ꯌꯥꯍ',
    nameBengali: 'পুণ্যাহ (শুভ আরম্ভ)',
    nameEnglish: 'Punyaha (Auspicious Religious Commencement)',
    category: 'Spiritual',
    allowedTithis: [1, 2, 3, 5, 7, 10, 11, 12, 13, 15],
    allowedNakshatras: [1, 4, 5, 7, 8, 13, 15, 17, 22, 27],
    allowedWeekdays: [0, 1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: false,
    preferredLagnas: [1, 2, 4, 5, 7, 9, 11],
    avoidYoginiDirection: false,
    notes: 'General auspicious start, invoking deity blessings, beginning pilgrimages, and fasting vows.'
  },
  {
    id: 'shantiswastyayan',
    nameMeetei: 'ꯁꯥꯟꯇꯤꯁ꯭ꯕꯁ꯭ꯇ꯭ꯌꯌꯟ',
    nameBengali: 'শান্তিস্বস্ত্যয়ন (শান্তি যজ্ঞ ও গ্রহ পূজা)',
    nameEnglish: 'Shantiswastyayan (Peace Homa & Remedial Sacraments)',
    category: 'Spiritual',
    allowedTithis: [1, 2, 3, 5, 7, 8, 10, 11, 13, 15],
    allowedNakshatras: [1, 4, 5, 8, 13, 15, 17, 22, 24, 27],
    allowedWeekdays: [0, 1, 2, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: false,
    preferredLagnas: [1, 2, 4, 5, 7, 9, 11],
    avoidYoginiDirection: false,
    notes: 'Sacred fire rituals, Graha Shanti, and chanting to ward off natural disasters or bodily distress.'
  },
  {
    id: 'graha_puja',
    nameMeetei: 'ꯒ꯭ꯔꯍ ꯄꯨꯖꯥ',
    nameBengali: 'গ্রহ পূজা (নবগ্রহ শান্তি ও হোম)',
    nameEnglish: 'Graha Puja (Navagraha Shanti & Planetary Propitiation)',
    category: 'Spiritual',
    allowedTithis: [1, 2, 3, 5, 7, 8, 10, 11, 13, 15],
    allowedNakshatras: [1, 4, 5, 7, 8, 13, 15, 17, 22, 24, 27],
    allowedWeekdays: [0, 1, 2, 3, 4, 5, 6],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: false,
    preferredLagnas: [1, 2, 4, 5, 7, 9, 11],
    avoidYoginiDirection: false,
    notes: 'Navagraha worship, pacification of malefic planetary transits, Graha Shanti, and planetary deity blessings.'
  },
  {
    id: 'yatra_chathokpa',
    nameMeetei: 'ꯆꯠꯊꯣꯛꯄ',
    nameBengali: 'চৎথোকপা (যাত্রা আরম্ভ)',
    nameEnglish: 'Yatra / Chathokpa (Commencing Auspicious Travel)',
    category: 'Spiritual',
    allowedTithis: [2, 3, 5, 7, 10, 11, 12, 13],
    allowedNakshatras: [1, 5, 7, 8, 13, 17, 22, 23, 27],
    allowedWeekdays: [1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: false,
    preferredLagnas: [3, 6, 9, 11], // Movable & dual signs
    avoidYoginiDirection: true,
    notes: 'Long journeys, pilgrimages, and overseas travels. Never depart facing the Yogini direction.'
  },

  // ─────────────────────────────────────────────────────────────
  // 5. HEALTH & MEDICINE
  // ─────────────────────────────────────────────────────────────
  {
    id: 'chikitsa_aushadha',
    nameMeetei: 'ꯍꯤꯗꯥꯛ ꯆꯥꯕ ꯍꯧꯕ',
    nameBengali: 'হিদাক চাবা হৌবা (চিকিৎসারম্ভ ও ঔষধ সেবন)',
    nameEnglish: 'Chikitsa & Aushadha Sevana (Starting Treatment & Medication)',
    category: 'Health',
    allowedTithis: [2, 3, 5, 7, 8, 10, 11, 13, 15],
    allowedNakshatras: [1, 4, 5, 7, 8, 13, 14, 15, 17, 22, 23, 24, 27],
    allowedWeekdays: [0, 1, 3, 4, 5],
    prohibitedTithis: [4, 9, 14, 30],
    requiresShuklaPaksha: false,
    requiresGuruShukraUdaya: false,
    preferredLagnas: [1, 2, 3, 4, 6, 7, 9, 11],
    avoidYoginiDirection: false,
    notes: 'Taking first dose of critical medicine, starting therapy, or surgery under Ashwini/Pushya.'
  }
];

export function getThouramRuleById(id: string): ThouramRule | undefined {
  return THOURAM_REGISTRY.find((r) => r.id === id);
}

export function getThouramRulesByCategory(
  category: ThouramRule['category']
): ThouramRule[] {
  return THOURAM_REGISTRY.filter((r) => r.category === category);
}
