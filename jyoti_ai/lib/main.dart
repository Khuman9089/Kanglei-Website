import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/config/jyoti_config.dart';
import 'core/services/jyoti_storage_service.dart';
import 'core/state/jyoti_providers.dart';
import 'core/theme/jyoti_theme.dart';
import 'presentation/navigation/jyoti_router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize sandboxed storage
  final storageService = await JyotiStorageService.initialize();

  runApp(
    ProviderScope(
      overrides: [
        jyotiStorageServiceProvider.overrideWithValue(storageService),
      ],
      child: const JyotiApp(),
    ),
  );
}

class JyotiApp extends StatelessWidget {
  const JyotiApp({super.key});

  @override
  Widget build(BuildContext context) {
    final router = JyotiRouter.createRouter();

    return MaterialApp.router(
      title: '${JyotiConfig.appName} — ${JyotiConfig.appSubtitle}',
      debugShowCheckedModeBanner: false,
      theme: JyotiTheme.darkTheme,
      routerConfig: router,
    );
  }
}
