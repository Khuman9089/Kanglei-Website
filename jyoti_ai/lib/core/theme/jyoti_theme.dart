import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Jyoti AI Celestial Design System
class JyotiTheme {
  JyotiTheme._();

  // Celestial Color Tokens
  static const Color spaceCanvas = Color(0xFF07090E);
  static const Color surfaceGlass = Color(0xFF111622);
  static const Color surfaceElevated = Color(0xFF181F30);
  static const Color surfaceCard = Color(0xFF131A29);

  // Border & Glow Accents
  static const Color borderSubtle = Color(0x12FFFFFF); // rgba(255, 255, 255, 0.07)
  static const Color borderElevated = Color(0x24FFFFFF); // rgba(255, 255, 255, 0.14)
  static const Color borderHighlight = Color(0x666366F1);

  // Energy Accents
  static const Color electricIndigo = Color(0xFF6366F1);
  static const Color cosmicViolet = Color(0xFFA855F7);
  static const Color starlightAmber = Color(0xFFF59E0B);
  static const Color nebulaCyan = Color(0xFF06B6D4);
  static const Color stellarRose = Color(0xFFF43F5E);
  static const Color cosmicEmerald = Color(0xFF10B981);

  // Text Hierarchy
  static const Color textPrimary = Color(0xFFF8FAFC);
  static const Color textSecondary = Color(0xFF94A3B8);
  static const Color textMuted = Color(0xFF64748B);
  static const Color textGold = Color(0xFFFCD34D);

  // Astral Gradients
  static const LinearGradient astralEnergyGradient = LinearGradient(
    colors: [electricIndigo, cosmicViolet],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient solarAuraGradient = LinearGradient(
    colors: [starlightAmber, cosmicViolet],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient glassGradient = LinearGradient(
    colors: [Color(0x1AFFFFFF), Color(0x05FFFFFF)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient deepSpaceGradient = LinearGradient(
    colors: [Color(0xFF05070B), Color(0xFF0C101A)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  // ThemeData
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: spaceCanvas,
      colorScheme: const ColorScheme.dark(
        primary: electricIndigo,
        secondary: cosmicViolet,
        tertiary: starlightAmber,
        surface: surfaceGlass,
        background: spaceCanvas,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: textPrimary,
        onBackground: textPrimary,
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.cormorantGaramond(
          fontSize: 48,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.5,
          color: textPrimary,
        ),
        displayMedium: GoogleFonts.cormorantGaramond(
          fontSize: 36,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.5,
          color: textPrimary,
        ),
        displaySmall: GoogleFonts.cormorantGaramond(
          fontSize: 28,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        headlineLarge: GoogleFonts.cormorantGaramond(
          fontSize: 24,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        headlineMedium: GoogleFonts.plusJakartaSans(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          letterSpacing: -0.2,
          color: textPrimary,
        ),
        headlineSmall: GoogleFonts.plusJakartaSans(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        titleLarge: GoogleFonts.plusJakartaSans(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        titleMedium: GoogleFonts.plusJakartaSans(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.2,
          color: textPrimary,
        ),
        bodyLarge: GoogleFonts.plusJakartaSans(
          fontSize: 15,
          fontWeight: FontWeight.w400,
          height: 1.6,
          color: textPrimary,
        ),
        bodyMedium: GoogleFonts.plusJakartaSans(
          fontSize: 13,
          fontWeight: FontWeight.w400,
          height: 1.5,
          color: textSecondary,
        ),
        bodySmall: GoogleFonts.plusJakartaSans(
          fontSize: 11,
          fontWeight: FontWeight.w400,
          color: textMuted,
        ),
        labelLarge: GoogleFonts.plusJakartaSans(
          fontSize: 13,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
          color: textPrimary,
        ),
      ),
      cardTheme: CardTheme(
        color: surfaceGlass,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: borderSubtle, width: 1),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceGlass,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderSubtle),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderSubtle),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: electricIndigo, width: 1.5),
        ),
        hintStyle: GoogleFonts.plusJakartaSans(
          color: textMuted,
          fontSize: 14,
        ),
        labelStyle: GoogleFonts.plusJakartaSans(
          color: textSecondary,
          fontSize: 14,
        ),
      ),
    );
  }
}
