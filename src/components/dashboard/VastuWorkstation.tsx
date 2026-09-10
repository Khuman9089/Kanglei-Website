'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Printer,
  Copy,
  RotateCcw,
  Layers,
  Flame,
  Droplets,
  Wind,
  Mountain,
  Globe,
  DoorOpen,
  Home,
  Briefcase,
  Building,
  Info,
  ChevronRight,
  Maximize2,
  Award,
  Play,
  Pause,
  Smartphone,
  Sliders,
  Radio,
} from 'lucide-react';
import {
  VASTU_ZONES_16,
  PADA_GATES_32,
  VastuZone,
  RoomPlacementCheck,
  evaluateVastuFloorplan,
  getZoneByAngle,
} from '@/engine/vastuEngine';
import {
  calculateYumsharol,
  YUMSHAROL_DIRECTIONS,
  NAKSHATRAS_LIST,
} from '@/lib/astrology/yumsharol';

interface VastuWorkstationProps {
  initialBirthData?: {
    name?: string;
    dob?: string;
    tob?: string;
    pob?: string;
    sex?: string;
  };
  onClose?: () => void;
}

const DEFAULT_PLACEMENTS: RoomPlacementCheck[] = [
  { roomType: 'entrance', roomLabel: 'Main Entrance (Mahadwara)', zoneId: 'n' },
  { roomType: 'kitchen', roomLabel: 'Kitchen (Cooking Stove)', zoneId: 'se' },
  { roomType: 'master_bedroom', roomLabel: 'Master Bedroom (Head of House)', zoneId: 'sw' },
  { roomType: 'puja', roomLabel: 'Puja Room / Mandir', zoneId: 'ne' },
  { roomType: 'toilet', roomLabel: 'Main Toilet / Restroom', zoneId: 'ssw' },
  { roomType: 'water_tank', roomLabel: 'Underground Water Tank / Boring', zoneId: 'ne' },
  { roomType: 'living', roomLabel: 'Living Room / Family Lounge', zoneId: 'e' },
  { roomType: 'safe_vault', roomLabel: 'Cash Safe / Jewelry Locker', zoneId: 'n' },
  { roomType: 'study', roomLabel: 'Study Room / Library', zoneId: 'wsw' },
];

export default function VastuWorkstation({ initialBirthData, onClose }: VastuWorkstationProps) {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'compass' | 'floorplan' | 'entrance' | 'yumsharol' | 'commercial' | 'remedies'
  >('compass');

  // Client Details
  const [clientName, setClientName] = useState(initialBirthData?.name || 'Sanatomba Meitei');
  const [clientDob, setClientDob] = useState(initialBirthData?.dob || '2004-06-28');
  const [clientTob, setClientTob] = useState(initialBirthData?.tob || '06:00');
  const [clientNakshatra, setClientNakshatra] = useState<number>(14); // Default Chitra

  // Interactive Live Compass State
  const [compassDegree, setCompassDegree] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // Mobile Device Orientation / Real Compass Tracking
  const [isMobileTracking, setIsMobileTracking] = useState<boolean>(false);
  const [isTrackingPaused, setIsTrackingPaused] = useState<boolean>(false);
  const [sensorStatus, setSensorStatus] = useState<string>('idle'); // 'idle' | 'active' | 'denied' | 'unsupported'
  const [calibrationOffset, setCalibrationOffset] = useState<number>(0);
  const [showCalibrationControls, setShowCalibrationControls] = useState<boolean>(false);

  // Floorplan placements state
  const [placements, setPlacements] = useState<RoomPlacementCheck[]>(DEFAULT_PLACEMENTS);

  // Selected gate for 32 Pada analyzer
  const [selectedGateId, setSelectedGateId] = useState<string>('N3');

  // Notification state
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Active Zone calculated from degree dial
  const activeCompassZone = useMemo(() => {
    return getZoneByAngle(compassDegree);
  }, [compassDegree]);

  // Vastu Floorplan Audit Evaluation
  const auditResult = useMemo(() => {
    return evaluateVastuFloorplan(placements);
  }, [placements]);

  // Manipuri Yumsharol Calculation
  const yumsharolResult = useMemo(() => {
    try {
      if (!clientDob) return null;
      return calculateYumsharol({
        dob: clientDob,
        tob: clientTob,
        nakshatra: clientNakshatra,
        constantValue: 15,
      });
    } catch {
      return null;
    }
  }, [clientDob, clientTob, clientNakshatra]);

  // Handle Compass Drag/Click rotation
  const handleCompassDegreeChange = (newDeg: number) => {
    const norm = ((newDeg % 360) + 360) % 360;
    setCompassDegree(Math.round(norm));
  };

  // Device orientation handler callback
  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      if (isTrackingPaused) return;

      let heading: number | null = null;

      // iOS WebKit Compass Heading
      if ((event as any).webkitCompassHeading !== undefined && (event as any).webkitCompassHeading !== null) {
        heading = (event as any).webkitCompassHeading;
      } else if (event.alpha !== null && event.alpha !== undefined) {
        // Android standard: alpha starts from 0 to 360, compass heading is 360 - alpha
        if (event.absolute || (event as any).webkitCompassHeading === undefined) {
          heading = (360 - event.alpha) % 360;
        }
      }

      if (heading !== null) {
        const calibrated = (heading + calibrationOffset + 360) % 360;
        setCompassDegree(Math.round(calibrated));
        setSensorStatus('active');
      }
    },
    [isTrackingPaused, calibrationOffset]
  );

  // Request & Toggle Mobile Compass Sensor
  const toggleMobileSensor = async () => {
    if (isMobileTracking) {
      // Stop tracking
      window.removeEventListener('deviceorientation', handleDeviceOrientation as any, true);
      window.removeEventListener('deviceorientationabsolute' as any, handleDeviceOrientation as any, true);
      setIsMobileTracking(false);
      setIsTrackingPaused(false);
      setSensorStatus('idle');
      return;
    }

    // Check if DeviceOrientationEvent exists
    if (typeof window === 'undefined' || !window.DeviceOrientationEvent) {
      alert('Device orientation sensors are not supported on this browser/device.');
      setSensorStatus('unsupported');
      return;
    }

    try {
      // For iOS 13+ permission request
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          startSensorListeners();
        } else {
          setSensorStatus('denied');
          alert('Sensor permission was denied. Please allow motion & orientation access in your mobile browser settings.');
        }
      } else {
        // Non-iOS or older browsers
        startSensorListeners();
      }
    } catch (err) {
      console.error('Sensor permission error:', err);
      startSensorListeners();
    }
  };

  const startSensorListeners = () => {
    if (typeof window !== 'undefined') {
      if ('ondeviceorientationabsolute' in window) {
        (window as any).addEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
      } else {
        (window as any).addEventListener('deviceorientation', handleDeviceOrientation, true);
      }
      setIsMobileTracking(true);
      setIsTrackingPaused(false);
      setSensorStatus('active');
    }
  };

  // Clean up sensor listener on unmount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isMobileTracking) {
      if ('ondeviceorientationabsolute' in window) {
        (window as any).addEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
      } else {
        (window as any).addEventListener('deviceorientation', handleDeviceOrientation, true);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        (window as any).removeEventListener('deviceorientation', handleDeviceOrientation, true);
        (window as any).removeEventListener('deviceorientationabsolute', handleDeviceOrientation, true);
      }
    };
  }, [isMobileTracking, handleDeviceOrientation]);

  const handleTogglePause = () => {
    setIsTrackingPaused((prev) => !prev);
  };

  const handleRoomZoneChange = (index: number, newZoneId: string) => {
    const updated = [...placements];
    updated[index].zoneId = newZoneId;
    setPlacements(updated);
  };

  const handleCopySummary = () => {
    const text = `VASTU SHASTRA & YUMSHAROL AUDIT DOSSIER:
Client: ${clientName} | DOB: ${clientDob} (Nakshatra #${clientNakshatra})
• Vastu Harmony Score: ${auditResult.overallScore}% (${auditResult.grade})
• Active Compass Heading: ${compassDegree}° (${activeCompassZone.name} - ${activeCompassZone.sanskritName})
• Dominant Direction Element: ${activeCompassZone.element} (${activeCompassZone.rulingDevata})
• Manipuri Yumsharol Index: ${yumsharolResult?.traditionalIndex} (${yumsharolResult?.directionInfo.name})
• Sanamahi Kachin (South-West): ${auditResult.meiteiTraditions.sanamahiCorner}
• Detected Doshas: ${auditResult.doshas.length > 0 ? auditResult.doshas.join('; ') : 'No critical doshas detected.'}

Generated on KuthiYengpham / KangleiAstro Vastu Workstation`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const selectedGate = PADA_GATES_32.find((g) => g.id === selectedGateId) || PADA_GATES_32[2];

  return (
    <div className="w-full bg-[#f4f7f4] dark:bg-[#0b132b] text-slate-900 dark:text-[#faf8f4] font-sans p-3 sm:p-5 rounded-3xl border border-slate-300/80 dark:border-[#3a506b] shadow-2xl space-y-5 max-w-7xl mx-auto print:p-0 transition-colors">
      {/* Header Bar */}
      <div className="bg-white dark:bg-[#1c2541] border border-[#f3e8d2] dark:border-[#3a506b] rounded-3xl shadow-sm p-5 sm:p-6 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
        <div className="flex items-start gap-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-[#d97706] to-[#f59e0b] text-white shadow-md">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-xl text-[#0f172a] dark:text-[#faf8f4] flex items-center gap-2">
                Vastu Shastra &amp; Manipuri Yumsharol Workstation
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-[11px] font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#d97706]" /> 16 MahaVastu Zones • 32 Padas • Lainingthou Sanamahi Lore
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
              Client: <strong>{clientName}</strong> • Running Age: <strong>{yumsharolResult?.runningAge}th Year</strong> • Traditional Modulo 8 Index: <strong>{yumsharolResult?.traditionalIndex} ({yumsharolResult?.directionInfo.name})</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-[#d97706]" />
            <span>{copiedNotification ? 'Copied Dossier!' : 'Copy Summary'}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Audit</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-300 hover:bg-slate-200 text-xs font-bold cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none print:hidden">
        {[
          { id: 'compass', label: 'Live 360° Compass & Energy Dial', icon: Compass },
          { id: 'floorplan', label: '16-Zone Floorplan Audit', icon: Home },
          { id: 'entrance', label: '32-Pada Main Gate Analyzer', icon: DoorOpen },
          { id: 'yumsharol', label: 'Manipur Yumsharol & Sanamahi Lore', icon: Building },
          { id: 'commercial', label: 'Commercial & Office Vastu', icon: Briefcase },
          { id: 'remedies', label: 'Non-Structural Vedic Remedies', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] text-white shadow-md border border-[#fde68a]/40'
                  : 'bg-white dark:bg-[#1c2541] text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TAB: LIVE 360° COMPASS & ENERGY DIAL                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'compass' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Compass Visualization Column (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#1c2541] border border-[#f3e8d2] dark:border-[#3a506b] rounded-3xl p-6 shadow-sm flex flex-col items-center justify-between text-center space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 block">
                Magnetic Heading &amp; Orientation
              </span>
              <h4 className="font-serif font-bold text-2xl text-[#0f172a] dark:text-[#faf8f4]">
                {compassDegree}° {activeCompassZone.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                {activeCompassZone.sanskritName} • {activeCompassZone.manipuriName}
              </p>
            </div>

            {/* Interactive Rotating Compass SVG Dial */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2 flex items-center justify-center">
              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 dark:border-amber-400/10 animate-pulse" />

              {/* Compass Dial SVG */}
              <svg
                viewBox="0 0 300 300"
                className="w-full h-full transform transition-transform duration-300 ease-out drop-shadow-xl select-none"
                style={{ transform: `rotate(${-compassDegree}deg)` }}
              >
                {/* Outer Rim */}
                <circle cx="150" cy="150" r="140" fill="#0b132b" stroke="#d97706" strokeWidth="4" />
                <circle cx="150" cy="150" r="132" fill="none" stroke="#3a506b" strokeWidth="1" strokeDasharray="4 2" />

                {/* 16 Zone Wedge Dividers & Labels */}
                {VASTU_ZONES_16.map((z, zi) => {
                  const midAngle = (z.angleRange[0] + (z.angleRange[0] > z.angleRange[1] ? z.angleRange[1] + 360 : z.angleRange[1])) / 2;
                  const rad = (midAngle - 90) * (Math.PI / 180);
                  const x = 150 + 115 * Math.cos(rad);
                  const y = 150 + 115 * Math.sin(rad);

                  return (
                    <g key={z.id}>
                      <line
                        x1="150"
                        y1="150"
                        x2={150 + 138 * Math.cos((z.angleRange[0] - 90) * (Math.PI / 180))}
                        y2={150 + 138 * Math.sin((z.angleRange[0] - 90) * (Math.PI / 180))}
                        stroke="#3a506b"
                        strokeWidth="0.8"
                      />
                      <text
                        x={x}
                        y={y + 3}
                        fill={z.id === 'n' ? '#ef4444' : '#fbbf24'}
                        fontSize="9"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="select-none font-mono"
                      >
                        {z.id.toUpperCase()}
                      </text>
                    </g>
                  );
                })}

                {/* Cardinal Points */}
                <text x="150" y="32" fill="#ef4444" fontSize="16" fontWeight="black" textAnchor="middle">N</text>
                <text x="270" y="155" fill="#fbbf24" fontSize="14" fontWeight="black" textAnchor="middle">E</text>
                <text x="150" y="280" fill="#fbbf24" fontSize="14" fontWeight="black" textAnchor="middle">S</text>
                <text x="30" y="155" fill="#fbbf24" fontSize="14" fontWeight="black" textAnchor="middle">W</text>

                {/* Center Core */}
                <circle cx="150" cy="150" r="28" fill="#1c2541" stroke="#d97706" strokeWidth="2" />
                <circle cx="150" cy="150" r="6" fill="#ef4444" />
              </svg>

              {/* Fixed Center Needle Pointer */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[40px] border-b-rose-500 drop-shadow-md" />
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[40px] border-t-slate-300 drop-shadow-md" />
              </div>
            </div>

            {/* Mobile Sensor Controls & Calibration Bar */}
            <div className="w-full bg-slate-50 dark:bg-[#0b132b] p-3.5 rounded-2xl border border-slate-200 dark:border-[#3a506b] space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#d97706]" />
                  <span className="text-xs font-bold text-slate-800 dark:text-gray-200">
                    Mobile Compass Sensor:
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isMobileTracking
                        ? isTrackingPaused
                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                          : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-gray-400'
                    }`}
                  >
                    <Radio className="w-2.5 h-2.5" />
                    {isMobileTracking ? (isTrackingPaused ? 'PAUSED (Frozen)' : 'LIVE TRACKING') : 'OFF (Manual Dial)'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Calibrate toggle */}
                  <button
                    type="button"
                    onClick={() => setShowCalibrationControls((prev) => !prev)}
                    className="p-1.5 rounded-xl bg-white dark:bg-[#1c2541] border border-slate-200 dark:border-[#3a506b] text-slate-700 dark:text-gray-200 hover:text-[#d97706] text-xs font-bold transition-colors cursor-pointer"
                    title="Calibrate Compass Angle Offset"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>

                  {/* Pause / Resume button */}
                  {isMobileTracking && (
                    <button
                      type="button"
                      onClick={handleTogglePause}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        isTrackingPaused
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                          : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                      }`}
                    >
                      {isTrackingPaused ? (
                        <>
                          <Play className="w-3 h-3" />
                          <span>Resume Live</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3 h-3" />
                          <span>Pause &amp; Lock Angle</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Toggle Mobile Sensor Button */}
                  <button
                    type="button"
                    onClick={toggleMobileSensor}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isMobileTracking
                        ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700 hover:bg-rose-100'
                        : 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-sm hover:from-[#b45309]'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{isMobileTracking ? 'Disconnect Sensor' : 'Calibrate with Mobile'}</span>
                  </button>
                </div>
              </div>

              {/* Calibration Slider Drawer */}
              {showCalibrationControls && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1 text-left">
                  <div className="flex justify-between text-[11px] font-mono text-slate-600 dark:text-gray-300">
                    <span>Calibration Offset (Magnetic Declination / Bias)</span>
                    <strong className="text-[#d97706]">{calibrationOffset > 0 ? `+${calibrationOffset}°` : `${calibrationOffset}°`}</strong>
                  </div>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={calibrationOffset}
                    onChange={(e) => setCalibrationOffset(Number(e.target.value))}
                    className="w-full accent-[#d97706] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                    <span>-45° (West Bias)</span>
                    <button
                      type="button"
                      onClick={() => setCalibrationOffset(0)}
                      className="text-[#d97706] font-bold hover:underline"
                    >
                      Reset to 0°
                    </button>
                    <span>+45° (East Bias)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Slider & Quick Snap Buttons */}
            <div className="w-full space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono font-bold text-slate-600 dark:text-gray-300 mb-1">
                  <span>0° (North)</span>
                  <span className="text-[#d97706] text-sm">{compassDegree}°</span>
                  <span>359°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="359"
                  value={compassDegree}
                  onChange={(e) => handleCompassDegreeChange(Number(e.target.value))}
                  disabled={isMobileTracking && !isTrackingPaused}
                  className={`w-full accent-[#d97706] ${isMobileTracking && !isTrackingPaused ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                />
              </div>

              {/* Quick Direction Snaps */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 text-[11px] font-bold">
                {[
                  { label: 'N (0°)', deg: 0 },
                  { label: 'NE (45°)', deg: 45 },
                  { label: 'E (90°)', deg: 90 },
                  { label: 'SE (135°)', deg: 135 },
                  { label: 'S (180°)', deg: 180 },
                  { label: 'SW (225°)', deg: 225 },
                  { label: 'W (270°)', deg: 270 },
                  { label: 'NW (315°)', deg: 315 },
                ].map((snap) => (
                  <button
                    key={snap.label}
                    type="button"
                    onClick={() => handleCompassDegreeChange(snap.deg)}
                    disabled={isMobileTracking && !isTrackingPaused}
                    className={`py-1 rounded-lg border transition-colors ${
                      Math.abs(compassDegree - snap.deg) < 12
                        ? 'bg-amber-500 text-white border-amber-600 font-extrabold'
                        : 'bg-slate-100 dark:bg-[#0b132b] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-[#3a506b]'
                    } ${isMobileTracking && !isTrackingPaused ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {snap.label.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Direction Energy Properties Column (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1c2541] border border-[#f3e8d2] dark:border-[#3a506b] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-[#3a506b] pb-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase text-[#b45309] dark:text-amber-400 block">
                  Directional Energy Breakdown
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#0f172a] dark:text-[#faf8f4]">
                  {activeCompassZone.name} — {activeCompassZone.sanskritName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${activeCompassZone.elementColor}`}>
                  {activeCompassZone.element} Element
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-500/30">
                  {activeCompassZone.rulingPlanet}
                </span>
              </div>
            </div>

            {/* Core Energy Attributes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2">
                <span className="font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider text-[10px] block">
                  Presiding Devata &amp; Cosmic Force
                </span>
                <p className="font-serif font-bold text-base text-[#d97706] dark:text-amber-400">
                  {activeCompassZone.rulingDevata}
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-[#3a506b] space-y-1">
                  <span className="font-bold text-slate-700 dark:text-gray-200 block">Core Life Influences:</span>
                  {activeCompassZone.coreAttributes.map((attr, ai) => (
                    <p key={ai} className="text-slate-600 dark:text-gray-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{attr}</span>
                    </p>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-3">
                <div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-1 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Highly Recommended Rooms:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCompassZone.idealRooms.map((room, ri) => (
                      <span key={ri} className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 font-bold text-[11px]">
                        {room}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-[#3a506b]">
                  <span className="font-bold text-rose-700 dark:text-rose-400 text-xs flex items-center gap-1 mb-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Prohibited (Major Dosha):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeCompassZone.forbiddenRooms.map((fRoom, fi) => (
                      <span key={fi} className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 font-bold text-[11px]">
                        {fRoom}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Manipur Lore & Remedial Colors Banner */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#b45309] dark:text-amber-300">
                <Sparkles className="w-4 h-4 text-[#d97706]" />
                <span>Manipur Meitei Yumsharol Traditional Significance</span>
              </div>
              <p className="text-slate-700 dark:text-gray-200 leading-relaxed font-medium">
                {activeCompassZone.meiteiTraditionNote}
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-600 dark:text-gray-300">
                <span className="font-bold">Auspicious Colors &amp; Tattva Fix:</span>
                <span className="font-mono font-bold text-[#d97706] dark:text-amber-400">
                  {activeCompassZone.remedyColor}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. TAB: 16-ZONE FLOORPLAN AUDIT                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'floorplan' && (
        <div className="space-y-5">
          {/* Audit Score Banner */}
          <div className="bg-white dark:bg-[#1c2541] border border-[#f3e8d2] dark:border-[#3a506b] rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase text-[#b45309] dark:text-amber-400 block">
                Vastu Harmony Evaluation Score
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className={`font-serif font-bold text-5xl ${
                  auditResult.overallScore >= 80 ? 'text-emerald-500' :
                  auditResult.overallScore >= 65 ? 'text-[#d97706]' : 'text-rose-500'
                }`}>
                  {auditResult.overallScore}%
                </span>
                <div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-extrabold text-xs border border-amber-500/30 block w-fit">
                    {auditResult.grade}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                    {auditResult.checks.filter(c => c.status === 'Auspicious').length} Auspicious • {auditResult.checks.filter(c => c.status === 'Defect (Dosha)').length} Defects Detected
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Reset to Defaults */}
            <button
              type="button"
              onClick={() => setPlacements(DEFAULT_PLACEMENTS)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-gray-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer w-fit"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Standard Layout</span>
            </button>
          </div>

          {/* Interactive Room Position Chooser Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {placements.map((p, idx) => {
              const check = auditResult.checks[idx];
              return (
                <div
                  key={p.roomType}
                  className="bg-white dark:bg-[#1c2541] border border-[#f3e8d2] dark:border-[#3a506b] rounded-2xl p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {p.roomLabel}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      check?.status === 'Auspicious' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' :
                      check?.status === 'Neutral' ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300' :
                      'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300'
                    }`}>
                      {check?.status}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-500 dark:text-gray-400 mb-1">
                      Allocated Vastu Zone / Direction:
                    </label>
                    <select
                      value={p.zoneId}
                      onChange={(e) => handleRoomZoneChange(idx, e.target.value)}
                      className="w-full h-9 px-3 rounded-xl border border-slate-300 dark:border-[#3a506b] bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-white font-bold text-xs focus:border-[#d97706] focus:outline-none"
                    >
                      {VASTU_ZONES_16.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} ({z.sanskritName.split('/')[0].trim()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-snug">
                    {check?.impact}
                  </p>

                  {check?.remedy && (
                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-[10px] text-amber-900 dark:text-amber-200 space-y-0.5">
                      <span className="font-bold block">✨ Remedial Action:</span>
                      <p>{check.remedy}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. TAB: 32-PADA MAIN GATE ANALYZER                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'entrance' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-[#1c2541] border border-[#f3e8d2] dark:border-[#3a506b] rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h4 className="font-serif font-bold text-xl text-[#0f172a] dark:text-[#faf8f4] flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-[#d97706]" />
                <span>32-Pada Main Entrance (Mahadwara) Matrix</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-gray-300">
                In Classical Vastu Shastra, the perimeter is divided into 32 energy gates (8 in each direction). Only 4–6 specific gates bestow immense wealth and prosperity.
              </p>
            </div>

            {/* Gate Selection Buttons by Quadrant */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {(['North', 'East', 'South', 'West'] as const).map((dir) => {
                const gates = PADA_GATES_32.filter((g) => g.direction === dir);
                return (
                  <div key={dir} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2">
                    <span className="font-serif font-bold text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                      {dir} Quadrant Gates
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {gates.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setSelectedGateId(g.id)}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            selectedGateId === g.id
                              ? 'bg-[#d97706] text-white border-amber-400 font-extrabold shadow-sm'
                              : g.quality.includes('Auspicious')
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 font-bold'
                              : 'bg-white dark:bg-[#1c2541] text-slate-700 dark:text-gray-300 border-slate-200 dark:border-[#3a506b]'
                          }`}
                        >
                          <span className="text-[10px] block opacity-80">{g.id}</span>
                          <span className="text-xs block truncate font-bold">{g.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Gate In-Depth Breakdown */}
            {selectedGate && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-[#0b132b] dark:to-[#1c2541] border border-amber-300 dark:border-amber-600/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#d97706] text-white font-mono font-bold text-xs">
                      {selectedGate.id} Gate
                    </span>
                    <h5 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                      {selectedGate.name} Pada ({selectedGate.direction})
                    </h5>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    selectedGate.quality.includes('Auspicious') ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                  }`}>
                    {selectedGate.quality}
                  </span>
                </div>

                <p className="text-xs text-slate-800 dark:text-gray-200 leading-relaxed font-medium">
                  <strong>Impact on Inhabitants:</strong> {selectedGate.impact}
                </p>

                <div className="p-3 rounded-xl bg-white/80 dark:bg-[#0b132b]/80 border border-amber-300/60 dark:border-[#3a506b] text-xs text-slate-700 dark:text-gray-300 space-y-1">
                  <span className="font-bold text-[#b45309] dark:text-amber-400">Classical Remedial Guidance:</span>
                  <p>
                    {selectedGate.quality.includes('Auspicious')
                      ? '✨ Highly auspicious gate. Keep entrance well lit, clean, and place a brass Swastika or mango leaves Toran on festive days.'
                      : '⚠️ If living in this entrance, install a lead or copper wire threshold strip along the door frame and fix a 3-inch Brass Pyramid above the lintel to block negative energy.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. TAB: MANIPUR YUMSHAROL & SANAMAHI LORE                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'yumsharol' && (
        <div className="space-y-5">
          {/* Client Details Form for Yumsharol */}
          <div className="bg-white dark:bg-[#1c2541] border border-[#f3e8d2] dark:border-[#3a506b] rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="font-serif font-bold text-lg text-[#0f172a] dark:text-[#faf8f4] flex items-center gap-2">
              <Building className="w-5 h-5 text-[#d97706]" />
              <span>Meitei Yumsharol Birth &amp; Directional Modulo 8 Calculation</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1.5">
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-[#3a506b] bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-white font-bold text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1.5">
                  Date of Birth (DOB)
                </label>
                <input
                  type="date"
                  value={clientDob}
                  onChange={(e) => setClientDob(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-[#3a506b] bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-white font-bold text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1.5">
                  Time of Birth (TOB)
                </label>
                <input
                  type="time"
                  value={clientTob}
                  onChange={(e) => setClientTob(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-[#3a506b] bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-white font-bold text-xs focus:border-[#d97706] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 dark:text-gray-300 mb-1.5">
                  Birth Nakshatra (1–27)
                </label>
                <select
                  value={clientNakshatra}
                  onChange={(e) => setClientNakshatra(Number(e.target.value))}
                  className="w-full h-11 px-3 rounded-xl border border-slate-300 dark:border-[#3a506b] bg-slate-50 dark:bg-[#0b132b] text-slate-900 dark:text-white font-bold text-xs focus:border-[#d97706] focus:outline-none"
                >
                  {NAKSHATRAS_LIST.map((nak) => (
                    <option key={nak.index} value={nak.index}>
                      #{nak.index} {nak.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Yumsharol Result Display */}
            {yumsharolResult && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1c2541] via-[#0b132b] to-[#0f172a] text-white border border-[#3a506b] shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3a506b] pb-4">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                      Yumsharol Modulo 8 Index
                    </span>
                    <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#fbbf24]">
                      Index {yumsharolResult.traditionalIndex}: {yumsharolResult.directionInfo.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-300 block">Traditional Direction:</span>
                    <strong className="text-emerald-400 font-mono text-lg block">
                      {yumsharolResult.directionInfo.direction} ({yumsharolResult.directionInfo.directionManipuri})
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-gray-400 block">1. Running Age:</span>
                    <strong className="text-[#fbbf24] text-base font-mono block mt-1">{yumsharolResult.runningAge}th Year</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-gray-400 block">2. Nakshatra:</span>
                    <strong className="text-white text-base font-mono block mt-1">#{yumsharolResult.nakshatra} {yumsharolResult.nakshatraName.split(' ')[0]}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-gray-400 block">3. Constant Tithi:</span>
                    <strong className="text-emerald-400 text-base font-mono block mt-1">+15 Tithis</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-gray-400 block">4. Total Sum Mod 8:</span>
                    <strong className="text-cyan-400 text-base font-mono block mt-1">Sum {yumsharolResult.sum} (Mod {yumsharolResult.standardMod})</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                  <span className="font-bold text-[#fbbf24] block">Traditional Puya Lore Prediction:</span>
                  <p className="text-gray-200 leading-relaxed font-mono">
                    {yumsharolResult.remainderPrediction}
                  </p>
                  <p className="text-amber-200/90 text-[11px] pt-1 border-t border-amber-500/20">
                    {yumsharolResult.directionInfo.significance}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sacred Meitei Household Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white dark:bg-[#1c2541] border border-[#f3e8d2] dark:border-[#3a506b] rounded-3xl p-6 shadow-sm space-y-3">
              <h5 className="font-serif font-bold text-base text-[#0f172a] dark:text-[#faf8f4] flex items-center gap-2">
                <Mountain className="w-5 h-5 text-[#d97706]" />
                <span>1. Sanamahi Kachin (South-West Corner)</span>
              </h5>
              <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                In Meitei architectural tradition, the South-West corner of every home is the sacred abode of <strong>Lainingthou Sanamahi</strong>. This corner must be kept elevated, impeccably clean, and free of toilets or drains to ensure family health, lineage protection, and spiritual peace.
              </p>
            </div>

            <div className="bg-white dark:bg-[#1c2541] border border-[#f3e8d2] dark:border-[#3a506b] rounded-3xl p-6 shadow-sm space-y-3">
              <h5 className="font-serif font-bold text-base text-[#0f172a] dark:text-[#faf8f4] flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span>2. Phunga Lairu (South-East Sacred Hearth)</span>
              </h5>
              <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                The traditional hearth where household food is prepared. Harmonized with the Agni (Fire) Tattva, cooking facing East invokes culinary vitality and preserves domestic wealth.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. TAB: COMMERCIAL & OFFICE VASTU                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'commercial' && (
        <div className="bg-white dark:bg-[#1c2541] border border-[#f3e8d2] dark:border-[#3a506b] rounded-3xl p-6 shadow-sm space-y-5">
          <div>
            <h4 className="font-serif font-bold text-xl text-[#0f172a] dark:text-[#faf8f4] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#d97706]" />
              <span>Commercial, Office &amp; Factory Vastu Guidelines</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-gray-300">
              Strategic spatial allocation to accelerate business cash flow, leadership authority, and seamless client transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2">
              <span className="font-bold text-[#b45309] dark:text-amber-400 block text-sm">
                🏢 Managing Director / CEO Cabin
              </span>
              <p className="text-slate-600 dark:text-gray-300">
                <strong>South-West (SW):</strong> Ensures commanding authority, long-term business stability, and decisive leadership. Sit facing North or East.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2">
              <span className="font-bold text-[#b45309] dark:text-amber-400 block text-sm">
                💰 Cash Counter &amp; Accounts Dept
              </span>
              <p className="text-slate-600 dark:text-gray-300">
                <strong>North (N) or North-North-East:</strong> Governed by Lord Kubera. Cash drawer opening towards North brings continuous liquidity.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2">
              <span className="font-bold text-[#b45309] dark:text-amber-400 block text-sm">
                🤝 Marketing &amp; Sales Team
              </span>
              <p className="text-slate-600 dark:text-gray-300">
                <strong>East (E) or North-West (NW):</strong> Fosters vibrant communication, new networking leads, and fast conversion of inquiries.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2">
              <span className="font-bold text-[#b45309] dark:text-amber-400 block text-sm">
                ⚙️ Heavy Machinery &amp; Generators
              </span>
              <p className="text-slate-600 dark:text-gray-300">
                <strong>South-East (SE) or South (S):</strong> Aligned with Agni and Mars forces for uninterrupted mechanical efficiency and fire safety.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2">
              <span className="font-bold text-[#b45309] dark:text-amber-400 block text-sm">
                📦 Finished Goods &amp; Dispatch
              </span>
              <p className="text-slate-600 dark:text-gray-300">
                <strong>North-West (NW):</strong> Governed by Vayu (Air). Ensures rapid turnover of inventory and quick freight clearances.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2">
              <span className="font-bold text-[#b45309] dark:text-amber-400 block text-sm">
                🏛️ Reception &amp; Visitor Waiting
              </span>
              <p className="text-slate-600 dark:text-gray-300">
                <strong>North-East (NE) or East:</strong> Creates an inviting, positive first impression and sets a warm tone for business negotiations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. TAB: NON-STRUCTURAL VEDIC REMEDIES                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'remedies' && (
        <div className="bg-white dark:bg-[#1c2541] border border-[#f3e8d2] dark:border-[#3a506b] rounded-3xl p-6 shadow-sm space-y-5">
          <div>
            <h4 className="font-serif font-bold text-xl text-[#0f172a] dark:text-[#faf8f4] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Vedic &amp; Pancha Tattva Non-Demolition Remedies</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-gray-300">
              Rectify Vastu flaws without tearing down walls using elemental color therapy, pyramids, sacred geometry, and directional balancing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2">
              <span className="font-bold text-amber-700 dark:text-amber-400 text-sm block">
                🔺 1. Brass &amp; Lead Energy Pyramids
              </span>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                Place 9-pyramid clusters in corners suffering from missing extensions or cut angles to energetically complete the Vastu grid.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2">
              <span className="font-bold text-amber-700 dark:text-amber-400 text-sm block">
                🧂 2. Marine Vastu Salt Bowls
              </span>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                Neutralize toilet or damp energy by placing raw sea salt in a bronze bowl in the defect corner. Replace every 15 days.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2">
              <span className="font-bold text-amber-700 dark:text-amber-400 text-sm block">
                🌿 3. Sacred Botanical Balancers
              </span>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                Place a holy Tulsi (Basil) in North-East for mental clarity and Bamboo in East for rapid family prosperity and health.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0b132b] border border-slate-200 dark:border-[#3a506b] space-y-2">
              <span className="font-bold text-amber-700 dark:text-amber-400 text-sm block">
                🪙 4. Metallic Perimeter Strips
              </span>
              <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                Cut off toxic drainage energy by installing Copper (South-East), Brass (South-West), or Zinc (North-East) boundary floor strips.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
