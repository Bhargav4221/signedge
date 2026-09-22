# SignEdge AI & Machine Learning Pipeline

> **SignEdge Technical Deep-Dive:** Computer Vision, Spatial Landmark Modeling, Temporal Sequence Classification, and Language Generation.

---

## 1. Pipeline Overview

The SignEdge AI engine implements a modular, pipelined architecture running purely on client hardware. It strictly decouples **vision perception** from **temporal movement analysis** and **natural language generation**:

```text
              CAMERA FEED (RGBA)
                      │
                      ▼
         [Stage 1: Computer Vision]
           Frame Sampling & Scaling
                      │
                      ▼
       [Stage 2: Landmark Feature Extraction]
        21 Hand Keypoints + Upper Pose
                      │
                      ▼
       [Stage 3: Temporal Sequence Modeling]
        Sliding Window Trajectory Buffer
                      │
                      ▼
       [Stage 4: Sign Semantics Classification]
        Gloss & Confidence Scoring (0–100%)
                      │
                      ▼
       [Stage 5: Contextual Language Layer]
        Multi-Gloss to Natural Language
                      │
              ┌───────┴───────┐
              ▼               ▼
         TEXT OUTPUT    SPEECH (TTS)
```

---

## 2. Stage 1 & 2: Vision & Landmark Extraction

### Why Landmarks Instead of Raw RGB Convolutions?
Streaming continuous high-resolution video into deep 3D convolutional neural networks (like I3D or SlowFast) on mobile devices causes rapid thermal throttling, high battery consumption, and severe frame dropping. 

SignEdge utilizes a geometric landmark reduction:
1. Video canvas captures video at an adaptive resolution based on device capability (320x240 on Low Tier, 480x360 on Medium Tier, 640x480 on High Tier).
2. **Hand Landmarks (21 points per hand)**:
   - Point 0: Wrist anchor point
   - Points 1–4: Thumb (CMC, MCP, IP, Tip)
   - Points 5–8: Index finger (MCP, PIP, DIP, Tip)
   - Points 9–12: Middle finger (MCP, PIP, DIP, Tip)
   - Points 13–16: Ring finger (MCP, PIP, DIP, Tip)
   - Points 17–20: Pinky finger (MCP, PIP, DIP, Tip)
3. **Upper-Body Pose Reference (7 points)**:
   - Shoulders (left/right) for chest frame reference
   - Elbows and Wrists for forearm orientation
   - Nose/Chin for facial contact gestures (e.g., *THANK YOU*, *WATER*)

### Normalization
All raw pixel coordinates \((x, y)\) are normalized relative to:
- **Wrist Origin**: All finger vectors are offset relative to Point 0.
- **Palm Scale Metric**: Normalized by the Euclidean distance between Point 0 (Wrist) and Point 9 (Middle MCP):
  $$\text{Scale} = \sqrt{(x_9 - x_0)^2 + (y_9 - y_0)^2}$$

---

## 3. Stage 3: Temporal Sequence Modeling

### Why Temporal Modeling is Essential
> [!IMPORTANT]
> **MediaPipe and static landmark detection are NOT a sign language translator.**
> Sign languages are dynamic linguistic systems. For instance:
> - A static open hand near the forehead could be an unfinished salute, a wave, or resting. Only when tracking the **trajectory vector moving outward in an arc** does it signify *"HELLO"*.
> - A closed fist moving downward nods affirmatively to signify *"YES"*.
> - Two index fingers twisting toward each other signify *"PAIN"*.

### Sliding Temporal Window Buffer
The pipeline maintains a FIFO circular buffer of \(N\) frames (\(N \in [16, 30]\), representing approximately 600ms to 1000ms at typical frame rates).

```text
Frame t-24 ──► Frame t-20 ──► Frame t-10 ──► Frame t (Current)
└───────────────────────────┬───────────────────────────────┘
                            ▼
          Dynamic Trajectory Evaluation:
          • Delta X / Delta Y displacement
          • Average velocity vector
          • Lateral oscillation frequency (dx reversal count)
          • Inter-hand Euclidean convergence
```

---

## 4. Stage 4: Sign Semantics Classification

Each supported sign definition in `src/ai/vocabulary.ts` specifies a structural feature pattern:
1. **Finger Extension Signature**: Binary array \([F_{\text{thumb}}, F_{\text{index}}, F_{\text{middle}}, F_{\text{ring}}, F_{\text{pinky}}]\).
2. **Motion Type**: `linear`, `oscillating`, `contact`, `two-handed-open`, or `static`.
3. **Target Direction**: `up`, `down`, `forward`, `chest`, `chin`.

### Multi-Cue Scoring Function
The similarity score \(S(\text{sign})\) is computed as:
$$S(\text{sign}) = w_1 S_{\text{finger}} + w_2 S_{\text{motion}} + w_3 S_{\text{coordination}} + S_{\text{base}}$$

- **Finger Match (\(w_1 = 0.40\))**: Ratio of matching extended/curled fingers.
- **Motion Match (\(w_2 = 0.35\))**: Velocity, direction vector, and oscillation congruence.
- **Coordination Check (\(w_3 = 0.15\))**: Single-hand vs two-handed mutual presence.
- **Confidence Floor (\(S_{\text{base}} = 0.10\))**.

### Hysteresis Thresholding
To prevent sporadic flickering between candidate signs, a detection is only marked **Stable** (`isStable: true`) when the same candidate dominates the top score for at least 3 consecutive temporal evaluations.

---

## 5. Stage 5: Contextual Language Processing

Sign language grammar (such as ASL) does not map word-for-word to English syntax. ASL relies on Topic-Comment structures, spatial indexing, and facial markers.

The `LanguageProcessor` smooths semantic sign glosses into polite, grammatical natural English:

| Sign Gloss Sequence | Raw Translation | Smoothed Natural Spoken Output |
| :--- | :--- | :--- |
| `["ME", "HELP"]` | Me help | *"I need help, please."* |
| `["WHERE", "RESTROOM"]` | Where restroom | *"Where is the nearest restroom?"* |
| `["ME", "PAIN"]` | Me pain | *"I am experiencing severe pain."* |
| `["WHERE", "DOCTOR"]` | Where doctor | *"Where can I find a doctor?"* |
| `["HELLO", "NICE-MEET-YOU"]` | Hello nice meet you | *"Hello! It is very nice to meet you."* |
| `["PLEASE", "AGAIN"]` | Please again | *"Could you please repeat that again?"* |

---

## 6. Stage 6: Reverse Communication Pipeline

When a hearing partner speaks:

```text
SPOKEN SPEECH ──► On-Device STT ──► Transcript Text
                                         │
                                         ▼
                               Keyword & Intent Parser
                               (Synonym Normalization)
                                         │
                                         ▼
                            Certified Sign Sequence
                                         │
                                         ▼
                            Visual Cue Keyframe Player
                       (Directional Arrows + Handshapes)
```

1. **Audio Capture**: Web Speech Recognition API handles speech-to-text without remote storage.
2. **Keyword Extraction**: Synonym dictionaries map colloquial variations (*"toilet"* \(\to\) `RESTROOM`, *"hurts"* \(\to\) `PAIN`, *"physician"* \(\to\) `DOCTOR`).
3. **Visual Cue Rendering**: Rather than rendering ungrounded, inaccurate 3D humanoid animations that misrepresent complex spatial grammar, SignEdge presents **certified, step-by-step keyframes** with explicit handshape labels, directional motion arrows, and anatomical positions.
