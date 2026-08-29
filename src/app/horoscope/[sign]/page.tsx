'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import {
  Briefcase,
  Heart,
  Activity,
  DollarSign,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Sun,
  Moon,
  Compass,
  ChevronRight,
  Clock,
  Award,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface ForecastPeriodContent {
  periodLabel: string;
  badgeTag: string;
  overview: string;
  transits: {
    saturn: string;
    jupiter: string;
    rahuKetu: string;
  };
  career: string;
  love: string;
  wealth: string;
  health: string;
  luckyColor: string;
  luckyNumber: string;
  luckyTime: string;
  luckyGem: string;
  remedies: string[];
}

interface SignData {
  name: string;
  sanskrit: string;
  lord: string;
  element: string;
  quality: string;
  icon: string;
  sadeSatiStatus: string;
  sadeSatiBadge: string;
  periods: Record<PeriodType, ForecastPeriodContent>;
}

const ALL_SIGN_DATA: Record<string, SignData> = {
  aries: {
    name: 'Aries',
    sanskrit: 'Mesha Rashi',
    lord: 'Mars (Mangal)',
    element: 'Fire',
    quality: 'Movable (Chara)',
    icon: '♈',
    sadeSatiStatus: 'No active Sade Sati (Favorable Transit Phase)',
    sadeSatiBadge: 'Clear',
    periods: {
      daily: {
        periodLabel: "Today's Daily Moon Rashifal",
        badgeTag: 'Today - Aug 28, 2026',
        overview: 'Today\'s Moon transit through your 10th house brings high energetic drive in professional matters. Decisions taken before 3:00 PM yield favorable returns. Mars aspect provides strong confidence.',
        transits: {
          saturn: 'Saturn in 11th house supports steady corporate income and networking.',
          jupiter: 'Jupiter aspecting 5th house inspires high creative energy and problem solving.',
          rahuKetu: 'Rahu in 11th house boosts sudden opportunities through digital communication.',
        },
        career: 'Ideal day to push pending proposals, lead strategy meetings, and pitch ambitious concepts to seniors.',
        love: 'Express your feelings directly. Romantic energy is high, especially during evening conversations.',
        wealth: 'Small financial gains through past investments. Good time to clear pending bills or plan purchases.',
        health: 'High physical energy. Ensure you stay well-hydrated during peak work hours.',
        luckyColor: 'Coral Red & Saffron',
        luckyNumber: '9 & 18',
        luckyTime: '10:30 AM – 12:15 PM',
        luckyGem: 'Red Coral (Moonga)',
        remedies: [
          'Chant "Om Kram Kreem Kroum Sah Bhaumaya Namah" 11 times in the morning.',
          'Offer fresh red flowers or water to Surya Dev during sunrise.',
        ],
      },
      weekly: {
        periodLabel: 'Weekly Forecast (Current Week)',
        badgeTag: 'Aug 25 – Aug 31, 2026',
        overview: 'This week highlights leadership, client outreach, and strategic career moves. Mid-week brings exciting financial developments and long-term project approvals.',
        transits: {
          saturn: 'Saturn ensures that systematic effort translates into corporate recognition.',
          jupiter: 'Jupiter facilitates wisdom in financial planning and family harmony.',
          rahuKetu: 'Rahu rewards calculated risks while Ketu suggests verifying contract details.',
        },
        career: 'Mid-week brings a breakthrough in ongoing client negotiations. Stay open to new corporate roles.',
        love: 'Single Aries natives might meet someone special through mutual friends or work seminars.',
        wealth: 'Steady growth in savings. Avoid speculative trading on Thursday.',
        health: 'Good overall stamina. Incorporate light morning yoga or cardio.',
        luckyColor: 'Golden Yellow & Crimson',
        luckyNumber: '1 & 9',
        luckyTime: 'Tuesday 2:00 PM – 4:00 PM',
        luckyGem: 'Red Coral',
        remedies: [
          'Donate red lentils (Masoor Dal) on Tuesday morning.',
          'Recite Hanuman Chalisa on Tuesday and Saturday evening.',
        ],
      },
      monthly: {
        periodLabel: 'Monthly Forecast (August 2026)',
        badgeTag: 'August 2026',
        overview: 'August promises expansion in your professional stature. Sun and Mercury transits stimulate analytical skills, high-level networking, and commercial growth.',
        transits: {
          saturn: 'Saturn in 11th house guarantees steady passive income and strong industry connections.',
          jupiter: 'Jupiter in 5th house fosters success in competitive exams and intellectual projects.',
          rahuKetu: 'Rahu-Ketu transit enhances digital marketing and international business links.',
        },
        career: 'Promotions, salary increments, or new business contracts are strongly highlighted.',
        love: 'Strong harmony in married life. Romantic getaways planned for late August bring joy.',
        wealth: 'Excellent month for property allocation, long-term stocks, or mutual fund expansion.',
        health: 'Vitality remains high. Maintain proper sleep routines to avoid burnout.',
        luckyColor: 'Bright Red & Gold',
        luckyNumber: '9 & 27',
        luckyTime: '1st & 3rd Week of August',
        luckyGem: 'Red Coral (Moonga)',
        remedies: [
          'Perform Hanuman Puja on Tuesdays with Sindoor offering.',
          'Feed cows with jaggery and wheat flour on Tuesdays.',
        ],
      },
      yearly: {
        periodLabel: 'Yearly Horoscope 2026 (Full Year Roadmap)',
        badgeTag: 'Full Year 2026',
        overview: '2026 is a landmark year of career ascension, financial accumulation, and spiritual maturity for Aries natives. Jupiter\'s graceful aspect protects your health and family.',
        transits: {
          saturn: 'Saturn in 11th house brings major financial rewards from past multi-year efforts.',
          jupiter: 'Jupiter transit blesses career elevation, higher education, and auspicious family events.',
          rahuKetu: 'Rahu in 11th house opens international income streams and high-value partnerships.',
        },
        career: 'Major career promotions, international assignments, or successful business expansion occur between April and October 2026.',
        love: 'High probability of marriage for single Aries. Married natives deepen mutual trust.',
        wealth: '2026 marks substantial capital growth, home purchases, and solid asset creation.',
        health: 'Robust health throughout the year. Maintain a disciplined daily lifestyle.',
        luckyColor: 'Saffron & Ruby Red',
        luckyNumber: '9, 18, 27',
        luckyTime: 'April – October 2026',
        luckyGem: 'Red Coral (Moonga)',
        remedies: [
          'Wear a genuine 7-Ratti Red Coral in copper or gold after proper Vedic consecration.',
          'Chant "Om Namo Bhagavate Vasudevaya" daily for divine grace.',
          'Donate food to underprivileged children on auspicious tithis.',
        ],
      },
    },
  },
  taurus: {
    name: 'Taurus',
    sanskrit: 'Vrishabha Rashi',
    lord: 'Venus (Shukra)',
    element: 'Earth',
    quality: 'Fixed (Sthira)',
    icon: '♉',
    sadeSatiStatus: 'No active Sade Sati (Stable Planetary Period)',
    sadeSatiBadge: 'Clear',
    periods: {
      daily: {
        periodLabel: "Today's Daily Moon Rashifal",
        badgeTag: 'Today - Aug 28, 2026',
        overview: 'Venus alignment brings artistic charm, peaceful interactions, and luxury. Focus on financial organization and domestic harmony today.',
        transits: {
          saturn: 'Saturn in 10th house rewards steady disciplined work.',
          jupiter: 'Jupiter in 4th house expands home comfort and family bliss.',
          rahuKetu: 'Rahu in 10th house encourages high career ambitions.',
        },
        career: 'Focus on quality over speed. Design, finance, real estate, and culinary arts bring strong productivity.',
        love: 'Warmth and mutual respect in relationships. Express appreciation to your partner.',
        wealth: 'Favorable for planned shopping, asset evaluation, or fixed deposit renewals.',
        health: 'Good vital energy. Keep a balanced diet to support digestion.',
        luckyColor: 'Lotus Pink & Cream White',
        luckyNumber: '6 & 15',
        luckyTime: '1:00 PM – 3:30 PM',
        luckyGem: 'Diamond / Opal',
        remedies: [
          'Chant "Om Shum Shukraya Namah" 11 times in the morning.',
          'Offer white sweets or milk to Goddess Lakshmi.',
        ],
      },
      weekly: {
        periodLabel: 'Weekly Forecast (Current Week)',
        badgeTag: 'Aug 25 – Aug 31, 2026',
        overview: 'This week emphasizes family harmony, financial gains, and creative projects. Your patient approach yields substantial progress.',
        transits: {
          saturn: 'Saturn reinforces your professional authority in corporate structures.',
          jupiter: 'Jupiter enhances mental tranquility and domestic satisfaction.',
          rahuKetu: 'Rahu inspires innovative business ideas.',
        },
        career: 'A great week for closing key contracts and solidifying long-term business ties.',
        love: 'Romantic moments mid-week. Single Taurus natives draw attention through charm.',
        wealth: 'Steady income. Good time to invest in gold or real estate.',
        health: 'Stable stamina. Practice mild morning stretching.',
        luckyColor: 'Cream & Sky Blue',
        luckyNumber: '6 & 24',
        luckyTime: 'Friday 4:00 PM – 6:00 PM',
        luckyGem: 'Diamond / Opal',
        remedies: [
          'Offer white flowers at a Shiva temple on Friday.',
          'Donate food or clothes to women in need on Friday.',
        ],
      },
      monthly: {
        periodLabel: 'Monthly Forecast (August 2026)',
        badgeTag: 'August 2026',
        overview: 'August brings steady growth in asset value, comfortable living, and professional stability. Venus transits spark creative success.',
        transits: {
          saturn: 'Saturn in 10th house demands ethics and consistency for executive promotion.',
          jupiter: 'Jupiter in 4th house brings vehicle purchase or home decoration luck.',
          rahuKetu: 'Rahu boosts career vision.',
        },
        career: 'Steady rise in reputation. Executive roles and creative consultancies thrive.',
        love: 'Deep emotional alignment. Family support for personal goals is strong.',
        wealth: 'Multiple income channels opening up.',
        health: 'Vibrant energy. Maintain proper throat care.',
        luckyColor: 'Silver & Rose Pink',
        luckyNumber: '6 & 15',
        luckyTime: 'Mid August 2026',
        luckyGem: 'Opal / White Zircon',
        remedies: [
          'Chant Lakshmi Suktam on Friday evenings.',
          'Feed birds with grain on Friday mornings.',
        ],
      },
      yearly: {
        periodLabel: 'Yearly Horoscope 2026 (Full Year Roadmap)',
        badgeTag: 'Full Year 2026',
        overview: '2026 is a year of domestic happiness, financial consolidation, and executive career elevation. Venus and Saturn alignment promises enduring security.',
        transits: {
          saturn: 'Saturn in 10th house bestows senior positions and long-term authority.',
          jupiter: 'Jupiter in 4th house promises real estate, car purchases, and peace.',
          rahuKetu: 'Rahu-Ketu aids international trade and high-end projects.',
        },
        career: 'Significant promotions, corporate recognition, or expansion of business ventures occur in 2026.',
        love: 'Auspicious year for marriage, family expansion, and deep commitment.',
        wealth: 'Substantial rise in net worth, property creation, and investment yields.',
        health: 'Overall good health with peaceful mental state.',
        luckyColor: 'Lotus Pink & Silver',
        luckyNumber: '6, 15, 24',
        luckyTime: 'May – November 2026',
        luckyGem: 'Diamond or White Zircon',
        remedies: [
          'Wear a high-quality Opal or Diamond in silver on Friday morning.',
          'Perform Sri Suktam Havan on auspicious tithis.',
        ],
      },
    },
  },
  gemini: {
    name: 'Gemini',
    sanskrit: 'Mithuna Rashi',
    lord: 'Mercury (Budh)',
    element: 'Air',
    quality: 'Dual (Dwiswabhava)',
    icon: '♊',
    sadeSatiStatus: 'No Sade Sati',
    sadeSatiBadge: 'Clear',
    periods: {
      daily: {
        periodLabel: "Today's Daily Moon Rashifal",
        badgeTag: 'Today - Aug 28, 2026',
        overview: 'Mercury transit enhances your analytical intelligence, communication skills, and commercial negotiations today.',
        transits: {
          saturn: 'Saturn in 9th house brings luck through perseverance.',
          jupiter: 'Jupiter in 3rd house boosts writing and short trips.',
          rahuKetu: 'Rahu encourages novel learning.',
        },
        career: 'Ideal day for marketing, tech development, trading, and contract drafting.',
        love: 'Lively communication restores excitement. Be clear and direct.',
        wealth: 'Gains through consulting, intellectual projects, and online trading.',
        health: 'Keep your mind calm with short breaks during intense computer work.',
        luckyColor: 'Emerald Green & Gold',
        luckyNumber: '5 & 14',
        luckyTime: '11:00 AM – 1:00 PM',
        luckyGem: 'Emerald (Panna)',
        remedies: [
          'Chant "Om Bum Budhaya Namah" 11 times.',
          'Feed green spinach to cows on Wednesday morning.',
        ],
      },
      weekly: {
        periodLabel: 'Weekly Forecast (Current Week)',
        badgeTag: 'Aug 25 – Aug 31, 2026',
        overview: 'Networking, social media, and client outreach are highlighted this week. Important news regarding career growth arrives mid-week.',
        transits: {
          saturn: 'Saturn guides long-term higher learning.',
          jupiter: 'Jupiter supports sibling ties and short business trips.',
          rahuKetu: 'Rahu inspires creative communication.',
        },
        career: 'High productivity in journalism, software, sales, and education.',
        love: 'Charming conversations bring new romantic connections.',
        wealth: 'Income stream expands. Good time for financial planning.',
        health: 'Maintain balanced sleep to prevent mental fatigue.',
        luckyColor: 'Parrot Green & White',
        luckyNumber: '5 & 23',
        luckyTime: 'Wednesday 10:00 AM – 12:00 PM',
        luckyGem: 'Emerald (Panna)',
        remedies: [
          'Recite Vishnu Sahasranama on Wednesday.',
          'Donate green stationery to students.',
        ],
      },
      monthly: {
        periodLabel: 'Monthly Forecast (August 2026)',
        badgeTag: 'August 2026',
        overview: 'August brings sharp mental clarity, commercial gains, and new strategic partnerships for Gemini natives.',
        transits: {
          saturn: 'Saturn strengthens your long-distance business links.',
          jupiter: 'Jupiter enhances communication impact.',
          rahuKetu: 'Rahu opens international prospects.',
        },
        career: 'Major success in publishing, IT, finance, and trading.',
        love: 'Engaging conversations and mutual intellectual interest.',
        wealth: 'Strong financial returns from multiple assignments.',
        health: 'Good immunity. Keep active with outdoor walks.',
        luckyColor: 'Bright Green & Light Yellow',
        luckyNumber: '5 & 14',
        luckyTime: 'Mid August 2026',
        luckyGem: 'Emerald (Panna)',
        remedies: [
          'Chant Budh Beej Mantra daily.',
          'Keep a green plant in your workspace.',
        ],
      },
      yearly: {
        periodLabel: 'Yearly Horoscope 2026 (Full Year Roadmap)',
        badgeTag: 'Full Year 2026',
        overview: '2026 is a year of intellectual triumphs, international connections, and commercial growth for Gemini natives.',
        transits: {
          saturn: 'Saturn in 9th house rewards higher study and long-distance ventures.',
          jupiter: 'Jupiter in 3rd house expands influence, media presence, and courage.',
          rahuKetu: 'Rahu-Ketu supports digital technology and innovative trade.',
        },
        career: 'Outstanding performance in tech, publishing, media, and trading sectors.',
        love: 'Fulfilling romantic relationships and pleasant travels with spouse.',
        wealth: 'Significant financial accumulation and capital gains.',
        health: 'Good physical health throughout the year.',
        luckyColor: 'Emerald Green & Gold',
        luckyNumber: '5, 14, 23',
        luckyTime: 'June – October 2026',
        luckyGem: 'Emerald (Panna)',
        remedies: [
          'Wear a natural 5-Ratti Emerald in gold or silver on Wednesday morning.',
          'Perform Budh Shanti Puja on Wednesdays.',
        ],
      },
    },
  },
  cancer: {
    name: 'Cancer',
    sanskrit: 'Karka Rashi',
    lord: 'Moon (Chandra)',
    element: 'Water',
    quality: 'Movable (Chara)',
    icon: '♋',
    sadeSatiStatus: 'No Sade Sati (Ashtama Shani Influence)',
    sadeSatiBadge: 'Caution',
    periods: {
      daily: {
        periodLabel: "Today's Daily Moon Rashifal",
        badgeTag: 'Today - Aug 28, 2026',
        overview: 'Moon transits heighten intuitive wisdom today. Emotional patience and steady focus unlock victory in key personal and professional goals.',
        transits: {
          saturn: 'Saturn in 8th house urges caution in sudden investments.',
          jupiter: 'Jupiter in 2nd house protects family wealth and reserves.',
          rahuKetu: 'Rahu in 8th house brings deep research discoveries.',
        },
        career: 'Steady work ethic pays off. Avoid impulsive career decisions without analysis.',
        love: 'Deep emotional bonding with partner. Express affection openly.',
        wealth: 'Save systematically. Traditional investments offer safety.',
        health: 'Prioritize adequate hydration and peace of mind.',
        luckyColor: 'Pearl White & Silver',
        luckyNumber: '2 & 11',
        luckyTime: '9:00 AM – 11:00 AM',
        luckyGem: 'Natural Pearl (Moti)',
        remedies: [
          'Offer fresh water to Surya Dev in the morning.',
          'Chant "Om Som Somaya Namah" 11 times.',
        ],
      },
      weekly: {
        periodLabel: 'Weekly Forecast (Current Week)',
        badgeTag: 'Aug 25 – Aug 31, 2026',
        overview: 'Focus on family wealth, domestic comfort, and emotional wellness this week. Financial inflows remain steady.',
        transits: {
          saturn: 'Saturn requires disciplined financial handling.',
          jupiter: 'Jupiter shields family harmony and speech sweetness.',
          rahuKetu: 'Rahu encourages research and deep study.',
        },
        career: 'Internal planning and solid execution bring career rewards.',
        love: 'Supportive family environment and warm marital connection.',
        wealth: 'Good time for banking, fixed deposits, and family assets.',
        health: 'Practice Pranayama for emotional calm.',
        luckyColor: 'Moon Silver & Cream',
        luckyNumber: '2 & 20',
        luckyTime: 'Monday 5:00 PM – 7:00 PM',
        luckyGem: 'Natural Pearl',
        remedies: [
          'Offer milk or water at a Shiva Lingam on Mondays.',
          'Donate white rice or sugar to the needy on Monday evening.',
        ],
      },
      monthly: {
        periodLabel: 'Monthly Forecast (August 2026)',
        badgeTag: 'August 2026',
        overview: 'August highlights financial consolidation and domestic peace. Jupiter in 2nd house ensures steady wealth build-up.',
        transits: {
          saturn: 'Saturn in 8th house advises steady health care.',
          jupiter: 'Jupiter in 2nd house enhances family prosperity.',
          rahuKetu: 'Rahu-Ketu supports analytical discoveries.',
        },
        career: 'Recognition in banking, healthcare, education, and administration.',
        love: 'Harmony and joy in family relations.',
        wealth: 'Strong financial security and savings expansion.',
        health: 'Good vital energy with balanced diet.',
        luckyColor: 'Silver & Sky Blue',
        luckyNumber: '2 & 11',
        luckyTime: 'First Half of August 2026',
        luckyGem: 'Natural Pearl (Moti)',
        remedies: [
          'Chant Chandra Beej Mantra on Mondays.',
          'Respect mother figures and seek their blessings.',
        ],
      },
      yearly: {
        periodLabel: 'Yearly Horoscope 2026 (Full Year Roadmap)',
        badgeTag: 'Full Year 2026',
        overview: '2026 brings wealth protection, family auspiciousness, and spiritual elevation. Jupiter\'s graceful transit shields your assets.',
        transits: {
          saturn: 'Saturn in 8th house demands careful financial discipline.',
          jupiter: 'Jupiter in 2nd house confers immense family prosperity and wisdom.',
          rahuKetu: 'Rahu-Ketu aids secret research and intuitive insights.',
        },
        career: 'Steady rise in administrative, financial, medical, or academic roles.',
        love: 'Family harmony, auspicious celebrations, and deep marital unity.',
        wealth: 'Substantial increase in family wealth and bank reserves.',
        health: 'Maintain regular health check-ups and stress balance.',
        luckyColor: 'Pearl White & Silver',
        luckyNumber: '2, 11, 20',
        luckyTime: 'July – December 2026',
        luckyGem: 'Natural South Sea Pearl',
        remedies: [
          'Wear a high-grade South Sea Pearl in silver on Monday evening.',
          'Perform Rudrabhishekam on Somvar tithis.',
        ],
      },
    },
  },
  leo: {
    name: 'Leo',
    sanskrit: 'Simha Rashi',
    lord: 'Sun (Surya)',
    element: 'Fire',
    quality: 'Fixed (Sthira)',
    icon: '♌',
    sadeSatiStatus: 'No Sade Sati',
    sadeSatiBadge: 'Clear',
    periods: {
      daily: {
        periodLabel: "Today's Daily Moon Rashifal",
        badgeTag: 'Today - Aug 28, 2026',
        overview: 'Sun transit bestows high authority, leadership charisma, and administrative success today. Senior executives support your vision.',
        transits: {
          saturn: 'Saturn in 7th house tests partnership commitment.',
          jupiter: 'Jupiter in 1st house confers immense wisdom and grace.',
          rahuKetu: 'Rahu in 7th house brings foreign prospects.',
        },
        career: 'Commanding position in leadership roles, government matters, and corporate presentations.',
        love: 'Warmth and loyalty define your relationship. Share decisions with your partner.',
        wealth: 'Strong revenue generation. Good time for investment planning.',
        health: 'Vibrant vitality. Enjoy daily cardiovascular workouts.',
        luckyColor: 'Sun Gold & Crimson',
        luckyNumber: '1 & 10',
        luckyTime: '8:00 AM – 10:00 AM',
        luckyGem: 'Ruby (Manikya)',
        remedies: [
          'Offer Arghya (water) to Lord Surya at sunrise.',
          'Recite Aditya Hrudayam Stotram.',
        ],
      },
      weekly: {
        periodLabel: 'Weekly Forecast (Current Week)',
        badgeTag: 'Aug 25 – Aug 31, 2026',
        overview: 'A stellar week for leadership recognition, public speaking, and strategic expansion. Your influence rises across professional circles.',
        transits: {
          saturn: 'Saturn demands fairness in business partnerships.',
          jupiter: 'Jupiter bestows personal magnetic charm and optimism.',
          rahuKetu: 'Rahu encourages international collaborations.',
        },
        career: 'Executive promotions or high-value project leads are highlighted.',
        love: 'Charming romantic moments. Single Leos attract attention.',
        wealth: 'Capital growth through past efforts. Good period for portfolio review.',
        health: 'High stamina and bright mood.',
        luckyColor: 'Golden Yellow & Red',
        luckyNumber: '1 & 19',
        luckyTime: 'Sunday 9:00 AM – 11:30 AM',
        luckyGem: 'Ruby (Manikya)',
        remedies: [
          'Donate wheat or copper items on Sunday morning.',
          'Chant "Om Hram Hreem Hroum Sah Suryaya Namah".',
        ],
      },
      monthly: {
        periodLabel: 'Monthly Forecast (August 2026)',
        badgeTag: 'August 2026',
        overview: 'August is your birthday month of power and prestige! Sun and Jupiter alignment brings victory, vitality, and corporate acclaim.',
        transits: {
          saturn: 'Saturn in 7th house consolidates long-term commercial ties.',
          jupiter: 'Jupiter in 1st house confers overall life grace and wisdom.',
          rahuKetu: 'Rahu aids global reach.',
        },
        career: 'Peak professional recognition, leadership awards, and expansion.',
        love: 'Deep mutual respect and joyous family celebrations.',
        wealth: 'Strong earnings growth and asset creation.',
        health: 'Top-tier health and mental enthusiasm.',
        luckyColor: 'Ruby Red & Gold',
        luckyNumber: '1 & 10',
        luckyTime: 'Entire August 2026',
        luckyGem: 'Ruby (Manikya)',
        remedies: [
          'Recite Surya Ashtakam every morning.',
          'Give respect to father and senior mentors.',
        ],
      },
      yearly: {
        periodLabel: 'Yearly Horoscope 2026 (Full Year Roadmap)',
        badgeTag: 'Full Year 2026',
        overview: '2026 is a golden year of leadership, personal magnetism, and spiritual wisdom for Leo natives. Jupiter in your 1st house bestows divine protection.',
        transits: {
          saturn: 'Saturn in 7th house solidifies marriage and business contracts.',
          jupiter: 'Jupiter in 1st house brings immense fortune, good health, and success.',
          rahuKetu: 'Rahu-Ketu supports international expansion.',
        },
        career: 'Major executive promotions, public appointments, or corporate milestones in 2026.',
        love: 'Highly auspicious year for marriage, soulmate connections, and marital harmony.',
        wealth: 'Massive wealth accumulation, property growth, and business expansion.',
        health: 'Excellent health and high vital energy.',
        luckyColor: 'Royal Gold & Crimson',
        luckyNumber: '1, 10, 19',
        luckyTime: 'August – December 2026',
        luckyGem: 'Ruby (Manikya)',
        remedies: [
          'Wear a genuine 5-Ratti Burmese Ruby in copper or gold on Sunday morning.',
          'Perform Gayatri Mantra Japa daily.',
        ],
      },
    },
  },
  virgo: {
    name: 'Virgo',
    sanskrit: 'Kanya Rashi',
    lord: 'Mercury (Budh)',
    element: 'Earth',
    quality: 'Dual (Dwiswabhava)',
    icon: '♍',
    sadeSatiStatus: 'No Sade Sati',
    sadeSatiBadge: 'Clear',
    periods: {
      daily: {
        periodLabel: "Today's Daily Moon Rashifal",
        badgeTag: 'Today - Aug 28, 2026',
        overview: 'Precision, data analysis, and problem-solving abilities reach peak efficiency today. Your attention to detail saves time and capital.',
        transits: {
          saturn: 'Saturn in 6th house brings victory over competitors.',
          jupiter: 'Jupiter in 12th house favors spiritual peace and foreign links.',
          rahuKetu: 'Rahu in 6th house grants opposition immunity.',
        },
        career: 'Excellence in auditing, medicine, software testing, and service management.',
        love: 'Practical helpfulness strengthens bonds. Avoid over-critical tone.',
        wealth: 'Debt clearance and effective expense management today.',
        health: 'Good immunity. Maintain regular sleep hygiene.',
        luckyColor: 'Dark Green & Beige',
        luckyNumber: '5 & 23',
        luckyTime: '2:00 PM – 4:00 PM',
        luckyGem: 'Emerald (Panna)',
        remedies: [
          'Recite Vishnu Sahasranama.',
          'Keep your workspace clean and organized.',
        ],
      },
      weekly: {
        periodLabel: 'Weekly Forecast (Current Week)',
        badgeTag: 'Aug 25 – Aug 31, 2026',
        overview: 'This week emphasizes legal victory, competitive success, and efficient workflow. Past technical efforts pay off.',
        transits: {
          saturn: 'Saturn grants victory over rivals and loan resolutions.',
          jupiter: 'Jupiter supports foreign trips and charitable deeds.',
          rahuKetu: 'Rahu enhances problem-solving tactics.',
        },
        career: 'High success in competitive exams, legal matters, and audits.',
        love: 'Mutual care and helpful advice strengthen your connection.',
        wealth: 'Gains through analytical consulting and systematic savings.',
        health: 'Maintain balanced digestive health.',
        luckyColor: 'Olive Green & Off-White',
        luckyNumber: '5 & 14',
        luckyTime: 'Wednesday 3:00 PM – 5:00 PM',
        luckyGem: 'Emerald (Panna)',
        remedies: [
          'Donate green vegetables to needy families on Wednesday.',
          'Chant "Om Budhaya Namah" 108 times.',
        ],
      },
      monthly: {
        periodLabel: 'Monthly Forecast (August 2026)',
        badgeTag: 'August 2026',
        overview: 'August brings victory over competitors, health improvement, and structured career advancements for Virgo natives.',
        transits: {
          saturn: 'Saturn in 6th house ensures success in litigation and loans.',
          jupiter: 'Jupiter in 12th house favors foreign projects.',
          rahuKetu: 'Rahu aids work performance.',
        },
        career: 'Rising dominance in technical, medical, administrative, and service fields.',
        love: 'Harmonious domestic life with quiet, supportive moments.',
        wealth: 'Good recovery of blocked funds and wise capital allocation.',
        health: 'Strong immunity and physical recovery.',
        luckyColor: 'Emerald & Khaki',
        luckyNumber: '5 & 23',
        luckyTime: 'Mid to Late August 2026',
        luckyGem: 'Emerald (Panna)',
        remedies: [
          'Perform Budh Shanti Archana on Wednesdays.',
          'Feed green grass to cows regularly.',
        ],
      },
      yearly: {
        periodLabel: 'Yearly Horoscope 2026 (Full Year Roadmap)',
        badgeTag: 'Full Year 2026',
        overview: '2026 is a year of victory over obstacles, career consolidation, and foreign opportunities for Virgo natives.',
        transits: {
          saturn: 'Saturn in 6th house bestows competitive dominance and health immunity.',
          jupiter: 'Jupiter in 12th house supports spiritual growth, international travel, and peace.',
          rahuKetu: 'Rahu-Ketu shields you against rivals.',
        },
        career: 'Major breakthroughs in corporate services, legal matters, medicine, and tech engineering.',
        love: 'Stable, reliable relationship built on practical devotion.',
        wealth: 'Complete debt resolution and wealth accumulation.',
        health: 'Robust health and high stamina.',
        luckyColor: 'Emerald Green & Gold',
        luckyNumber: '5, 14, 23',
        luckyTime: 'September – December 2026',
        luckyGem: 'Emerald (Panna)',
        remedies: [
          'Wear a genuine 6-Ratti Emerald in gold or silver on Wednesday morning.',
          'Recite Sri Vishnu Sahasranama Stotram weekly.',
        ],
      },
    },
  },
  libra: {
    name: 'Libra',
    sanskrit: 'Tula Rashi',
    lord: 'Venus (Shukra)',
    element: 'Air',
    quality: 'Movable (Chara)',
    icon: '♎',
    sadeSatiStatus: 'No Sade Sati',
    sadeSatiBadge: 'Clear',
    periods: {
      daily: {
        periodLabel: "Today's Daily Moon Rashifal",
        badgeTag: 'Today - Aug 28, 2026',
        overview: 'Balanced judgment, diplomatic tact, and artistic harmony elevate your prestige today. Social interactions lead to promising opportunities.',
        transits: {
          saturn: 'Saturn in 5th house promotes structured learning.',
          jupiter: 'Jupiter in 11th house grants major corporate gains.',
          rahuKetu: 'Rahu in 5th house boosts creative innovation.',
        },
        career: 'Success in diplomacy, law, design, public relations, and luxury retail.',
        love: 'Romantic bliss and pleasant evening dinner dates.',
        wealth: 'Substantial increase in income through professional connections.',
        health: 'Balanced vitality. Enjoy light yoga or graceful workouts.',
        luckyColor: 'Sky Blue & Opal White',
        luckyNumber: '6 & 24',
        luckyTime: '3:00 PM – 5:30 PM',
        luckyGem: 'Diamond / Opal',
        remedies: [
          'Chant "Om Dram Dreem Droum Sah Shukraya Namah" 11 times.',
          'Apply natural sandalwood perfume in the morning.',
        ],
      },
      weekly: {
        periodLabel: 'Weekly Forecast (Current Week)',
        badgeTag: 'Aug 25 – Aug 31, 2026',
        overview: 'This week highlights network expansion, income growth, and artistic projects. Team collaborations bring high success.',
        transits: {
          saturn: 'Saturn strengthens investment discipline.',
          jupiter: 'Jupiter fulfills long-held professional ambitions.',
          rahuKetu: 'Rahu inspires tech-driven creativity.',
        },
        career: 'Strong progress in group projects, creative arts, and corporate contracts.',
        love: 'Harmonious relationship atmosphere and single Libras find attraction.',
        wealth: 'Multiple financial inflows. Great week for stock portfolio gains.',
        health: 'Good mental peace and vitality.',
        luckyColor: 'White & Turquoise',
        luckyNumber: '6 & 15',
        luckyTime: 'Friday 2:00 PM – 4:30 PM',
        luckyGem: 'Diamond / Opal',
        remedies: [
          'Donate white clothes or sweets to women on Friday.',
          'Offer white fragrant flowers to Goddess Lakshmi.',
        ],
      },
      monthly: {
        periodLabel: 'Monthly Forecast (August 2026)',
        badgeTag: 'August 2026',
        overview: 'August brings wish fulfillment, lucrative corporate partnerships, and artistic recognition for Libra natives.',
        transits: {
          saturn: 'Saturn in 5th house disciplines speculative investments.',
          jupiter: 'Jupiter in 11th house guarantees high revenue stream.',
          rahuKetu: 'Rahu-Ketu aids creative technology.',
        },
        career: 'Elevation in status, expanded authority, and client acclaim.',
        love: 'Deep mutual love and romantic holiday plans.',
        wealth: 'Outstanding financial gains and capital appreciation.',
        health: 'Bright physical and emotional health.',
        luckyColor: 'Opal White & Light Blue',
        luckyNumber: '6 & 24',
        luckyTime: 'Mid August 2026',
        luckyGem: 'Opal / White Zircon',
        remedies: [
          'Perform Lakshmi Kuber Puja on Fridays.',
          'Keep your surroundings fragrant and clean.',
        ],
      },
      yearly: {
        periodLabel: 'Yearly Horoscope 2026 (Full Year Roadmap)',
        badgeTag: 'Full Year 2026',
        overview: '2026 is a stellar year of financial prosperity, wish fulfillment, and romantic joy for Libra natives. Jupiter in 11th house brings major success.',
        transits: {
          saturn: 'Saturn in 5th house matures creative intelligence and investment returns.',
          jupiter: 'Jupiter in 11th house guarantees corporate gains and network expansion.',
          rahuKetu: 'Rahu-Ketu supports digital media and global connections.',
        },
        career: 'Major promotions, high-value corporate deals, and social prestige in 2026.',
        love: 'Highly auspicious year for romantic relationships and marriage.',
        wealth: 'Peak financial accumulation, stock yields, and asset growth.',
        health: 'Robust health and vibrant mind.',
        luckyColor: 'Sky Blue & Opal White',
        luckyNumber: '6, 15, 24',
        luckyTime: 'September – November 2026',
        luckyGem: 'Australian Opal or Diamond',
        remedies: [
          'Wear a genuine 7-Ratti Australian Opal in silver on Friday morning.',
          'Chant Mahalakshmi Ashtakam daily.',
        ],
      },
    },
  },
  scorpio: {
    name: 'Scorpio',
    sanskrit: 'Vrishchika Rashi',
    lord: 'Mars (Mangal)',
    element: 'Water',
    quality: 'Fixed (Sthira)',
    icon: '♏',
    sadeSatiStatus: 'No Sade Sati',
    sadeSatiBadge: 'Clear',
    periods: {
      daily: {
        periodLabel: "Today's Daily Moon Rashifal",
        badgeTag: 'Today - Aug 28, 2026',
        overview: 'Transformative inner strength and strategic foresight lead to breakthroughs today. Mars energy grants determination to resolve challenges.',
        transits: {
          saturn: 'Saturn in 4th house brings focus on real estate duties.',
          jupiter: 'Jupiter in 10th house bestows professional honor and promotion.',
          rahuKetu: 'Rahu in 4th house urges domestic balance.',
        },
        career: 'Achievement in research, surgery, engineering, defense, and management.',
        love: 'Deep emotional loyalty and supportive communication.',
        wealth: 'Property discussions and long-term asset planning today.',
        health: 'High stamina. Maintain emotional calm through meditation.',
        luckyColor: 'Deep Maroon & Coral',
        luckyNumber: '9 & 27',
        luckyTime: '10:00 AM – 12:00 PM',
        luckyGem: 'Red Coral (Moonga)',
        remedies: [
          'Recite Hanuman Chalisa in the morning.',
          'Apply red tilak on forehead.',
        ],
      },
      weekly: {
        periodLabel: 'Weekly Forecast (Current Week)',
        badgeTag: 'Aug 25 – Aug 31, 2026',
        overview: 'Career recognition, senior executive support, and property progress define this week for Scorpio natives.',
        transits: {
          saturn: 'Saturn disciplines domestic responsibilities.',
          jupiter: 'Jupiter elevates executive authority at work.',
          rahuKetu: 'Rahu supports real estate upgrades.',
        },
        career: 'Senior management appreciates your dedication and problem-solving skills.',
        love: 'Deep trust and emotional grounding with your spouse.',
        wealth: 'Steady gains from career. Good week for real estate allocation.',
        health: 'Good vital energy.',
        luckyColor: 'Dark Red & Saffron',
        luckyNumber: '9 & 18',
        luckyTime: 'Tuesday 11:00 AM – 1:30 PM',
        luckyGem: 'Red Coral (Moonga)',
        remedies: [
          'Donate red lentils or jaggery on Tuesday.',
          'Light a ghee lamp before Hanumanji.',
        ],
      },
      monthly: {
        periodLabel: 'Monthly Forecast (August 2026)',
        badgeTag: 'August 2026',
        overview: 'August brings professional honors, promotions, and real estate investments. Jupiter in 10th house elevates career status.',
        transits: {
          saturn: 'Saturn in 4th house stabilizes home life.',
          jupiter: 'Jupiter in 10th house bestows executive recognition.',
          rahuKetu: 'Rahu-Ketu supports strategic expansion.',
        },
        career: 'Major career promotions, key client wins, and leadership roles.',
        love: 'Strong emotional bonds and family support.',
        wealth: 'Property acquisition and solid financial reserves.',
        health: 'Strong stamina and physical wellness.',
        luckyColor: 'Maroon & Gold',
        luckyNumber: '9 & 27',
        luckyTime: 'Entire August 2026',
        luckyGem: 'Red Coral (Moonga)',
        remedies: [
          'Perform Mangal Graha Puja on Tuesdays.',
          'Chant Hanuman Ashtak weekly.',
        ],
      },
      yearly: {
        periodLabel: 'Yearly Horoscope 2026 (Full Year Roadmap)',
        badgeTag: 'Full Year 2026',
        overview: '2026 is a major milestone year of executive career promotion, property acquisition, and status growth for Scorpio natives.',
        transits: {
          saturn: 'Saturn in 4th house consolidates land, home, and vehicle assets.',
          jupiter: 'Jupiter in 10th house bestows senior administrative authority.',
          rahuKetu: 'Rahu-Ketu supports strategic research and tech.',
        },
        career: 'Promotions to executive roles, government honors, or major corporate expansions in 2026.',
        love: 'Deep marital commitment and family harmony.',
        wealth: 'Substantial rise in net worth and real estate creation.',
        health: 'Good physical health and resilience.',
        luckyColor: 'Deep Maroon & Saffron',
        luckyNumber: '9, 18, 27',
        luckyTime: 'October – December 2026',
        luckyGem: 'Red Coral (Moonga)',
        remedies: [
          'Wear a genuine 6.5-Ratti Italian Red Coral in copper or gold on Tuesday morning.',
          'Perform Kartikeya / Hanuman Havan on auspicious tithis.',
        ],
      },
    },
  },
  sagittarius: {
    name: 'Sagittarius',
    sanskrit: 'Dhanu Rashi',
    lord: 'Jupiter (Guru)',
    element: 'Fire',
    quality: 'Dual (Dwiswabhava)',
    icon: '♐',
    sadeSatiStatus: 'Completed (Post-Sade Sati Growth Phase)',
    sadeSatiBadge: 'Clear',
    periods: {
      daily: {
        periodLabel: "Today's Daily Moon Rashifal",
        badgeTag: 'Today - Aug 28, 2026',
        overview: 'Expansive wisdom, divine grace, and optimism open doors today. Jupiter alignment favors high-level decisions and mentor guidance.',
        transits: {
          saturn: 'Saturn in 3rd house grants immense courage and initiative.',
          jupiter: 'Jupiter in 9th house brings luck, higher education, and travel.',
          rahuKetu: 'Rahu in 3rd house boosts self-effort.',
        },
        career: 'Leadership in teaching, law, publishing, corporate strategy, and philosophy.',
        love: 'Fulfilling spiritual and emotional connection with spouse.',
        wealth: 'Financial prosperity and capital expansion today.',
        health: 'Robust health and high optimistic mood.',
        luckyColor: 'Yellow & Saffron Gold',
        luckyNumber: '3 & 12',
        luckyTime: '9:30 AM – 11:30 AM',
        luckyGem: 'Yellow Sapphire (Pukhraj)',
        remedies: [
          'Apply yellow sandalwood tilak on forehead.',
          'Chant "Om Gram Greem Groum Sah Gurave Namah" 11 times.',
        ],
      },
      weekly: {
        periodLabel: 'Weekly Forecast (Current Week)',
        badgeTag: 'Aug 25 – Aug 31, 2026',
        overview: 'This week highlights fortune through travel, mentor support, and strategic expansion. Your optimism inspires teams.',
        transits: {
          saturn: 'Saturn reinforces your persistence in competitive tasks.',
          jupiter: 'Jupiter brings luck in higher study and legal matters.',
          rahuKetu: 'Rahu supports digital outreach.',
        },
        career: 'High success in academic, corporate, legal, and international ventures.',
        love: 'Warm, spiritual bond with your partner.',
        wealth: 'Prosperity and capital growth through past investments.',
        health: 'Vibrant stamina.',
        luckyColor: 'Golden Yellow & Amber',
        luckyNumber: '3 & 21',
        luckyTime: 'Thursday 10:00 AM – 12:30 PM',
        luckyGem: 'Yellow Sapphire (Pukhraj)',
        remedies: [
          'Donate banana or yellow sweets on Thursday morning.',
          'Offer yellow flowers at Vishnu temple.',
        ],
      },
      monthly: {
        periodLabel: 'Monthly Forecast (August 2026)',
        badgeTag: 'August 2026',
        overview: 'August brings divine grace, international luck, and financial expansion. Jupiter in 9th house blesses long journeys and publication.',
        transits: {
          saturn: 'Saturn in 3rd house gives unstoppable courage.',
          jupiter: 'Jupiter in 9th house grants luck and spiritual honors.',
          rahuKetu: 'Rahu-Ketu aids digital media.',
        },
        career: 'Promotions, international ventures, and academic publishing success.',
        love: 'Joyous family trips and marital happiness.',
        wealth: 'Capital expansion and high investment returns.',
        health: 'Excellent health and high vitality.',
        luckyColor: 'Saffron & Gold',
        luckyNumber: '3 & 12',
        luckyTime: 'Mid August 2026',
        luckyGem: 'Yellow Sapphire (Pukhraj)',
        remedies: [
          'Perform Vishnu Sahasranama Path on Thursdays.',
          'Respect teachers and elders.',
        ],
      },
      yearly: {
        periodLabel: 'Yearly Horoscope 2026 (Full Year Roadmap)',
        badgeTag: 'Full Year 2026',
        overview: '2026 is a landmark fortune year of international growth, higher learning, and spiritual expansion for Sagittarius natives. Jupiter in 9th house grants divine protection.',
        transits: {
          saturn: 'Saturn in 3rd house bestows immense initiative and triumph over obstacles.',
          jupiter: 'Jupiter in 9th house unlocks supreme luck, international travel, and mentor grace.',
          rahuKetu: 'Rahu-Ketu aids digital enterprise.',
        },
        career: 'Major career promotions, global assignments, or successful publishing/legal endeavors in 2026.',
        love: 'Soulful marriage, spiritual partnerships, and family blessings.',
        wealth: 'Substantial rise in net worth, international gains, and property.',
        health: 'Robust health throughout the year.',
        luckyColor: 'Yellow & Saffron Gold',
        luckyNumber: '3, 12, 21',
        luckyTime: 'November – December 2026',
        luckyGem: 'Yellow Sapphire (Pukhraj)',
        remedies: [
          'Wear a natural 5-Ratti Ceylon Yellow Sapphire in gold on Thursday morning.',
          'Perform Guru Puja on Purnima tithis.',
        ],
      },
    },
  },
  capricorn: {
    name: 'Capricorn',
    sanskrit: 'Makara Rashi',
    lord: 'Saturn (Shani)',
    element: 'Earth',
    quality: 'Movable (Chara)',
    icon: '♑',
    sadeSatiStatus: 'Final Phase (Setting Sade Sati - Harvest Phase)',
    sadeSatiBadge: 'Final Phase',
    periods: {
      daily: {
        periodLabel: "Today's Daily Moon Rashifal",
        badgeTag: 'Today - Aug 28, 2026',
        overview: 'Disciplined labor, endurance, and practical mastery yield steady results today. Focus on long-term strategy and financial reserves.',
        transits: {
          saturn: 'Saturn in 2nd house consolidates financial savings.',
          jupiter: 'Jupiter in 8th house grants research insight.',
          rahuKetu: 'Rahu in 2nd house brings wealth opportunities.',
        },
        career: 'Authority in heavy industry, governance, architecture, and finance.',
        love: 'Devoted, reliable, and committed relationship tone.',
        wealth: 'Steady accumulation of permanent capital today.',
        health: 'Maintain joint mobility and bone strength with gentle exercise.',
        luckyColor: 'Steel Blue & Charcoal',
        luckyNumber: '8 & 17',
        luckyTime: '4:00 PM – 6:00 PM',
        luckyGem: 'Blue Sapphire (Neelam)',
        remedies: [
          'Chant "Om Sham Shanaishcharaya Namah" 11 times.',
          'Light a mustard oil lamp under Peepal tree in the evening.',
        ],
      },
      weekly: {
        periodLabel: 'Weekly Forecast (Current Week)',
        badgeTag: 'Aug 25 – Aug 31, 2026',
        overview: 'This week rewards patient labor, corporate organization, and disciplined speech. Financial reserves increase steadily.',
        transits: {
          saturn: 'Saturn ensures long-term security in bank balance.',
          jupiter: 'Jupiter brings hidden financial gains and inheritance support.',
          rahuKetu: 'Rahu sparks innovative income ideas.',
        },
        career: 'Solid progress in governance, construction, accounting, and industry.',
        love: 'Deep mutual respect and practical devotion.',
        wealth: 'Growth in fixed deposits and ancestral property value.',
        health: 'Good overall endurance.',
        luckyColor: 'Dark Blue & Slate Gray',
        luckyNumber: '8 & 26',
        luckyTime: 'Saturday 5:00 PM – 7:00 PM',
        luckyGem: 'Blue Sapphire / Amethyst',
        remedies: [
          'Donate black sesame seeds or oil on Saturday evening.',
          'Recite Shani Chalisa.',
        ],
      },
      monthly: {
        periodLabel: 'Monthly Forecast (August 2026)',
        badgeTag: 'August 2026',
        overview: 'August brings financial consolidation, harvest of past multi-year labor, and administrative authority for Capricorn natives.',
        transits: {
          saturn: 'Saturn in 2nd house builds solid wealth reserves.',
          jupiter: 'Jupiter in 8th house aids joint assets and research.',
          rahuKetu: 'Rahu-Ketu supports financial trade.',
        },
        career: 'Rise in corporate seniority and long-term project leadership.',
        love: 'Stable marital bond and family security.',
        wealth: 'Capital growth and debt clearance.',
        health: 'Good health through regular disciplined routine.',
        luckyColor: 'Charcoal & Royal Blue',
        luckyNumber: '8 & 17',
        luckyTime: 'Late August 2026',
        luckyGem: 'Blue Sapphire / Amethyst',
        remedies: [
          'Perform Shani Shanti Havan on Saturdays.',
          'Feed black dogs on Saturday evening.',
        ],
      },
      yearly: {
        periodLabel: 'Yearly Horoscope 2026 (Full Year Roadmap)',
        badgeTag: 'Full Year 2026',
        overview: '2026 marks the victorious harvest phase of your Sade Sati! Multi-year hard work culminates in major status, wealth, and permanent security.',
        transits: {
          saturn: 'Saturn in 2nd house consolidates massive long-term wealth.',
          jupiter: 'Jupiter in 8th house grants inheritance and deep wisdom.',
          rahuKetu: 'Rahu-Ketu supports modern financial technology.',
        },
        career: 'Senior corporate appointments, government positions, or expansion of major business enterprises in 2026.',
        love: 'Committed, enduring marriage and strong family unity.',
        wealth: 'Substantial rise in net worth, land, and permanent reserves.',
        health: 'Good stamina and physical endurance.',
        luckyColor: 'Steel Blue & Charcoal',
        luckyNumber: '8, 17, 26',
        luckyTime: 'October – December 2026',
        luckyGem: 'Blue Sapphire (Neelam)',
        remedies: [
          'Wear a genuine 5-Ratti Ceylon Blue Sapphire or Amethyst in silver on Saturday evening after consultation.',
          'Serve elderly or underprivileged workers regularly.',
        ],
      },
    },
  },
  aquarius: {
    name: 'Aquarius',
    sanskrit: 'Kumbha Rashi',
    lord: 'Saturn (Shani)',
    element: 'Air',
    quality: 'Fixed (Sthira)',
    icon: '♒',
    sadeSatiStatus: 'Peak Phase (Janma Shani Transit)',
    sadeSatiBadge: 'Peak Phase',
    periods: {
      daily: {
        periodLabel: "Today's Daily Moon Rashifal",
        badgeTag: 'Today - Aug 28, 2026',
        overview: 'Deep self-restructuring, humanitarian leadership, and technological innovation shape your path today. Focus on mental clarity and personal discipline.',
        transits: {
          saturn: 'Saturn in 1st house demands personal discipline.',
          jupiter: 'Jupiter in 7th house blesses commercial contracts.',
          rahuKetu: 'Rahu in 1st house sparks visionary ideas.',
        },
        career: 'Breakthroughs in innovation, scientific research, social organizations, and tech engineering.',
        love: 'Jupiter transit brings harmony and romantic renewal.',
        wealth: 'Long-term corporate gains. Avoid hasty spending.',
        health: 'Practice daily Pranayama and maintain adequate rest.',
        luckyColor: 'Electric Blue & Violet',
        luckyNumber: '8 & 26',
        luckyTime: '2:00 PM – 4:30 PM',
        luckyGem: 'Blue Sapphire / Amethyst',
        remedies: [
          'Recite Shani Chalisa.',
          'Light a mustard oil lamp before Lord Shani.',
        ],
      },
      weekly: {
        periodLabel: 'Weekly Forecast (Current Week)',
        badgeTag: 'Aug 25 – Aug 31, 2026',
        overview: 'Personal growth, commercial partnerships, and technology innovation are highlighted this week. Stay patient and focused.',
        transits: {
          saturn: 'Saturn refines your personality and leadership focus.',
          jupiter: 'Jupiter protects commercial contracts and marital joy.',
          rahuKetu: 'Rahu urges clear communication.',
        },
        career: 'Solid achievements in software, engineering, social service, and consultancy.',
        love: 'Harmonious communication with partner. Marriage prospects for singles.',
        wealth: 'Steady corporate earnings and partnership gains.',
        health: 'Maintain proper sleep hygiene.',
        luckyColor: 'Royal Blue & Purple',
        luckyNumber: '8 & 17',
        luckyTime: 'Saturday 4:00 PM – 6:30 PM',
        luckyGem: 'Amethyst',
        remedies: [
          'Donate blue clothes or footwear on Saturday.',
          'Chant "Om Sham Shanaishcharaya Namah".',
        ],
      },
      monthly: {
        periodLabel: 'Monthly Forecast (August 2026)',
        badgeTag: 'August 2026',
        overview: 'August brings major business contract approvals, public acclaim, and technological milestones for Aquarius natives.',
        transits: {
          saturn: 'Saturn in 1st house builds unbreakable mental fortitude.',
          jupiter: 'Jupiter in 7th house expands corporate partnerships.',
          rahuKetu: 'Rahu-Ketu supports global technology.',
        },
        career: 'Elevation in public standing, senior roles, and innovative projects.',
        love: 'Splendid marital harmony and romantic travel.',
        wealth: 'Long-term business gains and investment growth.',
        health: 'Good stamina with daily morning routine.',
        luckyColor: 'Electric Blue & Silver',
        luckyNumber: '8 & 26',
        luckyTime: 'Mid August 2026',
        luckyGem: 'Amethyst / Blue Sapphire',
        remedies: [
          'Perform Shani Shanti Path on Saturdays.',
          'Serve physically disabled persons with food.',
        ],
      },
      yearly: {
        periodLabel: 'Yearly Horoscope 2026 (Full Year Roadmap)',
        badgeTag: 'Full Year 2026',
        overview: '2026 is a year of major personal transformation, corporate leadership, and commercial partnership success for Aquarius natives.',
        transits: {
          saturn: 'Saturn in 1st house refines your life purpose and character.',
          jupiter: 'Jupiter in 7th house bestows auspicious marriage and business growth.',
          rahuKetu: 'Rahu-Ketu supports futuristic technology and global reach.',
        },
        career: 'Executive leadership, corporate founding, or scientific achievements in 2026.',
        love: 'Highly auspicious year for marriage, public goodwill, and deep marital unity.',
        wealth: 'Substantial business expansion and asset security.',
        health: 'Good health with disciplined lifestyle.',
        luckyColor: 'Electric Blue & Violet',
        luckyNumber: '8, 17, 26',
        luckyTime: 'August – December 2026',
        luckyGem: 'Natural Amethyst or Blue Sapphire',
        remedies: [
          'Wear a genuine 7-Ratti African Amethyst in silver on Saturday evening.',
          'Recite Hanuman Chalisa daily.',
        ],
      },
    },
  },
  pisces: {
    name: 'Pisces',
    sanskrit: 'Meena Rashi',
    lord: 'Jupiter (Guru)',
    element: 'Water',
    quality: 'Dual (Dwiswabhava)',
    icon: '♓',
    sadeSatiStatus: 'First Phase (Rising Sade Sati)',
    sadeSatiBadge: 'Rising Phase',
    periods: {
      daily: {
        periodLabel: "Today's Daily Moon Rashifal",
        badgeTag: 'Today - Aug 28, 2026',
        overview: 'Intuitive wisdom, compassion, and foreign opportunities bring spiritual and career evolution today. Follow your inner guidance.',
        transits: {
          saturn: 'Saturn in 12th house invites introspection and foreign travel.',
          jupiter: 'Jupiter in 6th house grants victory over health and work obstacles.',
          rahuKetu: 'Rahu in 12th house aids overseas endeavors.',
        },
        career: 'Success in arts, healing, psychology, maritime business, and international trade.',
        love: 'Compassionate, soulful connection with your partner.',
        wealth: 'Gains through international projects and spiritual teaching.',
        health: 'Prioritize deep sleep and peaceful surroundings.',
        luckyColor: 'Sea Green & Golden Yellow',
        luckyNumber: '3 & 21',
        luckyTime: '10:00 AM – 12:30 PM',
        luckyGem: 'Yellow Sapphire (Pukhraj)',
        remedies: [
          'Chant "Om Gurave Namah" 11 times.',
          'Offer yellow flowers at Vishnu temple.',
        ],
      },
      weekly: {
        periodLabel: 'Weekly Forecast (Current Week)',
        badgeTag: 'Aug 25 – Aug 31, 2026',
        overview: 'This week emphasizes spiritual peace, health recovery, and international assignments for Pisces natives.',
        transits: {
          saturn: 'Saturn encourages wise expense management.',
          jupiter: 'Jupiter shields you against work disputes.',
          rahuKetu: 'Rahu aids overseas connections.',
        },
        career: 'Solid breakthroughs in research, healing arts, foreign trade, and creative writing.',
        love: 'Deep emotional empathy and supportive partner dynamics.',
        wealth: 'Steady income. Good time to invest in health or foreign bonds.',
        health: 'Good recovery and mental serenity.',
        luckyColor: 'Yellow & Light Turquoise',
        luckyNumber: '3 & 12',
        luckyTime: 'Thursday 11:00 AM – 1:30 PM',
        luckyGem: 'Yellow Sapphire (Pukhraj)',
        remedies: [
          'Donate yellow sweets or banana on Thursday morning.',
          'Chant Vishnu Sahasranama.',
        ],
      },
      monthly: {
        periodLabel: 'Monthly Forecast (August 2026)',
        badgeTag: 'August 2026',
        overview: 'August brings international prospects, spiritual growth, and victory over competitive obstacles for Pisces natives.',
        transits: {
          saturn: 'Saturn in 12th house supports foreign travel.',
          jupiter: 'Jupiter in 6th house guarantees health recovery.',
          rahuKetu: 'Rahu-Ketu supports global projects.',
        },
        career: 'Recognition in creative fields, healthcare, global trade, and academics.',
        love: 'Harmonious domestic life and spiritual travel with partner.',
        wealth: 'Capital growth through international sources.',
        health: 'Strong immunity and restful sleep.',
        luckyColor: 'Sea Green & Yellow Gold',
        luckyNumber: '3 & 21',
        luckyTime: 'Mid August 2026',
        luckyGem: 'Yellow Sapphire (Pukhraj)',
        remedies: [
          'Perform Vishnu Puja on Thursdays.',
          'Keep a vessel of water near your bed for spiritual peace.',
        ],
      },
      yearly: {
        periodLabel: 'Yearly Horoscope 2026 (Full Year Roadmap)',
        badgeTag: 'Full Year 2026',
        overview: '2026 is a year of profound spiritual evolution, international opportunities, and health resolution for Pisces natives.',
        transits: {
          saturn: 'Saturn in 12th house guides international travel and spiritual peace.',
          jupiter: 'Jupiter in 6th house bestows victory over opposition and physical healing.',
          rahuKetu: 'Rahu-Ketu aids global enterprise.',
        },
        career: 'Breakthroughs in international trade, medicine, fine arts, and spiritual teaching in 2026.',
        love: 'Soulful, compassionate marriage and family joy.',
        wealth: 'International revenue growth and sound capital investments.',
        health: 'Good overall health and spiritual inner peace.',
        luckyColor: 'Sea Green & Golden Yellow',
        luckyNumber: '3, 12, 21',
        luckyTime: 'November – December 2026',
        luckyGem: 'Yellow Sapphire (Pukhraj)',
        remedies: [
          'Wear a genuine 5.5-Ratti Yellow Sapphire in gold on Thursday morning.',
          'Perform Vishnu Sahasranama Path weekly.',
        ],
      },
    },
  },
};

function getSignDetails(signKey: string): SignData {
  const normalized = signKey.toLowerCase().trim();
  if (ALL_SIGN_DATA[normalized]) {
    return ALL_SIGN_DATA[normalized];
  }
  return ALL_SIGN_DATA['aries'];
}

export default function MoonSignForecastPage({ params }: { params: Promise<{ sign: string }> }) {
  const [resolvedSign, setResolvedSign] = useState<string>('aries');
  const [activePeriod, setActivePeriod] = useState<PeriodType>('daily');

  React.useEffect(() => {
    params.then((p) => {
      if (p.sign) setResolvedSign(p.sign);
    });
  }, [params]);

  const data = getSignDetails(resolvedSign);
  const periodData = data.periods[activePeriod];

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#0f172a] flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Top Back Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/horoscope"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fef3c7] border border-[#fde68a] text-[#b45309] font-extrabold text-sm hover:bg-[#b45309] hover:text-white transition-all shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View All 12 Moon Signs</span>
          </Link>

          <span className="text-sm font-bold text-gray-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#d97706]" />
            <span>Updated Daily for Vedic Astrology Accuracy</span>
          </span>
        </div>

        {/* Hero Sign Header (with BIGGER readable text) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-sm relative overflow-hidden space-y-6">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#f59e0b]" />

          <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-[#fef3c7] border-2 border-[#fde68a] flex items-center justify-center text-5xl text-[#d97706] shadow-xs shrink-0">
                {data.icon}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-serif font-extrabold text-4xl sm:text-5xl text-[#0f172a] leading-tight">
                    {data.name} <span className="text-[#b45309] font-serif">Horoscope</span>
                  </h1>
                  <span className="px-3 py-1 rounded-full bg-[#fef3c7] text-[#b45309] text-xs font-extrabold uppercase border border-[#fde68a]">
                    {data.element} Element
                  </span>
                </div>
                <p className="text-base sm:text-lg font-bold text-[#b45309] mt-1">
                  {data.sanskrit} • Lord: {data.lord} • {data.quality}
                </p>
              </div>
            </div>

            {/* Sade Sati Indicator */}
            <div className="bg-[#fefcf6] px-6 py-3.5 rounded-2xl border-2 border-[#fde68a] text-left sm:text-right shrink-0">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-0.5">Saturn Sade Sati Status</span>
              <span className="text-sm sm:text-base font-extrabold text-[#b45309]">{data.sadeSatiStatus}</span>
            </div>
          </div>

          {/* PERIOD SELECTOR TABS (Daily, Weekly, Monthly, Yearly) */}
          <div className="pt-2 border-t border-[#f3e8d2]">
            <label className="block text-xs font-extrabold uppercase tracking-widest text-[#b45309] mb-3">
              SELECT FORECAST TIME PERIOD:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(
                [
                  { id: 'daily', label: '☀️ Daily', sub: 'Today Rashifal' },
                  { id: 'weekly', label: '📅 Weekly', sub: '7-Day Transit' },
                  { id: 'monthly', label: '🗓️ Monthly', sub: 'August 2026' },
                  { id: 'yearly', label: '✨ Yearly', sub: '2026 Roadmap' },
                ] as const
              ).map((tab) => {
                const isActive = activePeriod === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePeriod(tab.id)}
                    className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      isActive
                        ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white border-[#d97706] shadow-md scale-[1.02]'
                        : 'bg-[#fefcf6] border-[#fde68a] text-gray-700 hover:bg-[#fef3c7] hover:text-[#b45309]'
                    }`}
                  >
                    <span className="font-serif font-extrabold text-base sm:text-lg block leading-tight">
                      {tab.label}
                    </span>
                    <span className={`text-[11px] font-semibold block mt-0.5 ${isActive ? 'text-amber-100' : 'text-gray-500'}`}>
                      {tab.sub}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Period Overview Banner (BIGGER Readable Text) */}
          <div className="p-6 rounded-2xl bg-[#fefcf6] border-2 border-[#fde68a]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#b45309] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#d97706]" />
                <span>{periodData.periodLabel}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-[#fde68a] text-[#78350f] text-xs font-extrabold">
                {periodData.badgeTag}
              </span>
            </div>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-medium mt-1">
              {periodData.overview}
            </p>
          </div>
        </div>

        {/* Key Planetary Transits Box (BIGGER Readable Text) */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#0f172a]">Key Planetary Transits & Planetary Themes</h2>
              <p className="text-sm text-gray-600">Influence of Saturn, Jupiter, & Rahu-Ketu during this period</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
            <div className="p-5 sm:p-6 rounded-2xl bg-[#fefcf6] border border-[#f3e8d2] space-y-2">
              <span className="font-bold text-[#b45309] text-base sm:text-lg block">🪐 Saturn Transit</span>
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">{periodData.transits.saturn}</p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#fefcf6] border border-[#f3e8d2] space-y-2">
              <span className="font-bold text-[#b45309] text-base sm:text-lg block">🌟 Jupiter Transit</span>
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">{periodData.transits.jupiter}</p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#fefcf6] border border-[#f3e8d2] space-y-2">
              <span className="font-bold text-[#b45309] text-base sm:text-lg block">🐲 Rahu-Ketu Axis</span>
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">{periodData.transits.rahuKetu}</p>
            </div>
          </div>
        </div>

        {/* Life Aspects 4-Grid (BIGGER Readable Text) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Career */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Career & Business</h3>
            </div>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-normal">{periodData.career}</p>
          </div>

          {/* Love */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Love & Relationships</h3>
            </div>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-normal">{periodData.love}</p>
          </div>

          {/* Wealth */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Finance & Wealth</h3>
            </div>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-normal">{periodData.wealth}</p>
          </div>

          {/* Health */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3e8d2] shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-[#0f172a]">Health & Vitality</h3>
            </div>
            <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-normal">{periodData.health}</p>
          </div>

        </div>

        {/* Remedies & Lucky Factors Card (BIGGER Readable Text) */}
        <div className="bg-[#fef3c7] p-6 sm:p-8 rounded-3xl border-2 border-[#fde68a] space-y-6">
          <div className="flex items-center gap-3 text-[#b45309]">
            <ShieldAlert className="w-7 h-7 shrink-0" />
            <h3 className="font-serif font-bold text-2xl sm:text-3xl">Prescribed Vedic Remedies & Lucky Factors</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-7 space-y-3 text-sm sm:text-base text-[#78350f]">
              {periodData.remedies.map((rem, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white/70 p-4 rounded-2xl border border-[#fde68a] shadow-2xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <span className="font-semibold text-gray-900 leading-relaxed">{rem}</span>
                </div>
              ))}
            </div>

            <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-[#fde68a] text-sm font-sans space-y-4 shadow-xs">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Lucky Color</span>
                <span className="font-extrabold text-base text-[#0f172a]">{periodData.luckyColor}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Lucky Number</span>
                <span className="font-extrabold text-base text-[#0f172a]">{periodData.luckyNumber}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Auspicious Time</span>
                <span className="font-extrabold text-base text-emerald-700">{periodData.luckyTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Recommended Gemstone</span>
                <span className="font-extrabold text-base text-[#b45309]">{periodData.luckyGem}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA to Consultation */}
        <div className="text-center bg-white p-8 sm:p-10 rounded-3xl border border-[#f3e8d2] shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-3xl text-[#0f172a]">Want a Personalized Natal Chart Analysis?</h3>
          <p className="text-sm sm:text-base text-gray-700 max-w-xl mx-auto leading-relaxed">
            Moon Sign transits provide overall trends, but your precise birth time, Vimshottari Dasha, and Lagna chart determine your specific timing.
          </p>
          <div className="pt-2">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-extrabold text-base shadow-md hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <span>Book 1-on-1 Consultation Session</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
