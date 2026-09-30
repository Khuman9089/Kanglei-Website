import React from 'react';
import { ImageResponse } from 'next/og';

export function generateDailyRashifalImage(dateStr?: string): ImageResponse {
  let targetDate = new Date();
  if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    targetDate = new Date(dateStr + 'T12:00:00Z');
  } else {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    targetDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
  }

  const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
  const formattedDate = targetDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#090d16',
          padding: '48px 56px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle Warm Amber Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '640px',
            height: '320px',
            backgroundColor: 'rgba(217, 119, 6, 0.22)',
            filter: 'blur(90px)',
            borderRadius: '50%',
          }}
        />

        {/* Top Header Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 24px',
              borderRadius: '999px',
              backgroundColor: 'rgba(254, 243, 199, 0.12)',
              border: '1px solid rgba(253, 230, 138, 0.35)',
            }}
          >
            <span style={{ color: '#fbbf24', fontSize: '24px' }}>✨</span>
            <span
              style={{
                color: '#fef3c7',
                fontSize: '22px',
                fontWeight: '800',
                letterSpacing: '1px',
              }}
            >
              ꯀꯨꯊꯤꯌꯦꯡꯐꯝ • KuthiYengpham.in
            </span>
          </div>

          <div
            style={{
              color: '#f59e0b',
              fontSize: '18px',
              fontWeight: '700',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Daily Vedic Forecast
          </div>
        </div>

        {/* Center: "Ngasi gi Rashifal" & Highlighted Date */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              fontSize: '76px',
              fontWeight: '900',
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span>Ngasi gi</span>
            <span
              style={{
                background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Rashifal
            </span>
          </div>

          {/* Simple Clean Date Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 36px',
              borderRadius: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1.5px solid rgba(245, 158, 11, 0.5)',
              color: '#fef3c7',
              fontSize: '32px',
              fontWeight: '800',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)',
            }}
          >
            <span>📅</span>
            <span>{formattedDate}, {dayName}</span>
          </div>

          <div
            style={{
              color: '#cbd5e1',
              fontSize: '22px',
              fontWeight: '500',
              marginTop: '4px',
            }}
          >
            Rashi 1 dagi 12 faobagi Serial-wise Forecast in Romanized Manipuri
          </div>
        </div>

        {/* 12 Zodiac Symbols (Symbols Only - No Rashi Names) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '28px',
            width: '100%',
            padding: '16px 20px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: '#fbbf24',
            fontSize: '32px',
          }}
        >
          <span>♈</span>
          <span>♉</span>
          <span>♊</span>
          <span>♋</span>
          <span>♌</span>
          <span>♍</span>
          <span>♎</span>
          <span>♏</span>
          <span>♐</span>
          <span>♑</span>
          <span>♒</span>
          <span>♓</span>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            color: '#94a3b8',
            fontSize: '17px',
            fontWeight: '600',
          }}
        >
          <span>Thabak • Sen-thum • Nungsiba • Haksel • Daily Upay</span>
          <span style={{ color: '#fbbf24' }}>kuthiyengpham.in/daily-rashifal</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
