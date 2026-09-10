import 'package:flutter/material.dart';

/// ---------------------------------------------------------------------------
/// Production-Ready Astrologer Mobile Dashboard (Flutter Material 3)
/// Matching the exact design specifications & visual hierarchy of KangleiAstro.
/// ---------------------------------------------------------------------------

void main() {
  runApp(const AstrologerMobileApp());
}

class AstrologerMobileApp extends StatelessWidget {
  const AstrologerMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Kuthiyengpham Guru Portal',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Inter',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFE67E22),
          primary: const Color(0xFFE67E22),
          secondary: const Color(0xFFED8936),
          surface: const Color(0xFFF8FAFC),
          onSurface: const Color(0xFF0F172A),
        ),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        fontFamily: 'Inter',
        colorScheme: ColorScheme.fromSeed(
          brightness: Brightness.dark,
          seedColor: const Color(0xFFE67E22),
          primary: const Color(0xFFF59E0B),
          surface: const Color(0xFF0B132B),
          onSurface: const Color(0xFFFAF8F4),
        ),
        scaffoldBackgroundColor: const Color(0xFF0B132B),
      ),
      themeMode: ThemeMode.system,
      home: const AstrologerMobileDashboard(),
    );
  }
}

class AstrologerMobileDashboard extends StatefulWidget {
  const AstrologerMobileDashboard({super.key});

  @override
  State<AstrologerMobileDashboard> createState() => _AstrologerMobileDashboardState();
}

class _AstrologerMobileDashboardState extends State<AstrologerMobileDashboard> {
  int _currentNavIndex = 0;
  bool _isOnline = true;
  bool _isDarkMode = false;
  int _unreadNotifications = 3;
  int _pendingKuthiOrders = 4;
  int _activeLiveCalls = 1;
  double _walletBalance = 14850.0;

  // Ad Banner Config
  bool _showAdBanner = true;
  String _adTitle = 'Ceylon Unheated Yellow Sapphires';
  String _adSubtitle = 'Lab Certified 100% Natural • 20% Special Astrologer Partner Off';
  String _adBannerUrl =
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop';
  String _adTag = 'SPONSORED';

  // Notices / Announcement Carousel
  int _activeNoticeIndex = 0;
  final List<Map<String, String>> _notices = [
    {
      'id': '1',
      'type': 'PROMO_AD',
      'badge': 'GEMS PARTNER',
      'title': 'New Certified Gemstones Added to E-Store',
      'message': 'Offer 100% lab certified Ceylon gemstones with your custom prescription token.',
      'action': 'Add Product Now',
      'severity': 'PROMO',
    },
    {
      'id': '2',
      'type': 'URGENT_NOTICE',
      'badge': 'MAINTENANCE',
      'title': 'Eastern Ephemeris Server Update (12:00 AM)',
      'message': 'Scheduled 15-minute sync for Lahiri Sidereal tables for high precision.',
      'action': 'Read Details',
      'severity': 'URGENT',
    },
    {
      'id': '3',
      'type': 'INFO',
      'badge': 'PAYOUT',
      'title': 'Weekly Consultation Payout Dispatched',
      'message': 'Your weekly UPI payout of ₹4,200 has been credited to your linked bank account.',
      'action': 'View Wallet',
      'severity': 'INFO',
    },
  ];

  // Panchanga Location & Items
  String _currentStation = 'Imphal · 24.8°N';
  final List<Map<String, dynamic>> _panchangaItems = [
    {
      'label': 'Tithi',
      'value': 'Shukla Navami (নৱমী)',
      'sub': '92% Waxing',
      'icon': Icons.brightness_6,
      'isHighlight': true
    },
    {
      'label': 'Nakshatra',
      'value': 'Rohini (রোহিণী)',
      'sub': 'Moon Lord (চন্দ্রপতি)',
      'icon': Icons.auto_awesome,
      'isHighlight': false
    },
    {
      'label': 'Moon Sign',
      'value': 'Vrishabha (বৃষ)',
      'sub': 'Exalted 28° (তুঙ্গী)',
      'icon': Icons.shield_moon_outlined,
      'isHighlight': false
    },
    {
      'label': 'Yoga',
      'value': 'Siddhi Yoga (সিদ্ধি)',
      'sub': 'Auspicious Timing',
      'icon': Icons.self_improvement,
      'isHighlight': false
    },
    {
      'label': 'Rahu Kaal',
      'value': '16:30 – 18:00',
      'sub': 'Avoid Auspicious Works',
      'icon': Icons.hourglass_top_rounded,
      'isHighlight': true
    },
  ];

  // Quick Astrological Engines
  final List<Map<String, dynamic>> _quickEngines = [
    {
      'id': 'sadesati',
      'label': 'Sade Sati',
      'icon': Icons.public,
      'color': Color(0xFF0284C7),
      'bgColor': Color(0xFFE0F2FE),
      'emoji': '🪐'
    },
    {
      'id': 'manglik',
      'label': 'Manglik',
      'icon': Icons.local_fire_department,
      'color': Color(0xFFE11D48),
      'bgColor': Color(0xFFFFE4E6),
      'emoji': '🔥'
    },
    {
      'id': 'kaalsarp',
      'label': 'Kaal Sarp',
      'icon': Icons.grain,
      'color': Color(0xFF7C3AED),
      'bgColor': Color(0xFFEDE9FE),
      'emoji': '🐍'
    },
    {
      'id': 'nga-eeshing',
      'label': 'ঙা-ঈশিং',
      'icon': Icons.water_drop,
      'color': Color(0xFF0891B2),
      'bgColor': Color(0xFFCFFAFE),
      'emoji': '🐟'
    },
    {
      'id': 'matchmaking',
      'label': 'Matching',
      'icon': Icons.favorite,
      'color': Color(0xFFDB2777),
      'bgColor': Color(0xFFFCE7F3),
      'emoji': '💍'
    },
    {
      'id': 'yogas',
      'label': 'Yogas',
      'icon': Icons.star,
      'color': Color(0xFFD97706),
      'bgColor': Color(0xFFFEF3C7),
      'emoji': '✨'
    },
    {
      'id': 'yumsharol',
      'label': 'Yumsharol',
      'icon': Icons.home,
      'color': Color(0xFF059669),
      'bgColor': Color(0xFFD1FAE5),
      'emoji': '🏡'
    },
    {
      'id': 'kundali',
      'label': 'Kundli',
      'icon': Icons.explore,
      'color': Color(0xFFD97706),
      'bgColor': Color(0xFFFEF3C7),
      'emoji': '🧭'
    },
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = _isDarkMode;
    final primarySaffron = const Color(0xFFE67E22);
    final surfaceBg = isDark ? const Color(0xFF0B132B) : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF1C2541) : Colors.white;
    final borderColor = isDark ? const Color(0xFF3A506B) : const Color(0xFFE2E8F0);
    final textPrimary = isDark ? const Color(0xFFFAF8F4) : const Color(0xFF0F172A);
    final textSecondary = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);

    return Scaffold(
      backgroundColor: surfaceBg,
      body: SafeArea(
        child: Column(
          children: [
            // -----------------------------------------------------------------
            // 1. TOP BAR & ASTROLOGER PROFILE HEADER
            // -----------------------------------------------------------------
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: cardBg,
                border: Border(bottom: BorderSide(color: borderColor, width: 1)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.02),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Profile Avatar + Name + Status Chip
                  Row(
                    children: [
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            _isOnline = !_isOnline;
                          });
                        },
                        child: Stack(
                          clipBehavior: Clip.none,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(2),
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: const LinearGradient(
                                  colors: [Color(0xFFD97706), Color(0xFFFBBF24), Color(0xFFF59E0B)],
                                ),
                              ),
                              child: const CircleAvatar(
                                radius: 19,
                                backgroundImage: NetworkImage(
                                  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
                                ),
                              ),
                            ),
                            Positioned(
                              bottom: -1,
                              right: -1,
                              child: Container(
                                width: 13,
                                height: 13,
                                decoration: BoxDecoration(
                                  color: _isOnline ? const Color(0xFF10B981) : Colors.grey,
                                  shape: BoxShape.circle,
                                  border: Border.all(color: cardBg, width: 2),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                'Acharya Sanatombi',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: textPrimary,
                                ),
                              ),
                              const SizedBox(width: 4),
                              Icon(Icons.verified, size: 14, color: primarySaffron),
                            ],
                          ),
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                _isOnline = !_isOnline;
                              });
                            },
                            child: Row(
                              children: [
                                Container(
                                  width: 6,
                                  height: 6,
                                  decoration: BoxDecoration(
                                    color: _isOnline ? const Color(0xFF10B981) : Colors.grey,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  _isOnline ? 'Accepting Orders' : 'Away (Offline)',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w600,
                                    color: _isOnline ? const Color(0xFF10B981) : Colors.grey,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),

                  // Center Brand Subtitle
                  Column(
                    children: [
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.nightlight_round, size: 12, color: primarySaffron),
                          const SizedBox(width: 3),
                          Text(
                            'kuthiyengpham',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: textPrimary,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        'GURU PORTAL',
                        style: TextStyle(
                          fontSize: 8.5,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.0,
                          color: primarySaffron,
                        ),
                      ),
                    ],
                  ),

                  // Action Buttons: Theme Toggle & Notification Bell
                  Row(
                    children: [
                      IconButton(
                        visualDensity: VisualDensity.compact,
                        onPressed: () {
                          setState(() {
                            _isDarkMode = !_isDarkMode;
                          });
                        },
                        icon: Icon(
                          _isDarkMode ? Icons.wb_sunny_rounded : Icons.nightlight_round,
                          size: 18,
                          color: _isDarkMode ? const Color(0xFFFBBF24) : const Color(0xFFD97706),
                        ),
                      ),
                      Stack(
                        clipBehavior: Clip.none,
                        children: [
                          IconButton(
                            visualDensity: VisualDensity.compact,
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(content: Text('Notifications Drawer Opened')),
                              );
                            },
                            icon: Icon(Icons.notifications_none_rounded, size: 20, color: textPrimary),
                          ),
                          if (_unreadNotifications > 0)
                            Positioned(
                              top: 6,
                              right: 6,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                decoration: BoxDecoration(
                                  color: Colors.redAccent,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                constraints: const BoxConstraints(minWidth: 14, minHeight: 14),
                                child: Text(
                                  '$_unreadNotifications',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 8.5,
                                    fontWeight: FontWeight.bold,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // -----------------------------------------------------------------
            // SCROLLABLE DASHBOARD VIEW
            // -----------------------------------------------------------------
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                children: [
                  // -----------------------------------------------------------
                  // 2. SPONSORED AD BANNER (16:5 Standard Height)
                  // -----------------------------------------------------------
                  if (_showAdBanner) ...[
                    GestureDetector(
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Opening Sponsored E-Store Item...')),
                        );
                      },
                      child: Container(
                        height: 74,
                        margin: const EdgeInsets.only(bottom: 12),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: primarySaffron.withOpacity(0.35), width: 1),
                          boxShadow: [
                            BoxShadow(
                              color: primarySaffron.withOpacity(0.06),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(15),
                          child: Stack(
                            children: [
                              Row(
                                children: [
                                  // Ad Thumbnail Image
                                  Container(
                                    width: 78,
                                    height: 74,
                                    decoration: BoxDecoration(
                                      image: DecorationImage(
                                        image: NetworkImage(_adBannerUrl),
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  // Ad Content Text
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Text(
                                            _adTitle,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: TextStyle(
                                              fontSize: 12,
                                              fontWeight: FontWeight.bold,
                                              color: textPrimary,
                                            ),
                                          ),
                                          const SizedBox(height: 2),
                                          Text(
                                            _adSubtitle,
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: TextStyle(
                                              fontSize: 9.5,
                                              fontWeight: FontWeight.w500,
                                              color: textSecondary,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                  // Action Chevron
                                  Padding(
                                    padding: const EdgeInsets.only(right: 12),
                                    child: Icon(Icons.arrow_forward_ios_rounded,
                                        size: 13, color: primarySaffron),
                                  ),
                                ],
                              ),
                              // "Sponsored / Ad" Badge in Top Right
                              Positioned(
                                top: 6,
                                right: 6,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: isDark ? const Color(0xFF0B132B) : const Color(0xFFFEF3C7),
                                    borderRadius: BorderRadius.circular(4),
                                    border: Border.all(
                                      color: const Color(0xFFD97706).withOpacity(0.4),
                                      width: 0.5,
                                    ),
                                  ),
                                  child: Text(
                                    _adTag,
                                    style: const TextStyle(
                                      fontSize: 7.5,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFFB45309),
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],

                  // -----------------------------------------------------------
                  // 3. NOTICE / ANNOUNCEMENT COMPACT CAROUSEL
                  // -----------------------------------------------------------
                  if (_notices.isNotEmpty) ...[
                    Container(
                      margin: const EdgeInsets.only(bottom: 14),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: _notices[_activeNoticeIndex]['severity'] == 'URGENT'
                            ? (isDark ? const Color(0xFF3B1D1D) : const Color(0xFFFFF1F2))
                            : (isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9)),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: _notices[_activeNoticeIndex]['severity'] == 'URGENT'
                              ? Colors.redAccent.withOpacity(0.3)
                              : borderColor,
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: primarySaffron.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Icon(
                                  _notices[_activeNoticeIndex]['severity'] == 'URGENT'
                                      ? Icons.warning_amber_rounded
                                      : Icons.campaign_outlined,
                                  size: 16,
                                  color: primarySaffron,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Container(
                                          padding:
                                              const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                                          decoration: BoxDecoration(
                                            color: primarySaffron.withOpacity(0.2),
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            _notices[_activeNoticeIndex]['badge'] ?? 'NOTICE',
                                            style: TextStyle(
                                              fontSize: 8,
                                              fontWeight: FontWeight.w900,
                                              color: primarySaffron,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 3),
                                    Text(
                                      _notices[_activeNoticeIndex]['title'] ?? '',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                        color: textPrimary,
                                      ),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      _notices[_activeNoticeIndex]['message'] ?? '',
                                      style: TextStyle(fontSize: 10, color: textSecondary),
                                    ),
                                  ],
                                ),
                              ),
                              IconButton(
                                visualDensity: VisualDensity.compact,
                                padding: EdgeInsets.zero,
                                constraints: const BoxConstraints(),
                                icon: Icon(Icons.close, size: 14, color: textSecondary),
                                onPressed: () {
                                  setState(() {
                                    _notices.removeAt(_activeNoticeIndex);
                                    if (_activeNoticeIndex >= _notices.length &&
                                        _notices.isNotEmpty) {
                                      _activeNoticeIndex = _notices.length - 1;
                                    }
                                  });
                                },
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          // Carousel indicator dots & Action button
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: List.generate(_notices.length, (idx) {
                                  return GestureDetector(
                                    onTap: () {
                                      setState(() {
                                        _activeNoticeIndex = idx;
                                      });
                                    },
                                    child: Container(
                                      width: idx == _activeNoticeIndex ? 14 : 5,
                                      height: 4,
                                      margin: const EdgeInsets.only(right: 4),
                                      decoration: BoxDecoration(
                                        color: idx == _activeNoticeIndex
                                            ? primarySaffron
                                            : Colors.grey.withOpacity(0.4),
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                    ),
                                  );
                                }),
                              ),
                              TextButton(
                                style: TextButton.styleFrom(
                                  visualDensity: VisualDensity.compact,
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  backgroundColor: primarySaffron,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                onPressed: () {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text(
                                          'Action: ${_notices[_activeNoticeIndex]['action']}'),
                                    ),
                                  );
                                },
                                child: Text(
                                  '${_notices[_activeNoticeIndex]['action']} →',
                                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],

                  // -----------------------------------------------------------
                  // 4. DAILY PANCHANGA & TRANSIT HORIZONTAL STRIP
                  // -----------------------------------------------------------
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.cyclone_outlined, size: 14, color: primarySaffron),
                          const SizedBox(width: 4),
                          Text(
                            'DAILY PANCHANGA & TRANSIT (পঞ্জিকা)',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.8,
                              color: textPrimary,
                            ),
                          ),
                        ],
                      ),
                      GestureDetector(
                        onTap: () {
                          _showLocationPickerModal(context);
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: primarySaffron.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            children: [
                              Icon(Icons.location_on_outlined, size: 11, color: primarySaffron),
                              const SizedBox(width: 2),
                              Text(
                                _currentStation,
                                style: TextStyle(
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.bold,
                                  color: primarySaffron,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  SizedBox(
                    height: 68,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: _panchangaItems.length,
                      separatorBuilder: (context, index) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        final item = _panchangaItems[index];
                        final isHigh = item['isHighlight'] as bool;
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: isHigh
                                ? (isDark ? const Color(0xFF38230B) : const Color(0xFFFEF3C7))
                                : cardBg,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isHigh ? const Color(0xFFF59E0B) : borderColor,
                              width: isHigh ? 1.2 : 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(item['icon'] as IconData,
                                  size: 20, color: isHigh ? primarySaffron : textSecondary),
                              const SizedBox(width: 8),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    item['label'] as String,
                                    style: TextStyle(
                                      fontSize: 9,
                                      fontWeight: FontWeight.w700,
                                      color: isHigh ? const Color(0xFFB45309) : textSecondary,
                                    ),
                                  ),
                                  Text(
                                    item['value'] as String,
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w800,
                                      color: textPrimary,
                                    ),
                                  ),
                                  Text(
                                    item['sub'] as String,
                                    style: TextStyle(
                                      fontSize: 8.5,
                                      fontWeight: FontWeight.w600,
                                      color: primarySaffron,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 16),

                  // -----------------------------------------------------------
                  // 5. WORKSPACE HUB CARDS: KUTHI HUB & LIVE CONSULTATION ROOM
                  // -----------------------------------------------------------
                  Row(
                    children: [
                      // Kuthi Order Hub Tile
                      Expanded(
                        child: GestureDetector(
                          onTap: () {
                            setState(() {
                              _currentNavIndex = 1;
                            });
                          },
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: cardBg,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: borderColor),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.02),
                                  blurRadius: 6,
                                  offset: const Offset(0, 2),
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
                                      padding: const EdgeInsets.all(6),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFFEF3C7),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Icon(Icons.menu_book_rounded,
                                          size: 16, color: primarySaffron),
                                    ),
                                    if (_pendingKuthiOrders > 0)
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: primarySaffron,
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: Text(
                                          '$_pendingKuthiOrders Pending',
                                          style: const TextStyle(
                                            fontSize: 8,
                                            fontWeight: FontWeight.w800,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                  ],
                                ),
                                const SizedBox(height: 10),
                                Text(
                                  'Kuthi Order Hub',
                                  style: TextStyle(
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.bold,
                                    color: textPrimary,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  'Matching, chart calculations, & reports delivery',
                                  style: TextStyle(fontSize: 9.5, color: textSecondary),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Text(
                                      'Manage Orders →',
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: primarySaffron,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 10),

                      // Live Call & Chat Tile
                      Expanded(
                        child: GestureDetector(
                          onTap: () {
                            setState(() {
                              _currentNavIndex = 2;
                            });
                          },
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: cardBg,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: borderColor),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withOpacity(0.02),
                                  blurRadius: 6,
                                  offset: const Offset(0, 2),
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
                                      padding: const EdgeInsets.all(6),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFD1FAE5),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: const Icon(Icons.videocam_rounded,
                                          size: 16, color: Color(0xFF059669)),
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF10B981),
                                        borderRadius: BorderRadius.circular(10),
                                      ),
                                      child: const Text(
                                        'LIVE',
                                        style: TextStyle(
                                          fontSize: 8,
                                          fontWeight: FontWeight.w900,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 10),
                                Text(
                                  'Live Call & Chat',
                                  style: TextStyle(
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.bold,
                                    color: textPrimary,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '1-on-1 encrypted audio/video consultation room',
                                  style: TextStyle(fontSize: 9.5, color: textSecondary),
                                ),
                                const SizedBox(height: 8),
                                const Row(
                                  children: [
                                    Text(
                                      'Enter Room →',
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: Color(0xFF059669),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // -----------------------------------------------------------
                  // 6. QUICK ASTROLOGICAL ENGINES GRID (Tactile pastel pills)
                  // -----------------------------------------------------------
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.auto_awesome, size: 14, color: primarySaffron),
                          const SizedBox(width: 4),
                          Text(
                            'QUICK ASTROLOGICAL ENGINES',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.8,
                              color: textPrimary,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        'VEDIC MATH',
                        style: TextStyle(
                          fontSize: 8.5,
                          fontWeight: FontWeight.bold,
                          color: primarySaffron,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  GridView.builder(
                    physics: const NeverScrollableScrollPhysics(),
                    shrinkWrap: true,
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 4,
                      mainAxisSpacing: 8,
                      crossAxisSpacing: 8,
                      childAspectRatio: 0.95,
                    ),
                    itemCount: _quickEngines.length,
                    itemBuilder: (context, index) {
                      final engine = _quickEngines[index];
                      return GestureDetector(
                        onTap: () {
                          _showToolDialog(context, engine['label'] as String);
                        },
                        child: Container(
                          decoration: BoxDecoration(
                            color: cardBg,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: borderColor),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                width: 34,
                                height: 34,
                                decoration: BoxDecoration(
                                  color: (engine['bgColor'] as Color),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  engine['emoji'] as String,
                                  style: const TextStyle(fontSize: 16),
                                ),
                              ),
                              const SizedBox(height: 5),
                              Text(
                                engine['label'] as String,
                                style: TextStyle(
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.bold,
                                  color: textPrimary,
                                ),
                                textAlign: TextAlign.center,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),

                  const SizedBox(height: 16),

                  // -----------------------------------------------------------
                  // 7. SUMMARY COUNTERS: KUTHI ORDERS, LIVE CALLS, WALLET
                  // -----------------------------------------------------------
                  Row(
                    children: [
                      _buildCounterCard('Kuthi Orders', '$_pendingKuthiOrders', cardBg, borderColor,
                          textPrimary, primarySaffron),
                      const SizedBox(width: 8),
                      _buildCounterCard('Live Queue', '$_activeLiveCalls', cardBg, borderColor,
                          textPrimary, const Color(0xFF059669)),
                      const SizedBox(width: 8),
                      _buildCounterCard(
                          'Wallet Balance',
                          '₹${_walletBalance.toStringAsFixed(0)}',
                          cardBg,
                          borderColor,
                          textPrimary,
                          primarySaffron),
                    ],
                  ),

                  const SizedBox(height: 20),
                ],
              ),
            ),

            // -----------------------------------------------------------------
            // 8. MODERN FLOATING / DOCKED BOTTOM NAVIGATION
            // -----------------------------------------------------------------
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              decoration: BoxDecoration(
                color: cardBg,
                border: Border(top: BorderSide(color: borderColor, width: 1)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 10,
                    offset: const Offset(0, -2),
                  ),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildNavItem(0, Icons.dashboard_rounded, 'Overview', primarySaffron, textSecondary),
                  _buildNavItem(1, Icons.menu_book_rounded, 'Kuthi Hub', primarySaffron, textSecondary),
                  _buildNavItem(2, Icons.video_call_rounded, 'Live Call', primarySaffron, textSecondary),
                  _buildNavItem(3, Icons.explore_rounded, 'Bengali Chart', primarySaffron, textSecondary),
                  _buildNavItem(4, Icons.person_rounded, 'Profile', primarySaffron, textSecondary),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCounterCard(String title, String count, Color cardBg, Color borderColor,
      Color textPrimary, Color accentColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: borderColor),
        ),
        child: Column(
          children: [
            Text(
              title,
              style: TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: textPrimary.withOpacity(0.7)),
            ),
            const SizedBox(height: 2),
            Text(
              count,
              style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: accentColor),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(
      int index, IconData icon, String label, Color activeColor, Color inactiveColor) {
    final isActive = _currentNavIndex == index;
    return GestureDetector(
      onTap: () {
        setState(() {
          _currentNavIndex = index;
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isActive ? activeColor.withOpacity(0.15) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 20, color: isActive ? activeColor : inactiveColor),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 9.5,
                fontWeight: isActive ? FontWeight.w800 : FontWeight.w500,
                color: isActive ? activeColor : inactiveColor,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showLocationPickerModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Select Panchanga Ephemeris Station',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              ListTile(
                leading: const Icon(Icons.place, color: Color(0xFFE67E22)),
                title: const Text('Imphal, Manipur · 24.817°N, 93.936°E'),
                onTap: () {
                  setState(() => _currentStation = 'Imphal · 24.8°N');
                  Navigator.pop(context);
                },
              ),
              ListTile(
                leading: const Icon(Icons.place, color: Color(0xFFE67E22)),
                title: const Text('Kolkata, WB · 22.572°N, 88.363°E'),
                onTap: () {
                  setState(() => _currentStation = 'Kolkata · 22.5°N');
                  Navigator.pop(context);
                },
              ),
              ListTile(
                leading: const Icon(Icons.place, color: Color(0xFFE67E22)),
                title: const Text('New Delhi · 28.613°N, 77.209°E'),
                onTap: () {
                  setState(() => _currentStation = 'New Delhi · 28.6°N');
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _showToolDialog(BuildContext context, String toolName) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(toolName),
        content: Text('Calculated planetary factors and Vedic parameters for $toolName.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}
