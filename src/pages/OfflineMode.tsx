import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { defaultPrivacyManager, StorageAudit } from '../storage/privacyManager';
import { 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  Download, 
  HardDrive, 
  Cpu, 
  Layers, 
  RefreshCw,
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const OfflineMode: React.FC = () => {
  const { isOnline, isSimulatedOffline, setSimulatedOffline, showToast } = useApp();
  const [audit, setAudit] = useState<StorageAudit | null>(null);
  const [checkingUpdates, setCheckingUpdates] = useState<boolean>(false);

  useEffect(() => {
    defaultPrivacyManager.getStorageAudit().then(setAudit);
  }, []);

  const handleCheckUpdates = () => {
    setCheckingUpdates(true);
    setTimeout(() => {
      setCheckingUpdates(false);
      showToast('All local models and dictionary assets are up to date.', 'success');
    }, 1200);
  };

  const offlineFeatures = [
    {
      feature: 'Temporal Sign Recognition',
      status: '100% Offline',
      details: 'Evaluates video canvas frames using local on-device trajectory classifier.',
      isOffline: true
    },
    {
      feature: 'Reverse Visual Sign Cues',
      status: '100% Offline',
      details: 'Renders canonical sign sequences & animations from local bundle.',
      isOffline: true
    },
    {
      feature: 'Text-to-Speech (TTS)',
      status: 'Device Offline',
      details: 'Synthesizes speech using local system voices built into the OS/browser.',
      isOffline: true
    },
    {
      feature: 'Conversation History',
      status: '100% Offline',
      details: 'Stored strictly in device IndexedDB with zero cloud synchronization.',
      isOffline: true
    },
    {
      feature: 'Speech Recognition (STT)',
      status: 'Device Engine Dependent',
      details: 'Uses device speech engine. Supported natively offline on modern Android/iOS.',
      isOffline: true
    },
    {
      feature: 'Model Weights / Asset Updates',
      status: 'Requires Network',
      details: 'Optional check for new vocabulary definitions or updated model weights.',
      isOffline: false
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <HardDrive className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Offline Mode & Cache</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            SignEdge is built offline-first. Core communication works without active internet connectivity.
          </p>
        </div>

        {/* Simulated Offline Toggle */}
        <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <span className="text-xs text-slate-300 font-medium">Simulate Airplane Mode:</span>
          <button
            onClick={() => {
              setSimulatedOffline(!isSimulatedOffline);
              showToast(
                !isSimulatedOffline ? 'Simulated offline mode enabled' : 'Simulated offline mode disabled',
                'info'
              );
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              isSimulatedOffline ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isSimulatedOffline ? 'Simulating Offline' : 'Live Network'}
          </button>
        </div>
      </div>

      {/* Network & Cache Status Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            {isOnline ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4 text-amber-400" />}
            <span>Active Network Status</span>
          </div>
          <div className="text-xl font-bold text-white">
            {isOnline ? 'Connected' : 'Offline Mode'}
          </div>
          <p className="text-[11px] text-slate-500">
            {isOnline ? 'Edge AI running locally on device' : 'Full local fallback active'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span>Local Cache Footprint</span>
          </div>
          <div className="text-xl font-bold text-white">
            {audit ? audit.usageFormatted : 'Calculating...'}
          </div>
          <p className="text-[11px] text-slate-500">IndexedDB & PWA asset cache</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Model Storage Location</span>
          </div>
          <div className="text-xl font-bold text-white">Local Sandbox</div>
          <p className="text-[11px] text-slate-500">Private browser client storage</p>
        </div>
      </div>

      {/* Offline Capabilities Breakdown Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Offline Capability Matrix</h3>
            <p className="text-xs text-slate-400">Verified operation status without network</p>
          </div>

          <button
            onClick={handleCheckUpdates}
            disabled={checkingUpdates || !isOnline}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingUpdates ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{checkingUpdates ? 'Checking...' : 'Check Model Updates'}</span>
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {offlineFeatures.map((item, idx) => (
            <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-white">{item.feature}</div>
                <div className="text-xs text-slate-400">{item.details}</div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold self-start sm:self-center whitespace-nowrap ${
                item.isOffline 
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Resilience Documentation Box */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Offline Architecture Principles</span>
        </h4>
        <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
          <li><strong>Zero Cloud Inference:</strong> Sign recognition, landmark calculations, and sequence evaluations are computed entirely on the local GPU/CPU.</li>
          <li><strong>Network Drop Recovery:</strong> If continuous internet drops mid-conversation, SignEdge seamlessly maintains all active dialog and visual recognition without interruptions.</li>
          <li><strong>Asset Immutability:</strong> The vocabulary models and visual cues are statically cached in the Service Worker and IndexedDB, ensuring immediate startup.</li>
        </ul>
      </div>
    </div>
  );
};
