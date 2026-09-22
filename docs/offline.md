# SignEdge Offline-First Architecture & Resiliency Guide

> **Core Product Principle:** SignEdge is an **offline-first platform**. Core communication functionality operates without continuous internet connectivity after initial installation.

---

## 1. Offline Architecture Overview

Traditional accessibility applications often rely on cloud streaming: every video frame is transmitted over WebRTC to server clusters, and spoken audio is processed by cloud APIs. If a user enters an elevator, a hospital basement, a rural area, or experiences network congestion, the application ceases functioning.

SignEdge reverses this paradigm:

```text
                  SIGNEDGE RUNTIME
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
   OFFLINE CORE ENGINE           OPTIONAL SERVICES
   (Device Execution)            (Network Dependent)
          │                             │
   ┌──────┴──────┐               ┌──────┴──────┐
   ▼             ▼               ▼             ▼
Local Vision  Local Audio      Lexicon Sync  Cloud TTS
Inference     Inference        (Check for    (High-res
& Models      & TTS            New Signs)     Voices)
   │             │                      │
   └──────┬──────┘                      │
          ▼                             │
    LOCAL RESULT ◄──────────────────────┘
```

---

## 2. Feature Availability Breakdown

| Capability | Offline Execution | Technical Mechanism |
| :--- | :---: | :--- |
| **Sign-to-Text Recognition** | **YES** | Local canvas frame processing + temporal trajectory classifier. |
| **Sign-to-Speech Synthesis** | **YES** | System speech synthesis engine native to Android, iOS, Windows, macOS. |
| **Speech-to-Text Captions** | **YES / Device-native** | Device SpeechRecognition engine (built-in on modern Android 12+ and iOS 16+). |
| **Visual Sign Cues Player** | **YES** | Statically cached vector assets and step-by-step keyframes. |
| **Two-Person Conversation Mode** | **YES** | Local turn sequencer and state machine. |
| **Conversation History** | **YES** | Client-side IndexedDB (`signedge_local_db`). |
| **Privacy & Permissions Center** | **YES** | Local `navigator.permissions` and storage estimators. |
| **Supported Signs Dictionary** | **YES** | Bundled static dataset with 21 signs across 6 categories. |
| **New Model / Sign Downloads** | **NO** | Requires network to fetch newly certified vocabulary packages. |

---

## 3. PWA Caching & Model Storage

### Where Assets are Stored
1. **Application Shell**: Service Worker caches HTML, compiled JavaScript chunks, stylesheets, and SVG assets in the browser `CacheStorage`.
2. **Conversation History & Preferences**: Stored in **IndexedDB** (`signedge_local_db`) within the browser's persistent storage partition.
3. **Model Weights & Heuristic Templates**: Bundled into the compiled client binary (`dist/assets/`), requiring zero external network calls upon startup.

### Storage Footprint
- Core Application Bundle: **~370 KB (gzip: ~95 KB)**.
- Local Database: **< 500 KB** for hundreds of conversation sessions.
- Total Footprint: **< 1.5 MB**, ensuring lightning-fast load times even on low-end budget smartphones with 2G/3G connections.

---

## 4. Network State Transitions & Recovery

SignEdge actively monitors network lifecycle events via the `AppContext`:

```typescript
window.addEventListener('online', () => setIsOnline(true));
window.addEventListener('offline', () => setIsOnline(false));
```

### What Happens When Internet Disappears?
1. **Zero Interruptions**: Active camera video processing, sign recognition, and conversation logging continue uninterrupted.
2. **Visual Status Badge**: The top badge shifts from `Edge Active` (Green) to `Offline Mode` (Amber).
3. **No Failed API Calls**: The application never makes polling calls to external APIs, preventing network timeout errors or sluggish UI freezes.

### What Happens When an Offline Model is Unavailable?
If browser permissions or hardware acceleration fail:
1. SignEdge switches to an adaptive CPU heuristic mode.
2. If camera hardware is inaccessible, users can activate the **Interactive Test Mode** to simulate sign recognition deterministically without breaking the conversation flow.
