import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { defaultPrivacyManager, PermissionStatusSummary, StorageAudit } from '../storage/privacyManager';
import { 
  ShieldCheck, 
  Trash2, 
  Lock, 
  EyeOff, 
  Camera, 
  Mic, 
  Database, 
  FileCheck2, 
  AlertTriangle 
} from 'lucide-react';

export const PrivacyCenter: React.FC = () => {
  const { showToast } = useApp();
  const [permissions, setPermissions] = useState<PermissionStatusSummary>({ camera: 'unknown', microphone: 'unknown' });
  const [audit, setAudit] = useState<StorageAudit | null>(null);
  const [isPurging, setIsPurging] = useState<boolean>(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const perms = await defaultPrivacyManager.checkPermissions();
    setPermissions(perms);
    const storageAudit = await defaultPrivacyManager.getStorageAudit();
    setAudit(storageAudit);
  };

  const handlePurgeAll = async () => {
    if (window.confirm('Are you sure you want to permanently delete all local conversation history and cached settings? This action cannot be undone.')) {
      setIsPurging(true);
      await defaultPrivacyManager.purgeAllLocalData();
      await refreshData();
      setIsPurging(false);
      showToast('All local device data has been permanently wiped.', 'success');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Privacy Center</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Designed for local-first processing with no cloud transmission of core conversation data by default.
        </p>
      </div>

      {/* Core Privacy Guarantee Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Local-Only Data Boundary</h3>
            <p className="text-xs text-slate-300">
              Camera frames, audio buffers, and generated transcripts stay strictly on this device.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
            <span className="text-cyan-400 font-bold block">Video Stream</span>
            <p className="text-slate-400">Processed frame-by-frame in volatile RAM canvas. Never saved or transmitted.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
            <span className="text-cyan-400 font-bold block">Audio Stream</span>
            <p className="text-slate-400">Speech transcribed on-device. Audio buffers are discarded immediately after transcription.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
            <span className="text-cyan-400 font-bold block">Analytics / Tracking</span>
            <p className="text-slate-400">Zero analytics, zero telemetry SDKs, zero advertising IDs.</p>
          </div>
        </div>
      </div>

      {/* Device Permissions Status Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-cyan-400" />
          <span>Device Hardware Permissions</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-slate-400" />
              <div>
                <div className="text-sm font-semibold text-white">Camera Access</div>
                <div className="text-xs text-slate-500">Sign gesture recognition</div>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
              permissions.camera === 'granted' ? 'bg-emerald-500/15 text-emerald-300' :
              permissions.camera === 'denied' ? 'bg-rose-500/15 text-rose-300' :
              'bg-amber-500/15 text-amber-300'
            }`}>
              {permissions.camera}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic className="w-5 h-5 text-slate-400" />
              <div>
                <div className="text-sm font-semibold text-white">Microphone Access</div>
                <div className="text-xs text-slate-500">Spoken voice transcription</div>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
              permissions.microphone === 'granted' ? 'bg-emerald-500/15 text-emerald-300' :
              permissions.microphone === 'denied' ? 'bg-rose-500/15 text-rose-300' :
              'bg-amber-500/15 text-amber-300'
            }`}>
              {permissions.microphone}
            </span>
          </div>
        </div>
      </div>

      {/* Storage Audit & 1-Tap Wipe Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Local Device Storage Footprint</h3>
            <p className="text-xs text-slate-400">Total data stored inside your browser's private sandbox</p>
          </div>
          <span className="text-xs font-mono font-semibold text-cyan-400">
            {audit ? `${audit.totalConversations} Messages Stored` : 'Loading...'}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="text-sm font-semibold text-white">Private IndexedDB & Cache</div>
              <div className="text-xs text-slate-500">Storage footprint: {audit?.usageFormatted || '0 KB'}</div>
            </div>
          </div>

          <button
            onClick={handlePurgeAll}
            disabled={isPurging}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isPurging ? 'Purging...' : 'Purge All Local Data'}</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500">
          Purging will permanently delete all conversation transcripts, custom voice settings, and offline cache from this device.
        </p>
      </div>
    </div>
  );
};
