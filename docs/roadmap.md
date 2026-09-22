# SignEdge Public Product Roadmap

> **Product Vision:** A world where any person can communicate across sign and spoken languages using private, reliable on-device technology.

---

## Roadmap Phases

```text
PHASE 1 (Current)          PHASE 2 (Next)             PHASE 3 (Future)           PHASE 4 (Long-term)
Core Vocabulary &          Expanded Temporal          Multi-Dialect &            Personalization &
Offline-First Mobile       Transformer Models         WebGPU On-Device Whisper   Wearable Integration
─────────────────────────  ─────────────────────────  ─────────────────────────  ─────────────────────────
• 21 Essential Signs       • 50+ Medical & Service    • Indian Sign Language     • User-Specific Sign
• On-Device Temporal Buffer  Signs                      (ISL) Full Model           Calibration (Tremors)
• Bidirectional Modes      • WebGPU Acceleration     • British Sign (BSL)       • Smartwatch Haptic
• WCAG AAA Accessibility   • Two-Handed Advanced      • Pure Offline Whisper       Feedback
• IndexedDB Local Storage    Cross-Body Signs           WebGPU STT Engine        • Multi-Party Transcripts
```

---

## Detailed Milestones

### Phase 1: Production Foundation (Current v1.0.0 Release)
- [x] On-device modular landmark extraction and temporal sequence classifier.
- [x] Curated 21-sign essential vocabulary across Emergency, Healthcare, Greetings, Daily Life, and Questions.
- [x] Bidirectional communication workflows: Sign \(\to\) Text, Sign \(\to\) Speech, Speech \(\to\) Text, Speech \(\to\) Visual Cues.
- [x] Two-Person Conversation Mode with 180° table-top rotation for seated dialogues.
- [x] 100% offline-capable architecture with Service Worker caching and local IndexedDB history.
- [x] Privacy Center with 1-tap local storage purge and zero-telemetry guarantee.
- [x] WCAG 2.1 AAA high-contrast theme, dynamic font scaling, and reduced motion modes.
- [x] Responsive layout optimized for smartphones (Android / iOS), tablets, and desktop displays.

### Phase 2: Expanded Vocabulary & Temporal Transformer (Next)
- [ ] Expand certified on-device vocabulary to **60+ signs** focusing on public transit, banking, and specialized medical triage.
- [ ] Integrate lightweight on-device Temporal Convolutional Network (TCN) or small Transformer encoder via ONNX Runtime Web / WebGPU.
- [ ] Enhance facial expression landmark tracking (eyebrow furrowing and mouth morphemes for ASL grammatical markers).
- [ ] Automated vocabulary package updater with cryptographically signed offline updates.

### Phase 3: Multi-Dialect Expansion & Pure Offline STT (Future)
- [ ] Comprehensive sign vocabulary sets for **Indian Sign Language (ISL)** and **British Sign Language (BSL)**.
- [ ] Embedded quantized Whisper WebGPU speech recognition model for browsers and desktop platforms that lack native on-device speech-to-text.
- [ ] Audio-to-tactile vibration patterns for deafblind accessibility.

### Phase 4: Personalization & System Integrations (Long-term)
- [ ] **Adaptive User Calibration**: Custom fine-tuning for individuals with limited mobility, arthritis, or variable signing speeds.
- [ ] Public Service Counter Kiosk mode with locked-down security profiles for hospital reception desks and municipal counters.
- [ ] Integration with wearable haptic wristbands for discreet directional cues.
