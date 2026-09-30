import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export interface DailyRashiItem {
  serial: number;
  signId: string;
  name: string;
  bengaliName: string;
  englishName: string;
  symbol: string;
  dates: string;
  rashiLord: string;
  element: string;
  overview: string;
  career: string;
  love: string;
  wealth: string;
  health: string;
  remedy: string;
  luckyColor: string;
  luckyNumber: string;
  luckyTime: string;
  rating: number;
}

export interface DailyRashifalData {
  date: string; // 'YYYY-MM-DD'
  formattedDate: string; // e.g. '26 September 2026, Saturday'
  manipuriDateTitle: string; // e.g. '26 September 2026 gi Rashifal'
  planetarySummary: string;
  items: DailyRashiItem[];
  generatedAt: string;
  source: 'ai' | 'engine';
}

export const BASE_ZODIAC_SIGNS = [
  { serial: 1, signId: 'mesha', name: 'Mesha', bengaliName: 'মেষ', englishName: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', rashiLord: 'Mars (Mangal)', element: 'Mei (Fire)' },
  { serial: 2, signId: 'vrishabha', name: 'Vrishabha', bengaliName: 'বৃষ', englishName: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', rashiLord: 'Venus (Sukra)', element: 'Leipak (Earth)' },
  { serial: 3, signId: 'mithuna', name: 'Mithuna', bengaliName: 'মিথুন', englishName: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', rashiLord: 'Mercury (Budha)', element: 'Nungshit (Air)' },
  { serial: 4, signId: 'karka', name: 'Karka', bengaliName: 'কর্কট', englishName: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', rashiLord: 'Moon (Chandra)', element: 'Eshing (Water)' },
  { serial: 5, signId: 'simha', name: 'Simha', bengaliName: 'সিংহ', englishName: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', rashiLord: 'Sun (Surya)', element: 'Mei (Fire)' },
  { serial: 6, signId: 'kanya', name: 'Kanya', bengaliName: 'কন্যা', englishName: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', rashiLord: 'Mercury (Budha)', element: 'Leipak (Earth)' },
  { serial: 7, signId: 'tula', name: 'Tula', bengaliName: 'তুলা', englishName: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', rashiLord: 'Venus (Sukra)', element: 'Nungshit (Air)' },
  { serial: 8, signId: 'vrishchika', name: 'Vrishchika', bengaliName: 'বৃশ্চিক', englishName: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', rashiLord: 'Mars (Mangal)', element: 'Eshing (Water)' },
  { serial: 9, signId: 'dhanu', name: 'Dhanu', bengaliName: 'ধনু', englishName: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', rashiLord: 'Jupiter (Brihaspati)', element: 'Mei (Fire)' },
  { serial: 10, signId: 'makara', name: 'Makara', bengaliName: 'মকর', englishName: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', rashiLord: 'Saturn (Shani)', element: 'Leipak (Earth)' },
  { serial: 11, signId: 'kumbha', name: 'Kumbha', bengaliName: 'কুম্ভ', englishName: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', rashiLord: 'Saturn (Shani)', element: 'Nungshit (Air)' },
  { serial: 12, signId: 'meena', name: 'Meena', bengaliName: 'মীন', englishName: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', rashiLord: 'Jupiter (Brihaspati)', element: 'Eshing (Water)' },
];

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro'
];

async function getGeminiApiKey(): Promise<string> {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '') {
    return process.env.GEMINI_API_KEY.trim();
  }
  try {
    const siteSettings = await readPersistentDataAsync<any>('site_settings', {});
    if (siteSettings?.geminiApiKey && siteSettings.geminiApiKey.trim() !== '') {
      return siteSettings.geminiApiKey.trim();
    }
  } catch (e) {}
  return '';
}

/**
 * 12 dedicated, natural human-spoken Vedic sign profiles.
 * Pure native spoken Meiteilon phrasing:
 * - "emung manung" (not "emoong")
 * - "Ngasi sel-thum gi sijinnabada fajana chatlu" (not "khongthang sengna")
 * - "ahal-laman" (not "Senior")
 * - "leigani" (not "leidokkani")
 */
const VEDIC_SIGN_PROFILES: Record<string, {
  overviews: string[];
  careers: string[];
  loves: string[];
  wealths: string[];
  healths: string[];
  remedies: string[];
  luckyColors: string[];
  luckyNumbers: string[];
  luckyTimes: string[];
}> = {
  mesha: {
    overviews: [
      `Ngasi numit ashida Mars (Mangal) gi mayai kankhatpaga loinana thabakta thouna amadi thougal hennat leigani. Anouba thabak houdokpada afaba maipakpa leigani.`,
      `Ngasi thabak-thouram khudingda thouna leigani amadi hotnaba khudingmak maipakkani. Emung manung amadi marup-mapangda mateng pangbada yaipha-mangol phanggani.`
    ],
    careers: [
      `Office nattraga business da anouba thabak houdokpagi afaba matamni. Ahal-laman singdagi mateng phanggani amadi thabakta maipakna chatkani.`,
      `Business da anouba tanja lakkani. Ahal-laman singgi pambei lousillaga thabak paikhatpada thawaiba leiroi.`
    ],
    loves: [
      `Spouse amadi nungshiba meeoiga wari fajana sanabada emung manungda nungshiba amadi harao-tayam leigani.`,
      `Nungshiba marupka manung-thaba wari fajana sanabiyu, amana amagi wakhal khangnaduna leiminnabada emung manungda nungshi-marup henna chetshillakkani.`
    ],
    wealths: [
      `Hanna hotnaramlaba thabakki sel-thum phanglakpagi lambi leigani. Ngasi sel-thum gi sijinnabada fajana chatlu.`,
      `Ngasi sel-thum gi sijinnabada fajana chatlu, aranba lamda sel thadok-kanu.`
    ],
    healths: [
      `Hakselgi oina hakchangda panggal ningthina leigani. Eshing kanna thakpiyu amadi thabakki chotpa khara pothabiyu.`,
      `Ayukta walk chattuna fitness thambada thamoigi pukning shanti leigani.`
    ],
    remedies: [
      `Ngasi Hanumanta lainingba amadi 'Om Hanumate Namah' 11-rak haibiyu.`,
      `Angangba leirang kattuna thouni toubada yaipha-mangol phanggani.`
    ],
    luckyColors: ['Angangba (Red)', 'Gulap-machu (Pink)', 'Khabok (Orange)'],
    luckyNumbers: ['1, 9', '9, 3'],
    luckyTimes: ['8:30 AM - 10:00 AM', '1:30 PM - 3:00 PM']
  },
  vrishabha: {
    overviews: [
      `Ngasi Sukra (Venus) gi mangolna maram oiraga emung manung amadi lalon-itikta chanaba leigani. Pukning shantina thamlaga hotnabada afaba mangol phanggani.`,
      `Ngasi sel-thum gi sijinnabada fajana chatlu. Emung manungda ningthina chanana leiminbada afaba pambei leigani.`
    ],
    careers: [
      `Design, commercial amadi trading thabakta afaba maipakpa leigani. Ahal-laman singgi afaba pambei lousinba ngamgani.`,
      `Thabakta pukning changna hotnabiyu. Partner singga chanana wari sanabaga loinana meeting sing afaba maikeida chatkani.`
    ],
    loves: [
      `Nungshiba meeoiga unanaba tanja leigani. Emung manung gi meeyamna nungshina chana-leiminbada haraoba phanggani.`,
      `Spouse-ka wari fajana sanabiyu, amana amagi wakhal khangnaduna leiminnabada emung manungda nungshiba hennat leigani.`
    ],
    wealths: [
      `Sen-thum hengatlakpagi afaba tanja leigani. Ariba pending loan nattraga sel phangdaba khara amuk thunglakpagi awangba tanja leiri.`,
      `Gold nattraga anouba pot-chei leibada budget fajana thammu. Ngasi sel-thum gi sijinnabada fajana chatlu.`
    ],
    healths: [
      `Chaba-thakpada fresh oiba chinjak chabiyu, thabakki chotpa khara pothabada hakchangda hennat panggal leigani.`,
      `Thamoigi pukning shanti thambiyu, hakchang gi energy ningthina thamgadabani.`
    ],
    remedies: [
      `Maha Lakshmi lainingba amadi angouba leirang kattuna thouni toubiyu.`,
      `Ayukta dhyan toubaga loinana yaipha-mangol phangnaba thouni toubiyu.`
    ],
    luckyColors: ['Angouba (White)', 'Ashangba (Green)', 'Chandan-machu (Cream)'],
    luckyNumbers: ['2, 7', '6, 2'],
    luckyTimes: ['10:15 AM - 11:45 AM', '4:00 PM - 5:30 PM']
  },
  mithuna: {
    overviews: [
      `Ngasi Budha (Mercury) gi mayaina meeyamga wari-watay sanabada mayai kankhatkani. Anouba pambei amadi meeyamda khutshamnaba ngambagi afaba thoudok leigani.`,
      `Ngasi meeyamga unanaba amadi communication toubada afaba maikei tamba phanggani. Pukning changna hotnaba khudingmak maipakkani.`
    ],
    careers: [
      `Contract, media, accounts amadi digital thabakta afaba maipakpa leigani. Ahal-laman singdagi thagatchaba phanggani.`,
      `Interview nattraga anouba thabak houdokpagi afaba tanjani. Ahal-laman singgi support leigani.`
    ],
    loves: [
      `Nungshi-wari amadi nungc-marup ki thajaba hengatlakkani. Wari-watayda nungsina leiminnou.`,
      `Single oiribasing gi oina anouba afaba marup unanaba tanja leigani.`
    ],
    wealths: [
      `Thabak-thouram dagi sel-thum gi afaba mangol leigani. Ngasi sel-thum gi sijinnabada fajana chatlu.`,
      `Online business nattraga trading da afaba returns phangbagi tanja leiri.`
    ],
    healths: [
      `Pukning channa morning walk chattuna fitness thambiyu. Mobile amadi screen matam khara khamhallu.`,
      `Pranayama toubiyu, breathing exercise na hennat thouna pigani.`
    ],
    remedies: [
      `Budha Gayatri Mantra 3-rak haibiyu amadi tulsi pambi da eshing katchabiyu.`,
      `Ashangba machugi leirang katchabada afaba mangol phanggani.`
    ],
    luckyColors: ['Ashangba (Green)', 'Hidak-machu (Yellow)'],
    luckyNumbers: ['5, 3', '3, 5'],
    luckyTimes: ['9:00 AM - 10:30 AM', '3:30 PM - 5:00 PM']
  },
  karka: {
    overviews: [
      `Ngasi Chandra (Moon) gi mangolna maram oiraga pukning dhyan amadi emung manung gi wari-watayda afaba mangol leigani. Mama-mapagi thouni phangbada maipakpa leigani.`,
      `Ngasi gi numit ashida pukning shanti thambada awaba khudingmak loisinba ngamgani. Thabak khudingda thouna leigani.`
    ],
    careers: [
      `Creative, education, amadi service thabakta ningthina maipakna chatkani. Ahal-laman singna pamba thabakta mateng panggani.`,
      `Thabak-thouramda colleague singga chanana chathokpaga loinana pendouba thabak loisinba ngamgani.`
    ],
    loves: [
      `Emung manungda nungshi-khoidouba hengatlakkani. Nungshiba meeoiga shamujik khara thungnaba thoktuna leiba ngamgani.`,
      `Spouse-ka wari fajana sanabiyu, thamoigi pukning shantina thambada emung manungda haraoba leigani.`
    ],
    wealths: [
      `Ngasi sel-thum gi sijinnabada fajana chatlu. Emung gi oina ahanba sel thadokpada nungsingbada afabani.`,
      `Fixed savings amadi banking investments da afaba returns lakkani. Ngasi sel-thum gi sijinnabada fajana chatlu.`
    ],
    healths: [
      `Eshing kanna thakpiyu amadi fresh oiba chinjak chabiyu. Pukning gi stress laksinbada meditation afabani.`,
      `Chaba-thakpada ningthina chengsillu, pothaba ningthina lousillu.`
    ],
    remedies: [
      `Shiva Lingada eshing nattraga sangom katchabiyu amadi 'Om Namah Shivaya' 11-rak haibiyu.`,
      `Angouba machugi leirang kattuna thouni toubiyu.`
    ],
    luckyColors: ['Angouba (White)', 'Rupa-machu (Silver)', 'Chandan-machu'],
    luckyNumbers: ['2, 4', '4, 8'],
    luckyTimes: ['8:00 AM - 9:30 AM', '6:00 PM - 7:30 PM']
  },
  simha: {
    overviews: [
      `Ngasi Surya (Sun) gi athoiba mayaina ningthina thouna amadi thougal pigani. Leadership amadi samman kankhatkadaba afaba numitni.`,
      `Ngasi thabak houdokpada ahal-laman singgi pambei lousillaga chathou. Maipakpagi pambei anouba leigani.`
    ],
    careers: [
      `Government, administration, amadi management project singda afaba results phanggani. Ahal-laman singdagi thagatchaba phanggani.`,
      `Meeting pitch toubada thouna kankhatkani. Ahal-laman singga chanana wari sanabada afaba tanja leigani.`
    ],
    loves: [
      `Thamoigi thouna leibana nungsiba wari sanabada proud oihallani. Emung manungda respect leigani.`,
      `Spouse-ka unanaba afaba program khannabiyu, nungc-wari da thamoigi shanti leigani.`
    ],
    wealths: [
      `Sel-thum phangbagi tanja leigani. Hanna hotnaramlaba thabakki returns lakkani.`,
      `Ngasi sel-thum gi sijinnabada fajana chatlu, budget maintenance sengna thammu.`
    ],
    healths: [
      `Hakchang da energy ningthina leigani. Morning walk amadi exercise toubada body fitness maintain toubada afabani.`,
      `Suryanamaskar toubiyu, health da ningthina attention thambiyu.`
    ],
    remedies: [
      `Ayukta Surya Bhagavan da arghya (eshing) katchabiyu amadi Gayatri Mantra 3-rak haibiyu.`,
      `Angangba leirang kattuna lainingba afabani.`
    ],
    luckyColors: ['Hidak-machu (Gold)', 'Angangba (Red)', 'Khabok (Orange)'],
    luckyNumbers: ['1, 9', '5, 1'],
    luckyTimes: ['7:30 AM - 9:00 AM', '11:30 AM - 1:00 PM']
  },
  kanya: {
    overviews: [
      `Ngasi Budha (Mercury) gi mayaina calculation amadi detail planning da afaba mangol leigani. Thabak khudingmak sengna loisinba ngamgani.`,
      `Ngasi thabakta thougal kanna leigani. Pukning changna hotnabada thengnarakpa awaba khudingmak loisinba ngamgani.`
    ],
    careers: [
      `Accounts, research, audit amadi technical thabakta afaba progress leigani. Ahal-laman singna pamba pambei thunggani.`,
      `Pending files amadi responsibilities loisinbada maipakna chatkani. Ahal-laman singgi thajaba phanggani.`
    ],
    loves: [
      `Wari fajana sanabada misunderstanding khudingmak loisinba ngamgani. Emung manungda chanaba leigani.`,
      `Nungshiba marupka manung-thaba wari fajana sanabada thamoigi shanti leigani.`
    ],
    wealths: [
      `Sel khara save touba ngamgani. Ngasi sel-thum gi sijinnabada fajana chatlu.`,
      `Investment planning toubada accounts expert singgi pambei lousillu. Ngasi sel-thum gi sijinnabada fajana chatlu.`
    ],
    healths: [
      `Fresh fruits chabiyu, overthinking khara pothahallu. Pukning shantina thambada energy kankhatkani.`,
      `Morning walk chattuna fitness thambada vitality hennat leigani.`
    ],
    remedies: [
      `Ganesha lainingba amadi 'Om Gan Ganapataye Namah' 11-rak haibiyu.`,
      `Ashangba machugi leirang katchabada afaba maikei tamba phanggani.`
    ],
    luckyColors: ['Ashangba (Green)', 'Chandan-machu (Cream)'],
    luckyNumbers: ['5, 6', '6, 2'],
    luckyTimes: ['10:00 AM - 11:30 AM', '3:00 PM - 4:30 PM']
  },
  tula: {
    overviews: [
      `Ngasi Sukra (Venus) gi balance amadi aesthetic mangolna public relations, partnership, amadi meetings da maipakpa pigani.`,
      `Ngasi gi numit ashida chanaba amadi nungshiba leigani. Emung manungda harao-tayam gi tanja leigani.`
    ],
    careers: [
      `Partnership dealings, negotiations, amadi clients ga unanabada afaba result phanggani. Ahal-laman singgi mateng leigani.`,
      `Business deals sign toubada terms and conditions ningthina khannaraga chathou.`
    ],
    loves: [
      `Spouse-ka chanaba ningthina leigani. Emung manungda nungshina leiminbada haraoba phanggani.`,
      `Single oiribasing gi oina prospective proposal lakpagi tanja leigani.`
    ],
    wealths: [
      `Joint assets nattraga shared income dagi sel lakpagi tanja leigani. Ngasi sel-thum gi sijinnabada fajana chatlu.`,
      `Lifestyle goods khara leibada budget nungsingbiyu. Ngasi sel-thum gi sijinnabada fajana chatlu.`
    ],
    healths: [
      `Eshing kanna thakpiyu amadi posture maintain toubiyu.`,
      `Deep breathing exercise toubada mental balance ningthina leigani.`
    ],
    remedies: [
      `Maha Lakshmi lainingba amadi angouba leirang kattuna thouni toubiyu.`,
      `Fragrant incense (dhup) thamlaga lainingbada afaba oigani.`
    ],
    luckyColors: ['Gulap-machu (Pink)', 'Angouba (White)', 'Light Blue'],
    luckyNumbers: ['6, 2', '7, 3'],
    luckyTimes: ['11:00 AM - 12:30 PM', '5:00 PM - 6:30 PM']
  },
  vrishchika: {
    overviews: [
      `Ngasi Mars amadi Ketu gi deep intuition na research amadi confidential matters da breakthrough pigani. Thouna kankhatkani.`,
      `Ngasi gi numit ashida thengnarakpa obstacle khudingmak thouna leina loisinba ngamgani.`
    ],
    careers: [
      `Technical research, surgery, amadi complex tasks da afaba breakthrough leigani. Ahal-laman singna thouna pigani.`,
      `Confidential matters fajana maintain toubiyu, meeting singda direct strategy thammu.`
    ],
    loves: [
      `Deep emotional bonding leigani. Nungshiba meeoigi thamoigi wari kupna tabada nungc-marup chetkhatkani. Emung manungda nungshiba leigani.`,
      `Secrets share toubada trust hengatlakkani, thamoigi shantina thambiyu.`
    ],
    wealths: [
      `Unexpected sources nattraga past investments dagi financial support lakpagi tanja leigani.`,
      `Ngasi sel-thum gi sijinnabada fajana chatlu, insurance amadi savings ta emphasis pi-yu.`
    ],
    healths: [
      `High stamina maintain toubiyu. Oily chaba khara nungsingbada afaba oigani.`,
      `Cardio exercise amadi pranayama na vitality hengathallani.`
    ],
    remedies: [
      `Hanuman Chalisa path toubiyu amadi angangba chandan katchabiyu.`,
      `Om Kram Kreem Kroum Sah Bhaumaya Namah 7-rak haibiyu.`
    ],
    luckyColors: ['Angangba (Deep Red)', 'Khabok (Maroon)'],
    luckyNumbers: ['9, 8', '8, 6'],
    luckyTimes: ['8:30 AM - 10:00 AM', '1:00 PM - 2:30 PM']
  },
  dhanu: {
    overviews: [
      `Ngasi Guru (Jupiter) gi athoiba thounina wisdom, higher education, amadi dharma thouramda mayai kankhatkani.`,
      `Ngasi gi numit ashida ahal-laman singgi thouni phanggani amadi laining-laison gi pukning changba leigani.`
    ],
    careers: [
      `Teaching, advisory, law, amadi consultancy da exceptional maipakpa leigani. Ahal-laman singgi pambei phanggani.`,
      `Expansion proposals sign toubada afaba prospects leigani. Guidance sengna lousillu.`
    ],
    loves: [
      `Spiritual understanding leiminnabana emung manungda shanti pigani. Marup-mapangda haraoba leigani.`,
      `Spouse-ka religious program nattraga trip chatnaba planning toubada afabani.`
    ],
    wealths: [
      `Long term capital growth amadi ahal-laman gi blessing na sel-thum kankhatkani. Ngasi sel-thum gi sijinnabada fajana chatlu.`,
      `Religious spending da haraoba phanggani, budget maintain toubiyu. Ngasi sel-thum gi sijinnabada fajana chatlu.`
    ],
    healths: [
      `Sweet items khara balance toubada hakchang sonba khanghangani. Fresh food chabiyu.`,
      `Morning walk amadi yoga stretching na joint mobility hennat thouna pigani.`
    ],
    remedies: [
      `Brihaspati Mantra 'Om Brim Brihaspataye Namah' 19-rak haibiyu.`,
      `Hidak-machu (yellow) leirang katchabiyu amadi guruji da kuruk toubiyu.`
    ],
    luckyColors: ['Hidak-machu (Yellow)', 'Sona-machu (Golden)'],
    luckyNumbers: ['3, 9', '9, 3'],
    luckyTimes: ['9:30 AM - 11:00 AM', '2:00 PM - 3:30 PM']
  },
  makara: {
    overviews: [
      `Ngasi Shani (Saturn) gi discipline na thabak sengna loisinbada maipakpa pigani. Practical approach na afaba result leigani.`,
      `Ngasi gi numit ashida ahal-laman singgi mateng phanggani amadi thabakta thougal kanna leigani.`
    ],
    careers: [
      `Industrial, construction, amadi executive management da afaba maipakpa leigani. Ahal-laman singna thagatchagani.`,
      `Patience thamlaga pending responsibility loisinba ngamgani. Recognition lakkani.`
    ],
    loves: [
      `Loyalty amadi duty-bound commitment na emung manungda thajaba chetshillani. Realistic discussions toubiyu.`,
      `Spouse gi mateng lousinlaga household decisions paikhatpada chanaba leigani.`
    ],
    wealths: [
      `Conservative financial approach na wealth preservation toubada afabani. Ngasi sel-thum gi sijinnabada fajana chatlu.`,
      `Long-standing debt payment loisinbada relief phanggani. Ngasi sel-thum gi sijinnabada fajana chatlu.`
    ],
    healths: [
      `Knees amadi joints maintain toubada calcium rich food chabiyu. Cold weather dagi ngakthokchabiyu.`,
      `Light warm-up exercises amadi sun exposure lousillu.`
    ],
    remedies: [
      `Shani Mantra 'Om Sham Shanaishcharaya Namah' 11-rak haibiyu.`,
      `Mustard oil lamp thamlaga Hanuman nattraga Shani Devta thouni toubiyu.`
    ],
    luckyColors: ['Asangba (Navy Blue)', 'Asengba Leipak-machu (Brown)'],
    luckyNumbers: ['8, 10', '10, 8'],
    luckyTimes: ['10:30 AM - 12:00 PM', '4:30 PM - 6:00 PM']
  },
  kumbha: {
    overviews: [
      `Ngasi Shani amadi Rahu gi progressive energy na visionary ideas, digital innovation, amadi team collaborations da afaba mangol pigani.`,
      `Ngasi anouba pambei amadi technology gi mateng lousinlaga hotnabada afaba maikei tamba phanggani.`
    ],
    careers: [
      `Software, scientific projects, NGO community, amadi networking da milestone achievement leigani. Ahal-laman singgi support leigani.`,
      `Team presentations lead toubada applause phanggani. Creative suggestions lousillu.`
    ],
    loves: [
      `Friendship-based romance henna chetshillakkani. Emung manung amadi marup-mapangda wari-watay sanabada haraoba phanggani.`,
      `Friends amadi community activities da spouse ga loinana participation leigani.`
    ],
    wealths: [
      `Multiple sources of income nattraga digital platforms dagi sel lakpagi afaba tanja leigani. Ngasi sel-thum gi sijinnabada fajana chatlu.`,
      `Ngasi sel-thum gi sijinnabada fajana chatlu, long-term investments ta focus toubiyu.`
    ],
    healths: [
      `Adequate sleep amadi digital detoxification evening da toubada afabani. Fresh water thakpiyu.`,
      `Pranayama amadi meditation na mental calmness pigani.`
    ],
    remedies: [
      `Mee-chamba nattraga needful singda mateng pangbiyu.`,
      `Shiva temple da water offering toubada transit favorable oigani.`
    ],
    luckyColors: ['Electric Blue', 'Asangba (Cyan)', 'Purple'],
    luckyNumbers: ['11, 4', '4, 8'],
    luckyTimes: ['11:30 AM - 1:00 PM', '5:30 PM - 7:00 PM']
  },
  meena: {
    overviews: [
      `Ngasi Guru (Jupiter) amadi Ketu gi spiritual aura na divine devotion, artistic imagination, amadi inner peace da afaba mangol pigani.`,
      `Ngasi gi numit ashida laining-laison amadi thamoigi pukning shanti thambada thengnarakpa awaba khudingmak loisinba ngamgani.`
    ],
    careers: [
      `Healthcare, counseling, design, amadi creative writing da outstanding performance leigani. Ahal-laman singdagi blessings phanggani.`,
      `Intuition matung inna thabak paikhatpada unexpected success phanggani.`
    ],
    loves: [
      `Compassionate, selfless love amadi spiritual bonding leigani. Emung manung amadi spouse ka emotional support chetshillani.`,
      `Forgiveness amadi understanding na past tension khudingmak loisinba ngamgani. Emung manungda nungshina leiminnou.`
    ],
    wealths: [
      `Charity da expenditure leiragasu unexpected spiritual/material gains phanggani.`,
      `Ngasi sel-thum gi sijinnabada fajana chatlu, creative royalties dagi financial support lakpagi tanja leiri.`
    ],
    healths: [
      `Restful sleep maintain toubiyu. Meditation amadi calm music na relief pigani.`,
      `Adequate warm water thakpiyu amadi peaceful walks chattuna refresh toubiyu.`
    ],
    remedies: [
      `Vishnu Sahasranama path nattraga 'Om Namo Bhagavate Vasudevaya' 12-rak haibiyu.`,
      `Hidak-machu (yellow) leirang katchabiyu amadi tulsi leaves puja da kattuna thouni toubiyu.`
    ],
    luckyColors: ['Hidak-machu (Yellow)', 'Ashangba (Sea Green)', 'Sona-machu'],
    luckyNumbers: ['3, 12', '12, 3'],
    luckyTimes: ['7:00 AM - 8:30 AM', '3:30 PM - 5:00 PM']
  }
};

/**
 * Deterministic Vedic template fallback generator for Romanized Manipuri daily predictions
 * Guarantees 100% distinct, high-quality predictions for all 12 signs without repetitive copy.
 */
function generateVedicFallback(dateStr: string): DailyRashifalData {
  const targetDate = new Date(dateStr + 'T12:00:00Z');
  const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = targetDate.toLocaleDateString('en-US', options) + `, ${dayOfWeek}`;

  const dayNumber = targetDate.getDate();
  const monthNumber = targetDate.getMonth() + 1;

  const items: DailyRashiItem[] = BASE_ZODIAC_SIGNS.map((sign) => {
    const profile = VEDIC_SIGN_PROFILES[sign.signId] || VEDIC_SIGN_PROFILES['mesha'];
    const seed = (dayNumber * 7 + monthNumber * 13 + sign.serial * 19) % 100;
    const rating = 4 + (seed % 2); // 4 to 5 stars

    const overview = profile.overviews[seed % profile.overviews.length];
    const career = profile.careers[seed % profile.careers.length];
    const love = profile.loves[seed % profile.loves.length];
    const wealth = profile.wealths[seed % profile.wealths.length];
    const health = profile.healths[seed % profile.healths.length];
    const remedy = profile.remedies[seed % profile.remedies.length];
    const luckyColor = profile.luckyColors[seed % profile.luckyColors.length];
    const luckyNumber = profile.luckyNumbers[seed % profile.luckyNumbers.length];
    const luckyTime = profile.luckyTimes[seed % profile.luckyTimes.length];

    return {
      serial: sign.serial,
      signId: sign.signId,
      name: sign.name,
      bengaliName: sign.bengaliName,
      englishName: sign.englishName,
      symbol: sign.symbol,
      dates: sign.dates,
      rashiLord: sign.rashiLord,
      element: sign.element,
      overview,
      career,
      love,
      wealth,
      health,
      remedy,
      luckyColor,
      luckyNumber,
      luckyTime,
      rating
    };
  });

  return {
    date: dateStr,
    formattedDate,
    manipuriDateTitle: `${formattedDate} gi Rashifal`,
    planetarySummary: `Ngasi gi Sidereal Moon transit amadi planetary aspect singgi matung inna Rashi 1 dagi 12 faobagi thabak-mari, sen-thum, nungsiba, amadi hakselgi afaba mangol khangdokchaba yarani.`,
    items,
    generatedAt: new Date().toISOString(),
    source: 'engine'
  };
}

/**
 * Call Gemini to produce high-authenticity Romanized Manipuri predictions
 */
async function generateRashifalWithAI(dateStr: string, apiKey: string): Promise<DailyRashifalData | null> {
  const targetDate = new Date(dateStr + 'T12:00:00Z');
  const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDate = targetDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) + `, ${dayOfWeek}`;

  const prompt = `
You are an expert traditional Manipuri Astrologer (Pandit / Astrologer) writing the official Daily Rashifal for KuthiYengpham (kuthiyengpham.in).
Date: ${formattedDate}.
Write the Daily Rashifal for all 12 Rashis strictly in SERIAL ORDER 1 to 12.

NATIVE MEITEILON (MANIPURI) LINGUISTIC & VOCABULARY STANDARDS:
1. SCRIPT & TRANSLITERATION: Write in high-quality, natural ROMANIZED MANIPURI (Meiteilon written in English alphabet) as spoken and read in Manipur.
2. CRITICAL WORD USAGE:
   - Always use "leigani" (NEVER use "leidokkani").
   - Always use "ahal-laman" for seniors, elders, superiors, or mentors (NEVER use the English word "Senior").
   - Always write "emung manung" or "emung" (NEVER write "emoong" with double 'o').
   - For financial advice write "Ngasi sel-thum gi sijinnabada fajana chatlu" or "sel-thum sijinnabada khangna-chaina chatlu" (NEVER write awkward phrases like "khongthang sengna").
   - Use "thabak-thouram" or "thouna-thougal" for work/enterprise (minimize English "office/project").
   - Use "wari-watay" or "pao-tanaba" for meetings/discussions.
   - Use "sen-thum" or "sel-thum" for money/finances.
   - Use "haksel" or "hakchang gi panggal" for health and energy.
   - Use "yaipha-mangol" or "afaba mangol" for auspicious blessings/benefits.
3. GRAMMATICAL SUFFIXES:
   - Future/predictive verbs: use proper Manipuri euphonic endings "-gani" / "-kani" (e.g. "leigani", "phanggani", "chatkani", "thokkani", "maipakkani", "kankhatkani", "hengatlakkani").
   - Advisory recommendations: use polite imperative "-biyu" / "-piyu" (e.g. "khannabiyu", "toubiyu", "thakpiyu", "lousillu").
4. CONTENT QUALITY:
   - Make it sound natural, warm, and genuine, like a wise human elder in Manipur speaking directly to the reader.
   - Every single sign must have 100% DISTINCT, UNIQUE predictions matching its Vedic Moon sign, ruling planet (e.g. Mars for Mesha, Venus for Vrishabha, Mercury for Mithuna, Moon for Karka, Sun for Simha, etc.).

Output strictly valid JSON with no markdown formatting:
{
  "date": "${dateStr}",
  "formattedDate": "${formattedDate}",
  "manipuriDateTitle": "${formattedDate} gi Rashifal",
  "planetarySummary": "Short 2 sentence overview of today's transit in fluent Romanized Manipuri",
  "items": [
    {
      "serial": 1,
      "signId": "mesha",
      "name": "Mesha",
      "englishName": "Aries",
      "symbol": "♈",
      "overview": "Fluent Romanized Manipuri overview (2-3 sentences, using 'leigani', 'ahal-laman', 'emung manung')",
      "career": "Manipuri career advice (using 'ahal-laman', 'thabak-thouram')",
      "love": "Manipuri love & family advice (using 'emung manung', 'chanaba')",
      "wealth": "Manipuri finance advice (using 'sel-thum gi sijinnabada fajana chatlu')",
      "health": "Manipuri health advice (using 'haksel', 'hakchang')",
      "remedy": "Manipuri daily remedy (e.g. Hanumanta lainingba, Om Namah Shivaya haiba)",
      "luckyColor": "Color name in Manipuri & English, e.g. Angangba (Red)",
      "luckyNumber": "1, 9",
      "luckyTime": "Morning/afternoon window, e.g. 8:30 AM - 10:00 AM",
      "rating": 5
    }
    ...all 12 signs in serial order: 1. Mesha, 2. Vrishabha, 3. Mithuna, 4. Karka, 5. Simha, 6. Kanya, 7. Tula, 8. Vrishchika, 9. Dhanu, 10. Makara, 11. Kumbha, 12. Meena
  ]
}
`;

  for (const model of CANDIDATE_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 6000,
            responseMimeType: 'application/json'
          }
        })
      });

      if (!res.ok) continue;

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) continue;

      const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
      if (parsed && Array.isArray(parsed.items) && parsed.items.length === 12) {
        const enrichedItems: DailyRashiItem[] = parsed.items.map((it: any, i: number) => {
          const base = BASE_ZODIAC_SIGNS[i] || BASE_ZODIAC_SIGNS[0];
          const cleanText = (txt: string) => {
            return (txt || '')
              .replace(/leidokkani\b/gi, 'leigani')
              .replace(/\bSenior\b/gi, 'Ahal-laman')
              .replace(/\bsenior\b/gi, 'ahal-laman')
              .replace(/emoong[- ]manung/gi, 'emung manung')
              .replace(/emoong/gi, 'emung')
              .replace(/Emoong[- ]manung/gi, 'Emung manung')
              .replace(/Emoong/gi, 'Emung')
              .replace(/khongthang sengna thamlaga chatlu/gi, 'sel-thum gi sijinnabada fajana chatlu')
              .replace(/khongthang sengna thamlaga/gi, 'sel-thum gi sijinnabada fajana')
              .replace(/khongthang sengna/gi, 'sel-thum gi sijinnabada fajana')
              .replace(/leimai thallani/gi, 'loisinba ngamgani');
          };

          return {
            serial: base.serial,
            signId: base.signId,
            name: base.name,
            bengaliName: base.bengaliName,
            englishName: base.englishName,
            symbol: base.symbol,
            dates: base.dates,
            rashiLord: base.rashiLord,
            element: base.element,
            overview: cleanText(it.overview) || 'Ngasi numit ashida thouna amadi thougal kankhatkani.',
            career: cleanText(it.career) || 'Thabak-thouramda ahal-laman singgi pambei lousillaga chatlu.',
            love: cleanText(it.love) || 'Emung manungda chanaba amadi nungshiba leigani.',
            wealth: cleanText(it.wealth) || 'Ngasi sel-thum gi sijinnabada fajana chatlu.',
            health: cleanText(it.health) || 'Hakselgi oina chaba-thakpada ningthina chengsillu.',
            remedy: cleanText(it.remedy) || 'Lainingba amadi yaipha-mangol phangnaba thouni toubiyu.',
            luckyColor: it.luckyColor || 'Angangba (Red)',
            luckyNumber: it.luckyNumber || '1, 9',
            luckyTime: it.luckyTime || '9:00 AM - 11:00 AM',
            rating: typeof it.rating === 'number' ? it.rating : 4
          };
        });

        return {
          date: dateStr,
          formattedDate: parsed.formattedDate || formattedDate,
          manipuriDateTitle: parsed.manipuriDateTitle || `${formattedDate} gi Rashifal`,
          planetarySummary: parsed.planetarySummary || `Ngasi gi Sidereal Moon transit matung inna Rashi 1 dagi 12 faobagi afaba mangol khangdokchaba yarani.`,
          items: enrichedItems,
          generatedAt: new Date().toISOString(),
          source: 'ai'
        };
      }
    } catch (e) {
      console.warn(`[dailyRashifal] Gemini model ${model} failed, trying next...`, e);
    }
  }

  return null;
}

/**
 * Get or generate the Daily Rashifal for a given date (defaults to today in IST).
 */
export async function getOrGenerateDailyRashifal(targetDateStr?: string, forceRefresh = false): Promise<DailyRashifalData> {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
  const dateStr = targetDateStr || istDate.toISOString().slice(0, 10);

  const cacheKey = `daily_rashifal_${dateStr}`;

  if (!forceRefresh) {
    const cached = await readPersistentDataAsync<DailyRashifalData | null>(cacheKey, null);
    if (cached && Array.isArray(cached.items) && cached.items.length === 12) {
      // Check if cached version contains old spellings like "emoong", "khongthang sengna", or "Senior" - if so, auto-refresh!
      const hasOldWords = cached.items.some(
        it => /leidokkani/i.test(it.overview + it.career + it.love + it.wealth + it.health) ||
              /\bsenior\b/i.test(it.overview + it.career + it.love + it.wealth + it.health) ||
              /emoong/i.test(it.overview + it.career + it.love + it.wealth + it.health) ||
              /khongthang sengna/i.test(it.overview + it.career + it.love + it.wealth + it.health) ||
              /leimai thallani/i.test(it.overview + it.career + it.love + it.wealth + it.health)
      );
      if (!hasOldWords) {
        return cached;
      }
    }
  }

  const apiKey = await getGeminiApiKey();
  let generatedData: DailyRashifalData | null = null;

  if (apiKey) {
    try {
      generatedData = await generateRashifalWithAI(dateStr, apiKey);
    } catch (err) {
      console.error('[dailyRashifal] AI generation failed:', err);
    }
  }

  if (!generatedData) {
    generatedData = generateVedicFallback(dateStr);
  }

  await writePersistentDataAsync(cacheKey, generatedData);

  return generatedData;
}
