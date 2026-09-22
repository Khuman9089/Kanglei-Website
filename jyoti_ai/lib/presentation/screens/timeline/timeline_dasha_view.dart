import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/models/jyoti_models.dart';
import '../../../core/state/jyoti_providers.dart';
import '../../../core/theme/jyoti_theme.dart';

/// Vimshottari Dasha Timeline for Jyoti AI
class JyotiTimelineView extends ConsumerStatefulWidget {
  const JyotiTimelineView({super.key});

  @override
  ConsumerState<JyotiTimelineView> createState() => _JyotiTimelineViewState();
}

class _JyotiTimelineViewState extends ConsumerState<JyotiTimelineView> {
  int? _expandedMahaIndex;
  int? _expandedAntarIndex;

  @override
  Widget build(BuildContext context) {
    final chartAsync = ref.watch(jyotiChartProvider);

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: chartAsync.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: JyotiTheme.electricIndigo),
        ),
        error: (err, stack) => Center(
          child: Text('Timeline error: $err', style: const TextStyle(color: JyotiTheme.stellarRose)),
        ),
        data: (chart) {
          final now = DateTime.now();
          final activeMahaIndex = chart.dashas.indexWhere((d) => now.isAfter(d.startDate) && now.isBefore(d.endDate));

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildTimelineHeader(chart, now),
                const SizedBox(height: 20),
                if (activeMahaIndex != -1)
                  _buildActiveCycleCard(chart.dashas[activeMahaIndex], now),
                const SizedBox(height: 24),
                Text(
                  '120-Year Vimshottari Mahadasha Sequence',
                  style: GoogleFonts.cormorantGaramond(
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                    color: JyotiTheme.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Tap any planetary period to reveal hierarchical Antardasha and Pratyantardasha cycles.',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    color: JyotiTheme.textSecondary,
                  ),
                ),
                const SizedBox(height: 16),
                ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: chart.dashas.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, idx) {
                    final maha = chart.dashas[idx];
                    final isCurrent = now.isAfter(maha.startDate) && now.isBefore(maha.endDate);
                    final isExpanded = _expandedMahaIndex == idx;

                    return _buildMahaCard(maha, idx, isCurrent, isExpanded, now);
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildTimelineHeader(JyotiNatalBlueprint chart, DateTime now) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: JyotiTheme.surfaceGlass,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: JyotiTheme.borderSubtle),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: JyotiTheme.cosmicViolet.withOpacity(0.15),
                  border: Border.all(color: JyotiTheme.cosmicViolet.withOpacity(0.3)),
                ),
                child: const Icon(Icons.hourglass_top_rounded, color: JyotiTheme.cosmicViolet, size: 22),
              ),
              const SizedBox(width: 14),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Vimshottari Dasha Engine',
                    style: GoogleFonts.cormorantGaramond(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: JyotiTheme.textPrimary,
                    ),
                  ),
                  Text(
                    'Precision Lunar Nakshatra Timeline (${chart.ascendantNakshatra} Moon Reference)',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 12,
                      color: JyotiTheme.textSecondary,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: JyotiTheme.surfaceElevated,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: JyotiTheme.borderElevated),
            ),
            child: Text(
              'Current: ${DateFormat('yyyy').format(now)} CE',
              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: JyotiTheme.starlightAmber),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveCycleCard(JyotiDashaNode activeMaha, DateTime now) {
    final totalDays = activeMaha.endDate.difference(activeMaha.startDate).inDays;
    final elapsedDays = now.difference(activeMaha.startDate).inDays;
    final progress = (elapsedDays / totalDays).clamp(0.0, 1.0);

    JyotiDashaNode? activeAntar;
    for (final a in activeMaha.subPeriods) {
      if (now.isAfter(a.startDate) && now.isBefore(a.endDate)) {
        activeAntar = a;
        break;
      }
    }

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: JyotiTheme.surfaceGlass,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: JyotiTheme.electricIndigo.withOpacity(0.4)),
        gradient: LinearGradient(
          colors: [
            JyotiTheme.electricIndigo.withOpacity(0.12),
            JyotiTheme.cosmicViolet.withOpacity(0.04),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      color: JyotiTheme.cosmicEmerald,
                      boxShadow: [
                        BoxShadow(color: JyotiTheme.cosmicEmerald, blurRadius: 8),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'ACTIVE COSMIC PERIOD',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.8,
                      color: JyotiTheme.cosmicEmerald,
                    ),
                  ),
                ],
              ),
              Text(
                '${(progress * 100).toStringAsFixed(1)}% Completed',
                style: const TextStyle(fontSize: 11, color: JyotiTheme.textSecondary),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            '${activeMaha.lord} Mahadasha ${activeAntar != null ? "/ ${activeAntar.lord} Antardasha" : ""}',
            style: GoogleFonts.cormorantGaramond(
              fontSize: 24,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            '${DateFormat('dd MMM yyyy').format(activeMaha.startDate)} – ${DateFormat('dd MMM yyyy').format(activeMaha.endDate)} (${activeMaha.durationYears.toStringAsFixed(1)} years total)',
            style: const TextStyle(fontSize: 12, color: JyotiTheme.textSecondary),
          ),
          const SizedBox(height: 14),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: JyotiTheme.surfaceElevated,
              valueColor: const AlwaysStoppedAnimation<Color>(JyotiTheme.electricIndigo),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMahaCard(
    JyotiDashaNode maha,
    int idx,
    bool isCurrent,
    bool isExpanded,
    DateTime now,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: isCurrent ? JyotiTheme.surfaceElevated : JyotiTheme.surfaceGlass,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isCurrent ? JyotiTheme.electricIndigo.withOpacity(0.5) : JyotiTheme.borderSubtle,
        ),
      ),
      child: Column(
        children: [
          InkWell(
            onTap: () {
              setState(() {
                if (_expandedMahaIndex == idx) {
                  _expandedMahaIndex = null;
                  _expandedAntarIndex = null;
                } else {
                  _expandedMahaIndex = idx;
                  _expandedAntarIndex = null;
                }
              });
            },
            borderRadius: BorderRadius.circular(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isCurrent ? JyotiTheme.electricIndigo : JyotiTheme.spaceCanvas,
                      border: Border.all(
                        color: isCurrent ? Colors.white : JyotiTheme.borderElevated,
                      ),
                    ),
                    child: Center(
                      child: Text(
                        maha.lord.substring(0, 2),
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text(
                              '${maha.lord} Mahadasha',
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w600,
                                color: Colors.white,
                              ),
                            ),
                            if (isCurrent) ...[
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: JyotiTheme.cosmicEmerald.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: const Text(
                                  'NOW',
                                  style: TextStyle(
                                    fontSize: 9,
                                    fontWeight: FontWeight.w700,
                                    color: JyotiTheme.cosmicEmerald,
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${DateFormat('yyyy').format(maha.startDate)} – ${DateFormat('yyyy').format(maha.endDate)} (${maha.durationYears.toStringAsFixed(1)} yrs)',
                          style: const TextStyle(fontSize: 12, color: JyotiTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  Icon(
                    isExpanded ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down,
                    color: JyotiTheme.textMuted,
                  ),
                ],
              ),
            ),
          ),
          if (isExpanded) ...[
            const Divider(color: JyotiTheme.borderSubtle, height: 1),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Antardasha Sub-Cycles for ${maha.lord}',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: JyotiTheme.textMuted,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: maha.subPeriods.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 6),
                    itemBuilder: (context, aIdx) {
                      final antar = maha.subPeriods[aIdx];
                      final isAntarCurrent = now.isAfter(antar.startDate) && now.isBefore(antar.endDate);
                      final isAntarExpanded = _expandedAntarIndex == aIdx;

                      return _buildAntarCard(antar, aIdx, isAntarCurrent, isAntarExpanded, now);
                    },
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildAntarCard(
    JyotiDashaNode antar,
    int aIdx,
    bool isCurrent,
    bool isExpanded,
    DateTime now,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: isCurrent ? JyotiTheme.surfaceElevated : JyotiTheme.spaceCanvas,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: isCurrent ? JyotiTheme.cosmicViolet.withOpacity(0.5) : JyotiTheme.borderSubtle,
        ),
      ),
      child: Column(
        children: [
          InkWell(
            onTap: () {
              setState(() {
                _expandedAntarIndex = _expandedAntarIndex == aIdx ? null : aIdx;
              });
            },
            borderRadius: BorderRadius.circular(10),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              child: Row(
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isCurrent ? JyotiTheme.starlightAmber : JyotiTheme.textMuted,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      '${antar.lord} Antar',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: isCurrent ? FontWeight.w600 : FontWeight.w400,
                        color: isCurrent ? Colors.white : JyotiTheme.textSecondary,
                      ),
                    ),
                  ),
                  Text(
                    '${DateFormat('MMM yyyy').format(antar.startDate)} – ${DateFormat('MMM yyyy').format(antar.endDate)}',
                    style: const TextStyle(fontSize: 11, color: JyotiTheme.textMuted),
                  ),
                  const SizedBox(width: 6),
                  Icon(
                    isExpanded ? Icons.unfold_less : Icons.unfold_more,
                    size: 14,
                    color: JyotiTheme.textMuted,
                  ),
                ],
              ),
            ),
          ),
          if (isExpanded) ...[
            Container(
              padding: const EdgeInsets.all(10),
              color: const Color(0xFF07090E),
              child: Column(
                children: antar.subPeriods.map((praty) {
                  final isPratyCurrent = now.isAfter(praty.startDate) && now.isBefore(praty.endDate);
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${praty.lord} Pratyantar',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: isPratyCurrent ? FontWeight.w600 : FontWeight.w400,
                            color: isPratyCurrent ? JyotiTheme.starlightAmber : JyotiTheme.textMuted,
                          ),
                        ),
                        Text(
                          '${DateFormat('dd MMM yy').format(praty.startDate)} - ${DateFormat('dd MMM yy').format(praty.endDate)}',
                          style: const TextStyle(fontSize: 9, color: JyotiTheme.textMuted),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
