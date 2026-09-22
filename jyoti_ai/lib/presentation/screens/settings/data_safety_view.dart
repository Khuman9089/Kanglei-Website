import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/config/jyoti_config.dart';
import '../../../core/state/jyoti_providers.dart';
import '../../../core/theme/jyoti_theme.dart';

/// In-App Privacy, Data Safety & Account Deletion Portal
/// Fully compliant with Google Play Store Data Safety & Account Deletion Policy.
class JyotiDataSafetyView extends ConsumerStatefulWidget {
  const JyotiDataSafetyView({super.key});

  @override
  ConsumerState<JyotiDataSafetyView> createState() => _JyotiDataSafetyViewState();
}

class _JyotiDataSafetyViewState extends ConsumerState<JyotiDataSafetyView> {
  bool _isDeleting = false;
  String? _successMessage;

  Future<void> _launchWebDeletionUrl() async {
    final uri = Uri.parse(JyotiConfig.publicAccountDeletionUrl);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _confirmAccountDeletion(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      barrierColor: Colors.black.withOpacity(0.8),
      builder: (ctx) => AlertDialog(
        backgroundColor: JyotiTheme.surfaceGlass,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: JyotiTheme.stellarRose, width: 1.2),
        ),
        title: Row(
          children: [
            const Icon(Icons.warning_amber_rounded, color: JyotiTheme.stellarRose, size: 24),
            const SizedBox(width: 10),
            Text(
              'Delete Account & All Data',
              style: GoogleFonts.cormorantGaramond(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
          ],
        ),
        content: Text(
          'This will permanently delete your Jyoti AI user profile, birth coordinates, cached natal blueprints, and conversational AI memory from this device and notify our servers.\n\nThis action is irreversible.',
          style: GoogleFonts.plusJakartaSans(
            fontSize: 13,
            height: 1.5,
            color: JyotiTheme.textSecondary,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancel', style: TextStyle(color: JyotiTheme.textSecondary)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: JyotiTheme.stellarRose,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('Permanently Delete', style: TextStyle(fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      setState(() => _isDeleting = true);
      await ref.read(jyotiUserProvider.notifier).deleteAccountAndAllData();
      ref.read(jyotiChatProvider.notifier).clearChat();
      setState(() {
        _isDeleting = false;
        _successMessage = 'All personal data, cached blueprints, and account records have been permanently deleted.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(jyotiUserProvider);

    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            _buildHeader(),
            const SizedBox(height: 20),

            if (_successMessage != null) ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: JyotiTheme.cosmicEmerald.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: JyotiTheme.cosmicEmerald),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.check_circle_outline, color: JyotiTheme.cosmicEmerald, size: 20),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        _successMessage!,
                        style: const TextStyle(fontSize: 12, color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Active Data Summary
            _buildActiveDataCard(user),
            const SizedBox(height: 20),

            // Google Play Data Safety Disclosures
            _buildDataSafetyDisclosures(),
            const SizedBox(height: 20),

            // In-App Deletion & Web Resource Card
            _buildDeletionActionsCard(context),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: JyotiTheme.surfaceGlass,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: JyotiTheme.borderSubtle),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: JyotiTheme.electricIndigo.withOpacity(0.15),
              border: Border.all(color: JyotiTheme.electricIndigo.withOpacity(0.3)),
            ),
            child: const Icon(Icons.security_rounded, color: JyotiTheme.electricIndigo, size: 22),
          ),
          const SizedBox(width: 14),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Data Safety & Privacy Controls',
                style: GoogleFonts.cormorantGaramond(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: JyotiTheme.textPrimary,
                ),
              ),
              Text(
                'Transparency, Sandboxing, & Complete Account Deletion (Google Play Compliant)',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  color: JyotiTheme.textSecondary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActiveDataCard(dynamic user) {
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
            'Locally Stored Data Profile',
            style: GoogleFonts.cormorantGaramond(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 12),
          _buildDataRow('Account Identifier', user.id),
          _buildDataRow('Full Name / Handle', user.fullName),
          _buildDataRow('Birth Coordinates', '${user.latitude}°N, ${user.longitude}°E (${user.locationName})'),
          _buildDataRow('Timezone Offset', 'UTC +${user.timezoneOffset}'),
          _buildDataRow('Local Storage Sandbox', 'Namespaced under "jyoti_*" (Zero host-domain data sharing)'),
        ],
      ),
    );
  }

  Widget _buildDataRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 160,
            child: Text(
              label,
              style: const TextStyle(fontSize: 12, color: JyotiTheme.textMuted),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDataSafetyDisclosures() {
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
              const Icon(Icons.verified_user_outlined, color: JyotiTheme.cosmicEmerald, size: 18),
              const SizedBox(width: 8),
              Text(
                'Google Play Data Safety Disclosures',
                style: GoogleFonts.cormorantGaramond(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          _buildSafetyPoint(
            'Data Encryption in Transit',
            'All ephemeral astrological calculations and AI syntheses use TLS/HTTPS encryption.',
          ),
          _buildSafetyPoint(
            'Zero Third-Party Data Sharing',
            'We do not sell, rent, or share personal birth coordinates or chat logs with third-party advertising networks.',
          ),
          _buildSafetyPoint(
            'Full Data Deletion Mechanism',
            'Users can delete their account and associated data immediately within this app or via our public web deletion link.',
          ),
        ],
      ),
    );
  }

  Widget _buildSafetyPoint(String title, String desc) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.check, size: 14, color: JyotiTheme.cosmicEmerald),
          const SizedBox(width: 10),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: GoogleFonts.plusJakartaSans(fontSize: 12, color: JyotiTheme.textSecondary),
                children: [
                  TextSpan(
                    text: '$title: ',
                    style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.white),
                  ),
                  TextSpan(text: desc),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDeletionActionsCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: JyotiTheme.surfaceGlass,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: JyotiTheme.stellarRose.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Account & Personal Data Deletion Actions',
            style: GoogleFonts.cormorantGaramond(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: JyotiTheme.stellarRose,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Choose your preferred method to delete your account and associated data. You can delete directly inside this app or visit our public web deletion resource.',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 12,
              color: JyotiTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 12,
            runSpacing: 10,
            children: [
              // In-App Deletion Button
              ElevatedButton.icon(
                onPressed: _isDeleting ? null : () => _confirmAccountDeletion(context),
                icon: _isDeleting
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Icon(Icons.delete_forever, size: 16),
                label: Text(
                  _isDeleting ? 'Deleting Data...' : 'Delete App Account & Data (In-App)',
                  style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: JyotiTheme.stellarRose,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),

              // Web Link Resource Button
              OutlinedButton.icon(
                onPressed: _launchWebDeletionUrl,
                icon: const Icon(Icons.open_in_new, size: 15, color: JyotiTheme.electricIndigo),
                label: const Text(
                  'Web Deletion Portal (Public Link)',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13, color: Colors.white),
                ),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: JyotiTheme.borderElevated),
                  backgroundColor: JyotiTheme.surfaceElevated,
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
