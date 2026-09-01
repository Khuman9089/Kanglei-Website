'use client';

import React, { useState } from 'react';

interface FreeReportSectionProps {
  name: string;
  gender: string;
  ascendantSignName?: string;
  moonSignName?: string;
  sunSignName?: string;
  isLight?: boolean;
}

export function FreeReportSection({
  name,
  gender,
  ascendantSignName = 'Taurus',
  moonSignName = 'Cancer',
  sunSignName = 'Leo',
  isLight = true,
}: FreeReportSectionProps) {
  const [subTab, setSubTab] = useState<'ascendant' | 'general' | 'remedies' | 'dosha' | 'planetary' | 'vimshottari' | 'yoga'>('ascendant');

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Sub-Navigation Pill Switches Bar (Matching Reference Image) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 border-b border-amber-200/50 pb-3">
        {/* Left Sub-Group */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-full p-1.5 shadow-xs">
          {[
            { id: 'general', label: 'General' },
            { id: 'remedies', label: 'Remedies' },
            { id: 'dosha', label: 'Dosha' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id as any)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                subTab === t.id
                  ? 'bg-[#fef08a] text-slate-900 shadow-xs border border-[#facc15]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-amber-100/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Right Sub-Group */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-full p-1.5 shadow-xs">
          {[
            { id: 'ascendant', label: 'Ascendant' },
            { id: 'planetary', label: 'Planetary' },
            { id: 'vimshottari', label: 'Vimshottari' },
            { id: 'yoga', label: 'Yoga' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id as any)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                subTab === t.id
                  ? 'bg-[#fef08a] text-slate-900 shadow-xs border border-[#facc15]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-amber-100/50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUB-TAB 1: ASCENDANT PREDICTIONS */}
      {subTab === 'ascendant' && (
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs space-y-4 ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
        }`}>
          <h3 className="font-sans font-bold text-lg sm:text-xl text-slate-900 dark:text-white border-b border-slate-100 pb-2">
            Ascendant Predictions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* CARD 1: Description */}
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2.5">
              <h4 className="font-sans font-bold text-base sm:text-lg text-slate-900">Description</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Ascendant is one of the most sought concepts in astrology when it comes to predicting the minute events in your life. At the time of birth, the sign that rises in the sky is the person&apos;s ascendant. It helps in making predictions about minute life events, unlike weekly or monthly sun sign readings.
              </p>
              <span className="text-sm font-bold text-[#b45309] block pt-1">
                Your ascendant is {ascendantSignName}.
              </span>
            </div>

            {/* CARD 2: Personality */}
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2.5">
              <h4 className="font-sans font-bold text-base sm:text-lg text-slate-900">Personality</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Those born with the {ascendantSignName} ascendant are relatively introverted, despite representing strength and perseverance. You prefer creating your own peaceful world with comfort, beauty, and emotional stability. You possess a great sense of loyalty, steady humor, and deep determination.
              </p>
            </div>

            {/* CARD 3: Physical */}
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2.5">
              <h4 className="font-sans font-bold text-base sm:text-lg text-slate-900">Physical Appearance</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Ruled by Venus, {ascendantSignName} ascendants possess a solid, well-proportioned physique, expressive luminous eyes, and a graceful facial structure. You carry a charming persona with powerful presence and natural elegance.
              </p>
            </div>

            {/* CARD 4: Health */}
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2.5">
              <h4 className="font-sans font-bold text-base sm:text-lg text-slate-900">Health Outlook</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                {ascendantSignName} natives usually enjoy robust physical stamina for most of their lives. Sensitive areas include throat, neck, and nervous system strain under prolonged stress. Regular throat care and balanced sleep maintain peak vitality.
              </p>
            </div>

            {/* CARD 5: Career */}
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2.5">
              <h4 className="font-sans font-bold text-base sm:text-lg text-slate-900">Career & Finance</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                You are eager to put in consistent hard work and persevere to achieve long-term wealth. Excellence is achieved in administration, financial management, real estate, arts, luxury trades, and strategic advisory.
              </p>
            </div>

            {/* CARD 6: Relationship */}
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2.5">
              <h4 className="font-sans font-bold text-base sm:text-lg text-slate-900">Relationship & Marriage</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                In personal relationships, {ascendantSignName} rising individuals seek deep affection, emotional security, and unshakeable fidelity. You move cautiously before trusting partners but remain steadfastly devoted for life.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GENERAL PREDICTIONS */}
      {subTab === 'general' && (
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs space-y-4 ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
        }`}>
          <h3 className="font-sans font-bold text-lg sm:text-xl text-slate-900 dark:text-white border-b border-slate-100 pb-2">
            General Vedic Horoscope Predictions
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2">
              <h4 className="font-sans font-bold text-base text-[#b45309]">Moon Sign (Rashi) Influence - {moonSignName}</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Your Moon sign in {moonSignName} highlights an empathetic, intuitive, and emotionally nurturing mind. You possess a strong memory, deep attachment to family, and creative problem-solving skills.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2">
              <h4 className="font-sans font-bold text-base text-[#b45309]">Sun Sign Energy - {sunSignName}</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                The Sun in {sunSignName} grants leadership drive, self-respect, and creative expression. You naturally command respect in group environments and inspire confidence in colleagues.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2">
              <h4 className="font-sans font-bold text-base text-[#b45309]">Temperament & Moral Values</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Guided by Deva Gana and Water element, your temperament balances high ethical integrity with warm compassion. You dislike deception and value transparent communication.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2">
              <h4 className="font-sans font-bold text-base text-[#b45309]">Key Life Philosophy</h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Steadfastness over speed. Building solid foundations in family wealth and spiritual discipline will ensure lifetime peace and legacy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: REMEDIES */}
      {subTab === 'remedies' && (
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs space-y-4 ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
        }`}>
          <h3 className="font-sans font-bold text-lg sm:text-xl text-slate-900 dark:text-white border-b border-slate-100 pb-2">
            Prescribed Astrological Remedies & Fasting Routines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-amber-200/70 space-y-2">
              <h4 className="font-bold text-base text-[#b45309]">💎 Recommended Gemstone</h4>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                <strong>Yellow Sapphire (Pukhraj) 5.25 Ratti</strong> set in Gold ring on Index Finger of right hand, worn on Thursday morning after purifying with Panchamrut.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-amber-200/70 space-y-2">
              <h4 className="font-bold text-base text-[#b45309]">📿 Rudraksha Recommendation</h4>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                <strong>5-Mukhi Nepali Rudraksha Mala (108+1 Beads)</strong> for emotional stability, BP control, and mental peace.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-amber-200/70 space-y-2">
              <h4 className="font-bold text-base text-[#b45309]">🕉️ Daily Mantra Recitation</h4>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium font-serif">
                Recite &ldquo;Om Namah Shivaya&rdquo; or &ldquo;Mahamrityunjaya Mantra&rdquo; 108 times daily at sunrise.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-amber-200/70 space-y-2">
              <h4 className="font-bold text-base text-[#b45309]">🙏 Charity & Vrat (Fasting)</h4>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                Donate yellow lentils (chana dal) and ghee on Thursdays. Observe light vegetarian fasting on Mondays for Lord Shiva grace.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: DOSHA ANALYSIS */}
      {subTab === 'dosha' && (
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs space-y-4 ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
        }`}>
          <h3 className="font-sans font-bold text-lg sm:text-xl text-slate-900 dark:text-white border-b border-slate-100 pb-2">
            Vedic Dosha Analysis & Nullification Reports
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Manglik Dosh */}
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-slate-900">Manglik Dosh Analysis</h4>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  NO DOSHA
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Mars is placed in favorable 3rd house from Moon. No severe Manglik Dosh is present in your D1 or D9 charts.
              </p>
            </div>

            {/* Kalsarpa Dosh */}
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-slate-900">Kalsarpa Dosh Analysis</h4>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  NO DOSHA
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Planets are distributed on both sides of Rahu-Ketu axis. Kalsarpa Yoga is absent.
              </p>
            </div>

            {/* Sade Sati */}
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-slate-900">Saturn Sade Sati Status</h4>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  MODERATE PHASING
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Saturn transits currently 9th house from Moon. Perform Hanuman Chalisa recitation on Saturdays for total protection.
              </p>
            </div>

            {/* Pitru Dosh */}
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-slate-900">Pitru Dosh Check</h4>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  NEUTRAL / NO DOSHA
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Sun and Rahu are well-separated in D1 chart. Ancestral blessings remain supportive.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: PLANETARY PREDICTIONS */}
      {subTab === 'planetary' && (
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs space-y-4 ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
        }`}>
          <h3 className="font-sans font-bold text-lg sm:text-xl text-slate-900 dark:text-white border-b border-slate-100 pb-2">
            House Placement Predictions for All 9 Grahas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              { p: 'Sun', house: 'House 3', sign: 'Leo', desc: 'Grants high courage, strong willpower, and leadership support from authority figures.' },
              { p: 'Moon', house: 'House 11', sign: 'Cancer', desc: 'Brings steady gains through creative arts, friendship circles, and maternal blessings.' },
              { p: 'Mars', house: 'House 1', sign: 'Gemini', desc: 'Bestows active physical drive, sharpness in debate, and athletic vitality.' },
              { p: 'Mercury', house: 'House 2', sign: 'Gemini', desc: 'Gives sweet persuasive speech, quick financial calculations, and diplomatic wisdom.' },
              { p: 'Jupiter', house: 'House 3', sign: 'Cancer', desc: 'Exalted placement strengthening wisdom, noble advisory skills, and spiritual writings.' },
              { p: 'Venus', house: 'House 5', sign: 'Virgo', desc: 'Enhances artistic creativity, interest in mantras, and romantic charm.' },
              { p: 'Saturn', house: 'House 11', sign: 'Pisces', desc: 'Ensures long-term wealth accumulation, disciplined savings, and elderly support.' },
              { p: 'Rahu', house: 'House 10', sign: 'Aquarius', desc: 'Drives ambition for technology, public fame, and innovative career pathways.' },
              { p: 'Ketu', house: 'House 4', sign: 'Leo', desc: 'Encourages spiritual detachment at home and inclination towards inner meditation.' },
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#fffdfa] border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-base text-[#b45309]">{item.p}</h4>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                    {item.house} ({item.sign})
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 6: VIMSHOTTARI PREDICTIONS */}
      {subTab === 'vimshottari' && (
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs space-y-4 ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
        }`}>
          <h3 className="font-sans font-bold text-lg sm:text-xl text-slate-900 dark:text-white border-b border-slate-100 pb-2">
            Vimshottari Dasha Current Period Outlook
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-amber-200/70 space-y-2">
              <h4 className="font-bold text-base text-[#b45309]">Running Mahadasha Period</h4>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                <strong>Jupiter Mahadasha (16 Years)</strong> is active. Jupiter is exalted in your birth chart, opening new doors for financial growth, spiritual wisdom, higher education, and auspicious family celebrations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-amber-200/70 space-y-2">
              <h4 className="font-bold text-base text-[#b45309]">Running Antardasha Window</h4>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                <strong>Jupiter - Venus Antardasha</strong>: Highly favorable period for marriage matching, career promotions, real estate investments, and creative projects.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: YOGAS ANALYSIS */}
      {subTab === 'yoga' && (
        <div className={`p-5 sm:p-6 rounded-3xl border shadow-xs space-y-4 ${
          isLight ? 'bg-white border-slate-200/90' : 'bg-[#1c2541] border-[#3a506b]'
        }`}>
          <h3 className="font-sans font-bold text-lg sm:text-xl text-slate-900 dark:text-white border-b border-slate-100 pb-2">
            Special Auspicious Yogas in Birth Chart
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-emerald-900">✨ Gajakesari Yoga</h4>
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">PRESENT</span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Jupiter and Moon are in mutual Kendra aspect. Grants high intelligence, spotless reputation, lasting prosperity, and public respect.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-emerald-900">💰 Budhaditya Yoga</h4>
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">PRESENT</span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Sun and Mercury placed together in 2nd house. Bestows sharp analytical acumen, fluency in speech, and career success in commerce.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-emerald-900">👑 Dhana Yoga</h4>
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">PRESENT</span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                2nd Lord Mercury and 11th Lord Saturn form mutually supportive aspects, ensuring continuous financial inflow throughout life.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fffdfa] border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-emerald-900">🌸 Amala Yoga</h4>
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">PRESENT</span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                Benefic planet Venus occupies 10th house from Moon. Ensures clean professional reputation and philanthropic nature.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FreeReportSection;
