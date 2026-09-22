import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/state/jyoti_providers.dart';
import '../../../core/theme/jyoti_theme.dart';

/// Daily Autonomous Celestial Intelligence & Transits for Jyoti AI
class JyotiDailyOracleView extends ConsumerWidget {
  const JyotiDailyOracleView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(jyotiUserProvider);
    final chartAsync = ref.watch(jyotiChartProvider);
    final now = DateTime.now();

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildDailyPulseCard(now, user),
            const SizedBox(height: 20),
            chartAsync.when(
              loading: () => const Center(
                child: CircularProgressIndicator(color: JyotiTheme.electricIndigo),
              ),
              error: (e, _) => const SizedBox.shrink(),
              data: (chart) => _buildResonanceGrid(chart),
            ),
            const SizedBox(height: 20),
            _buildActionWindows(),
            const SizedBox(height: 20),
            _buildCosmicSynthesisCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildDailyPulseCard(DateTime now, dynamic user) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          colors: [Color(0xFF1B1B38), Color(0xFF0F121C)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        border: Border.all(color: JyotiTheme.cosmicViolet.withOpacity(0.3)),
        boxShadow: [
          BoxShadow(
            color: JyotiTheme.cosmicViolet.withOpacity(0.1),
            blurRadius: 24,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: JyotiTheme.cosmicViolet.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: JyotiTheme.cosmicViolet),
                ),
                child: const Text(
                  'JYOTI DAILY ORACLE',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.8,
                    color: Colors.white,
                  ),
                ),
              ),
              Text(
                DateFormat('EEEE, MMMM d, yyyy').format(now),
                style: const TextStyle(fontSize: 12, color: JyotiTheme.textSecondary),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Harmonic Conjunction & Solar Radiance',
            style: GoogleFonts.cormorantGaramond(
              fontSize: 28,
              fontWeight: FontWeight.w700,
              color: JyotiTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'The celestial ether vibrates with heightened mental acuity today. Jupiter casts an auspicious trine to natal configurations, favoring strategic contracts, architectural creation, and decisive intellectual sovereignty.',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13,
              height: 1.6,
              color: JyotiTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResonanceGrid(dynamic chart) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth > 700;
        return GridView.count(
          crossAxisCount: isWide ? 4 : 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          childAspectRatio: isWide ? 1.4 : 1.2,
          children: [
            _buildMetricCard('Cosmic Resonance', '94%', Icons.speed, JyotiTheme.cosmicEmerald),
            _buildMetricCard('Lunar Phase', 'Waxing Gibbous', Icons.nightlight_round, JyotiTheme.starlightAmber),
            _buildMetricCard('Transit Nakshatra', 'Rohini (Moon)', Icons.star_border, JyotiTheme.electricIndigo),
            _buildMetricCard('Dominant Wave', 'High Intellect', Icons.waves, JyotiTheme.cosmicViolet),
          ],
        );
      },
    );
  }

  Widget _buildMetricCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: JyotiTheme.surfaceGlass,
        borderRadius: BorderRadius.circular(16),
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
                title,
                style: const TextStyle(fontSize: 11, color: JyotiTheme.textMuted),
              ),
              Icon(icon, size: 16, color: color),
            ],
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionWindows() {
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
            'Auspicious Muhurta Windows',
            style: GoogleFonts.cormorantGaramond(
              fontSize: 20,
              fontWeight: FontWeight.w700,
              color: JyotiTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 14),
          _buildTimingRow(
            'Abhijit Muhurta (Peak Clarity)',
            '11:42 AM – 12:30 PM',
            'Optimal for decisive negotiations, system deployments, and strategic signatures.',
            JyotiTheme.starlightAmber,
          ),
          const Divider(color: JyotiTheme.borderSubtle, height: 20),
          _buildTimingRow(
            'Amrita Siddhi Window',
            '03:15 PM – 04:50 PM',
            'Elevated creative focus, harmonic communications, and long-term planning.',
            JyotiTheme.cosmicEmerald,
          ),
          const Divider(color: JyotiTheme.borderSubtle, height: 20),
          _buildTimingRow(
            'Rahu Kaal (Avoid Major Inceptions)',
            '07:30 AM – 09:00 AM',
            'Reserve for introspection, debugging, and quiet contemplative alignment.',
            JyotiTheme.stellarRose,
          ),
        ],
      ),
    );
  }

  Widget _buildTimingRow(String title, String time, String desc, Color color) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          margin: const EdgeInsets.only(top: 4),
          width: 8,
          height: 8,
          decoration: BoxDecoration(shape: BoxShape.circle, color: color),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    title,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: Colors.white),
                  ),
                  Text(
                    time,
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: color),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                desc,
                style: const TextStyle(fontSize: 11, color: JyotiTheme.textSecondary),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCosmicSynthesisCard() {
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
            children: [
              const Icon(Icons.psychology_outlined, color: JyotiTheme.electricIndigo, size: 20),
              const SizedBox(width: 10),
              Text(
                'Oracle Mindset Directive',
                style: GoogleFonts.cormorantGaramond(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: JyotiTheme.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            '"The celestial movements do not dictate destiny; they illuminate the currents of possibility. Sail with the astral wind by executing with precision and unclouded intention."',
            style: GoogleFonts.cormorantGaramond(
              fontSize: 15,
              fontStyle: FontStyle.italic,
              color: JyotiTheme.textGold,
            ),
          ),
        ],
      ),
    );
  }
}
