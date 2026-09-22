import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/config/jyoti_config.dart';
import '../widgets/jyoti_shell.dart';

/// Configurable GoRouter for Jyoti AI with sub-path extraction support
class JyotiRouter {
  JyotiRouter._();

  static final GlobalKey<NavigatorState> rootNavigatorKey =
      GlobalKey<NavigatorState>(debugLabel: 'jyoti_root');

  static GoRouter createRouter() {
    final base = JyotiConfig.basePath == '/' ? '' : JyotiConfig.basePath;

    return GoRouter(
      navigatorKey: rootNavigatorKey,
      initialLocation: base.isEmpty ? '/' : base,
      routes: [
        GoRoute(
          path: base.isEmpty ? '/' : base,
          builder: (context, state) => const JyotiShell(),
          routes: [
            GoRoute(
              path: 'chart',
              builder: (context, state) => const JyotiShell(),
            ),
            GoRoute(
              path: 'timeline',
              builder: (context, state) => const JyotiShell(),
            ),
            GoRoute(
              path: 'oracle',
              builder: (context, state) => const JyotiShell(),
            ),
            GoRoute(
              path: 'data-safety',
              builder: (context, state) => const JyotiShell(),
            ),
          ],
        ),
      ],
      errorBuilder: (context, state) => Scaffold(
        backgroundColor: const Color(0xFF07090E),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                '404 — Cosmic Void',
                style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: () => context.go(base.isEmpty ? '/' : base),
                child: const Text('Return to Jyoti AI'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
