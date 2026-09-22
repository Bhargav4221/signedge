# SignEdge Privacy & Security Architecture

> **Core Principle:** **Designed for local-first processing with no cloud transmission of core conversation data by default.**

---

## 1. Privacy Architecture Diagram

```text
CAMERA FEED ────────┐
                    │
MICROPHONE AUDIO ───┼──► [VOLATILE RAM CANVAS / AUDIO BUFFER]
                    │                  │
                    │                  ▼
                    │       [ON-DEVICE AI INFERENCE]
                    │                  │
                    │         ┌────────┴────────┐
                    │         ▼                 ▼
                    │     TRANSLATED       LOCAL INDEXEDDB
                    │       RESULT          TRANSCRIPT
                    │         │                 │
                    │         ▼                 ▼
                    └────►  SCREEN ◄────── USER CONTROLS
                          (TTS / UI)    (Wipe / Export)
```

---

## 2. Detailed Data Handling Policy

### 1. Camera Video Data
- **Capture Scope**: The video stream is accessed via `navigator.mediaDevices.getUserMedia`.
- **Processing**: Video frames are drawn onto an internal HTML5 `<canvas>` in volatile GPU/CPU memory for landmark coordinate extraction.
- **Retention**: **Zero seconds**. Frames are overwritten in real time (every 33ms at 30 FPS). No raw image or video stream is ever recorded, buffered to persistent storage, or transmitted across the network.

### 2. Microphone Audio Data
- **Capture Scope**: Audio is accessed solely during active speech input via the device's native `SpeechRecognition` API.
- **Processing**: Speech is transcribed directly on the device.
- **Retention**: The audio stream is released immediately when the speaker stops talking. Audio recordings are never saved to disk.

### 3. Generated Conversation Transcripts
- **Storage Medium**: Stored strictly in the user's browser-managed **IndexedDB** database (`signedge_local_db`).
- **Access Boundary**: Accessible only within the same origin (`same-origin policy`).
- **Data Minimization**: Users have full sovereign control to:
  - Edit individual messages
  - Delete individual messages
  - Export transcripts as plain text (`.txt`) or structured `.json`
  - Execute a **1-Tap Complete Purge** that clears IndexedDB, LocalStorage, and CacheStorage instantly.

### 4. Telemetry and Analytics
- **Zero Third-Party Trackers**: SignEdge contains **no Google Analytics, no Meta Pixel, no Mixpanel, and no advertising SDKs**.
- **No Crash Reporting Pingbacks**: Errors are logged strictly to the browser developer console.
- **No Account Mandatory**: The platform requires no user registration, no email address, and no authentication token.

---

## 3. Data Deletion Verification

Users can audit and verify local storage at any time via the **Privacy Center** (`/privacy-center`):
- Displays active permission states (`camera`, `microphone`).
- Shows total message count and physical byte footprint (`navigator.storage.estimate()`).
- Provides the irreversible **Purge All Local Data** action.
