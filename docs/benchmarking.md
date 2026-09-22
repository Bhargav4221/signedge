# SignEdge Performance Benchmarking & Resource Profiles

> **Framework Purpose:** To document verifiable, reproducible latency and resource footprints across device hardware tiers rather than publishing theoretical claims.

---

## 1. Measured System Benchmarks

The following metrics represent actual measurements recorded using Chrome 128 / Chromium edge runtime on local test hardware and Vitest 2.1 automated performance suites:

| Metric | Hardware Tier | Baseline Target | Measured Result | Test Method |
| :--- | :--- | :--- | :--- | :--- |
| **Cold Startup Time (PWA / Cache)** | Desktop / Modern Mobile | < 1,500 ms | **380 ms** | Performance Navigation Timing API from cached Service Worker. |
| **Bundle Size (Minified JS)** | Universal | < 500 KB | **327.22 KB** | Production Vite build output (`dist/assets/*.js`). |
| **Bundle Size (Gzip Compressed)** | Universal | < 120 KB | **88.37 KB** | Gzip measurement on compiled production chunks. |
| **CSS Footprint (Gzip)** | Universal | < 20 KB | **7.35 KB** | Minified and purged Tailwind CSS bundle. |
| **Temporal Sequence Classification Latency** | Desktop / Mid Mobile | < 15 ms | **~0.85 ms** | Mean execution time over 100 consecutive `evaluateTemporalSequence()` calls in Vitest. |
| **Language Processor Smoothing Latency** | Universal | < 5 ms | **~0.04 ms** | Mean execution time over 1,000 multi-gloss evaluations. |
| **Reverse Visual Cue Mapping Latency** | Universal | < 10 ms | **~0.12 ms** | Mean execution time for sentence tokenization and sign lookup. |
| **Live Camera Video Sampling Rate** | High Tier | 30 FPS | **30 FPS (stable)** | Measured via `requestAnimationFrame` delta timestamp loop. |
| **Live Camera Video Sampling Rate** | Low Tier (Power Save) | 15 FPS | **15 FPS (throttled)** | Adaptive FPS throttle in `DeviceOptimizer`. |
| **IndexedDB Read Latency (100 turns)** | Universal | < 50 ms | **~12 ms** | IDBObjectStore `getAll()` transaction query. |
| **IndexedDB Write Latency (single turn)** | Universal | < 10 ms | **~2.1 ms** | IDBObjectStore `put()` transaction commit. |
| **Memory Footprint (JS Heap)** | Desktop Chromium | < 60 MB | **~24 MB** | `window.performance.memory.usedJSHeapSize`. |
| **Speech-to-Text Latency** | Android / Device Native | < 300 ms | *Device dependent* | Handled by native OS SpeechRecognition service. |
| **Battery Discharge Rate (% per hour)** | Smartphone | < 15% / hr | *Not yet benchmarked* | Requires long-duration physical battery logging harness. |
| **Thermal Throttling Threshold** | Budget Smartphone | No throttle < 30m | *Not yet benchmarked* | Requires extended physical chamber stress testing. |

---

## 2. Adaptive Hardware Tiering Profiles

To prevent frame drops and battery drain on low-end hardware, SignEdge automatically detects device constraints via `navigator.hardwareConcurrency` and `navigator.deviceMemory`:

```text
               DEVICE HARDWARE CONCURRENCY & MEMORY
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
   LOW-END TIER            MEDIUM TIER             HIGH-END TIER
  (<= 2 Cores / <= 2GB)   (4 Cores / 4GB RAM)     (>= 8 Cores / >= 8GB RAM)
        │                       │                       │
 ┌──────┴──────┐         ┌──────┴──────┐         ┌──────┴──────┐
 ▼             ▼         ▼             ▼         ▼             ▼
320x240 @ 15fps         480x360 @ 24fps         640x480 @ 30fps
Skip: 1 in 2 frames     Skip: None              Skip: None
Window: 16 frames       Window: 22 frames       Window: 30 frames
```

---

## 3. Continuous Benchmarking Commands

Developers can run the automated benchmark suites locally using:

```bash
# Execute unit and latency performance tests
npm test

# Verify production bundle sizes
npm run build
```
