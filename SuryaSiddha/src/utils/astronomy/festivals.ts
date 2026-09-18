// Hindu Festivals & Vrat Detection Engine
import { PanchangData } from '../../types/astronomy';

export interface HinduFestivalInfo {
  name: string;
  sanskritName: string;
  type: 'Major Festival' | 'Vrat' | 'Jayanti' | 'Sankranti';
  description?: string;
}

export function detectHinduFestival(
  panchang: PanchangData,
  dateStr: string
): HinduFestivalInfo | null {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const tithiIdx = panchang.tithi.index; // 1-30
  const paksha = panchang.tithi.paksha;

  // 1. Ekadashi (Tithi 11 & 26)
  if (tithiIdx === 11 || tithiIdx === 26) {
    return {
      name: `${paksha} Ekadashi Vrat`,
      sanskritName: 'एकादशी व्रत',
      type: 'Vrat',
      description: 'Dedicated to Lord Vishnu, observing sacred fasting.',
    };
  }

  // 2. Pradosh Vrat (Tithi 13 & 28)
  if (tithiIdx === 13 || tithiIdx === 28) {
    return {
      name: 'Pradosha Vrat',
      sanskritName: 'प्रदोष व्रत',
      type: 'Vrat',
      description: 'Twilight worship dedicated to Lord Shiva.',
    };
  }

  // 3. Purnima & Amavasya
  if (tithiIdx === 15) {
    if (month === 8) {
      return {
        name: 'Raksha Bandhan / Shravana Purnima',
        sanskritName: 'रक्षा बन्धन',
        type: 'Major Festival',
      };
    }
    if (month === 10 || month === 11) {
      return {
        name: 'Kartik Purnima / Dev Deepawali',
        sanskritName: 'कार्तिक पूर्णिमा',
        type: 'Major Festival',
      };
    }
    return {
      name: 'Satyanarayan Purnima',
      sanskritName: 'पूर्णिमा व्रत',
      type: 'Vrat',
      description: 'Full Moon day auspicious for Sri Satyanarayan puja.',
    };
  }

  if (tithiIdx === 30) {
    if (month === 9 || month === 10) {
      return {
        name: 'Mahalaya / Sarva Pitru Amavasya',
        sanskritName: 'सर्वपितृ अमावस्या',
        type: 'Major Festival',
        description: 'Culmination of Pitru Paksha ancestor tarpana.',
      };
    }
    return {
      name: 'Amavasya',
      sanskritName: 'दर्श अमावस्या',
      type: 'Vrat',
      description: 'New Moon day for ancestor prayers and charity.',
    };
  }

  // 4. Chaturthi (Ganesh / Vinayaka Chaturthi & Sankashti)
  if (tithiIdx === 4) {
    if (month === 8 || month === 9) {
      return {
        name: 'Vinayaka / Ganesha Chaturthi',
        sanskritName: 'विनायक चतुर्थी',
        type: 'Major Festival',
        description: 'Celebration of the birth of Lord Ganesha.',
      };
    }
    return {
      name: 'Vinayaka Chaturthi',
      sanskritName: 'विनायक चतुर्थी',
      type: 'Vrat',
    };
  }

  if (tithiIdx === 19) {
    return {
      name: 'Sankashti Chaturthi',
      sanskritName: 'संकष्टी चतुर्थी',
      type: 'Vrat',
      description: 'Moonrise fasting dedicated to Lord Ganesha.',
    };
  }

  // 5. Panchami
  if (tithiIdx === 5 && (month === 8 || month === 9)) {
    return {
      name: 'Rishi Panchami',
      sanskritName: 'ऋषि पञ्चमी',
      type: 'Major Festival',
      description: 'Veneration of the Sapta Rishis.',
    };
  }
  if (tithiIdx === 5 && (month === 1 || month === 2)) {
    return {
      name: 'Vasant Panchami / Saraswati Puja',
      sanskritName: 'वसन्त पञ्चमी',
      type: 'Major Festival',
    };
  }

  // 6. Shashthi (Skanda Sashti / Chhath Puja)
  if (tithiIdx === 6 && (month === 10 || month === 11)) {
    return {
      name: 'Chhath Puja (Surya Shashthi)',
      sanskritName: 'छठ पूजा',
      type: 'Major Festival',
    };
  }

  // 7. Saptami / Ashtami / Navami
  if (tithiIdx === 8) {
    if (month === 8 || month === 9) {
      return {
        name: 'Radha Ashtami / Durga Ashtami',
        sanskritName: 'राधा अष्टमी',
        type: 'Major Festival',
      };
    }
    return {
      name: 'Durga Ashtami Vrat',
      sanskritName: 'दुर्गा अष्टमी',
      type: 'Vrat',
    };
  }

  if (tithiIdx === 23 && (month === 8 || month === 9)) {
    return {
      name: 'Krishna Janmashtami',
      sanskritName: 'कृष्ण जन्माष्टमी',
      type: 'Major Festival',
      description: 'Appearance day of Bhagavan Sri Krishna.',
    };
  }

  if (tithiIdx === 9 && (month === 3 || month === 4)) {
    return {
      name: 'Sri Rama Navami',
      sanskritName: 'श्री राम नवमी',
      type: 'Major Festival',
    };
  }

  if (tithiIdx === 10 && (month === 9 || month === 10)) {
    return {
      name: 'Vijayadashami / Dussehra',
      sanskritName: 'विजयादशमी',
      type: 'Major Festival',
    };
  }

  if (tithiIdx === 29 && (month === 10 || month === 11)) {
    return {
      name: 'Deepawali / Lakshmi Puja',
      sanskritName: 'दीपावली',
      type: 'Major Festival',
    };
  }

  if (tithiIdx === 28 && (month === 2 || month === 3)) {
    return {
      name: 'Maha Shivaratri',
      sanskritName: 'महाशिवरात्रि',
      type: 'Major Festival',
    };
  }

  return null;
}
