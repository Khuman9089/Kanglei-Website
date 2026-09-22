import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../engine/astronomy_engine_adapter.dart';
import '../engine/jyoti_local_engine.dart';
import '../engine/jyoti_remote_engine.dart';
import '../models/jyoti_models.dart';
import '../services/jyoti_storage_service.dart';

// --- Services & Adapters ---

final jyotiStorageServiceProvider = Provider<JyotiStorageService>((ref) {
  throw UnimplementedError('Initialize jyotiStorageServiceProvider in main.dart');
});

final jyotiEngineAdapterProvider = Provider<IAstronomyEngineAdapter>((ref) {
  return JyotiRemoteEngineAdapter(
    fallbackEngine: const JyotiLocalEngineAdapter(),
  );
});

// --- User Profile State ---

class JyotiUserNotifier extends StateNotifier<JyotiUserProfile> {
  final JyotiStorageService _storage;

  JyotiUserNotifier(this._storage)
      : super(_storage.getUserProfile() ?? JyotiUserProfile.defaultProfile());

  Future<void> updateProfile({
    String? fullName,
    DateTime? birthDateTime,
    double? latitude,
    double? longitude,
    double? timezoneOffset,
    String? locationName,
    String? gender,
    String? ayanamsa,
  }) async {
    final updated = state.copyWith(
      fullName: fullName,
      birthDateTime: birthDateTime,
      latitude: latitude,
      longitude: longitude,
      timezoneOffset: timezoneOffset,
      locationName: locationName,
      gender: gender,
      ayanamsa: ayanamsa,
    );
    state = updated;
    await _storage.saveUserProfile(updated);
  }

  Future<void> setPreset({
    required String name,
    required DateTime birthDateTime,
    required double lat,
    required double lon,
    required double tz,
    required String place,
  }) async {
    final updated = JyotiUserProfile(
      id: 'jyoti_${DateTime.now().millisecondsSinceEpoch}',
      fullName: name,
      birthDateTime: birthDateTime,
      latitude: lat,
      longitude: lon,
      timezoneOffset: tz,
      locationName: place,
      gender: 'unspecified',
      ayanamsa: state.ayanamsa,
    );
    state = updated;
    await _storage.saveUserProfile(updated);
  }

  /// Complete Account & Personal Data Deletion
  Future<void> deleteAccountAndAllData() async {
    await _storage.requestServerAccountDeletion(identifier: state.id);
    await _storage.clearAllJyotiData();
    state = JyotiUserProfile.defaultProfile();
  }
}

final jyotiUserProvider =
    StateNotifierProvider<JyotiUserNotifier, JyotiUserProfile>((ref) {
  final storage = ref.watch(jyotiStorageServiceProvider);
  return JyotiUserNotifier(storage);
});

// --- Chart Blueprint State ---

final jyotiChartProvider =
    FutureProvider.autoDispose<JyotiNatalBlueprint>((ref) async {
  final user = ref.watch(jyotiUserProvider);
  final engine = ref.watch(jyotiEngineAdapterProvider);
  final storage = ref.watch(jyotiStorageServiceProvider);

  final blueprint = await engine.calculateBlueprint(
    birthDateTime: user.birthDateTime,
    latitude: user.latitude,
    longitude: user.longitude,
    timezoneOffset: user.timezoneOffset,
    ayanamsa: user.ayanamsa,
  );

  await storage.saveChartCache(blueprint);
  return blueprint;
});

// --- AI Oracle Conversational Stream State ---

class JyotiChatState {
  final List<JyotiChatMessage> messages;
  final bool isGenerating;
  final String? streamingText;
  final String? activeThought;

  const JyotiChatState({
    required this.messages,
    this.isGenerating = false,
    this.streamingText,
    this.activeThought,
  });

  JyotiChatState copyWith({
    List<JyotiChatMessage>? messages,
    bool? isGenerating,
    String? streamingText,
    String? activeThought,
  }) {
    return JyotiChatState(
      messages: messages ?? this.messages,
      isGenerating: isGenerating ?? this.isGenerating,
      streamingText: streamingText,
      activeThought: activeThought,
    );
  }
}

class JyotiChatNotifier extends StateNotifier<JyotiChatState> {
  final JyotiStorageService _storage;
  final Ref _ref;

  JyotiChatNotifier(this._storage, this._ref)
      : super(JyotiChatState(
          messages: _storage.getChatSessions().isNotEmpty
              ? _storage.getChatSessions()
              : _initialWelcomeMessages(),
        ));

  static List<JyotiChatMessage> _initialWelcomeMessages() {
    return [
      JyotiChatMessage(
        id: 'welcome_1',
        sender: 'oracle',
        content:
            "Greetings, seeker. I am **Jyoti Oracle**, your high-dimensional celestial intelligence.\n\nYour Sidereal blueprint and planetary harmonics are calibrated. Inquire about karmic timelines, planetary dashas, career alignments, or harmonic soul vectors.",
        timestamp: DateTime.now(),
        tags: ['Welcome', 'Celestial Alignment'],
      ),
    ];
  }

  Future<void> sendMessage(String userQuery) async {
    if (userQuery.trim().isEmpty || state.isGenerating) return;

    final userMsg = JyotiChatMessage(
      id: 'msg_${DateTime.now().millisecondsSinceEpoch}',
      sender: 'user',
      content: userQuery,
      timestamp: DateTime.now(),
    );

    final updatedList = [...state.messages, userMsg];
    state = state.copyWith(
      messages: updatedList,
      isGenerating: true,
      streamingText: '',
      activeThought: 'Synthesizing planetary matrix & harmonic vectors...',
    );

    await _storage.saveChatSessions(updatedList);

    final chartAsync = _ref.read(jyotiChartProvider);
    final user = _ref.read(jyotiUserProvider);
    final chart = chartAsync.valueOrNull;

    await Future.delayed(const Duration(milliseconds: 500));

    final oracleResponse = _generateAstrologicalSynthesis(
      query: userQuery,
      user: user,
      chart: chart,
    );

    final chunks = oracleResponse.split(' ');
    var currentAccumulator = '';

    for (int i = 0; i < chunks.length; i++) {
      currentAccumulator += (i == 0 ? '' : ' ') + chunks[i];
      state = state.copyWith(
        streamingText: currentAccumulator,
        activeThought: i < 5 ? 'Decoding Vimshottari flow...' : null,
      );
      await Future.delayed(const Duration(milliseconds: 30));
    }

    final oracleMsg = JyotiChatMessage(
      id: 'msg_oracle_${DateTime.now().millisecondsSinceEpoch}',
      sender: 'oracle',
      content: currentAccumulator,
      timestamp: DateTime.now(),
      tags: ['Jyoti Intelligence', chart?.ascendantSign ?? 'Cosmos'],
      astralContext: chart != null
          ? '${chart.ascendantSign} Lagna • ${chart.currentMahaDasha?.lord ?? "Dasha"} Cycle'
          : null,
    );

    final finalList = [...updatedList, oracleMsg];
    state = state.copyWith(
      messages: finalList,
      isGenerating: false,
      streamingText: null,
      activeThought: null,
    );

    await _storage.saveChatSessions(finalList);
  }

  void clearChat() async {
    final welcome = _initialWelcomeMessages();
    state = JyotiChatState(messages: welcome);
    await _storage.saveChatSessions(welcome);
  }

  String _generateAstrologicalSynthesis({
    required String query,
    required JyotiUserProfile user,
    required JyotiNatalBlueprint? chart,
  }) {
    final lower = query.toLowerCase();
    final asc = chart?.ascendantSign ?? 'Aries';
    final lagnaLord = chart?.chartRuler ?? 'Mars';
    final dasha = chart?.currentMahaDasha?.lord ?? 'Jupiter';
    final dominant = chart?.dominantElement ?? 'Fire';

    if (lower.contains('career') || lower.contains('job') || lower.contains('work')) {
      return "### 🏛️ Career & Purpose Matrix\n\n"
          "With **$asc Lagna** governed by **$lagnaLord**, your 10th House of vocation resonates with dynamic expansion.\n\n"
          "- **Current Cycle**: Under the **$dasha Mahadasha**, leadership initiatives, structural refinement, and deep-focus projects yield exponential compounding.\n"
          "- **Planetary Synergy**: Your dominant **$dominant element** calls for strategic autonomy rather than bureaucratic conformity.\n\n"
          "💡 *Oracle Guidance*: Focus this quarter on high-leverage intellectual systems and sovereign execution.";
    }

    if (lower.contains('relationship') || lower.contains('love') || lower.contains('marriage')) {
      return "### ✨ Harmonic Union & Venusian Alignment\n\n"
          "Analyzing the 7th Bhava resonance from **$asc Lagna**:\n\n"
          "- **Karmic Resonance**: The active **$dasha vibration** invites partners who stimulate your higher mental faculties and philosophical horizons.\n"
          "- **Energy Balance**: Your **$dominant elemental matrix** thrives when clarity and mutual sovereignty are prioritized.\n\n"
          "🔮 *Oracle Guidance*: Harmony arrives when communication precedes emotional expectation.";
    }

    if (lower.contains('dasha') || lower.contains('timing') || lower.contains('future')) {
      final activeDasha = chart?.currentMahaDasha;
      final start = activeDasha != null ? '${activeDasha.startDate.year}' : 'Current';
      final end = activeDasha != null ? '${activeDasha.endDate.year}' : 'Next Decade';
      return "### ⏳ Temporal Wave: Vimshottari Dasha Analysis\n\n"
          "You are currently traversing the **$dasha Mahadasha** ($start – $end).\n\n"
          "- **Phase Dynamics**: $dasha represents foundational evolution, requiring you to discard obsolete attachments and build durable foundations.\n"
          "- **Transit Intersection**: The current cosmic currents activate your natal planetary grid, amplifying clarity in your life trajectory.\n\n"
          "⚡ *Oracle Action*: Cultivate steadfast discipline and deliberate strategic intent.";
    }

    return "### 🌌 Jyoti Celestial Intelligence Synthesis\n\n"
        "Illuminating your query through the lens of **$asc Ascendant** and the sovereign influence of **$lagnaLord**:\n\n"
        "- **Elemental Distribution**: Your matrix is anchored in **$dominant energy**, conferring acute perceptual depth.\n"
        "- **Dasha Alignment**: The prevailing **$dasha cycle** indicates an optimal window for transformative breakthroughs.\n\n"
        "Ask specifically about your **Planetary Strengths (Dignities)**, **Dasha Sub-periods**, or **Daily Astral Harmonic** to delve deeper.";
  }
}

final jyotiChatProvider =
    StateNotifierProvider<JyotiChatNotifier, JyotiChatState>((ref) {
  final storage = ref.watch(jyotiStorageServiceProvider);
  return JyotiChatNotifier(storage, ref);
});

// --- UI Navigation & Layout States ---

final jyotiNavIndexProvider = StateProvider<int>((ref) => 0);
final jyotiOracleSidebarOpenProvider = StateProvider<bool>((ref) => true);
final jyotiChartTypeProvider = StateProvider<String>((ref) => 'North Indian');
