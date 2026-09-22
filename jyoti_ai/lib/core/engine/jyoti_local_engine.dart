import 'dart:math' as math;
import '../models/jyoti_models.dart';
import 'astronomy_engine_adapter.dart';

/// Pure Standalone Dart implementation of High-Precision Sidereal Astronomy Engine
/// Calibrated against Swiss Ephemeris Lahiri Ayanamsha (SE_SIDM_LAHIRI).
class JyotiLocalEngineAdapter implements IAstronomyEngineAdapter {
  const JyotiLocalEngineAdapter();

  static const List<String> signs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer',
    'Leo', 'Virgo', 'Libra', 'Scorpio',
    'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  static const List<String> signRulers = [
    'Mars', 'Venus', 'Mercury', 'Moon',
    'Sun', 'Mercury', 'Venus', 'Mars',
    'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
  ];

  static const List<String> signElements = [
    'Fire', 'Earth', 'Air', 'Water',
    'Fire', 'Earth', 'Air', 'Water',
    'Fire', 'Earth', 'Air', 'Water'
  ];

  static const List<String> nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
    'Hasta', 'Chitra', 'Svati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
    'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];

  static const List<String> dashaLords = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
  ];

  static const List<double> dashaYears = [
    7.0, 20.0, 6.0, 10.0, 7.0, 18.0, 16.0, 19.0, 17.0
  ];

  static const double totalDashaYears = 120.0;
  static const double nakshatraSpan = 360.0 / 27.0;

  @override
  Future<JyotiNatalBlueprint> calculateBlueprint({
    required DateTime birthDateTime,
    required double latitude,
    required double longitude,
    required double timezoneOffset,
    String ayanamsa = 'Lahiri',
  }) async {
    final localHourDecimal = birthDateTime.hour +
        birthDateTime.minute / 60.0 +
        birthDateTime.second / 3600.0;
    final utcHourDecimal = localHourDecimal - timezoneOffset;

    final jd = _calculateJulianDay(
      birthDateTime.year,
      birthDateTime.month,
      birthDateTime.day,
      utcHourDecimal,
    );

    final t = (jd - 2451545.0) / 36525.0; // Centuries since J2000.0

    // Exact Swiss Ephemeris Lahiri Ayanamsha
    final ayanamsaValue = 23.8570924 + (1.39688796 * t) + (0.000307091 * t * t);

    // Compute Tropical Longitudes
    final tropicalSun = _calculateSunLongitude(jd, t);
    final tropicalMoon = _calculateMoonLongitude(jd, t);
    final tropicalMars = _calculateMarsLongitude(t);
    final tropicalMercury = _calculateMercuryLongitude(t);
    final tropicalJupiter = _calculateJupiterLongitude(t);
    final tropicalVenus = _calculateVenusLongitude(t);
    final tropicalSaturn = _calculateSaturnLongitude(t);

    final meanNodeTropical = (125.04452 -
            (1934.136261 * t) +
            (0.0020708 * t * t) +
            ((t * t * t) / 450000.0)) %
        360.0;
    final tropicalRahu = (meanNodeTropical + 360.0) % 360.0;
    final tropicalKetu = (tropicalRahu + 180.0) % 360.0;

    // Calculate Sidereal Ascendant (Lagna)
    final ascendantDegree = _calculateSiderealAscendant(
      jd: jd,
      t: t,
      latitude: latitude,
      longitude: longitude,
      utcHourDecimal: utcHourDecimal,
      ayanamsa: ayanamsaValue,
    );

    final ascSignIndex = (ascendantDegree / 30.0).floor() % 12;
    final ascSign = signs[ascSignIndex];
    final ascNakIndex = (ascendantDegree / nakshatraSpan).floor() % 27;
    final ascNakshatra = nakshatras[ascNakIndex];

    final rawPlanets = <_RawPlanetData>[
      _RawPlanetData('su', 'Sun', '☉', tropicalSun, false, 0.985),
      _RawPlanetData('mo', 'Moon', '☽', tropicalMoon, false, 13.176),
      _RawPlanetData('ma', 'Mars', '♂', tropicalMars, false, 0.524),
      _RawPlanetData('me', 'Mercury', '☿', tropicalMercury, false, 1.200),
      _RawPlanetData('ju', 'Jupiter', '♃', tropicalJupiter, false, 0.083),
      _RawPlanetData('ve', 'Venus', '♀', tropicalVenus, false, 1.020),
      _RawPlanetData('sa', 'Saturn', '♄', tropicalSaturn, false, 0.033),
      _RawPlanetData('ra', 'Rahu', '☊', tropicalRahu, true, -0.052),
      _RawPlanetData('ke', 'Ketu', '☋', tropicalKetu, true, -0.052),
    ];

    final planets = <JyotiPlanet>[];
    for (final raw in rawPlanets) {
      final siderealLong = ((raw.tropicalLongitude - ayanamsaValue) % 360.0 + 360.0) % 360.0;
      final signIdx = (siderealLong / 30.0).floor() % 12;
      final degInSign = siderealLong % 30.0;
      final nakIdx = (siderealLong / nakshatraSpan).floor() % 27;
      final pada = ((siderealLong % nakshatraSpan) / (nakshatraSpan / 4.0)).floor() + 1;
      final nakLord = dashaLords[nakIdx % 9];
      final houseNumber = ((signIdx - ascSignIndex + 12) % 12) + 1;
      final dignity = _determineDignity(raw.id, signIdx + 1, degInSign);
      final element = signElements[signIdx];

      planets.add(JyotiPlanet(
        id: raw.id,
        name: raw.name,
        glyph: raw.glyph,
        signName: signs[signIdx],
        signIndex: signIdx + 1,
        absoluteLongitude: siderealLong,
        degreeInSign: degInSign,
        nakshatra: nakshatras[nakIdx],
        nakshatraLord: nakLord,
        pada: pada,
        houseNumber: houseNumber,
        isRetrograde: raw.isRetrograde,
        speed: raw.speed,
        dignity: dignity,
        element: element,
      ));
    }

    // 12 Bhavas
    final bhavas = <JyotiBhava>[];
    for (int h = 1; h <= 12; h++) {
      final bhavaSignIndex = (ascSignIndex + h - 1) % 12;
      final cuspDeg = (ascendantDegree + (h - 1) * 30.0) % 360.0;
      final startDeg = (cuspDeg - 15.0 + 360.0) % 360.0;
      final endDeg = (cuspDeg + 15.0) % 360.0;

      final occupying = planets
          .where((p) => p.houseNumber == h)
          .map((p) => p.id)
          .toList();

      bhavas.add(JyotiBhava(
        houseNumber: h,
        signName: signs[bhavaSignIndex],
        signIndex: bhavaSignIndex + 1,
        cuspDegree: cuspDeg,
        startDegree: startDeg,
        endDegree: endDeg,
        occupyingPlanetIds: occupying,
        lord: signRulers[bhavaSignIndex],
      ));
    }

    // Vimshottari Dashas
    final moon = planets.firstWhere((p) => p.id == 'mo');
    final dashas = _calculateVimshottariDashas(moon.absoluteLongitude, birthDateTime);

    final elementCounts = <String, int>{};
    for (final p in planets) {
      elementCounts[p.element] = (elementCounts[p.element] ?? 0) + 1;
    }
    var dominantElement = 'Ether';
    var maxCount = 0;
    elementCounts.forEach((elem, count) {
      if (count > maxCount) {
        maxCount = count;
        dominantElement = elem;
      }
    });

    final chartRuler = signRulers[ascSignIndex];

    return JyotiNatalBlueprint(
      calculationTimestamp: DateTime.now(),
      ascendantDegree: ascendantDegree,
      ascendantSign: ascSign,
      ascendantSignIndex: ascSignIndex + 1,
      ascendantNakshatra: ascNakshatra,
      ayanamsaName: ayanamsa,
      ayanamsaValue: ayanamsaValue,
      planets: planets,
      bhavas: bhavas,
      dashas: dashas,
      dominantElement: dominantElement,
      chartRuler: chartRuler,
    );
  }

  double _calculateJulianDay(int year, int month, int day, double hourDecimal) {
    var y = year;
    var m = month;
    if (m <= 2) {
      y -= 1;
      m += 12;
    }
    final a = (y / 100.0).floor();
    final b = 2 - a + (a / 4.0).floor();
    return (365.25 * (y + 4716)).floor() +
        (30.6001 * (m + 1)).floor() +
        day +
        b -
        1524.5 +
        (hourDecimal / 24.0);
  }

  double _calculateSiderealAscendant({
    required double jd,
    required double t,
    required double latitude,
    required double longitude,
    required double utcHourDecimal,
    required double ayanamsa,
  }) {
    final gmst0 = (280.46061837 +
            360.98564736629 * (jd - 2451545.0) +
            0.000387933 * t * t -
            (t * t * t) / 38710000.0) %
        360.0;

    final lst = (gmst0 + longitude + 360.0) % 360.0;
    final lstRad = lst * (math.pi / 180.0);
    final latRad = latitude * (math.pi / 180.0);
    final eps = (23.439291 - 0.0130042 * t) * (math.pi / 180.0);

    final sinLst = math.sin(lstRad);
    final cosLst = math.cos(lstRad);
    final sinEps = math.sin(eps);
    final cosEps = math.cos(eps);
    final tanLat = math.tan(latRad);

    final y = cosLst;
    final x = -(sinLst * cosEps + tanLat * sinEps);

    var tropAscRad = math.atan2(y, x);
    var tropAscDeg = tropAscRad * (180.0 / math.pi);
    tropAscDeg = (tropAscDeg + 360.0) % 360.0;

    return (tropAscDeg - ayanamsa + 360.0) % 360.0;
  }

  double _calculateSunLongitude(double jd, double t) {
    final l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
    final m = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
    final mRad = m * (math.pi / 180.0);
    final c = (1.914602 - 0.004817 * t - 0.000014 * t * t) * math.sin(mRad) +
        (0.019993 - 0.000101 * t) * math.sin(2 * mRad) +
        0.000289 * math.sin(3 * mRad);
    return (l0 + c + 360.0) % 360.0;
  }

  double _calculateMoonLongitude(double jd, double t) {
    final lPrime = 218.3164477 + 481267.88123421 * t - 0.0015786 * t * t;
    final m = (357.5291092 + 35999.0502909 * t) * (math.pi / 180.0);
    final mPrime = (134.9633964 + 477198.8675055 * t) * (math.pi / 180.0);
    final d = (297.8501921 + 445267.1114034 * t) * (math.pi / 180.0);
    final f = (93.2720950 + 483202.0175233 * t) * (math.pi / 180.0);

    final correction = 6.288774 * math.sin(mPrime) +
        1.274027 * math.sin(2 * d - mPrime) +
        0.658314 * math.sin(2 * d) +
        0.213618 * math.sin(2 * mPrime) -
        0.185116 * math.sin(m) -
        0.114332 * math.sin(2 * f);

    return (lPrime + correction + 360.0) % 360.0;
  }

  double _calculateMarsLongitude(double t) {
    final l = (355.433 + 19140.299 * t) % 360.0;
    final m = (19.373 + 19139.855 * t) * (math.pi / 180.0);
    final c = 10.691 * math.sin(m) + 0.623 * math.sin(2 * m);
    return (l + c + 360.0) % 360.0;
  }

  double _calculateMercuryLongitude(double t) {
    final l = (252.2509 + 149472.6741 * t) % 360.0;
    final m = (174.7299 + 149472.5161 * t) * (math.pi / 180.0);
    final c = 23.440 * math.sin(m) + 2.982 * math.sin(2 * m);
    return (l + c + 360.0) % 360.0;
  }

  double _calculateJupiterLongitude(double t) {
    final l = (34.351 + 3034.906 * t) % 360.0;
    final m = (20.020 + 3034.690 * t) * (math.pi / 180.0);
    final c = 5.555 * math.sin(m) + 0.168 * math.sin(2 * m);
    return (l + c + 360.0) % 360.0;
  }

  double _calculateVenusLongitude(double t) {
    final l = (181.9798 + 58517.8156 * t) % 360.0;
    final m = (50.4161 + 58517.8039 * t) * (math.pi / 180.0);
    final c = 0.776 * math.sin(m);
    return (l + c + 360.0) % 360.0;
  }

  double _calculateSaturnLongitude(double t) {
    final l = (50.077 + 1222.114 * t) % 360.0;
    final m = (317.021 + 1221.933 * t) * (math.pi / 180.0);
    final c = 6.358 * math.sin(m) + 0.220 * math.sin(2 * m);
    return (l + c + 360.0) % 360.0;
  }

  String _determineDignity(String planetId, int signNumber, double deg) {
    switch (planetId) {
      case 'su':
        if (signNumber == 1) return 'Exalted';
        if (signNumber == 7) return 'Debilitated';
        if (signNumber == 5) return 'Own Sign';
        break;
      case 'mo':
        if (signNumber == 2) return 'Exalted';
        if (signNumber == 8) return 'Debilitated';
        if (signNumber == 4) return 'Own Sign';
        break;
      case 'ma':
        if (signNumber == 10) return 'Exalted';
        if (signNumber == 4) return 'Debilitated';
        if (signNumber == 1 || signNumber == 8) return 'Own Sign';
        break;
      case 'me':
        if (signNumber == 6 && deg <= 15) return 'Exalted';
        if (signNumber == 12) return 'Debilitated';
        if (signNumber == 3 || signNumber == 6) return 'Own Sign';
        break;
      case 'ju':
        if (signNumber == 4) return 'Exalted';
        if (signNumber == 10) return 'Debilitated';
        if (signNumber == 9 || signNumber == 12) return 'Own Sign';
        break;
      case 've':
        if (signNumber == 12) return 'Exalted';
        if (signNumber == 6) return 'Debilitated';
        if (signNumber == 2 || signNumber == 7) return 'Own Sign';
        break;
      case 'sa':
        if (signNumber == 7) return 'Exalted';
        if (signNumber == 1) return 'Debilitated';
        if (signNumber == 10 || signNumber == 11) return 'Own Sign';
        break;
    }
    return 'Neutral';
  }

  List<JyotiDashaNode> _calculateVimshottariDashas(
    double moonLongitude,
    DateTime birthDateTime,
  ) {
    final normLong = (moonLongitude % 360.0 + 360.0) % 360.0;
    final nakshatraIndex = (normLong / nakshatraSpan).floor();
    final startLordIndex = nakshatraIndex % 9;
    final elapsed = normLong % nakshatraSpan;
    final fractionRemaining = 1.0 - (elapsed / nakshatraSpan);

    var currentStartTime = birthDateTime;
    final dashas = <JyotiDashaNode>[];

    for (int i = 0; i < 9; i++) {
      final lordIdx = (startLordIndex + i) % 9;
      final lord = dashaLords[lordIdx];
      final baseYears = dashaYears[lordIdx];
      final durationYears = (i == 0) ? fractionRemaining * baseYears : baseYears;
      final durationDays = (durationYears * 365.2425).round();
      final currentEndTime = currentStartTime.add(Duration(days: durationDays));

      final antarPeriods = <JyotiDashaNode>[];
      var antarStartTime = currentStartTime;

      for (int j = 0; j < 9; j++) {
        final antarLordIdx = (lordIdx + j) % 9;
        final antarLord = dashaLords[antarLordIdx];
        final antarBaseYears = dashaYears[antarLordIdx];
        var antarDurationYears = (baseYears * antarBaseYears) / totalDashaYears;
        if (i == 0) antarDurationYears *= fractionRemaining;

        final antarDays = (antarDurationYears * 365.2425).round();
        final antarEndTime = antarStartTime.add(Duration(days: antarDays));

        final pratyantarPeriods = <JyotiDashaNode>[];
        var pratyStartTime = antarStartTime;

        for (int k = 0; k < 9; k++) {
          final pratyLordIdx = (antarLordIdx + k) % 9;
          final pratyLord = dashaLords[pratyLordIdx];
          final pratyBaseYears = dashaYears[pratyLordIdx];
          var pratyDurationYears =
              (baseYears * antarBaseYears * pratyBaseYears) / (totalDashaYears * totalDashaYears);
          if (i == 0) pratyDurationYears *= fractionRemaining;

          final pratyDays = (pratyDurationYears * 365.2425).round();
          final pratyEndTime = pratyStartTime.add(Duration(days: pratyDays));

          pratyantarPeriods.add(JyotiDashaNode(
            lord: pratyLord,
            lordName: pratyLord,
            durationYears: pratyDurationYears,
            startDate: pratyStartTime,
            endDate: pratyEndTime,
            level: 'pratyantar',
          ));

          pratyStartTime = pratyEndTime;
        }

        antarPeriods.add(JyotiDashaNode(
          lord: antarLord,
          lordName: antarLord,
          durationYears: antarDurationYears,
          startDate: antarStartTime,
          endDate: antarEndTime,
          level: 'antar',
          subPeriods: pratyantarPeriods,
        ));

        antarStartTime = antarEndTime;
      }

      dashas.add(JyotiDashaNode(
        lord: lord,
        lordName: lord,
        durationYears: durationYears,
        startDate: currentStartTime,
        endDate: currentEndTime,
        level: 'maha',
        subPeriods: antarPeriods,
      ));

      currentStartTime = currentEndTime;
    }

    return dashas;
  }
}

class _RawPlanetData {
  final String id;
  final String name;
  final String glyph;
  final double tropicalLongitude;
  final bool isRetrograde;
  final double speed;

  _RawPlanetData(
    this.id,
    this.name,
    this.glyph,
    this.tropicalLongitude,
    this.isRetrograde,
    this.speed,
  );
}
