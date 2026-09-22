import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/config/jyoti_config.dart';
import '../../core/state/jyoti_providers.dart';
import '../../core/theme/jyoti_theme.dart';
import '../screens/chart/celestial_chart_view.dart';
import '../screens/daily/daily_oracle_view.dart';
import '../screens/oracle/ai_oracle_view.dart';
import '../screens/settings/data_safety_view.dart';
import '../screens/timeline/timeline_dasha_view.dart';
import 'birth_input_modal.dart';

/// Root Responsive Shell for Jyoti AI
class JyotiShell extends ConsumerWidget {
  const JyotiShell({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final navIndex = ref.watch(jyotiNavIndexProvider);
    final isSidebarOpen = ref.watch(jyotiOracleSidebarOpenProvider);
    final user = ref.watch(jyotiUserProvider);

    return LayoutBuilder(
      builder: (context, constraints) {
        final isDesktop = constraints.maxWidth >= 1024;

        if (isDesktop) {
          return Scaffold(
            body: Container(
              decoration: const BoxDecoration(
                gradient: JyotiTheme.deepSpaceGradient,
              ),
              child: Row(
                children: [
                  // Left Nav Dock
                  _buildDesktopNavDock(context, ref, navIndex, user),

                  // Center Studio Canvas
                  Expanded(
                    flex: 7,
                    child: Column(
                      children: [
                        _buildDesktopTopBar(context, ref, isSidebarOpen),
                        Expanded(
                          child: _buildActiveView(navIndex),
                        ),
                      ],
                    ),
                  ),

                  // Right Collapsible AI Oracle Stream
                  if (isSidebarOpen && navIndex != 3)
                    const SizedBox(
                      width: 380,
                      child: JyotiOracleView(isSidebarMode: true),
                    ),
                ],
              ),
            ),
          );
        } else {
          // Mobile Shell
          return Scaffold(
            appBar: AppBar(
              backgroundColor: JyotiTheme.surfaceGlass,
              elevation: 0,
              title: Row(
                children: [
                  Container(
                    width: 28,
                    height: 28,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: JyotiTheme.astralEnergyGradient,
                    ),
                    child: const Center(
                      child: Icon(Icons.blur_on, color: Colors.white, size: 16),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    JyotiConfig.appName,
                    style: GoogleFonts.cormorantGaramond(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: JyotiTheme.textPrimary,
                    ),
                  ),
                ],
              ),
              actions: [
                IconButton(
                  icon: const Icon(Icons.security, color: JyotiTheme.textSecondary, size: 20),
                  onPressed: () => ref.read(jyotiNavIndexProvider.notifier).state = 4,
                  tooltip: 'Data Safety & Account Deletion',
                ),
                IconButton(
                  icon: const Icon(Icons.tune, color: JyotiTheme.textSecondary, size: 20),
                  onPressed: () => JyotiBirthInputModal.show(context),
                  tooltip: 'Natal Calibration',
                ),
              ],
            ),
            body: Container(
              decoration: const BoxDecoration(
                gradient: JyotiTheme.deepSpaceGradient,
              ),
              child: _buildActiveView(navIndex),
            ),
            bottomNavigationBar: Container(
              decoration: const BoxDecoration(
                color: JyotiTheme.surfaceGlass,
                border: Border(top: BorderSide(color: JyotiTheme.borderSubtle)),
              ),
              child: BottomNavigationBar(
                currentIndex: navIndex > 3 ? 0 : navIndex,
                onTap: (idx) => ref.read(jyotiNavIndexProvider.notifier).state = idx,
                backgroundColor: Colors.transparent,
                elevation: 0,
                selectedItemColor: JyotiTheme.electricIndigo,
                unselectedItemColor: JyotiTheme.textMuted,
                selectedLabelStyle: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600),
                unselectedLabelStyle: const TextStyle(fontSize: 10),
                type: BottomNavigationBarType.fixed,
                items: const [
                  BottomNavigationBarItem(
                    icon: Icon(Icons.donut_large_rounded),
                    label: 'Kundali',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(Icons.timeline_rounded),
                    label: 'Dashas',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(Icons.auto_awesome_rounded),
                    label: 'Daily Oracle',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(Icons.chat_bubble_outline_rounded),
                    label: 'AI Stream',
                  ),
                ],
              ),
            ),
          );
        }
      },
    );
  }

  Widget _buildActiveView(int navIndex) {
    switch (navIndex) {
      case 0:
        return const JyotiChartView();
      case 1:
        return const JyotiTimelineView();
      case 2:
        return const JyotiDailyOracleView();
      case 3:
        return const JyotiOracleView();
      case 4:
        return const JyotiDataSafetyView();
      default:
        return const JyotiChartView();
    }
  }

  Widget _buildDesktopNavDock(
    BuildContext context,
    WidgetRef ref,
    int navIndex,
    dynamic user,
  ) {
    return Container(
      width: 240,
      decoration: const BoxDecoration(
        color: JyotiTheme.surfaceGlass,
        border: Border(right: BorderSide(color: JyotiTheme.borderSubtle)),
      ),
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: JyotiTheme.astralEnergyGradient,
                  boxShadow: [
                    BoxShadow(
                      color: JyotiTheme.electricIndigo.withOpacity(0.4),
                      blurRadius: 12,
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(Icons.blur_on, color: Colors.white, size: 20),
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    JyotiConfig.appName,
                    style: GoogleFonts.cormorantGaramond(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.5,
                      color: JyotiTheme.textPrimary,
                    ),
                  ),
                  const Text(
                    'Celestial Intelligence',
                    style: TextStyle(
                      fontSize: 9,
                      color: JyotiTheme.textMuted,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 32),

          Text(
            'STUDIO MODULES',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              color: JyotiTheme.textMuted,
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(height: 12),

          _buildNavDockItem(
            ref: ref,
            index: 0,
            currentIndex: navIndex,
            icon: Icons.donut_large_rounded,
            title: 'Natal Kundali Studio',
          ),
          const SizedBox(height: 6),
          _buildNavDockItem(
            ref: ref,
            index: 1,
            currentIndex: navIndex,
            icon: Icons.timeline_rounded,
            title: 'Vimshottari Timeline',
          ),
          const SizedBox(height: 6),
          _buildNavDockItem(
            ref: ref,
            index: 2,
            currentIndex: navIndex,
            icon: Icons.auto_awesome_rounded,
            title: 'Daily Cosmic Oracle',
          ),
          const SizedBox(height: 6),
          _buildNavDockItem(
            ref: ref,
            index: 3,
            currentIndex: navIndex,
            icon: Icons.chat_bubble_outline_rounded,
            title: 'AI Oracle Intelligence',
          ),
          const SizedBox(height: 6),
          _buildNavDockItem(
            ref: ref,
            index: 4,
            currentIndex: navIndex,
            icon: Icons.security_rounded,
            title: 'Data Safety & Deletion',
          ),

          const Spacer(),

          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: JyotiTheme.surfaceElevated,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: JyotiTheme.borderSubtle),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 16,
                  backgroundColor: JyotiTheme.electricIndigo.withOpacity(0.2),
                  child: const Icon(Icons.person, size: 16, color: JyotiTheme.electricIndigo),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user.fullName,
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.white),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        user.locationName,
                        style: const TextStyle(fontSize: 10, color: JyotiTheme.textMuted),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.tune, size: 16, color: JyotiTheme.textSecondary),
                  onPressed: () => JyotiBirthInputModal.show(context),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavDockItem({
    required WidgetRef ref,
    required int index,
    required int currentIndex,
    required IconData icon,
    required String title,
  }) {
    final active = index == currentIndex;

    return InkWell(
      onTap: () => ref.read(jyotiNavIndexProvider.notifier).state = index,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: active ? JyotiTheme.electricIndigo.withOpacity(0.15) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: active ? JyotiTheme.electricIndigo.withOpacity(0.3) : Colors.transparent,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 18,
              color: active ? JyotiTheme.electricIndigo : JyotiTheme.textMuted,
            ),
            const SizedBox(width: 12),
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                fontWeight: active ? FontWeight.w600 : FontWeight.w400,
                color: active ? Colors.white : JyotiTheme.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDesktopTopBar(BuildContext context, WidgetRef ref, bool isSidebarOpen) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      decoration: const BoxDecoration(
        color: JyotiTheme.surfaceGlass,
        border: Border(bottom: BorderSide(color: JyotiTheme.borderSubtle)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: JyotiTheme.surfaceElevated,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  'JYOTI ENGINE v1.0',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: JyotiTheme.starlightAmber),
                ),
              ),
              const SizedBox(width: 12),
              const Text(
                'High-Precision Sidereal Ephemeris Active • Google Play Data Safety Compliant',
                style: TextStyle(fontSize: 11, color: JyotiTheme.textMuted),
              ),
            ],
          ),
          Row(
            children: [
              OutlinedButton.icon(
                onPressed: () => JyotiBirthInputModal.show(context),
                icon: const Icon(Icons.tune, size: 14, color: JyotiTheme.electricIndigo),
                label: const Text('Natal Parameters', style: TextStyle(fontSize: 12, color: Colors.white)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: JyotiTheme.borderSubtle),
                  backgroundColor: JyotiTheme.surfaceElevated,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                ),
              ),
              const SizedBox(width: 12),
              IconButton(
                icon: Icon(
                  isSidebarOpen ? Icons.view_sidebar : Icons.view_sidebar_outlined,
                  color: isSidebarOpen ? JyotiTheme.electricIndigo : JyotiTheme.textMuted,
                  size: 20,
                ),
                tooltip: 'Toggle AI Oracle Sidebar',
                onPressed: () {
                  ref.read(jyotiOracleSidebarOpenProvider.notifier).state = !isSidebarOpen;
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}
