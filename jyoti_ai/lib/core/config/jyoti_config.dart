/// Jyoti AI Configuration
/// Designed for standalone extraction or sub-path routing with Google Play Data Safety Compliance
class JyotiConfig {
  JyotiConfig._();

  /// Product Branding
  static const String appName = 'Jyoti AI';
  static const String appSubtitle = 'Your Personal Celestial Intelligence';
  static const String appVersion = '1.0.0';
  static const String standaloneDomain = 'https://jyoti.ai';

  /// Base Path Routing
  /// Use '/astroai' when hosted under host domain (e.g. yourdomain.com/astroai)
  /// Set to '/' for standalone deployment (jyoti.ai) or native iOS/Android builds.
  static const String basePath = '/astroai';

  /// Storage Sandboxing Prefixes
  static const String storagePrefix = 'jyoti_';
  static const String keyUserProfile = '${storagePrefix}user_profile';
  static const String keyChartCache = '${storagePrefix}chart_cache';
  static const String keyChatSessions = '${storagePrefix}chat_sessions';
  static const String keySettings = '${storagePrefix}settings';

  /// Google Play Store Data Safety & Account Deletion URLs
  static const String publicAccountDeletionUrl = 'https://kuthiyengpham.in/astroai/delete-account';
  static const String privacyPolicyUrl = 'https://kuthiyengpham.in/privacy-policy';

  /// Default Astronomical Settings
  static const String defaultAyanamsa = 'Lahiri';
  static const String defaultHouseSystem = 'Placidus / Equal House';

  /// API Endpoints
  static const String endpointCalculate = '/api/jyoti/calculate';
  static const String endpointOracle = '/api/jyoti/oracle';
  static const String endpointDeleteAccount = '/api/jyoti/delete-account';

  /// Helper to resolve absolute or relative routes based on basePath
  static String resolveRoute(String subRoute) {
    if (basePath == '/' || basePath.isEmpty) {
      return subRoute.startsWith('/') ? subRoute : '/$subRoute';
    }
    final cleanBase = basePath.endsWith('/') ? basePath.substring(0, basePath.length - 1) : basePath;
    final cleanSub = subRoute.startsWith('/') ? subRoute : '/$subRoute';
    return '$cleanBase$cleanSub';
  }
}
