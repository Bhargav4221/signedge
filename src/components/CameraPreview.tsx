import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { LandmarkDetector, defaultLandmarkDetector } from '../ai/landmarkDetector';
import { TemporalSignModel } from '../ai/temporalSignModel';
import { RecognitionResult, HandLandmarks, Point2D } from '../ai/types';
import { Camera, RefreshCw, Eye, EyeOff, AlertCircle, Sparkles, Sliders } from 'lucide-react';

interface CameraPreviewProps {
  onRecognized?: (result: RecognitionResult) => void;
  showSkeleton?: boolean;
  active?: boolean;
}

export const CameraPreview: React.FC<CameraPreviewProps> = ({
  onRecognized,
  showSkeleton = true,
  active = true
}) => {
  const { 
    deviceTier, 
    accessibility, 
    isSimulatedAiMode, 
    setSimulatedAiMode, 
    triggerAudioCue 
  } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [fps, setFps] = useState<number>(0);
  const [drawOverlay, setDrawOverlay] = useState<boolean>(showSkeleton);

  // Initialize modular AI models
  const detectorRef = useRef<LandmarkDetector>(defaultLandmarkDetector);
  const temporalModelRef = useRef<TemporalSignModel>(
    new TemporalSignModel(defaultLandmarkDetector, 22)
  );

  // Synchronize simulation mode
  useEffect(() => {
    detectorRef.current.setSimulatedMode(isSimulatedAiMode);
  }, [isSimulatedAiMode]);

  // Handle camera stream setup
  useEffect(() => {
    if (!active || !cameraActive || isSimulatedAiMode) {
      stopCameraStream();
      return;
    }

    let stream: MediaStream | null = null;

    async function startCamera() {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera access is not supported by this browser.');
        }

        const constraints: MediaStreamConstraints = {
          video: {
            facingMode,
            width: { ideal: deviceTier === 'high' ? 640 : 480 },
            height: { ideal: deviceTier === 'high' ? 480 : 360 },
          },
          audio: false,
        };

        stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err: any) {
        console.warn('[CameraPreview] Camera init failed:', err);
        setCameraError(err?.message || 'Could not access camera device. Check permissions.');
      }
    }

    startCamera();

    return () => {
      stopCameraStream();
    };
  }, [facingMode, cameraActive, active, isSimulatedAiMode, deviceTier]);

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Main visual processing & temporal inference loop
  useEffect(() => {
    if (!active) return;

    let frameCount = 0;
    let lastFpsCalc = performance.now();

    const renderLoop = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastFpsCalc >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastFpsCalc = now;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Extract landmarks from detector
      const frameLandmarks = detectorRef.current.processVideoFrame(video, canvas);

      // Render skeletal mesh overlay if canvas is present
      if (canvas && drawOverlay) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (frameLandmarks.rightHand) {
            drawHandSkeleton(ctx, frameLandmarks.rightHand, canvas.width, canvas.height, '#00e5ff');
          }
          if (frameLandmarks.leftHand) {
            drawHandSkeleton(ctx, frameLandmarks.leftHand, canvas.width, canvas.height, '#2688ff');
          }
          if (frameLandmarks.pose) {
            drawPosePoints(ctx, frameLandmarks.pose, canvas.width, canvas.height);
          }
        }
      }

      // Temporal sequence evaluation
      const recognition = temporalModelRef.current.pushFrame(frameLandmarks);
      if (recognition && onRecognized) {
        if (recognition.isStable) {
          triggerAudioCue('detect');
        }
        onRecognized(recognition);
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [active, drawOverlay, onRecognized, triggerAudioCue]);

  // Helper to draw 21-point hand joints and skeletal bone connections
  const drawHandSkeleton = (
    ctx: CanvasRenderingContext2D,
    hand: HandLandmarks,
    w: number,
    h: number,
    color: string
  ) => {
    // Joint connections for 5 fingers
    const fingerConnections = [
      [0, 1, 2, 3, 4],     // Thumb
      [0, 5, 6, 7, 8],     // Index
      [0, 9, 10, 11, 12],  // Middle
      [0, 13, 14, 15, 16], // Ring
      [0, 17, 18, 19, 20], // Pinky
      [5, 9, 13, 17]       // Palm bridge
    ];

    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    fingerConnections.forEach(chain => {
      ctx.beginPath();
      chain.forEach((idx, i) => {
        const pt = hand[idx];
        if (pt) {
          const x = pt.x * w;
          const y = pt.y * h;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    });

    // Draw individual joints
    hand.forEach((pt, idx) => {
      const x = pt.x * w;
      const y = pt.y * h;
      ctx.beginPath();
      const isTip = [4, 8, 12, 16, 20].includes(idx);
      ctx.arc(x, y, isTip ? 4.5 : 3, 0, 2 * Math.PI);
      ctx.fillStyle = isTip ? '#ffffff' : color;
      ctx.fill();
      ctx.strokeStyle = '#05070c';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  const drawPosePoints = (
    ctx: CanvasRenderingContext2D,
    pose: Point2D[],
    w: number,
    h: number
  ) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    pose.forEach(pt => {
      ctx.beginPath();
      ctx.arc(pt.x * w, pt.y * h, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const toggleCameraFacing = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-center">
      {/* Underlying Video Stream */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          cameraActive && !isSimulatedAiMode && !cameraError ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
        } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
      />

      {/* Real-time Landmark Skeleton Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${
          facingMode === 'user' ? 'scale-x-[-1]' : ''
        }`}
        width={640}
        height={480}
      />

      {/* Fallback / Interactive Test Mode Display */}
      {(isSimulatedAiMode || cameraError || !cameraActive) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/85 backdrop-blur-sm z-20">
          {cameraError && !isSimulatedAiMode ? (
            <div className="max-w-md space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">Camera Access Restricted</h3>
              <p className="text-xs text-slate-400">{cameraError}</p>
              <button
                onClick={() => setSimulatedAiMode(true)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors"
              >
                Switch to Interactive Test Mode
              </button>
            </div>
          ) : isSimulatedAiMode ? (
            <div className="space-y-3 max-w-sm">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-sm font-semibold text-cyan-300">
                Development Test Mode Active
              </h3>
              <p className="text-xs text-slate-400">
                Deterministic temporal gesture simulation active for testing and verification without physical camera hardware.
              </p>
              <button
                onClick={() => setSimulatedAiMode(false)}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                Return to Live Camera
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Camera paused</p>
          )}
        </div>
      )}

      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-auto">
        <div className="flex items-center gap-2">
          {/* Status Badge */}
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 shadow">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{isSimulatedAiMode ? 'Test Pipeline' : `${fps} FPS • ${deviceTier.toUpperCase()}`}</span>
          </span>

          {isSimulatedAiMode && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              SIMULATED
            </span>
          )}
        </div>

        {/* Camera Action Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow">
          {/* Switch Front/Rear Camera */}
          <button
            onClick={toggleCameraFacing}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Switch front/rear camera"
            aria-label="Switch front or rear camera"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Toggle Skeleton Mesh Overlay */}
          <button
            onClick={() => setDrawOverlay(!drawOverlay)}
            className={`p-1.5 rounded-lg transition-colors ${
              drawOverlay ? 'text-cyan-400 bg-cyan-950/60' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle landmark overlay"
            aria-label="Toggle landmark overlay"
          >
            {drawOverlay ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Camera On/Off */}
          <button
            onClick={() => setCameraActive(!cameraActive)}
            className={`p-1.5 rounded-lg transition-colors ${
              cameraActive ? 'text-emerald-400' : 'text-red-400'
            }`}
            title={cameraActive ? 'Turn camera off' : 'Turn camera on'}
            aria-label={cameraActive ? 'Turn camera off' : 'Turn camera on'}
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
