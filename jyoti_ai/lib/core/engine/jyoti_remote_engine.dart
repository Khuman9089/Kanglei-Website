import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/jyoti_config.dart';
import '../models/jyoti_models.dart';
import 'astronomy_engine_adapter.dart';
import 'jyoti_local_engine.dart';

/// Remote Bridge Adapter that calls the decoupled `/api/jyoti/calculate` endpoint
/// Automatically falls back to high-precision local engine if offline or unreachable.
class JyotiRemoteEngineAdapter implements IAstronomyEngineAdapter {
  final IAstronomyEngineAdapter _fallbackEngine;
  final String apiEndpoint;

  JyotiRemoteEngineAdapter({
    IAstronomyEngineAdapter? fallbackEngine,
    String? apiEndpoint,
  })  : _fallbackEngine = fallbackEngine ?? const JyotiLocalEngineAdapter(),
        apiEndpoint = apiEndpoint ?? JyotiConfig.endpointCalculate;

  @override
  Future<JyotiNatalBlueprint> calculateBlueprint({
    required DateTime birthDateTime,
    required double latitude,
    required double longitude,
    required double timezoneOffset,
    String ayanamsa = 'Lahiri',
  }) async {
    try {
      final url = Uri.parse(apiEndpoint);
      final response = await http
          .post(
            url,
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'birthDateTime': birthDateTime.toIso8601String(),
              'latitude': latitude,
              'longitude': longitude,
              'timezoneOffset': timezoneOffset,
              'ayanamsa': ayanamsa,
            }),
          )
          .timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        return JyotiNatalBlueprint.fromJson(data);
      }
    } catch (_) {
      // Graceful offline fallback
    }

    return _fallbackEngine.calculateBlueprint(
      birthDateTime: birthDateTime,
      latitude: latitude,
      longitude: longitude,
      timezoneOffset: timezoneOffset,
      ayanamsa: ayanamsa,
    );
  }
}
