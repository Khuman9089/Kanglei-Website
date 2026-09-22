/// Jyoti AI Isolated Data Models
/// Independent from any host or legacy data schemas

class JyotiUserProfile {
  final String id;
  final String fullName;
  final DateTime birthDateTime;
  final double latitude;
  final double longitude;
  final double timezoneOffset; // e.g. +5.5 for IST, -4.0 for EDT
  final String locationName;
  final String gender;
  final String ayanamsa;

  const JyotiUserProfile({
    required this.id,
    required this.fullName,
    required this.birthDateTime,
    required this.latitude,
    required this.longitude,
    required this.timezoneOffset,
    required this.locationName,
    this.gender = 'unspecified',
    this.ayanamsa = 'Lahiri',
  });

  factory JyotiUserProfile.defaultProfile() {
    return JyotiUserProfile(
      id: 'jyoti_guest_user',
      fullName: 'Aether Seeker',
      birthDateTime: DateTime(1996, 7, 15, 14, 30),
      latitude: 24.8170,
      longitude: 93.9368,
      timezoneOffset: 5.5,
      locationName: 'Imphal, IN',
      gender: 'unspecified',
      ayanamsa: 'Lahiri',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'fullName': fullName,
    'birthDateTime': birthDateTime.toIso8601String(),
    'latitude': latitude,
    'longitude': longitude,
    'timezoneOffset': timezoneOffset,
    'locationName': locationName,
    'gender': gender,
    'ayanamsa': ayanamsa,
  };

  factory JyotiUserProfile.fromJson(Map<String, dynamic> json) {
    return JyotiUserProfile(
      id: json['id'] as String? ?? 'jyoti_guest_user',
      fullName: json['fullName'] as String? ?? 'Aether Seeker',
      birthDateTime: json['birthDateTime'] != null
          ? DateTime.parse(json['birthDateTime'] as String)
          : DateTime(1996, 7, 15, 14, 30),
      latitude: (json['latitude'] as num?)?.toDouble() ?? 24.8170,
      longitude: (json['longitude'] as num?)?.toDouble() ?? 93.9368,
      timezoneOffset: (json['timezoneOffset'] as num?)?.toDouble() ?? 5.5,
      locationName: json['locationName'] as String? ?? 'Imphal, IN',
      gender: json['gender'] as String? ?? 'unspecified',
      ayanamsa: json['ayanamsa'] as String? ?? 'Lahiri',
    );
  }

  JyotiUserProfile copyWith({
    String? id,
    String? fullName,
    DateTime? birthDateTime,
    double? latitude,
    double? longitude,
    double? timezoneOffset,
    String? locationName,
    String? gender,
    String? ayanamsa,
  }) {
    return JyotiUserProfile(
      id: id ?? this.id,
      fullName: fullName ?? this.fullName,
      birthDateTime: birthDateTime ?? this.birthDateTime,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      timezoneOffset: timezoneOffset ?? this.timezoneOffset,
      locationName: locationName ?? this.locationName,
      gender: gender ?? this.gender,
      ayanamsa: ayanamsa ?? this.ayanamsa,
    );
  }
}

class JyotiPlanet {
  final String id; // 'su', 'mo', 'ma', 'me', 'ju', 've', 'sa', 'ra', 'ke'
  final String name; // Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
  final String glyph; // ☉, ☽, ♂, ☿, ♃, ♀, ♄, ☊, ☋
  final String signName; // Aries, Taurus, etc.
  final int signIndex; // 1 to 12
  final double absoluteLongitude; // 0 to 360
  final double degreeInSign; // 0 to 30
  final String nakshatra;
  final String nakshatraLord;
  final int pada; // 1 to 4
  final int houseNumber; // 1 to 12
  final bool isRetrograde;
  final double speed;
  final String dignity; // Own Sign, Exalted, Debilitated, Friendly, Neutral, Enemy
  final String element; // Fire, Earth, Air, Water

  const JyotiPlanet({
    required this.id,
    required this.name,
    required this.glyph,
    required this.signName,
    required this.signIndex,
    required this.absoluteLongitude,
    required this.degreeInSign,
    required this.nakshatra,
    required this.nakshatraLord,
    required this.pada,
    required this.houseNumber,
    this.isRetrograde = false,
    this.speed = 1.0,
    this.dignity = 'Neutral',
    this.element = 'Ether',
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'glyph': glyph,
    'signName': signName,
    'signIndex': signIndex,
    'absoluteLongitude': absoluteLongitude,
    'degreeInSign': degreeInSign,
    'nakshatra': nakshatra,
    'nakshatraLord': nakshatraLord,
    'pada': pada,
    'houseNumber': houseNumber,
    'isRetrograde': isRetrograde,
    'speed': speed,
    'dignity': dignity,
    'element': element,
  };

  factory JyotiPlanet.fromJson(Map<String, dynamic> json) {
    return JyotiPlanet(
      id: json['id'] as String? ?? 'su',
      name: json['name'] as String? ?? 'Sun',
      glyph: json['glyph'] as String? ?? '☉',
      signName: json['signName'] as String? ?? 'Aries',
      signIndex: json['signIndex'] as int? ?? 1,
      absoluteLongitude: (json['absoluteLongitude'] as num?)?.toDouble() ?? 0.0,
      degreeInSign: (json['degreeInSign'] as num?)?.toDouble() ?? 0.0,
      nakshatra: json['nakshatra'] as String? ?? 'Ashwini',
      nakshatraLord: json['nakshatraLord'] as String? ?? 'Ketu',
      pada: json['pada'] as int? ?? 1,
      houseNumber: json['houseNumber'] as int? ?? 1,
      isRetrograde: json['isRetrograde'] as bool? ?? false,
      speed: (json['speed'] as num?)?.toDouble() ?? 1.0,
      dignity: json['dignity'] as String? ?? 'Neutral',
      element: json['element'] as String? ?? 'Ether',
    );
  }
}

class JyotiBhava {
  final int houseNumber; // 1 to 12
  final String signName;
  final int signIndex;
  final double cuspDegree;
  final double startDegree;
  final double endDegree;
  final List<String> occupyingPlanetIds;
  final String lord;

  const JyotiBhava({
    required this.houseNumber,
    required this.signName,
    required this.signIndex,
    required this.cuspDegree,
    required this.startDegree,
    required this.endDegree,
    required this.occupyingPlanetIds,
    required this.lord,
  });

  Map<String, dynamic> toJson() => {
    'houseNumber': houseNumber,
    'signName': signName,
    'signIndex': signIndex,
    'cuspDegree': cuspDegree,
    'startDegree': startDegree,
    'endDegree': endDegree,
    'occupyingPlanetIds': occupyingPlanetIds,
    'lord': lord,
  };

  factory JyotiBhava.fromJson(Map<String, dynamic> json) {
    return JyotiBhava(
      houseNumber: json['houseNumber'] as int? ?? 1,
      signName: json['signName'] as String? ?? 'Aries',
      signIndex: json['signIndex'] as int? ?? 1,
      cuspDegree: (json['cuspDegree'] as num?)?.toDouble() ?? 0.0,
      startDegree: (json['startDegree'] as num?)?.toDouble() ?? 0.0,
      endDegree: (json['endDegree'] as num?)?.toDouble() ?? 30.0,
      occupyingPlanetIds: (json['occupyingPlanetIds'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      lord: json['lord'] as String? ?? 'Mars',
    );
  }
}

class JyotiDashaNode {
  final String lord;
  final String lordName;
  final double durationYears;
  final DateTime startDate;
  final DateTime endDate;
  final String level; // 'maha', 'antar', 'pratyantar'
  final List<JyotiDashaNode> subPeriods;

  const JyotiDashaNode({
    required this.lord,
    required this.lordName,
    required this.durationYears,
    required this.startDate,
    required this.endDate,
    required this.level,
    this.subPeriods = const [],
  });

  bool get isActiveNow {
    final now = DateTime.now();
    return now.isAfter(startDate) && now.isBefore(endDate);
  }

  Map<String, dynamic> toJson() => {
    'lord': lord,
    'lordName': lordName,
    'durationYears': durationYears,
    'startDate': startDate.toIso8601String(),
    'endDate': endDate.toIso8601String(),
    'level': level,
    'subPeriods': subPeriods.map((e) => e.toJson()).toList(),
  };

  factory JyotiDashaNode.fromJson(Map<String, dynamic> json) {
    return JyotiDashaNode(
      lord: json['lord'] as String? ?? 'Ketu',
      lordName: json['lordName'] as String? ?? 'Ketu',
      durationYears: (json['durationYears'] as num?)?.toDouble() ?? 7.0,
      startDate: json['startDate'] != null
          ? DateTime.parse(json['startDate'] as String)
          : DateTime.now(),
      endDate: json['endDate'] != null
          ? DateTime.parse(json['endDate'] as String)
          : DateTime.now().add(const Duration(days: 365 * 7)),
      level: json['level'] as String? ?? 'maha',
      subPeriods: (json['subPeriods'] as List<dynamic>?)
              ?.map((e) => JyotiDashaNode.fromJson(e as Map<String, dynamic>))
              .toList() ??
          const [],
    );
  }
}

class JyotiNatalBlueprint {
  final DateTime calculationTimestamp;
  final double ascendantDegree;
  final String ascendantSign;
  final int ascendantSignIndex;
  final String ascendantNakshatra;
  final String ayanamsaName;
  final double ayanamsaValue;
  final List<JyotiPlanet> planets;
  final List<JyotiBhava> bhavas;
  final List<JyotiDashaNode> dashas;
  final String dominantElement;
  final String chartRuler;

  const JyotiNatalBlueprint({
    required this.calculationTimestamp,
    required this.ascendantDegree,
    required this.ascendantSign,
    required this.ascendantSignIndex,
    required this.ascendantNakshatra,
    required this.ayanamsaName,
    required this.ayanamsaValue,
    required this.planets,
    required this.bhavas,
    required this.dashas,
    required this.dominantElement,
    required this.chartRuler,
  });

  JyotiPlanet? getPlanet(String id) {
    try {
      return planets.firstWhere((p) => p.id == id);
    } catch (_) {
      return null;
    }
  }

  JyotiBhava? getBhava(int houseNumber) {
    try {
      return bhavas.firstWhere((b) => b.houseNumber == houseNumber);
    } catch (_) {
      return null;
    }
  }

  JyotiDashaNode? get currentMahaDasha {
    final now = DateTime.now();
    for (final d in dashas) {
      if (now.isAfter(d.startDate) && now.isBefore(d.endDate)) {
        return d;
      }
    }
    return dashas.isNotEmpty ? dashas.first : null;
  }

  Map<String, dynamic> toJson() => {
    'calculationTimestamp': calculationTimestamp.toIso8601String(),
    'ascendantDegree': ascendantDegree,
    'ascendantSign': ascendantSign,
    'ascendantSignIndex': ascendantSignIndex,
    'ascendantNakshatra': ascendantNakshatra,
    'ayanamsaName': ayanamsaName,
    'ayanamsaValue': ayanamsaValue,
    'planets': planets.map((p) => p.toJson()).toList(),
    'bhavas': bhavas.map((b) => b.toJson()).toList(),
    'dashas': dashas.map((d) => d.toJson()).toList(),
    'dominantElement': dominantElement,
    'chartRuler': chartRuler,
  };

  factory JyotiNatalBlueprint.fromJson(Map<String, dynamic> json) {
    return JyotiNatalBlueprint(
      calculationTimestamp: json['calculationTimestamp'] != null
          ? DateTime.parse(json['calculationTimestamp'] as String)
          : DateTime.now(),
      ascendantDegree: (json['ascendantDegree'] as num?)?.toDouble() ?? 0.0,
      ascendantSign: json['ascendantSign'] as String? ?? 'Aries',
      ascendantSignIndex: json['ascendantSignIndex'] as int? ?? 1,
      ascendantNakshatra: json['ascendantNakshatra'] as String? ?? 'Ashwini',
      ayanamsaName: json['ayanamsaName'] as String? ?? 'Lahiri',
      ayanamsaValue: (json['ayanamsaValue'] as num?)?.toDouble() ?? 24.1,
      planets: (json['planets'] as List<dynamic>?)
              ?.map((e) => JyotiPlanet.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      bhavas: (json['bhavas'] as List<dynamic>?)
              ?.map((e) => JyotiBhava.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      dashas: (json['dashas'] as List<dynamic>?)
              ?.map((e) => JyotiDashaNode.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      dominantElement: json['dominantElement'] as String? ?? 'Ether',
      chartRuler: json['chartRuler'] as String? ?? 'Mars',
    );
  }
}

class JyotiChatMessage {
  final String id;
  final String sender; // 'user', 'oracle', 'system'
  final String content;
  final DateTime timestamp;
  final List<String> tags;
  final String? astralContext;

  const JyotiChatMessage({
    required this.id,
    required this.sender,
    required this.content,
    required this.timestamp,
    this.tags = const [],
    this.astralContext,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'sender': sender,
    'content': content,
    'timestamp': timestamp.toIso8601String(),
    'tags': tags,
    'astralContext': astralContext,
  };

  factory JyotiChatMessage.fromJson(Map<String, dynamic> json) {
    return JyotiChatMessage(
      id: json['id'] as String? ?? 'msg_${DateTime.now().millisecondsSinceEpoch}',
      sender: json['sender'] as String? ?? 'oracle',
      content: json['content'] as String? ?? '',
      timestamp: json['timestamp'] != null
          ? DateTime.parse(json['timestamp'] as String)
          : DateTime.now(),
      tags: (json['tags'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      astralContext: json['astralContext'] as String?,
    );
  }
}
