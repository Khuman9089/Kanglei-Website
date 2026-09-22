import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/models/jyoti_models.dart';
import '../../../core/state/jyoti_providers.dart';
import '../../../core/theme/jyoti_theme.dart';
import '../../widgets/birth_input_modal.dart';

/// Celestial Natal Chart Studio for Jyoti AI
class JyotiChartView extends ConsumerWidget {
  const JyotiChartView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(jyotiUserProvider);
    final chartAsync = ref.watch(jyotiChartProvider);
    final chartType = ref.watch(jyotiChartTypeProvider);

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: chartAsync.when(
        loading: () => const Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(color: JyotiTheme.electricIndigo),
              SizedBox(height: 16),
              Text(
                'Aligning celestial coordinates & computing harmonic matrix...',
                style: TextStyle(color: JyotiTheme.textSecondary, fontSize: 13),
              ),
            ],
          ),
        ),
        error: (err, stack) => Center(
          child: Text(
            'Error resolving chart: $err',
            style: const TextStyle(color: JyotiTheme.stellarRose),
          ),
        ),
        data: (chart) {
          return LayoutBuilder(
            builder: (context, constraints) {
              final isWide = constraints.maxWidth > 900;
              return SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildChartHeader(context, user, chart),
                    const SizedBox(height: 20),
                    if (isWide)
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            flex: 5,
                            child: _buildChartCanvasCard(context, ref, chart, chartType),
                          ),
                          const SizedBox(width: 20),
                          Expanded(
                            flex: 4,
                            child: _buildPlanetsColumn(chart),
                          ),
                        ],
                      )
                    else
                      Column(
                        children: [
                          _buildChartCanvasCard(context, ref, chart, chartType),
                          const SizedBox(height: 20),
                          _buildPlanetsColumn(chart),
                        ],
                      ),
                    const SizedBox(height: 24),
                    _buildBhavasMatrix(chart),
                  ],
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildChartHeader(
    BuildContext context,
    JyotiUserProfile user,
    JyotiNatalBlueprint chart,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: JyotiTheme.surfaceGlass,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: JyotiTheme.borderSubtle),
        gradient: const LinearGradient(
          colors: [Color(0xFF131A29), Color(0xFF0C101A)],
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
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: JyotiTheme.astralEnergyGradient,
                      boxShadow: [
                        BoxShadow(
                          color: JyotiTheme.electricIndigo.withOpacity(0.3),
                          blurRadius: 16,
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Icon(Icons.auto_awesome, color: Colors.white, size: 22),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        user.fullName,
                        style: GoogleFonts.cormorantGaramond(
                          fontSize: 24,
                          fontWeight: FontWeight.w700,
                          color: JyotiTheme.textPrimary,
                        ),
                      ),
                      Text(
                        '${DateFormat('dd MMMM yyyy, HH:mm').format(user.birthDateTime)} • ${user.locationName}',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 12,
                          color: JyotiTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              OutlinedButton.icon(
                onPressed: () => JyotiBirthInputModal.show(context),
                icon: const Icon(Icons.tune, size: 14, color: JyotiTheme.electricIndigo),
                label: Text(
                  'Calibrate',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: JyotiTheme.textPrimary,
                  ),
                ),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: JyotiTheme.borderElevated),
                  backgroundColor: JyotiTheme.surfaceElevated,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(color: JyotiTheme.borderSubtle, height: 1),
          const SizedBox(height: 14),
          Wrap(
            spacing: 12,
            runSpacing: 8,
            children: [
              _buildMetricBadge('Ascendant / Lagna', '${chart.ascendantSign} (${chart.ascendantDegree.toStringAsFixed(1)}°)', JyotiTheme.electricIndigo),
              _buildMetricBadge('Asc Nakshatra', chart.ascendantNakshatra, JyotiTheme.cosmicViolet),
              _buildMetricBadge('Chart Ruler', chart.chartRuler, JyotiTheme.starlightAmber),
              _buildMetricBadge('Dominant Element', chart.dominantElement, JyotiTheme.nebulaCyan),
              _buildMetricBadge('Ayanamsha', '${chart.ayanamsaName} (${chart.ayanamsaValue.toStringAsFixed(2)}°)', JyotiTheme.textMuted),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricBadge(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: JyotiTheme.surfaceElevated,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(shape: BoxShape.circle, color: color),
          ),
          const SizedBox(width: 8),
          Text(
            '$label: ',
            style: const TextStyle(fontSize: 11, color: JyotiTheme.textMuted),
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Colors.white),
          ),
        ],
      ),
    );
  }

  Widget _buildChartCanvasCard(
    BuildContext context,
    WidgetRef ref,
    JyotiNatalBlueprint chart,
    String chartType,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: JyotiTheme.surfaceGlass,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: JyotiTheme.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Kundali Matrix (D1 Natal)',
                style: GoogleFonts.cormorantGaramond(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: JyotiTheme.textPrimary,
                ),
              ),
              Row(
                children: [
                  _buildStyleTab(
                    'North Indian',
                    chartType == 'North Indian',
                    () => ref.read(jyotiChartTypeProvider.notifier).state = 'North Indian',
                  ),
                  const SizedBox(width: 6),
                  _buildStyleTab(
                    'South Indian',
                    chartType == 'South Indian',
                    () => ref.read(jyotiChartTypeProvider.notifier).state = 'South Indian',
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          Center(
            child: AspectRatio(
              aspectRatio: 1.0,
              child: Container(
                constraints: const BoxConstraints(maxWidth: 450, maxHeight: 450),
                child: CustomPaint(
                  painter: chartType == 'North Indian'
                      ? JyotiNorthIndianChartPainter(chart)
                      : JyotiSouthIndianChartPainter(chart),
                  child: Container(),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStyleTab(String text, bool active, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: active ? JyotiTheme.electricIndigo.withOpacity(0.2) : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: active ? JyotiTheme.electricIndigo : JyotiTheme.borderSubtle,
          ),
        ),
        child: Text(
          text,
          style: TextStyle(
            fontSize: 11,
            fontWeight: active ? FontWeight.w600 : FontWeight.w400,
            color: active ? Colors.white : JyotiTheme.textMuted,
          ),
        ),
      ),
    );
  }

  Widget _buildPlanetsColumn(JyotiNatalBlueprint chart) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: JyotiTheme.surfaceGlass,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: JyotiTheme.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Planetary Vibrations',
                style: GoogleFonts.cormorantGaramond(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: JyotiTheme.textPrimary,
                ),
              ),
              Text(
                '${chart.planets.length} Celestial Bodies',
                style: const TextStyle(fontSize: 11, color: JyotiTheme.textMuted),
              ),
            ],
          ),
          const SizedBox(height: 14),
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: chart.planets.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (context, idx) {
              final p = chart.planets[idx];
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                decoration: BoxDecoration(
                  color: JyotiTheme.surfaceElevated,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: JyotiTheme.borderSubtle),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: JyotiTheme.spaceCanvas,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: JyotiTheme.borderElevated),
                      ),
                      child: Center(
                        child: Text(
                          p.glyph,
                          style: TextStyle(
                            fontSize: 16,
                            color: p.id == 'su'
                                ? JyotiTheme.starlightAmber
                                : p.id == 'mo'
                                    ? Colors.white
                                    : JyotiTheme.electricIndigo,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                p.name,
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white,
                                ),
                              ),
                              if (p.isRetrograde) ...[
                                const SizedBox(width: 4),
                                const Text(
                                  '(R)',
                                  style: TextStyle(fontSize: 10, color: JyotiTheme.stellarRose),
                                ),
                              ],
                              const SizedBox(width: 8),
                              _buildDignityTag(p.dignity),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${p.signName} ${p.degreeInSign.toStringAsFixed(1)}° • H${p.houseNumber}',
                            style: const TextStyle(fontSize: 11, color: JyotiTheme.textSecondary),
                          ),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          p.nakshatra,
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w500,
                            color: JyotiTheme.cosmicViolet,
                          ),
                        ),
                        Text(
                          'Pada ${p.pada} • ${p.nakshatraLord}',
                          style: const TextStyle(fontSize: 10, color: JyotiTheme.textMuted),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDignityTag(String dignity) {
    Color color = JyotiTheme.textMuted;
    if (dignity == 'Exalted') color = JyotiTheme.cosmicEmerald;
    if (dignity == 'Own Sign') color = JyotiTheme.electricIndigo;
    if (dignity == 'Debilitated') color = JyotiTheme.stellarRose;

    if (dignity == 'Neutral') return const SizedBox.shrink();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Text(
        dignity,
        style: TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: color),
      ),
    );
  }

  Widget _buildBhavasMatrix(JyotiNatalBlueprint chart) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: JyotiTheme.surfaceGlass,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: JyotiTheme.borderSubtle),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '12 Bhavas (House Cusps & Lords)',
            style: GoogleFonts.cormorantGaramond(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: JyotiTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 14),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 180,
              mainAxisExtent: 90,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
            ),
            itemCount: chart.bhavas.length,
            itemBuilder: (context, idx) {
              final b = chart.bhavas[idx];
              return Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: JyotiTheme.surfaceElevated,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: JyotiTheme.borderSubtle),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'House ${b.houseNumber}',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: JyotiTheme.electricIndigo,
                          ),
                        ),
                        Text(
                          '${b.cuspDegree.toStringAsFixed(0)}°',
                          style: const TextStyle(fontSize: 10, color: JyotiTheme.textMuted),
                        ),
                      ],
                    ),
                    Text(
                      b.signName,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      'Lord: ${b.lord} ${b.occupyingPlanetIds.isNotEmpty ? "• [${b.occupyingPlanetIds.join(',')}]" : ""}',
                      style: const TextStyle(fontSize: 10, color: JyotiTheme.textSecondary),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class JyotiNorthIndianChartPainter extends CustomPainter {
  final JyotiNatalBlueprint chart;

  JyotiNorthIndianChartPainter(this.chart);

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    final borderPaint = Paint()
      ..color = JyotiTheme.borderHighlight
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;

    final innerLinePaint = Paint()
      ..color = JyotiTheme.borderElevated
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;

    final fillPaint = Paint()
      ..color = const Color(0xFF0C101A)
      ..style = PaintingStyle.fill;

    final rect = Rect.fromLTWH(0, 0, w, h);
    canvas.drawRect(rect, fillPaint);
    canvas.drawRect(rect, borderPaint);

    canvas.drawLine(const Offset(0, 0), Offset(w, h), innerLinePaint);
    canvas.drawLine(Offset(w, 0), Offset(0, h), innerLinePaint);

    final diamondPath = Path()
      ..moveTo(w / 2, 0)
      ..lineTo(w, h / 2)
      ..lineTo(w / 2, h)
      ..lineTo(0, h / 2)
      ..close();
    canvas.drawPath(diamondPath, innerLinePaint);

    final ascSignIdx = chart.ascendantSignIndex;

    _drawHouseContent(canvas, 1, Offset(w / 2, h * 0.25), ascSignIdx, w);
    _drawHouseContent(canvas, 2, Offset(w * 0.25, h * 0.12), (ascSignIdx % 12) + 1, w);
    _drawHouseContent(canvas, 3, Offset(w * 0.12, h * 0.25), ((ascSignIdx + 1) % 12) + 1, w);
    _drawHouseContent(canvas, 4, Offset(w * 0.25, h / 2), ((ascSignIdx + 2) % 12) + 1, w);
    _drawHouseContent(canvas, 5, Offset(w * 0.12, h * 0.75), ((ascSignIdx + 3) % 12) + 1, w);
    _drawHouseContent(canvas, 6, Offset(w * 0.25, h * 0.88), ((ascSignIdx + 4) % 12) + 1, w);
    _drawHouseContent(canvas, 7, Offset(w / 2, h * 0.75), ((ascSignIdx + 5) % 12) + 1, w);
    _drawHouseContent(canvas, 8, Offset(w * 0.75, h * 0.88), ((ascSignIdx + 6) % 12) + 1, w);
    _drawHouseContent(canvas, 9, Offset(w * 0.88, h * 0.75), ((ascSignIdx + 7) % 12) + 1, w);
    _drawHouseContent(canvas, 10, Offset(w * 0.75, h / 2), ((ascSignIdx + 8) % 12) + 1, w);
    _drawHouseContent(canvas, 11, Offset(w * 0.88, h * 0.25), ((ascSignIdx + 9) % 12) + 1, w);
    _drawHouseContent(canvas, 12, Offset(w * 0.75, h * 0.12), ((ascSignIdx + 10) % 12) + 1, w);
  }

  void _drawHouseContent(
    Canvas canvas,
    int houseNumber,
    Offset center,
    int signNumber,
    double canvasWidth,
  ) {
    final textPainter = TextPainter(
      text: TextSpan(
        text: '$signNumber',
        style: const TextStyle(
          color: JyotiTheme.textMuted,
          fontSize: 10,
          fontWeight: FontWeight.w700,
        ),
      ),
      textDirection: TextDirection.ltr,
    );
    textPainter.layout();
    textPainter.paint(canvas, center - Offset(textPainter.width / 2, 14));

    final planetsInHouse = chart.planets.where((p) => p.houseNumber == houseNumber).toList();
    if (planetsInHouse.isNotEmpty) {
      final pText = planetsInHouse.map((p) => '${p.glyph} ${p.name.substring(0, math.min(2, p.name.length))}').join(' ');
      final pPainter = TextPainter(
        text: TextSpan(
          text: pText,
          style: const TextStyle(
            color: JyotiTheme.starlightAmber,
            fontSize: 10,
            fontWeight: FontWeight.w600,
          ),
        ),
        textDirection: TextDirection.ltr,
      );
      pPainter.layout();
      pPainter.paint(canvas, center - Offset(pPainter.width / 2, -2));
    }
  }

  @override
  bool shouldRepaint(covariant JyotiNorthIndianChartPainter oldDelegate) {
    return oldDelegate.chart != chart;
  }
}

class JyotiSouthIndianChartPainter extends CustomPainter {
  final JyotiNatalBlueprint chart;

  JyotiSouthIndianChartPainter(this.chart);

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final cellW = w / 4.0;
    final cellH = h / 4.0;

    final borderPaint = Paint()
      ..color = JyotiTheme.borderHighlight
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;

    final linePaint = Paint()
      ..color = JyotiTheme.borderElevated
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;

    final bgPaint = Paint()
      ..color = const Color(0xFF0C101A)
      ..style = PaintingStyle.fill;

    canvas.drawRect(Rect.fromLTWH(0, 0, w, h), bgPaint);
    canvas.drawRect(Rect.fromLTWH(0, 0, w, h), borderPaint);

    for (int i = 1; i < 4; i++) {
      canvas.drawLine(Offset(cellW * i, 0), Offset(cellW * i, h), linePaint);
      canvas.drawLine(Offset(0, cellH * i), Offset(w, cellH * i), linePaint);
    }

    final centerRect = Rect.fromLTWH(cellW, cellH, cellW * 2, cellH * 2);
    canvas.drawRect(centerRect, Paint()..color = const Color(0xFF07090E));
    canvas.drawRect(centerRect, borderPaint);

    final signGridPositions = [
      const Point(1, 0),
      const Point(2, 0),
      const Point(3, 0),
      const Point(3, 1),
      const Point(3, 2),
      const Point(3, 3),
      const Point(2, 3),
      const Point(1, 3),
      const Point(0, 3),
      const Point(0, 2),
      const Point(0, 1),
      const Point(0, 0),
    ];

    for (int i = 0; i < 12; i++) {
      final pt = signGridPositions[i];
      final signNum = i + 1;
      final cellX = pt.x * cellW;
      final cellY = pt.y * cellH;

      final isAsc = chart.ascendantSignIndex == signNum;
      if (isAsc) {
        canvas.drawLine(
          Offset(cellX, cellY),
          Offset(cellX + cellW, cellY + cellH),
          Paint()
            ..color = JyotiTheme.electricIndigo.withOpacity(0.5)
            ..strokeWidth = 1.5,
        );
      }

      final planetsInSign = chart.planets.where((p) => p.signIndex == signNum).toList();
      var pString = isAsc ? 'Asc ' : '';
      pString += planetsInSign.map((p) => p.glyph).join(' ');

      final textPainter = TextPainter(
        text: TextSpan(
          text: pString,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 11,
            fontWeight: FontWeight.w600,
          ),
        ),
        textDirection: TextDirection.ltr,
      );
      textPainter.layout();
      textPainter.paint(
        canvas,
        Offset(cellX + (cellW - textPainter.width) / 2, cellY + (cellH - textPainter.height) / 2),
      );
    }
  }

  @override
  bool shouldRepaint(covariant JyotiSouthIndianChartPainter oldDelegate) {
    return oldDelegate.chart != chart;
  }
}
