// Astronomical Sun and Solar Time Calculations (Jean Meeus / NOAA Algorithms)

export const RAD2DEG = 180 / Math.PI;
export const DEG2RAD = Math.PI / 180;

export function toJulianDay(year: number, month: number, day: number, hourUtc: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = day + hourUtc / 24;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFrac + B - 1524.5;
}

export function julianCenturies(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}

// Normalize angle to [0, 360)
export function normalize360(deg: number): number {
  let res = deg % 360;
  if (res < 0) res += 360;
  return res;
}

// Greenwich Mean Sidereal Time in degrees
export function calculateGMST(jd: number): number {
  const T = julianCenturies(jd);
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000;
  return normalize360(gmst);
}

// Local Sidereal Time in degrees
export function calculateLST(jd: number, longitude: number): number {
  const gmst = calculateGMST(jd);
  return normalize360(gmst + longitude);
}

export interface SolarTimes {
  sunrise: { hour: number; minute: number; str: string; dateObj: Date };
  sunset: { hour: number; minute: number; str: string; dateObj: Date };
  solarNoon: { hour: number; minute: number; str: string; dateObj: Date };
  dayLengthMinutes: number;
}

// Calculate Sunrise and Sunset times accurately for any location and date
export function calculateSunTimes(
  year: number,
  month: number,
  day: number,
  lat: number,
  lng: number,
  tzOffsetHours: number
): SolarTimes {
  // Approximate day of year
  const N1 = Math.floor((275 * month) / 9);
  const N2 = Math.floor((month + 9) / 12);
  const N3 = 1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3);
  const N = N1 - N2 * N3 + day - 30;

  // Approximate sunrise
  const lngHour = lng / 15;
  const tSunrise = N + (6 - lngHour) / 24;
  const tSunset = N + (18 - lngHour) / 24;

  const computeTime = (t: number, isSunrise: boolean) => {
    // Sun's mean anomaly
    const M = 0.9856 * t - 3.289;
    // Sun's true longitude
    let L = M + 1.916 * Math.sin(M * DEG2RAD) + 0.020 * Math.sin(2 * M * DEG2RAD) + 282.634;
    L = normalize360(L);

    // Sun's right ascension
    let RA = RAD2DEG * Math.atan(0.91764 * Math.tan(L * DEG2RAD));
    RA = normalize360(RA);

    // Right ascension value needs to be in the same quadrant as L
    const Lquadrant = Math.floor(L / 90) * 90;
    const RAquadrant = Math.floor(RA / 90) * 90;
    RA = RA + (Lquadrant - RAquadrant);
    RA = RA / 15;

    // Sun's declination
    const sinDec = 0.39782 * Math.sin(L * DEG2RAD);
    const cosDec = Math.cos(Math.asin(sinDec));

    // Sun's local hour angle (zenith = 90.8333 deg for standard refraction)
    const zenith = 90.8333 * DEG2RAD;
    const cosH = (Math.cos(zenith) - sinDec * Math.sin(lat * DEG2RAD)) / (cosDec * Math.cos(lat * DEG2RAD));

    let H: number;
    if (cosH > 1) {
      // Polar night
      H = isSunrise ? 0 : 0;
    } else if (cosH < -1) {
      // Midnight sun
      H = isSunrise ? 0 : 24;
    } else {
      H = isSunrise ? 360 - RAD2DEG * Math.acos(cosH) : RAD2DEG * Math.acos(cosH);
      H = H / 15;
    }

    // Local Mean Time of event
    const T = H + RA - 0.06571 * t - 6.622;
    // UTC time
    let UT = normalize24(T - lngHour);
    // Local time
    let localHour = normalize24(UT + tzOffsetHours);

    const hour = Math.floor(localHour);
    const minute = Math.floor((localHour - hour) * 60);

    const d = new Date(Date.UTC(year, month - 1, day, Math.floor(UT), Math.floor((UT - Math.floor(UT)) * 60)));

    return {
      hour,
      minute,
      totalHours: localHour,
      str: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      dateObj: d,
    };
  };

  const rise = computeTime(tSunrise, true);
  const set = computeTime(tSunset, false);

  let dayLengthHours = set.totalHours - rise.totalHours;
  if (dayLengthHours < 0) dayLengthHours += 24;
  const dayLengthMinutes = Math.round(dayLengthHours * 60);

  const solarNoonHours = normalize24(rise.totalHours + dayLengthHours / 2);
  const noonHour = Math.floor(solarNoonHours);
  const noonMinute = Math.floor((solarNoonHours - noonHour) * 60);

  return {
    sunrise: { hour: rise.hour, minute: rise.minute, str: rise.str, dateObj: rise.dateObj },
    sunset: { hour: set.hour, minute: set.minute, str: set.str, dateObj: set.dateObj },
    solarNoon: {
      hour: noonHour,
      minute: noonMinute,
      str: `${String(noonHour).padStart(2, '0')}:${String(noonMinute).padStart(2, '0')}`,
      dateObj: new Date(Date.UTC(year, month - 1, day, Math.floor(solarNoonHours - tzOffsetHours), noonMinute)),
    },
    dayLengthMinutes,
  };
}

export function normalize24(h: number): number {
  let res = h % 24;
  if (res < 0) res += 24;
  return res;
}

export function formatTimeHours(hours: number): string {
  const h = Math.floor(normalize24(hours));
  const m = Math.floor((normalize24(hours) - h) * 60);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function formatTime24(hours: number): string {
  const h = Math.floor(normalize24(hours));
  const m = Math.floor((normalize24(hours) - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
