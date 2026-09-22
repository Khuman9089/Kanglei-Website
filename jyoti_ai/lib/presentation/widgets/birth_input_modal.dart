import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../core/state/jyoti_providers.dart';
import '../../core/theme/jyoti_theme.dart';

/// Modal dialog to input or edit birth parameters for Jyoti AI
class JyotiBirthInputModal extends ConsumerStatefulWidget {
  const JyotiBirthInputModal({super.key});

  static Future<void> show(BuildContext context) {
    return showDialog(
      context: context,
      barrierColor: Colors.black.withOpacity(0.75),
      builder: (context) => const JyotiBirthInputModal(),
    );
  }

  @override
  ConsumerState<JyotiBirthInputModal> createState() => _JyotiBirthInputModalState();
}

class _JyotiBirthInputModalState extends ConsumerState<JyotiBirthInputModal> {
  late TextEditingController _nameCtrl;
  late TextEditingController _placeCtrl;
  late TextEditingController _latCtrl;
  late TextEditingController _lonCtrl;
  late TextEditingController _tzCtrl;
  late DateTime _selectedDate;
  late TimeOfDay _selectedTime;
  String _selectedAyanamsa = 'Lahiri';

  @override
  void initState() {
    super.initState();
    final user = ref.read(jyotiUserProvider);
    _nameCtrl = TextEditingController(text: user.fullName);
    _placeCtrl = TextEditingController(text: user.locationName);
    _latCtrl = TextEditingController(text: user.latitude.toString());
    _lonCtrl = TextEditingController(text: user.longitude.toString());
    _tzCtrl = TextEditingController(text: user.timezoneOffset.toString());
    _selectedDate = user.birthDateTime;
    _selectedTime = TimeOfDay(hour: user.birthDateTime.hour, minute: user.birthDateTime.minute);
    _selectedAyanamsa = user.ayanamsa;
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _placeCtrl.dispose();
    _latCtrl.dispose();
    _lonCtrl.dispose();
    _tzCtrl.dispose();
    super.dispose();
  }

  void _applyPreset(String name, double lat, double lon, double tz, String place) {
    setState(() {
      _placeCtrl.text = place;
      _latCtrl.text = lat.toString();
      _lonCtrl.text = lon.toString();
      _tzCtrl.text = tz.toString();
    });
  }

  void _save() {
    final lat = double.tryParse(_latCtrl.text) ?? 24.8170;
    final lon = double.tryParse(_lonCtrl.text) ?? 93.9368;
    final tz = double.tryParse(_tzCtrl.text) ?? 5.5;

    final birthDateTime = DateTime(
      _selectedDate.year,
      _selectedDate.month,
      _selectedDate.day,
      _selectedTime.hour,
      _selectedTime.minute,
    );

    ref.read(jyotiUserProvider.notifier).updateProfile(
          fullName: _nameCtrl.text.trim().isEmpty ? 'Aether Seeker' : _nameCtrl.text.trim(),
          birthDateTime: birthDateTime,
          latitude: lat,
          longitude: lon,
          timezoneOffset: tz,
          locationName: _placeCtrl.text.trim().isEmpty ? 'Selected Coordinates' : _placeCtrl.text.trim(),
          ayanamsa: _selectedAyanamsa,
        );

    Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final isDesktop = MediaQuery.of(context).size.width > 600;

    return Dialog(
      backgroundColor: JyotiTheme.surfaceGlass,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: const BorderSide(color: JyotiTheme.borderElevated, width: 1.2),
      ),
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: Container(
        width: isDesktop ? 540 : double.infinity,
        constraints: const BoxConstraints(maxHeight: 700),
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          gradient: const LinearGradient(
            colors: [Color(0xFF141A29), Color(0xFF0C101A)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: JyotiTheme.electricIndigo.withOpacity(0.15),
              blurRadius: 32,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: JyotiTheme.astralEnergyGradient,
                        ),
                        child: const Icon(Icons.auto_awesome, color: Colors.white, size: 18),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Jyoti Natal Calibration',
                        style: GoogleFonts.cormorantGaramond(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: JyotiTheme.textPrimary,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: JyotiTheme.textSecondary),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                'Enter precise birth coordinates to configure your high-precision sidereal matrix.',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 12,
                  color: JyotiTheme.textSecondary,
                ),
              ),
              const SizedBox(height: 20),

              _buildFieldLabel('Full Name / Identifier'),
              const SizedBox(height: 6),
              TextField(
                controller: _nameCtrl,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: const InputDecoration(
                  hintText: 'e.g. Maya Lin',
                  prefixIcon: Icon(Icons.person_outline, color: JyotiTheme.electricIndigo, size: 18),
                ),
              ),
              const SizedBox(height: 16),

              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildFieldLabel('Date of Birth'),
                        const SizedBox(height: 6),
                        InkWell(
                          onTap: () async {
                            final picked = await showDatePicker(
                              context: context,
                              initialDate: _selectedDate,
                              firstDate: DateTime(1900),
                              lastDate: DateTime.now().add(const Duration(days: 365)),
                            );
                            if (picked != null) {
                              setState(() => _selectedDate = picked);
                            }
                          },
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                            decoration: BoxDecoration(
                              color: JyotiTheme.surfaceGlass,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: JyotiTheme.borderSubtle),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.calendar_today_outlined, color: JyotiTheme.electricIndigo, size: 16),
                                const SizedBox(width: 8),
                                Text(
                                  DateFormat('dd MMM yyyy').format(_selectedDate),
                                  style: const TextStyle(color: Colors.white, fontSize: 13),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildFieldLabel('Time of Birth'),
                        const SizedBox(height: 6),
                        InkWell(
                          onTap: () async {
                            final picked = await showTimePicker(
                              context: context,
                              initialTime: _selectedTime,
                            );
                            if (picked != null) {
                              setState(() => _selectedTime = picked);
                            }
                          },
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                            decoration: BoxDecoration(
                              color: JyotiTheme.surfaceGlass,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: JyotiTheme.borderSubtle),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.access_time_outlined, color: JyotiTheme.cosmicViolet, size: 16),
                                const SizedBox(width: 8),
                                Text(
                                  _selectedTime.format(context),
                                  style: const TextStyle(color: Colors.white, fontSize: 13),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              _buildFieldLabel('Birth City / Region'),
              const SizedBox(height: 6),
              TextField(
                controller: _placeCtrl,
                style: const TextStyle(color: Colors.white, fontSize: 14),
                decoration: const InputDecoration(
                  hintText: 'e.g. New York, London, Imphal, Tokyo',
                  prefixIcon: Icon(Icons.location_on_outlined, color: JyotiTheme.starlightAmber, size: 18),
                ),
              ),
              const SizedBox(height: 12),

              Wrap(
                spacing: 8,
                runSpacing: 6,
                children: [
                  _buildPresetChip('Imphal (IST +5.5)', 24.8170, 93.9368, 5.5, 'Imphal, India'),
                  _buildPresetChip('London (GMT +0)', 51.5074, -0.1278, 0.0, 'London, UK'),
                  _buildPresetChip('New York (EDT -4)', 40.7128, -74.0060, -4.0, 'New York, USA'),
                  _buildPresetChip('Tokyo (JST +9)', 35.6762, 139.6503, 9.0, 'Tokyo, Japan'),
                ],
              ),
              const SizedBox(height: 16),

              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildFieldLabel('Latitude (°N)'),
                        const SizedBox(height: 4),
                        TextField(
                          controller: _latCtrl,
                          keyboardType: const TextInputType.numberWithOptions(decimal: true, signed: true),
                          style: const TextStyle(color: Colors.white, fontSize: 13),
                          decoration: const InputDecoration(hintText: '24.8170'),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildFieldLabel('Longitude (°E)'),
                        const SizedBox(height: 4),
                        TextField(
                          controller: _lonCtrl,
                          keyboardType: const TextInputType.numberWithOptions(decimal: true, signed: true),
                          style: const TextStyle(color: Colors.white, fontSize: 13),
                          decoration: const InputDecoration(hintText: '93.9368'),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildFieldLabel('UTC Offset (hrs)'),
                        const SizedBox(height: 4),
                        TextField(
                          controller: _tzCtrl,
                          keyboardType: const TextInputType.numberWithOptions(decimal: true, signed: true),
                          style: const TextStyle(color: Colors.white, fontSize: 13),
                          decoration: const InputDecoration(hintText: '+5.5'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              _buildFieldLabel('Astronomical Ephemeris Model'),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: JyotiTheme.surfaceGlass,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: JyotiTheme.borderSubtle),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedAyanamsa,
                    isExpanded: true,
                    dropdownColor: JyotiTheme.surfaceElevated,
                    style: const TextStyle(color: Colors.white, fontSize: 13),
                    items: const [
                      DropdownMenuItem(
                        value: 'Lahiri',
                        child: Text('Lahiri (Swiss Ephemeris SE_SIDM_LAHIRI) — Default'),
                      ),
                      DropdownMenuItem(
                        value: 'Krishnamurti',
                        child: Text('KP (Krishnamurti Paddhati)'),
                      ),
                      DropdownMenuItem(
                        value: 'Raman',
                        child: Text('B.V. Raman'),
                      ),
                    ],
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedAyanamsa = val);
                    },
                  ),
                ),
              ),
              const SizedBox(height: 24),

              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: Text(
                      'Cancel',
                      style: GoogleFonts.plusJakartaSans(
                        color: JyotiTheme.textSecondary,
                        fontSize: 14,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: _save,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                      backgroundColor: JyotiTheme.electricIndigo,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 4,
                      shadowColor: JyotiTheme.electricIndigo.withOpacity(0.5),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.bolt, size: 16),
                        const SizedBox(width: 6),
                        Text(
                          'Calibrate Matrix',
                          style: GoogleFonts.plusJakartaSans(
                            fontWeight: FontWeight.w600,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFieldLabel(String text) {
    return Text(
      text,
      style: GoogleFonts.plusJakartaSans(
        fontSize: 11,
        fontWeight: FontWeight.w600,
        color: JyotiTheme.textSecondary,
        letterSpacing: 0.3,
      ),
    );
  }

  Widget _buildPresetChip(String label, double lat, double lon, double tz, String place) {
    return ActionChip(
      label: Text(
        label,
        style: const TextStyle(fontSize: 10, color: JyotiTheme.textSecondary),
      ),
      backgroundColor: JyotiTheme.surfaceElevated,
      side: const BorderSide(color: JyotiTheme.borderSubtle),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      padding: EdgeInsets.zero,
      onPressed: () => _applyPreset(label, lat, lon, tz, place),
    );
  }
}
