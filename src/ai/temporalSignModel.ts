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
 * Accurately classifies intentional sign gestures over a multi-frame sliding window.
 * Requires deliberate motion trajectory and hand stability.
 * Idle or resting hands are ignored to prevent premature false triggers.
 */
export class TemporalSignModel {
  private windowSize: number = 24; // ~800ms at 30fps
  private frameBuffer: TemporalFrame[] = [];
  private landmarkDetector: LandmarkDetector;
  private lastRecognizedSignId: string | null = null;
  private stableDetectionCount: number = 0;
  private readonly stabilityThreshold: number = 4; // Consecutive matches required for trigger
  private minMotionThreshold: number = 0.025; // Minimum spatial displacement to avoid idle triggers

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
      // Clear buffer immediately when hand leaves the camera frame
      this.clearBuffer();
      return null;
    }

    const primaryLandmarks = landmarks.rightHand || landmarks.leftHand;
    if (!primaryLandmarks) return null;

    const primaryFeatures = this.landmarkDetector.extractFeatures(primaryLandmarks);
    
    let secondaryFeatures = undefined;
    let twoHandedDistance = undefined;
    if (landmarks.rightHand && landmarks.leftHand) {
      secondaryFeatures = this.landmarkDetector.extractFeatures(landmarks.leftHand);
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

    // Need at least 8 frames to evaluate trajectory
    if (this.frameBuffer.length < 8) {
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
    if (n < 8) return null;

    const firstFrame = this.frameBuffer[0];
    const lastFrame = this.frameBuffer[n - 1];

    const firstHand = firstFrame.landmarks.rightHand || firstFrame.landmarks.leftHand;
    const lastHand = lastFrame.landmarks.rightHand || lastFrame.landmarks.leftHand;

    if (!firstHand || !lastHand) return null;

    // Wrist trajectory delta
    const deltaX = lastHand[0].x - firstHand[0].x;
    const deltaY = lastHand[0].y - firstHand[0].y;
    const durationMs = lastFrame.timestamp - firstFrame.timestamp || 1;

    // Displacement
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

    // Guard: If hand is idle/stationary without oscillation, do NOT trigger false signs
    if (totalDistance < this.minMotionThreshold && !isOscillating) {
      this.stableDetectionCount = 0;
      return null;
    }

    // Score candidate signs in vocabulary
    let bestSign: SignDefinition | null = null;
    let highestConfidence = 0.0;

    for (const sign of SUPPORTED_SIGNS) {
      const conf = this.calculateSignScore(sign, {
        fingerExtensions: currentFingers,
        deltaX,
        deltaY,
        avgVelocity,
        totalDistance,
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
      totalDistance: number;
      isOscillating: boolean;
      twoHandedPresent: boolean;
      wristY: number;
    }
  ): number {
    let score = 0;
    const targetFingers = sign.featurePattern.fingerSignature;

    // 1. Finger Extension Matching (Weight: 45%)
    let fingerMatchCount = 0;
    for (let i = 0; i < 5; i++) {
      if (observed.fingerExtensions[i] === targetFingers[i]) {
        fingerMatchCount++;
      }
    }
    const fingerScore = (fingerMatchCount / 5) * 0.45;
    score += fingerScore;

    // 2. Motion Dynamic Matching (Weight: 40%)
    let motionScore = 0;
    switch (sign.featurePattern.motionType) {
      case 'oscillating':
        motionScore = observed.isOscillating ? 0.40 : 0.0;
        break;
      case 'linear':
        if (sign.featurePattern.targetDirection === 'up' && observed.deltaY < -0.04) {
          motionScore = 0.40;
        } else if (sign.featurePattern.targetDirection === 'down' && observed.deltaY > 0.04) {
          motionScore = 0.40;
        } else if (sign.featurePattern.targetDirection === 'forward' && observed.totalDistance > 0.03) {
          motionScore = 0.35;
        } else {
          motionScore = 0.05;
        }
        break;
      case 'contact':
        // Distinct deceleration after motion
        if (observed.totalDistance > 0.02 && observed.avgVelocity < 0.6) {
          motionScore = 0.40;
        } else {
          motionScore = 0.15;
        }
        break;
      case 'two-handed-open':
        motionScore = observed.twoHandedPresent && observed.totalDistance > 0.025 ? 0.40 : 0.05;
        break;
      case 'static':
        motionScore = observed.totalDistance < 0.03 ? 0.25 : 0.05;
        break;
    }
    score += motionScore;

    // 3. Two-handed consistency check (Weight: 15%)
    if (sign.twoHanded) {
      score += observed.twoHandedPresent ? 0.15 : 0.0;
    } else {
      score += 0.15;
    }

    return Math.min(0.99, score);
  }
}
