import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/models/jyoti_models.dart';
import '../../../core/state/jyoti_providers.dart';
import '../../../core/theme/jyoti_theme.dart';

/// AI Oracle Conversational Stream for Jyoti AI
class JyotiOracleView extends ConsumerStatefulWidget {
  final bool isSidebarMode;
  const JyotiOracleView({super.key, this.isSidebarMode = false});

  @override
  ConsumerState<JyotiOracleView> createState() => _JyotiOracleViewState();
}

class _JyotiOracleViewState extends ConsumerState<JyotiOracleView> {
  final TextEditingController _inputCtrl = TextEditingController();
  final ScrollController _scrollCtrl = ScrollController();

  @override
  void dispose() {
    _inputCtrl.dispose();
    _scrollCtrl.dispose();
    super.dispose();
  }

  void _sendMessage([String? text]) {
    final query = text ?? _inputCtrl.text;
    if (query.trim().isEmpty) return;

    ref.read(jyotiChatProvider.notifier).sendMessage(query);
    _inputCtrl.clear();

    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollCtrl.hasClients) {
        _scrollCtrl.animateTo(
          _scrollCtrl.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final chatState = ref.watch(jyotiChatProvider);
    final chartAsync = ref.watch(jyotiChartProvider);
    final chart = chartAsync.valueOrNull;

    return Container(
      decoration: BoxDecoration(
        color: widget.isSidebarMode ? JyotiTheme.surfaceGlass : Colors.transparent,
        border: widget.isSidebarMode
            ? const Border(left: BorderSide(color: JyotiTheme.borderSubtle))
            : null,
      ),
      child: Column(
        children: [
          _buildHeader(chart),
          Expanded(
            child: ListView.builder(
              controller: _scrollCtrl,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              itemCount: chatState.messages.length +
                  (chatState.isGenerating && chatState.streamingText != null ? 1 : 0),
              itemBuilder: (context, idx) {
                if (idx < chatState.messages.length) {
                  final msg = chatState.messages[idx];
                  return _buildMessageBubble(msg);
                } else {
                  return _buildStreamingBubble(
                    chatState.streamingText ?? '',
                    chatState.activeThought,
                  );
                }
              },
            ),
          ),
          _buildQuickPrompts(),
          _buildInputBar(chatState.isGenerating),
        ],
      ),
    );
  }

  Widget _buildHeader(JyotiNatalBlueprint? chart) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
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
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: JyotiTheme.astralEnergyGradient,
                  boxShadow: [
                    BoxShadow(
                      color: JyotiTheme.electricIndigo.withOpacity(0.4),
                      blurRadius: 10,
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(Icons.blur_on, color: Colors.white, size: 18),
                ),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Jyoti Oracle',
                    style: GoogleFonts.cormorantGaramond(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: JyotiTheme.textPrimary,
                    ),
                  ),
                  Row(
                    children: [
                      Container(
                        width: 6,
                        height: 6,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: JyotiTheme.cosmicEmerald,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        chart != null
                            ? '${chart.ascendantSign} Lagna Synchronized'
                            : 'Celestial Stream Active',
                        style: const TextStyle(fontSize: 10, color: JyotiTheme.textMuted),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
          IconButton(
            icon: const Icon(Icons.refresh, size: 18, color: JyotiTheme.textMuted),
            tooltip: 'Clear Stream',
            onPressed: () => ref.read(jyotiChatProvider.notifier).clearChat(),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(JyotiChatMessage msg) {
    final isUser = msg.sender == 'user';

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isUser) ...[
            Container(
              margin: const EdgeInsets.only(top: 2, right: 10),
              width: 26,
              height: 26,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                gradient: JyotiTheme.solarAuraGradient,
              ),
              child: const Center(
                child: Icon(Icons.auto_awesome, size: 13, color: Colors.white),
              ),
            ),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: isUser ? JyotiTheme.electricIndigo.withOpacity(0.2) : JyotiTheme.surfaceElevated,
                borderRadius: BorderRadius.circular(16).copyWith(
                  bottomRight: isUser ? const Radius.circular(2) : const Radius.circular(16),
                  topLeft: !isUser ? const Radius.circular(2) : const Radius.circular(16),
                ),
                border: Border.all(
                  color: isUser ? JyotiTheme.electricIndigo.withOpacity(0.5) : JyotiTheme.borderSubtle,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (msg.astralContext != null) ...[
                    Container(
                      margin: const EdgeInsets.only(bottom: 6),
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: JyotiTheme.cosmicViolet.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        msg.astralContext!,
                        style: const TextStyle(
                          fontSize: 9,
                          fontWeight: FontWeight.w600,
                          color: JyotiTheme.cosmicViolet,
                        ),
                      ),
                    ),
                  ],
                  _buildFormattedContent(msg.content),
                  const SizedBox(height: 6),
                  Align(
                    alignment: Alignment.bottomRight,
                    child: Text(
                      DateFormat('HH:mm').format(msg.timestamp),
                      style: const TextStyle(fontSize: 9, color: JyotiTheme.textMuted),
                    ),
                  ),
                ],
              ),
            ),
          ),
          if (isUser) const SizedBox(width: 8),
        ],
      ),
    );
  }

  Widget _buildStreamingBubble(String text, String? thought) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 2, right: 10),
            width: 26,
            height: 26,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              gradient: JyotiTheme.astralEnergyGradient,
            ),
            child: const Center(
              child: Icon(Icons.auto_awesome, size: 13, color: Colors.white),
            ),
          ),
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: JyotiTheme.surfaceElevated,
                borderRadius: BorderRadius.circular(16).copyWith(
                  topLeft: const Radius.circular(2),
                ),
                border: Border.all(color: JyotiTheme.electricIndigo.withOpacity(0.4)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (thought != null) ...[
                    Row(
                      children: [
                        const SizedBox(
                          width: 10,
                          height: 10,
                          child: CircularProgressIndicator(
                            strokeWidth: 1.5,
                            color: JyotiTheme.cosmicViolet,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          thought,
                          style: const TextStyle(
                            fontSize: 10,
                            fontStyle: FontStyle.italic,
                            color: JyotiTheme.cosmicViolet,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                  ],
                  _buildFormattedContent(text),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFormattedContent(String content) {
    return Text(
      content,
      style: GoogleFonts.plusJakartaSans(
        fontSize: 13,
        height: 1.55,
        color: JyotiTheme.textPrimary,
      ),
    );
  }

  Widget _buildQuickPrompts() {
    final prompts = [
      '🏛️ Career & Wealth Timing',
      '✨ Harmonic Union Alignment',
      '⏳ Current Dasha Influence',
      '⚡ Planetary Strengths Matrix',
    ];

    return Container(
      height: 38,
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: prompts.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, idx) {
          final p = prompts[idx];
          return ActionChip(
            label: Text(p, style: const TextStyle(fontSize: 11, color: JyotiTheme.textSecondary)),
            backgroundColor: JyotiTheme.surfaceGlass,
            side: const BorderSide(color: JyotiTheme.borderSubtle),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            padding: const EdgeInsets.symmetric(horizontal: 4),
            onPressed: () => _sendMessage(p),
          );
        },
      ),
    );
  }

  Widget _buildInputBar(bool isGenerating) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: const BoxDecoration(
        color: JyotiTheme.surfaceGlass,
        border: Border(top: BorderSide(color: JyotiTheme.borderSubtle)),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _inputCtrl,
              onSubmitted: (_) => _sendMessage(),
              style: const TextStyle(color: Colors.white, fontSize: 13),
              decoration: InputDecoration(
                hintText: 'Ask Jyoti Oracle about your celestial matrix...',
                hintStyle: const TextStyle(color: JyotiTheme.textMuted, fontSize: 12),
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                filled: true,
                fillColor: JyotiTheme.spaceCanvas,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: const BorderSide(color: JyotiTheme.borderSubtle),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: const BorderSide(color: JyotiTheme.borderSubtle),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: const BorderSide(color: JyotiTheme.electricIndigo),
                ),
              ),
            ),
          ),
          const SizedBox(width: 8),
          IconButton(
            onPressed: isGenerating ? null : () => _sendMessage(),
            icon: isGenerating
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(strokeWidth: 2, color: JyotiTheme.electricIndigo),
                  )
                : const Icon(Icons.send_rounded, color: JyotiTheme.electricIndigo, size: 20),
            style: IconButton.styleFrom(
              backgroundColor: JyotiTheme.surfaceElevated,
              padding: const EdgeInsets.all(10),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
          ),
        ],
      ),
    );
  }
}
