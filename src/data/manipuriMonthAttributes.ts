export interface MonthAttributeEntry {
  monthCode: number;
  nameEn: string;
  nameBengali: string;
  nameMeetei: string;
  blipi: {
    month: string;
    tatnaba: string;
    thasiMaigei: string;
    waitek: string;
    cheiKaba: string;
  };
  bengali: {
    month: string;
    tatnaba: string;
    thasiMaigei: string;
    waitek: string;
    cheiKaba: string;
  };
  meetei: {
    month: string;
    tatnaba: string;
    thasiMaigei: string;
    waitek: string;
    cheiKaba: string;
  };
  tatnabaNumit: { bengali: string; meetei: string };
  tasiMahei: { bengali: string; meetei: string };
  waheibaNumit: { bengali: string; meetei: string };
  ichaKabaNumit: { bengali: string; meetei: string };
}

export const MANIPURI_MONTH_ATTRIBUTES_HEADERS = {
  blipi: {
    month: 'Ta mimz',
    tatnaba: 't\\nba nuim\\iSz',
    thasiMaigei: 'TaiS mah~e~g',
    waitek: 'wah~etk nuim\\iSz',
    cheiKaba: 'E~c kaba nuim\\iSz',
  },
  bengali: {
    month: 'থা মমিং',
    tatnaba: 'তৎনবা নুমিৎশিং',
    thasiMaigei: 'থাসি মাইগৈ',
    waitek: 'ৱাইতেক নুমিৎশিং',
    cheiKaba: 'চৈ কাবা নুমিৎশিং',
  },
  meetei: {
    month: 'ꯊꯥ ꯃꯃꯤꯡ',
    tatnaba: 'ꯇꯠꯅꯕ ꯅꯨꯃꯤꯠꯁꯤꯡ',
    thasiMaigei: 'ꯊꯥꯁꯤ ꯃꯥꯏꯒꯩ',
    waitek: 'ꯋꯥꯏꯇꯦꯛ ꯅꯨꯃꯤꯠꯁꯤꯡ',
    cheiKaba: 'ꯆꯩ ꯀꯥꯕ ꯅꯨꯃꯤꯠꯁꯤꯡ',
  },
};

export const MANIPURI_MONTH_ATTRIBUTES: MonthAttributeEntry[] = [
  {
    monthCode: 1,
    nameEn: 'Sajibu',
    nameBengali: 'শজিবু',
    nameMeetei: 'ꯁꯖꯤꯕꯨ',
    blipi: {
      month: 'Sijbu',
      tatnaba: 'Enazmah~ijz, inzeT;kaba',
      thasiMaigei: 'ice~™',
      waitek: 'Tazj',
      cheiKaba: 'Taj, Enazmah~ijz, inzeT;kaba',
    },
    bengali: {
      month: 'শজিবু',
      tatnaba: 'নোংমাইজিং, নিংথৌকাবা',
      thasiMaigei: 'ইচেক',
      waitek: 'থাংজ',
      cheiKaba: 'থাংজ, নোংমাইজিং, নিংথৌকাবা',
    },
    meetei: {
      month: 'ꯁꯖꯤꯕꯨ',
      tatnaba: 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ, ꯅꯤꯡꯊꯧꯀꯥꯕ',
      thasiMaigei: 'ꯏꯆꯦꯛ',
      waitek: 'ꯊꯥꯡꯖꯥ',
      cheiKaba: 'ꯊꯥꯡꯖꯥ, ꯅꯣꯡꯃꯥꯏꯖꯤꯡ, ꯅꯤꯡꯊꯧꯀꯥꯕ',
    },
    tatnabaNumit: { bengali: 'নোংমাইজিং, নিংথৌকাবা', meetei: 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ, ꯅꯤꯡꯊꯧꯀꯥꯕ' },
    tasiMahei: { bengali: 'ইচেক', meetei: 'ꯏꯆꯦꯛ' },
    waheibaNumit: { bengali: 'থাংজ', meetei: 'ꯊꯥꯡꯖꯥ' },
    ichaKabaNumit: { bengali: 'থাংজ, নোংমাইজিং, নিংথৌকাবা', meetei: 'ꯊꯥꯡꯖꯥ, ꯅꯣꯡꯃꯥꯏꯖꯤꯡ, ꯅꯤꯡꯊꯧꯀꯥꯕ' },
  },
  {
    monthCode: 2,
    nameEn: 'Kaalen',
    nameBengali: 'কালেন',
    nameMeetei: 'ꯀꯥꯂꯦꯟ',
    blipi: {
      month: 'kaeln',
      tatnaba: 'yumSe~kS, h~rah~',
      thasiMaigei: 'Awaz',
      waitek: 'E~lbakepakpa',
      cheiKaba: 'E~lbakepakpa, yumSe~kS, SegaleSn',
    },
    bengali: {
      month: 'কালেন',
      tatnaba: 'য়ুমশকৈশ, ইরাই',
      thasiMaigei: 'অৱাং',
      waitek: 'লৈবাকপোকপা',
      cheiKaba: 'লৈবাকপোকপা, য়ুমশকৈশ, শগোলশেন',
    },
    meetei: {
      month: 'ꯀꯥꯂꯦꯟ',
      tatnaba: 'ꯌꯨꯝꯁꯀꯩꯁꯥ, ꯏꯔꯥꯏ',
      thasiMaigei: 'ꯑꯋꯥꯡ',
      waitek: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ',
      cheiKaba: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ, ꯌꯨꯝꯁꯀꯩꯁꯥ, ꯁꯒꯣꯜꯁꯦꯟ',
    },
    tatnabaNumit: { bengali: 'য়ুমশকৈশ, ইরাই', meetei: 'ꯌꯨꯝꯁꯀꯩꯁꯥ, ꯏꯔꯥꯏ' },
    tasiMahei: { bengali: 'অৱাং', meetei: 'ꯑꯋꯥꯡ' },
    waheibaNumit: { bengali: 'লৈবাকপোকপা', meetei: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ' },
    ichaKabaNumit: { bengali: 'লৈবাকপোকপা, য়ুমশকৈশ, শগোলশেন', meetei: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ, ꯌꯨꯝꯁꯀꯩꯁꯥ, ꯁꯒꯣꯜꯁꯦꯟ' },
  },
  {
    monthCode: 3,
    nameEn: 'Ingaa',
    nameBengali: 'ইঙা',
    nameMeetei: 'ꯏꯉꯥ',
    blipi: {
      month: 'h~Za',
      tatnaba: 'E~lbakepakpa',
      thasiMaigei: 'Enazcup',
      waitek: 'yumSe~kS',
      cheiKaba: 'h~rah~, Tazj, Enazmah~ijz',
    },
    bengali: {
      month: 'ইঙা',
      tatnaba: 'লৈবাকপোকপা',
      thasiMaigei: 'নোংচুপ',
      waitek: 'য়ুমশকৈশ',
      cheiKaba: 'ইরাই, থাংজ, নোংমাইজিং',
    },
    meetei: {
      month: 'ꯏꯉꯥ',
      tatnaba: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ',
      thasiMaigei: 'ꯅꯣꯡꯆꯨꯞ',
      waitek: 'ꯌꯨꯝꯁꯀꯩꯁꯥ',
      cheiKaba: 'ꯏꯔꯥꯏ, ꯊꯥꯡꯖꯥ, ꯅꯣꯡꯃꯥꯏꯖꯤꯡ',
    },
    tatnabaNumit: { bengali: 'লৈবাকপোকপা', meetei: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ' },
    tasiMahei: { bengali: 'নোংচুপ', meetei: 'ꯅꯣꯡꯆꯨꯞ' },
    waheibaNumit: { bengali: 'য়ুমশকৈশ', meetei: 'ꯌꯨꯝꯁꯀꯩꯁꯥ' },
    ichaKabaNumit: { bengali: 'ইরাই, থাংজ, নোংমাইজিং', meetei: 'ꯏꯔꯥꯏ, ꯊꯥꯡꯖꯥ, ꯅꯣꯡꯃꯥꯏꯖꯤꯡ' },
  },
  {
    monthCode: 4,
    nameEn: 'Ingen',
    nameBengali: 'ইঙেন',
    nameMeetei: 'ꯏꯉꯦꯟ',
    blipi: {
      month: 'h~eZn',
      tatnaba: 'SegaleSn, Tazj',
      thasiMaigei: 'Ek;b{>',
      waitek: 'h~rah~',
      cheiKaba: 'inzeT;kaba, E~lbakepakpa, yumSe~kS',
    },
    bengali: {
      month: 'ইঙেন',
      tatnaba: 'শগোলশেন, থাংজ',
      thasiMaigei: 'কৌব্রু',
      waitek: 'ইরাই',
      cheiKaba: 'নিংথৌকাবা, লৈবাকপোকপা, য়ুমশকৈশ',
    },
    meetei: {
      month: 'ꯏꯉꯦꯟ',
      tatnaba: 'ꯁꯒꯣꯜꯁꯦꯟ, ꯊꯥꯡꯖꯥ',
      thasiMaigei: 'ꯀꯧꯕ꯭ꯔꯨ',
      waitek: 'ꯏꯔꯥꯏ',
      cheiKaba: 'ꯅꯤꯡꯊꯧꯀꯥꯕ, ꯂꯩꯄꯥꯛꯄꯣꯛꯄ, ꯌꯨꯝꯁꯀꯩꯁꯥ',
    },
    tatnabaNumit: { bengali: 'শগোলশেন, থাংজ', meetei: 'ꯁꯒꯣꯜꯁꯦꯟ, ꯊꯥꯡꯖꯥ' },
    tasiMahei: { bengali: 'কৌব্রু', meetei: 'ꯀꯧꯕ꯭ꯔꯨ' },
    waheibaNumit: { bengali: 'ইরাই', meetei: 'ꯏꯔꯥꯏ' },
    ichaKabaNumit: { bengali: 'নিংথৌকাবা, লৈবাকপোকপা, য়ুমশকৈশ', meetei: 'ꯅꯤꯡꯊꯧꯀꯥꯕ, ꯂꯩꯄꯥꯛꯄꯣꯛꯄ, ꯌꯨꯝꯁꯀꯩꯁꯥ' },
  },
  {
    monthCode: 5,
    nameEn: 'Thawaan',
    nameBengali: 'থৱান',
    nameMeetei: 'ꯊꯋꯥꯟ',
    blipi: {
      month: 'Twan',
      tatnaba: 'Enazmah~ijz, inzeT;kaba',
      thasiMaigei: 'ice~™',
      waitek: 'Tazj',
      cheiKaba: 'SeganeSn, h~rah~, Tazj',
    },
    bengali: {
      month: 'থৱান',
      tatnaba: 'নোংমাইজিং, নিংথৌকাবা',
      thasiMaigei: 'ইচেক',
      waitek: 'থাংজ',
      cheiKaba: 'শগোলশেন, ইরাই, থাংজ',
    },
    meetei: {
      month: 'ꯊꯋꯥꯟ',
      tatnaba: 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ, ꯅꯤꯡꯊꯧꯀꯥꯕ',
      thasiMaigei: 'ꯏꯆꯦꯛ',
      waitek: 'ꯊꯥꯡꯖꯥ',
      cheiKaba: 'ꯁꯒꯣꯜꯁꯦꯟ, ꯏꯔꯥꯏ, ꯊꯥꯡꯖꯥ',
    },
    tatnabaNumit: { bengali: 'নোংমাইজিং, নিংথৌকাবা', meetei: 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ, ꯅꯤꯡꯊꯧꯀꯥꯕ' },
    tasiMahei: { bengali: 'ইচেক', meetei: 'ꯏꯆꯦꯛ' },
    waheibaNumit: { bengali: 'থাংজ', meetei: 'ꯊꯥꯡꯖꯥ' },
    ichaKabaNumit: { bengali: 'শগোলশেন, ইরাই, থাংজ', meetei: 'ꯁꯒꯣꯜꯁꯦꯟ, ꯏꯔꯥꯏ, ꯊꯥꯡꯖꯥ' },
  },
  {
    monthCode: 6,
    nameEn: 'Laangban',
    nameBengali: 'লাংবন',
    nameMeetei: 'ꯂꯥꯡꯕꯟ',
    blipi: {
      month: 'lazbn',
      tatnaba: 'yumSe~kS, h~rah~',
      thasiMaigei: 'Awaz',
      waitek: 'E~lbakepakpa',
      cheiKaba: 'Enazmah~ijz, inzeT;kaba, E~lbakepakpa',
    },
    bengali: {
      month: 'লাংবন',
      tatnaba: 'য়ুমশকৈশ, ইরাই',
      thasiMaigei: 'অৱাং',
      waitek: 'লৈবাকপোকপা',
      cheiKaba: 'নোংমাইজিং, নিংথৌকাবা, লৈবাকপোকপা',
    },
    meetei: {
      month: 'ꯂꯥꯡꯕꯟ',
      tatnaba: 'ꯌꯨꯝꯁꯀꯩꯁꯥ, ꯏꯔꯥꯏ',
      thasiMaigei: 'ꯑꯋꯥꯡ',
      waitek: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ',
      cheiKaba: 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ, ꯅꯤꯡꯊꯧꯀꯥꯕ, ꯂꯩꯄꯥꯛꯄꯣꯛꯄ',
    },
    tatnabaNumit: { bengali: 'য়ুমশকৈশ, ইরাই', meetei: 'ꯌꯨꯝꯁꯀꯩꯁꯥ, ꯏꯔꯥꯏ' },
    tasiMahei: { bengali: 'অৱাং', meetei: 'ꯑꯋꯥꯡ' },
    waheibaNumit: { bengali: 'লৈবাকপোকপা', meetei: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ' },
    ichaKabaNumit: { bengali: 'নোংমাইজিং, নিংথৌকাবা, লৈবাকপোকপা', meetei: 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ, ꯅꯤꯡꯊꯧꯀꯥꯕ, ꯂꯩꯄꯥꯛꯄꯣꯛꯄ' },
  },
  {
    monthCode: 7,
    nameEn: 'Mera',
    nameBengali: 'মেরা',
    nameMeetei: 'ꯃꯦꯔꯥ',
    blipi: {
      month: 'Emra',
      tatnaba: 'E~lbakepakpa',
      thasiMaigei: 'Enazcup',
      waitek: 'yumSe~kS',
      cheiKaba: 'yumSe~kS, SegaleSn, h~rah~',
    },
    bengali: {
      month: 'মেরা',
      tatnaba: 'লৈবাকপোকপা',
      thasiMaigei: 'নোংচুপ',
      waitek: 'য়ুমশকৈশ',
      cheiKaba: 'য়ুমশকৈশ, শগোলশেন, ইরাই',
    },
    meetei: {
      month: 'ꯃꯦꯔꯥ',
      tatnaba: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ',
      thasiMaigei: 'ꯅꯣꯡꯆꯨꯞ',
      waitek: 'ꯌꯨꯝꯁꯀꯩꯁꯥ',
      cheiKaba: 'ꯌꯨꯝꯁꯀꯩꯁꯥ, ꯁꯒꯣꯜꯁꯦꯟ, ꯏꯔꯥꯏ',
    },
    tatnabaNumit: { bengali: 'লৈবাকপোকপা', meetei: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ' },
    tasiMahei: { bengali: 'নোংচুপ', meetei: 'ꯅꯣꯡꯆꯨꯞ' },
    waheibaNumit: { bengali: 'য়ুমশকৈশ', meetei: 'ꯌꯨꯝꯁꯀꯩꯁꯥ' },
    ichaKabaNumit: { bengali: 'য়ুমশকৈশ, শগোলশেন, ইরাই', meetei: 'ꯌꯨꯝꯁꯀꯩꯁꯥ, ꯁꯒꯣꯜꯁꯦꯟ, ꯏꯔꯥꯏ' },
  },
  {
    monthCode: 8,
    nameEn: 'Hiyaanggei',
    nameBengali: 'হিয়াঙ্গৈ',
    nameMeetei: 'ꯍꯤꯌꯥꯡꯒꯩ',
    blipi: {
      month: 'ihyaze~O',
      tatnaba: 'SegaleSn, Tazj',
      thasiMaigei: 'Ek;b{>',
      waitek: 'h~rah~',
      cheiKaba: 'Taj, Enazmah~ijz, inzeT;kaba',
    },
    bengali: {
      month: 'হিয়াঙ্গৈ',
      tatnaba: 'শগোলশেন, থাংজ',
      thasiMaigei: 'কৌব্রু',
      waitek: 'ইরাই',
      cheiKaba: 'থাংজ, নোংমাইজিং, নিংথৌকাবা',
    },
    meetei: {
      month: 'ꯍꯤꯌꯥꯡꯒꯩ',
      tatnaba: 'ꯁꯒꯣꯜꯁꯦꯟ, ꯊꯥꯡꯖꯥ',
      thasiMaigei: 'ꯀꯧꯕ꯭ꯔꯨ',
      waitek: 'ꯏꯔꯥꯏ',
      cheiKaba: 'ꯊꯥꯡꯖꯥ, ꯅꯣꯡꯃꯥꯏꯖꯤꯡ, ꯅꯤꯡꯊꯧꯀꯥꯕ',
    },
    tatnabaNumit: { bengali: 'শগোলশেন, থাংজ', meetei: 'ꯁꯒꯣꯜꯁꯦꯟ, ꯊꯥꯡꯖꯥ' },
    tasiMahei: { bengali: 'কৌব্রু', meetei: 'ꯀꯧꯕ꯭ꯔꯨ' },
    waheibaNumit: { bengali: 'ইরাই', meetei: 'ꯏꯔꯥꯏ' },
    ichaKabaNumit: { bengali: 'থাংজ, নোংমাইজিং, নিংথৌকাবা', meetei: 'ꯊꯥꯡꯖꯥ, ꯅꯣꯡꯃꯥꯏꯖꯤꯡ, ꯅꯤꯡꯊꯧꯀꯥꯕ' },
  },
  {
    monthCode: 9,
    nameEn: 'Poinu',
    nameBengali: 'পোইনু',
    nameMeetei: 'ꯄꯣꯏꯅꯨ',
    blipi: {
      month: 'Epah~nu',
      tatnaba: 'Enazmah~ijz, inzeT;kaba',
      thasiMaigei: 'ice~™',
      waitek: 'Tazj',
      cheiKaba: 'E~lbakepakpa, yumSe~kS, SegaleSn',
    },
    bengali: {
      month: 'পোইনু',
      tatnaba: 'নোংমাইজিং, নিংথৌকাবা',
      thasiMaigei: 'ইচেক',
      waitek: 'থাংজ',
      cheiKaba: 'লৈবাকপোকপা, য়ুমশকৈশ, শগোলশেন',
    },
    meetei: {
      month: 'ꯄꯣꯏꯅꯨ',
      tatnaba: 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ, ꯅꯤꯡꯊꯧꯀꯥꯕ',
      thasiMaigei: 'ꯏꯆꯦꯛ',
      waitek: 'ꯊꯥꯡꯖꯥ',
      cheiKaba: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ, ꯌꯨꯝꯁꯀꯩꯁꯥ, ꯁꯒꯣꯜꯁꯦꯟ',
    },
    tatnabaNumit: { bengali: 'নোংমাইজিং, নিংথৌকাবা', meetei: 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ, ꯅꯤꯡꯊꯧꯀꯥꯕ' },
    tasiMahei: { bengali: 'ইচেক', meetei: 'ꯏꯆꯦꯛ' },
    waheibaNumit: { bengali: 'থাংজ', meetei: 'ꯊꯥꯡꯖꯥ' },
    ichaKabaNumit: { bengali: 'লৈবাকপোকপা, য়ুমশকৈশ, শগোলশেন', meetei: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ, ꯌꯨꯝꯁꯀꯩꯁꯥ, ꯁꯒꯣꯜꯁꯦꯟ' },
  },
  {
    monthCode: 10,
    nameEn: 'Waakching',
    nameBengali: 'ৱাকচিং',
    nameMeetei: 'ꯋꯥꯛꯆꯤꯡ',
    blipi: {
      month: 'wakicz',
      tatnaba: 'yumSe~kS, h~rah~',
      thasiMaigei: 'Awaz',
      waitek: 'E~lbakepakpa',
      cheiKaba: 'h~rah~, Tazj, Enazmah~ijz',
    },
    bengali: {
      month: 'ৱাকচিং',
      tatnaba: 'য়ুমশকৈশ, ইরাই',
      thasiMaigei: 'অৱাং',
      waitek: 'লৈবাকপোকপা',
      cheiKaba: 'ইরাই, থাংজ, নোংমাইজিং',
    },
    meetei: {
      month: 'ꯋꯥꯛꯆꯤꯡ',
      tatnaba: 'ꯌꯨꯝꯁꯀꯩꯁꯥ, ꯏꯔꯥꯏ',
      thasiMaigei: 'ꯑꯋꯥꯡ',
      waitek: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ',
      cheiKaba: 'ꯏꯔꯥꯏ, ꯊꯥꯡꯖꯥ, ꯅꯣꯡꯃꯥꯏꯖꯤꯡ',
    },
    tatnabaNumit: { bengali: 'য়ুমশকৈশ, ইরাই', meetei: 'ꯌꯨꯝꯁꯀꯩꯁꯥ, ꯏꯔꯥꯏ' },
    tasiMahei: { bengali: 'অৱাং', meetei: 'ꯑꯋꯥꯡ' },
    waheibaNumit: { bengali: 'লৈবাকপোকপা', meetei: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ' },
    ichaKabaNumit: { bengali: 'ইরাই, থাংজ, নোংমাইজিং', meetei: 'ꯏꯔꯥꯏ, ꯊꯥꯡꯖꯥ, ꯅꯣꯡꯃꯥꯏꯖꯤꯡ' },
  },
  {
    monthCode: 11,
    nameEn: 'Phaairen',
    nameBengali: 'ফাইরেন',
    nameMeetei: 'ꯐꯥꯏꯔꯦꯟ',
    blipi: {
      month: 'fah~ern',
      tatnaba: 'E~lbakepakpa',
      thasiMaigei: 'Enazcup',
      waitek: 'yumSe~kS',
      cheiKaba: 'inzeT;kaba, E~lbakepakpa, yumSe~kS',
    },
    bengali: {
      month: 'ফাইরেন',
      tatnaba: 'লৈবাকপোকপা',
      thasiMaigei: 'নোংচুপ',
      waitek: 'য়ুমশকৈশ',
      cheiKaba: 'নিংথৌকাবা, লৈবাকপোকপা, য়ুমশকৈশ',
    },
    meetei: {
      month: 'ꯐꯥꯏꯔꯦꯟ',
      tatnaba: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ',
      thasiMaigei: 'ꯅꯣꯡꯆꯨꯞ',
      waitek: 'ꯌꯨꯝꯁꯀꯩꯁꯥ',
      cheiKaba: 'ꯅꯤꯡꯊꯧꯀꯥꯕ, ꯂꯩꯄꯥꯛꯄꯣꯛꯄ, ꯌꯨꯝꯁꯀꯩꯁꯥ',
    },
    tatnabaNumit: { bengali: 'লৈবাকপোকপা', meetei: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ' },
    tasiMahei: { bengali: 'নোংচুপ', meetei: 'ꯅꯣꯡꯆꯨꯞ' },
    waheibaNumit: { bengali: 'য়ুমশকৈশ', meetei: 'ꯌꯨꯝꯁꯀꯩꯁꯥ' },
    ichaKabaNumit: { bengali: 'নিংথৌকাবা, লৈবাকপোকপা, য়ুমশকৈশ', meetei: 'ꯅꯤꯡꯊꯧꯀꯥꯕ, ꯂꯩꯄꯥꯛꯄꯣꯛꯄ, ꯌꯨꯝꯁꯀꯩꯁꯥ' },
  },
  {
    monthCode: 12,
    nameEn: 'Lamtaa',
    nameBengali: 'লমতা',
    nameMeetei: 'ꯂꯝꯇꯥ',
    blipi: {
      month: 'lmta',
      tatnaba: 'SegaleSn, Tazj',
      thasiMaigei: 'Ek;b{>',
      waitek: 'h~rah~',
      cheiKaba: 'SeganeSn, h~rah~, Tazj',
    },
    bengali: {
      month: 'লমতা',
      tatnaba: 'শগোলশেন, থাংজ',
      thasiMaigei: 'কৌব্রু',
      waitek: 'ইরাই',
      cheiKaba: 'শগোলশেন, ইরাই, থাংজ',
    },
    meetei: {
      month: 'ꯂꯝꯇꯥ',
      tatnaba: 'ꯁꯒꯣꯜꯁꯦꯟ, ꯊꯥꯡꯖꯥ',
      thasiMaigei: 'ꯀꯧꯕ꯭ꯔꯨ',
      waitek: 'ꯏꯔꯥꯏ',
      cheiKaba: 'ꯁꯒꯣꯜꯁꯦꯟ, ꯏꯔꯥꯏ, ꯊꯥꯡꯖꯥ',
    },
    tatnabaNumit: { bengali: 'শগোলশেন, থাংজ', meetei: 'ꯁꯒꯣꯜꯁꯦꯟ, ꯊꯥꯡꯖꯥ' },
    tasiMahei: { bengali: 'কৌব্রু', meetei: 'ꯀꯧꯕ꯭ꯔꯨ' },
    waheibaNumit: { bengali: 'ইরাই', meetei: 'ꯏꯔꯥꯏ' },
    ichaKabaNumit: { bengali: 'শগোলশেন, ইরাই, থাংজ', meetei: 'ꯁꯒꯣꯜꯁꯦꯟ, ꯏꯔꯥꯏ, ꯊꯥꯡꯖꯥ' },
  },
];

export const EE_KHUDENG_LEITABA_DAYS = [1, 2, 3, 5, 11, 12, 13, 15, 21, 22, 23, 25];
export const EE_KHUDENG_LEIBA_DAYS = [4, 6, 7, 8, 9, 10, 14, 16, 17, 18, 19, 20, 24, 26, 27, 28, 29, 30];

export const KONGBA_LEITABA_DAYS = EE_KHUDENG_LEITABA_DAYS;
export const KONGBA_LEIBA_DAYS = EE_KHUDENG_LEIBA_DAYS;

export const SOLAR_MONTH_NAMES = [
  { index: 0, sign: 'Aries', bengali: 'বৈশাখ', meetei: 'ꯕꯩꯁꯥꯈ', en: 'Vaisakha' },
  { index: 1, sign: 'Taurus', bengali: 'জ্যৈষ্ঠ', meetei: 'ꯖ꯭ꯌꯩꯁ꯭ꯊ', en: 'Jyeshtha' },
  { index: 2, sign: 'Gemini', bengali: 'আষাঢ়', meetei: 'ꯑꯥꯁꯥꯔ', en: 'Ashadha' },
  { index: 3, sign: 'Cancer', bengali: 'শ্রাবণ', meetei: 'ꯁ꯭ꯔꯥꯕꯟ', en: 'Sravana' },
  { index: 4, sign: 'Leo', bengali: 'ভাদ্র', meetei: 'ꯚꯥꯗ꯭ꯔ', en: 'Bhadra' },
  { index: 5, sign: 'Virgo', bengali: 'আশ্বিন', meetei: 'ꯑꯥꯁ꯭ꯕꯤꯟ', en: 'Asvina' },
  { index: 6, sign: 'Libra', bengali: 'কার্ত্তিক', meetei: 'ꯀꯥꯔꯇꯤꯛ', en: 'Kartika' },
  { index: 7, sign: 'Scorpio', bengali: 'অগ্রহায়ণ', meetei: 'ꯑꯒ꯭ꯔꯍꯥꯌꯟ', en: 'Agrahayana' },
  { index: 8, sign: 'Sagittarius', bengali: 'পৌষ', meetei: 'ꯄꯧꯁ', en: 'Pausha' },
  { index: 9, sign: 'Capricorn', bengali: 'মাঘ', meetei: 'ꯃꯥꯘ', en: 'Magha' },
  { index: 10, sign: 'Aquarius', bengali: 'ফাল্গুন', meetei: 'ꯐꯥꯜꯒꯨꯟ', en: 'Phalguna' },
  { index: 11, sign: 'Pisces', bengali: 'চৈত্র', meetei: 'ꯆꯩꯇ꯭ꯔ', en: 'Chaitra' },
];

export const WEEKDAYS_MANIPURI = [
  { day: 0, en: 'Sunday', shortEn: 'Sun', bengali: 'নোংমাইজিং', meetei: 'ꯅꯣꯡꯃꯥꯏꯖꯤꯡ', shortMeetei: 'ꯅꯣꯡ' },
  { day: 1, en: 'Monday', shortEn: 'Mon', bengali: 'নিংথৌকাবা', meetei: 'ꯅꯤꯡꯊꯧꯀꯥꯕ', shortMeetei: 'ꯅꯤꯡ' },
  { day: 2, en: 'Tuesday', shortEn: 'Tue', bengali: 'লৈপাকপোকপা', meetei: 'ꯂꯩꯄꯥꯛꯄꯣꯛꯄ', shortMeetei: 'ꯂꯩ' },
  { day: 3, en: 'Wednesday', shortEn: 'Wed', bengali: 'য়ুমশকৈসা', meetei: 'ꯌꯨꯝꯁꯀꯩꯁꯥ', shortMeetei: 'ꯌꯨꯝ' },
  { day: 4, en: 'Thursday', shortEn: 'Thu', bengali: 'শগোলসেন', meetei: 'ꯁꯒꯣꯜꯁꯦꯟ', shortMeetei: 'ꯁꯒꯣꯜ' },
  { day: 5, en: 'Friday', shortEn: 'Fri', bengali: 'ইরাই', meetei: 'ꯏꯔꯥꯏ', shortMeetei: 'ꯏꯔꯥꯏ' },
  { day: 6, en: 'Saturday', shortEn: 'Sat', bengali: 'থাংজা', meetei: 'ꯊꯥꯡꯖꯥ', shortMeetei: 'ꯊꯥꯡ' },
];

export const CALENDAR_TIMING_NOTE = {
  bengali: 'থাগী মিং হৈরিবসিগী মখাদা তারিবসিগী অসিনা থবানিশিংগী অরোইবা মতমশিংনি, মতমশিং অসি পুং| মিনিট| সেকেণ্ড গী মওংদা পীবনি| পুংগী মশিংদা ২৪ দগী হেনবশিং ২৪ কক্থৎলগা অহিং নোংয়াং মতুংগী পুং ওন্না পাবীয়ু, করিগুম্বা পুং তাইকবা মশিংনা ১২ দগী হেল্লবদি ১২ কক্থৎলগা নুমিৎথাং অমসুং অহিং নোংয়াং মমাংগী পুংশিংনি অমসুং পুং তাইকবা মশিংদুনা ১২ দগী পিক্লবদি অয়ুক্কী মতমনি হায়বসি খঙজিনবীয়ু|',
  meetei: 'ꯊꯥꯒꯤ ꯃꯤꯡ ꯍꯩꯔꯤꯕꯁꯤꯒꯤ ꯃꯈꯥꯗ ꯇꯥꯔꯤꯕꯁꯤꯒꯤ ꯑꯁꯤꯅ ꯊꯕꯥꯅꯤꯁꯤꯡꯒꯤ ꯑꯔꯣꯏꯕ ꯃꯇꯃꯁꯤꯡꯅꯤ, ꯃꯇꯃꯁꯤꯡ ꯑꯁꯤ ꯄꯨꯡ| ꯃꯤꯅꯤꯠ| ꯁꯦꯀꯦꯟꯗ ꯒꯤ ꯃꯑꯣꯡꯗ ꯄꯤꯕꯅꯤ| ꯄꯨꯡꯒꯤ ꯃꯁꯤꯡꯗ ꯲꯴ ꯗꯒꯤ ꯍꯦꯅꯕꯁꯤꯡ ꯲꯴ ꯀꯛꯊꯠꯂꯒ ꯑꯍꯤꯡ ꯅꯣꯡꯌꯥꯡ ꯃꯇꯨꯡꯒꯤ ꯄꯨꯡ ꯑꯣꯟꯅ ꯄꯥꯕꯤꯌꯨ|',
  en: 'The timings displayed below each day indicate the ending moment of that Tithi/Thabanik in Hours | Minutes | Seconds evaluated from local sunrise. Values above 24 indicate ending post-midnight (before next sunrise).'
};
