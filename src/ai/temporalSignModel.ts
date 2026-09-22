import { 
  FrameLandmarks, 
  TemporalFrame, 
  RecognitionResult, 
  SignDefinition 
} from './types';
import { SUPPORTED_SIGNS } from './vocabulary';
import { LandmarkDetector } from './landmarkDetector';

/**
 * Temporal Sequence Modeling for Dynamic Sign Language Recognition
 * 
 * Signs cannot be recognized from a single static video frame alone because sign language
 * semantics are defined by handshape, movement trajectory, spatial location, and temporal sequence.
 * This class implements a temporal sliding window buffer that analyzes dynamic motion vectors,
 * velocity profiles, and handshape transitions over time.
 */
export class TemporalSignModel {
  private windowSize: number = 24; // ~800ms at 30fps
  private frameBuffer: TemporalFrame[] = [];
  private landmarkDetector: LandmarkDetector;
  private lastRecognizedSignId: string | null = null;
  private stableDetectionCount: number = 0;
  private readonly stabilityThreshold: number = 3; // Consecutive matches required for trigger

  constructor(detector: LandmarkDetector, windowSize = 24) {
    this.landmarkDetector = detector;
    this.windowSize = windowSize;
  }

  public setWindowSize(size: number) {
    this.windowSize = Math.max(10, Math.min(60, size));
  }

  public clearBuffer() {
    this.frameBuffer = [];
    this.lastRecognizedSignId = null;
    this.stableDetectionCount = 0;
  }

  /**
   * Feed a new video frame's landmarks into the temporal model
   */
  public pushFrame(landmarks: FrameLandmarks): RecognitionResult | null {
    if (!landmarks.handDetected || (!landmarks.rightHand && !landmarks.leftHand)) {
      // Clear or degrade buffer if no hands detected
      if (this.frameBuffer.length > 0) {
        this.frameBuffer.shift();
      }
      return null;
    }

    const primaryLandmarks = landmarks.rightHand || landmarks.leftHand;
    if (!primaryLandmarks) return null;

    const primaryFeatures = this.landmarkDetector.extractFeatures(primaryLandmarks);
    
    let secondaryFeatures = undefined;
    let twoHandedDistance = undefined;
    if (landmarks.rightHand && landmarks.leftHand) {
      secondaryFeatures = this.landmarkDetector.extractFeatures(landmarks.leftHand);
      // Distance between wrists
      twoHandedDistance = Math.hypot(
        landmarks.rightHand[0].x - landmarks.leftHand[0].x,
        landmarks.rightHand[0].y - landmarks.leftHand[0].y
      );
    }

    // Add frame to sliding temporal buffer
    const temporalFrame: TemporalFrame = {
      timestamp: landmarks.timestamp,
      landmarks,
      features: {
        primaryHand: primaryFeatures,
        secondaryHand: secondaryFeatures,
        twoHandedDistance
      }
    };

    this.frameBuffer.push(temporalFrame);
    if (this.frameBuffer.length > this.windowSize) {
      this.frameBuffer.shift();
    }

    // Need at least half buffer to evaluate trajectory
    if (this.frameBuffer.length < Math.floor(this.windowSize / 2)) {
      return null;
    }

    return this.evaluateTemporalSequence();
  }

  /**
   * Core Temporal Evaluation:
   * Analyzes trajectory delta, velocity, and finger signature over the temporal window
   */
  public evaluateTemporalSequence(): RecognitionResult | null {
    const n = this.frameBuffer.length;
    if (n < 6) return null;

    const firstFrame = this.frameBuffer[0];
    const lastFrame = this.frameBuffer[n - 1];

    const firstHand = firstFrame.landmarks.rightHand || firstFrame.landmarks.leftHand;
    const lastHand = lastFrame.landmarks.rightHand || lastFrame.landmarks.leftHand;

    if (!firstHand || !lastHand) return null;

    // Wrist trajectory delta
    const deltaX = lastHand[0].x - firstHand[0].x;
    const deltaY = lastHand[0].y - firstHand[0].y;
    const durationMs = lastFrame.timestamp - firstFrame.timestamp || 1;

    // Average velocity
    const totalDistance = Math.hypot(deltaX, deltaY);
    const avgVelocity = totalDistance / (durationMs / 1000); // units per second

    // Current finger signature from latest frame
    const latestFeatures = lastFrame.features.primaryHand;
    if (!latestFeatures) return null;

    const currentFingers = latestFeatures.fingerExtensions;

    // Evaluate lateral oscillation (side-to-side waving or shaking)
    let directionChangesX = 0;
    for (let i = 2; i < n; i++) {
      const hPrev = (this.frameBuffer[i - 1].landmarks.rightHand || this.frameBuffer[i - 1].landmarks.leftHand);
      const hCurr = (this.frameBuffer[i].landmarks.rightHand || this.frameBuffer[i].landmarks.leftHand);
      const hPrior = (this.frameBuffer[i - 2].landmarks.rightHand || this.frameBuffer[i - 2].landmarks.leftHand);
      if (hPrev && hCurr && hPrior) {
        const d1 = hPrev[0].x - hPrior[0].x;
        const d2 = hCurr[0].x - hPrev[0].x;
        if (d1 * d2 < -0.0001) {
          directionChangesX++;
        }
      }
    }

    const isOscillating = directionChangesX >= 2;

    // Score all candidate signs in vocabulary
    let bestSign: SignDefinition | null = null;
    let highestConfidence = 0.0;

    for (const sign of SUPPORTED_SIGNS) {
      const conf = this.calculateSignScore(sign, {
        fingerExtensions: currentFingers,
        deltaX,
        deltaY,
        avgVelocity,
        isOscillating,
        twoHandedPresent: Boolean(lastFrame.landmarks.rightHand && lastFrame.landmarks.leftHand),
        wristY: lastHand[0].y
      });

      if (conf > highestConfidence && conf >= sign.confidenceThreshold) {
        highestConfidence = conf;
        bestSign = sign;
      }
    }

    if (!bestSign) {
      this.stableDetectionCount = 0;
      return null;
    }

    // Temporal Hysteresis filtering
    if (bestSign.id === this.lastRecognizedSignId) {
      this.stableDetectionCount++;
    } else {
      this.lastRecognizedSignId = bestSign.id;
      this.stableDetectionCount = 1;
    }

    const isStable = this.stableDetectionCount >= this.stabilityThreshold;

    return {
      signId: bestSign.id,
      gloss: bestSign.gloss,
      naturalText: bestSign.naturalPhrase,
      category: bestSign.category,
      confidence: Math.min(0.98, parseFloat(highestConfidence.toFixed(2))),
      isStable,
      timestamp: lastFrame.timestamp,
      durationMs
    };
  }

  /**
   * Calculates similarity score for a sign candidate based on multi-cue features
   */
  private calculateSignScore(
    sign: SignDefinition,
    observed: {
      fingerExtensions: number[];
      deltaX: number;
      deltaY: number;
      avgVelocity: number;
      isOscillating: boolean;
      twoHandedPresent: boolean;
      wristY: number;
    }
  ): number {
    let score = 0;
    const targetFingers = sign.featurePattern.fingerSignature;

    // 1. Finger Extension Matching (Weight: 40%)
    let fingerMatchCount = 0;
    for (let i = 0; i < 5; i++) {
      if (observed.fingerExtensions[i] === targetFingers[i]) {
        fingerMatchCount++;
      }
    }
    const fingerScore = (fingerMatchCount / 5) * 0.40;
    score += fingerScore;

    // 2. Motion Dynamic Matching (Weight: 35%)
    let motionScore = 0;
    switch (sign.featurePattern.motionType) {
      case 'oscillating':
        motionScore = observed.isOscillating ? 0.35 : 0.05;
        break;
      case 'linear':
        if (sign.featurePattern.targetDirection === 'up' && observed.deltaY < -0.04) {
          motionScore = 0.35;
        } else if (sign.featurePattern.targetDirection === 'down' && observed.deltaY > 0.04) {
          motionScore = 0.35;
        } else if (sign.featurePattern.targetDirection === 'forward' && Math.hypot(observed.deltaX, observed.deltaY) > 0.02) {
          motionScore = 0.30;
        } else {
          motionScore = 0.15;
        }
        break;
      case 'contact':
        // Sudden decrease in velocity or terminal hold
        motionScore = observed.avgVelocity < 0.8 ? 0.35 : 0.20;
        break;
      case 'two-handed-open':
        motionScore = observed.twoHandedPresent ? 0.35 : 0.10;
        break;
      case 'static':
        motionScore = Math.hypot(observed.deltaX, observed.deltaY) < 0.03 ? 0.35 : 0.10;
        break;
    }
    score += motionScore;

    // 3. Two-handed consistency check (Weight: 15%)
    if (sign.twoHanded) {
      score += observed.twoHandedPresent ? 0.15 : 0.0;
    } else {
      score += 0.15; // single handed does not penalize
    }

    // 4. Base confidence floor (10%)
    score += 0.10;

    return Math.min(0.99, score);
  }
}
