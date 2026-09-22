/**
 * SignEdge Core AI & Pipeline Types
 */

export interface Point2D {
  x: number; // Normalized 0-1
  y: number; // Normalized 0-1
  z?: number; // Relative depth
  visibility?: number;
}

export type HandLandmarks = Point2D[]; // 21 keypoints
export type PoseLandmarks = Point2D[]; // Upper body landmarks

export interface FrameLandmarks {
  timestamp: number;
  leftHand: HandLandmarks | null;
  rightHand: HandLandmarks | null;
  pose: PoseLandmarks | null;
  handDetected: boolean;
}

export interface FeatureVector {
  fingerExtensions: number[]; // 5 values (0: folded, 1: extended)
  jointAngles: number[]; // Inter-knuckle angles
  palmVelocity: { dx: number; dy: number };
  palmScale: number;
  distanceToShoulder?: number;
}

export interface TemporalFrame {
  timestamp: number;
  landmarks: FrameLandmarks;
  features: {
    primaryHand?: FeatureVector;
    secondaryHand?: FeatureVector;
    twoHandedDistance?: number;
  };
}

export type SignCategory = 
  | 'greetings' 
  | 'emergency' 
  | 'healthcare' 
  | 'daily' 
  | 'questions' 
  | 'courtesies';

export interface VisualCueKeyframe {
  step: number;
  instruction: string;
  handShape: string;
  arrowDirection?: 'up' | 'down' | 'left' | 'right' | 'forward' | 'circular' | 'wave' | 'contact' | 'chest' | 'chin';
  handPositionLabel: string;
}

export interface SignDefinition {
  id: string;
  name: string;
  gloss: string;
  category: SignCategory;
  description: string;
  naturalPhrase: string;
  twoHanded: boolean;
  confidenceThreshold: number; // 0.0 - 1.0
  difficulty: 'basic' | 'intermediate';
  motionSteps: string[];
  visualCues: VisualCueKeyframe[];
  // Pattern matching criteria for temporal model
  featurePattern: {
    fingerSignature: number[]; // [thumb, index, middle, ring, pinky]
    motionType: 'static' | 'linear' | 'oscillating' | 'contact' | 'two-handed-open';
    targetDirection?: 'up' | 'down' | 'chest' | 'forward' | 'chin';
  };
}

export interface RecognitionResult {
  signId: string;
  gloss: string;
  naturalText: string;
  category: SignCategory;
  confidence: number; // 0 to 1
  isStable: boolean;
  timestamp: number;
  durationMs: number;
}

export type DeviceTier = 'low' | 'medium' | 'high';

export interface PerformanceProfile {
  tier: DeviceTier;
  recommendedFps: number;
  resolution: { width: number; height: number };
  temporalWindowSize: number;
  skipFrames: number;
  hardwareAcceleration: boolean;
}

export interface ConversationTurn {
  id: string;
  sender: 'signer' | 'speaker';
  text: string;
  gloss?: string;
  confidence?: number;
  timestamp: number;
  category?: SignCategory;
}

export interface VisualSignSequence {
  spokenPhrase: string;
  mappedSigns: SignDefinition[];
  unmappedWords: string[];
  timingIntervalMs: number;
}
