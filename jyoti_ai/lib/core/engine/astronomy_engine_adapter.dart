import '../models/jyoti_models.dart';

/// Abstract interface to decouple the calculation logic from UI and data layers
abstract class IAstronomyEngineAdapter {
  Future<JyotiNatalBlueprint> calculateBlueprint({
    required DateTime birthDateTime,
    required double latitude,
    required double longitude,
    required double timezoneOffset,
    String ayanamsa = 'Lahiri',
  });
}
