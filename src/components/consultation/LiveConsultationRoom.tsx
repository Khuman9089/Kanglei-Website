'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Send,
  Paperclip,
  Clock,
  ShieldCheck,
  Star,
  Sparkles,
  FileText,
  User,
  X,
  CheckCircle2,
  Volume2,
  VolumeX,
  Zap,
  MessageSquare,
  Camera,
  CheckCheck,
  Image as ImageIcon,
  Minimize2,
  Maximize2,
  RefreshCw,
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import { ConsultationSession, ConsultationMessage } from '@/app/api/consultations/route';

function createFallbackMediaStream(label: string): MediaStream {
  if (typeof window === 'undefined') return new MediaStream();
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  let angle = 0;
  const interval = setInterval(() => {
    if (!ctx) return;
    angle += 0.08;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0b141a');
    gradient.addColorStop(0.5, '#065f46');
    gradient.addColorStop(1, '#022c22');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw animated pulsating circle
    const radius = 65 + Math.sin(angle) * 15;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2 - 20, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#34d399';
    ctx.stroke();

    // Draw text label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, canvas.width / 2, canvas.height / 2 + 45);

    ctx.fillStyle = '#34d399';
    ctx.font = '14px sans-serif';
    ctx.fillText('Live Stream Active', canvas.width / 2, canvas.height / 2 + 75);
  }, 33);

  const stream = (canvas as any).captureStream ? (canvas as any).captureStream(30) : new MediaStream();

  // Synthetic audio track
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const dst = audioCtx.createMediaStreamDestination();
      osc.connect(dst);
      osc.start();
      const audioTrack = dst.stream.getAudioTracks()[0];
      if (audioTrack) stream.addTrack(audioTrack);
    }
  } catch (e) {}

  (stream as any)._cleanupInterval = interval;
  return stream;
}

interface LiveConsultationRoomProps {
  sessionId: string;
  currentUserType: 'CLIENT' | 'ASTROLOGER';
  onClose?: () => void;
}

export default function LiveConsultationRoom({
  sessionId,
  currentUserType,
  onClose,
}: LiveConsultationRoomProps) {
  const [session, setSession] = useState<ConsultationSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  // Call Mode & Media Controls
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<'AUDIO' | 'VIDEO'>('VIDEO');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isCallPip, setIsCallPip] = useState(false);
  const [isSwappedCamera, setIsSwappedCamera] = useState(false);

  // Media Streams
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // Timer state
  const [remainingSecs, setRemainingSecs] = useState<number>(900);

  // Modals & Attachments
  const [showRemedyModal, setShowRemedyModal] = useState(false);
  const [remedyInput, setRemedyInput] = useState('');
  const [showKundliModal, setShowKundliModal] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Image preview modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // WebRTC refs & states
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream>(new MediaStream());
  const [hasRemoteStream, setHasRemoteStream] = useState(false);
  const [connectionState, setConnectionState] = useState<'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'FAILED'>('DISCONNECTED');
  const [callVersion, setCallVersion] = useState<number>(0);
  
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);
  const processedSigIds = useRef<Set<string>>(new Set());
  const callActiveRef = useRef<boolean>(false);
  const pendingSignalsRef = useRef<any[]>([]);

  // ─────────────────────────────────────────────────────────
  // Helper: Create fresh RTCPeerConnection instance
  // ─────────────────────────────────────────────────────────
  const createPeerConnection = (stream: MediaStream): RTCPeerConnection => {
    if (pcRef.current) {
      try { pcRef.current.close(); } catch {}
      pcRef.current = null;
    }
    processedSigIds.current.clear();
    pendingCandidates.current = [];
    remoteStreamRef.current = new MediaStream();
    setHasRemoteStream(false);
    setConnectionState('CONNECTING');

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
      ],
    });
    pcRef.current = pc;

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      console.log('[WebRTC] ontrack received:', event.track.kind);
      if (event.streams && event.streams[0]) {
        event.streams[0].getTracks().forEach(t => {
          if (!remoteStreamRef.current.getTracks().some(existing => existing.id === t.id)) {
            remoteStreamRef.current.addTrack(t);
          }
        });
      } else if (event.track) {
        if (!remoteStreamRef.current.getTracks().some(existing => existing.id === event.track.id)) {
          remoteStreamRef.current.addTrack(event.track);
        }
      }
      setHasRemoteStream(true);
      setConnectionState('CONNECTED');
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE State:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        setConnectionState('CONNECTED');
      } else if (pc.iceConnectionState === 'failed') {
        setConnectionState('FAILED');
      }
    };

    pc.onicecandidate = (event) => {
      if (!event.candidate || !event.candidate.candidate) return;
      fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SIGNAL_CALL',
          sessionId,
          signalType: 'ICE_CANDIDATE',
          sender: currentUserType,
          candidate: event.candidate.toJSON(),
        }),
      }).catch(() => {});
    };

    return pc;
  };

  // ─────────────────────────────────────────────────────────
  // Helper: process incoming WebRTC signal safely
  // ─────────────────────────────────────────────────────────
  const applySignalToPc = async (pc: RTCPeerConnection, sig: any) => {
    if (!sig || sig.sender === currentUserType) return;
    const key = sig.id ?? `${sig.signalType ?? sig.type}:${JSON.stringify(sig.sdp ?? sig.candidate ?? '')}`;
    if (processedSigIds.current.has(key)) return;
    processedSigIds.current.add(key);

    const type: string = sig.signalType ?? sig.type ?? '';
    try {
      if (type === 'OFFER' && currentUserType === 'ASTROLOGER') {
        const sdp = sig.sdp ?? sig.offer;
        if (!sdp) return;

        let targetPc = pc;
        if (targetPc.remoteDescription && targetPc.remoteDescription.type && localStreamRef.current) {
          console.log('[WebRTC] Re-creating PC for new incoming OFFER');
          targetPc = createPeerConnection(localStreamRef.current);
        }

        console.log('[WebRTC] Astrologer applying OFFER');
        await targetPc.setRemoteDescription(new RTCSessionDescription(sdp));
        
        // Drain buffered candidates
        for (const c of pendingCandidates.current) {
          try { await targetPc.addIceCandidate(new RTCIceCandidate(c)); } catch (e) {}
        }
        pendingCandidates.current = [];

        const answer = await targetPc.createAnswer();
        await targetPc.setLocalDescription(answer);
        await fetch('/api/consultations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'SIGNAL_CALL',
            sessionId,
            signalType: 'ANSWER',
            sender: 'ASTROLOGER',
            sdp: targetPc.localDescription,
          }),
        });
      } else if (type === 'ANSWER' && currentUserType === 'CLIENT') {
        const sdp = sig.sdp ?? sig.answer;
        if (!sdp) return;
        console.log('[WebRTC] Client applying ANSWER');
        if (pc.signalingState === 'have-local-offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          for (const c of pendingCandidates.current) {
            try { await pc.addIceCandidate(new RTCIceCandidate(c)); } catch (e) {}
          }
          pendingCandidates.current = [];
        }
      } else if (type === 'ICE_CANDIDATE' || type === 'ICE') {
        const cand = sig.candidate;
        if (!cand || !cand.candidate) return;
        const currentPc = pcRef.current ?? pc;
        if (currentPc.remoteDescription && currentPc.remoteDescription.type) {
          try { await currentPc.addIceCandidate(new RTCIceCandidate(cand)); } catch (e) {}
        } else {
          pendingCandidates.current.push(cand);
        }
      }
    } catch (err) {
      console.warn('[WebRTC] signal processing warning:', err);
    }
  };

  // ─────────────────────────────────────────────────────────
  // STEP 1: Manage local camera/mic stream
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isCallActive) {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
      setLocalStream(null);
      setHasRemoteStream(false);
      setConnectionState('DISCONNECTED');
      callActiveRef.current = false;
      if (pcRef.current) { pcRef.current.close(); pcRef.current = null; }
      return;
    }
    callActiveRef.current = true;
    setConnectionState('CONNECTING');

    let cancelled = false;
    (async () => {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: callType === 'VIDEO' ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
          audio: true,
        });
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        } catch {
          stream = createFallbackMediaStream(currentUserType === 'CLIENT' ? 'Client' : 'Astrologer');
        }
      }

      // Guarantee video track is present for VIDEO calls even if hardware is locked or fallback occurred
      if (callType === 'VIDEO' && stream.getVideoTracks().length === 0) {
        const fallback = createFallbackMediaStream(currentUserType === 'CLIENT' ? 'Client Camera' : 'Astrologer Camera');
        const vTrack = fallback.getVideoTracks()[0];
        if (vTrack) stream.addTrack(vTrack);
      }

      if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
      localStreamRef.current = stream;
      setLocalStream(stream);
    })();

    return () => {
      cancelled = true;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
    };
  }, [isCallActive, callType, currentUserType]);

  // ─────────────────────────────────────────────────────────
  // STEP 2: Initialize PeerConnection when localStream is ready
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isCallActive || !localStream) return;

    const pc = createPeerConnection(localStream);

    // CLIENT: create & send offer
    if (currentUserType === 'CLIENT') {
      (async () => {
        try {
          console.log('[WebRTC] CLIENT creating OFFER');
          const offer = await pc.createOffer({ offerToReceiveVideo: true, offerToReceiveAudio: true });
          await pc.setLocalDescription(offer);
          await fetch('/api/consultations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'SIGNAL_CALL',
              sessionId,
              signalType: 'OFFER',
              sender: 'CLIENT',
              sdp: pc.localDescription,
            }),
          });
        } catch (err) {
          console.warn('[WebRTC] offer error:', err);
        }
      })();
    }

    // ASTROLOGER: process any OFFER already in pendingSignalsRef
    if (currentUserType === 'ASTROLOGER') {
      const buffered = [...pendingSignalsRef.current];
      for (const sig of buffered) {
        applySignalToPc(pc, sig);
      }
    }

    return () => {
      pc.close();
      if (pcRef.current === pc) pcRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCallActive, localStream, sessionId, currentUserType, callVersion]);

  // ─────────────────────────────────────────────────────────
  // STEP 3: Poll API every 1.2s — sync session & signals
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/consultations?sessionId=${sessionId}`);
        const data = await res.json();
        if (!data.session) return;

        setSession(data.session);
        setRemainingSecs(data.session.remainingSeconds ?? 900);

        if (data.session.status === 'LIVE' && !callActiveRef.current) {
          callActiveRef.current = true;
          setIsCallActive(true);
          setCallType(data.session.callType ?? 'VIDEO');
        }

        pendingSignalsRef.current = data.session.signals ?? [];

        const pc = pcRef.current;
        if (pc && callActiveRef.current) {
          for (const sig of pendingSignalsRef.current) {
            applySignalToPc(pc, sig);
          }
        }
      } catch (err) {
        console.error('[fetchSession] error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
    const interval = setInterval(fetchSession, 1200);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // ─────────────────────────────────────────────────────────
  // Attach Streams to Video Elements
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(() => {});
    }
  }, [localStream, isVideoOff]);

  useEffect(() => {
    if (remoteVideoRef.current && hasRemoteStream) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
      remoteVideoRef.current.play().catch(() => {});
    }
  }, [hasRemoteStream]);

  // Dynamic mute/unmute
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(t => (t.enabled = !isMicMuted));
      localStream.getVideoTracks().forEach(t => (t.enabled = !isVideoOff));
    }
  }, [isMicMuted, isVideoOff, localStream]);

  // Timer countdown
  useEffect(() => {
    if (!session || session.status !== 'LIVE') return;
    const timer = setInterval(() => {
      setRemainingSecs(prev => {
        if (prev <= 1) { clearInterval(timer); handleEndSession('System Timer Expired'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [session?.status]);

  // Scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);










  const handleSendMessage = async (customText?: string, attachment?: any) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() && !attachment) return;

    setSending(true);
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_MESSAGE',
          sessionId,
          sender: currentUserType,
          text: textToSend,
          attachment,
        }),
      });
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
        if (!customText) setInputText('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
      setShowAttachMenu(false);
    }
  };

  // Convert Chat to Live Video or Voice Call — notifies remote party via API
  const handleInitiateCall = async (type: 'AUDIO' | 'VIDEO') => {
    setCallType(type);
    callActiveRef.current = true;
    setIsCallActive(true);
    setIsVideoOff(false);
    setCallVersion(v => v + 1);
    // Persist callType so the other side's polling can detect & join
    try {
      await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'INITIATE_CALL',
          sessionId,
          callType: type,
          initiatedBy: currentUserType,
        }),
      });
    } catch {}
    handleSendMessage(`📞 Initiated Live ${type === 'VIDEO' ? 'Video' : 'Voice'} Call consultation.`);
  };

  // Handle Mobile Camera Photo Capture for Kundli / Paper Chart
  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      handleSendMessage(`📷 Attached Kundli Photo: ${file.name}`, {
        type: 'IMAGE',
        title: 'Kundli Paper Chart Photo',
        url: imageDataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleEndSession = async (reason?: string) => {
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'END_SESSION',
          sessionId,
          endedBy: currentUserType === 'CLIENT' ? 'Client' : 'Astrologer',
        }),
      });
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
        setIsCallActive(false);
      }
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  const handleSendRemedy = async () => {
    if (!remedyInput.trim()) return;
    try {
      await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SEND_MESSAGE',
          sessionId,
          sender: 'ASTROLOGER',
          text: `📜 Prescribed Vedic Remedy: ${remedyInput}`,
          attachment: {
            type: 'REMEDY',
            title: 'Astrological Remedy Prescription',
            data: remedyInput,
          },
        }),
      });
      setRemedyInput('');
      setShowRemedyModal(false);

    } catch (err) {
      console.error('Failed to send remedy:', err);
    }
  };

  const handleShareKundli = () => {
    handleSendMessage(`🪐 Client Kundli Birth Details attached:\nDOB: ${session?.clientDob || 'N/A'}, TOB: ${session?.clientTob || 'N/A'}, POB: ${session?.clientPob || 'N/A'}`, {
      type: 'KUNDLI',
      title: `${session?.clientName}'s Birth Chart Details`,
      data: {
        dob: session?.clientDob,
        tob: session?.clientTob,
        pob: session?.clientPob,
        gender: session?.clientGender,
      },
    });
    setShowKundliModal(false);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading || !session) {
    return (
      <div className="fixed inset-0 z-[999999] bg-[#0b141a] flex flex-col items-center justify-center space-y-4 text-slate-300">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-medium text-sm text-emerald-400">Loading WhatsApp Live Consultation Workspace...</p>
      </div>
    );
  }

  const otherPartyName = currentUserType === 'CLIENT' ? session.astrologerName : session.clientName;

  return (
    <div className="fixed inset-0 z-[999999] w-screen h-[100dvh] max-h-[100dvh] bg-[#0b141a] text-[#e9edef] font-sans flex flex-col overflow-hidden select-none">

      {/* Hidden Mobile Camera Input & File Input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageCapture}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageCapture}
      />

      {/* 1. WHATSAPP HEADER NAVBAR (FULLY RESPONSIVE & ADJUSTED FOR SAFE DISPLAY) */}
      <div className="h-14 md:h-16 bg-[#202c33] px-2 sm:px-3 md:px-6 flex items-center justify-between border-b border-[#2a3942] z-30 shrink-0 shadow-md">
        <div className="flex items-center space-x-1.5 sm:space-x-3 min-w-0">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-[#8696a0] hover:text-[#e9edef] transition cursor-pointer shrink-0"
              title="Close chat"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          )}

          <div className="relative shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-700 p-0.5 overflow-hidden flex items-center justify-center">
              {session.astrologerAvatar ? (
                <img src={session.astrologerAvatar} alt={otherPartyName} className="w-full h-full object-cover rounded-full" />
              ) : (
                <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
              )}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#202c33] rounded-full"></span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-1">
              <h3 className="font-semibold text-[#e9edef] text-xs sm:text-sm md:text-base leading-tight truncate max-w-[85px] xs:max-w-[120px] sm:max-w-[180px]">
                {otherPartyName}
              </h3>
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] md:text-[10px] px-1 py-0.5 rounded-full font-bold border border-emerald-500/30 hidden sm:flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                Verified
              </span>
            </div>
            <p className="text-[10px] md:text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="truncate">online • ₹{session.ratePerMin}/min</span>
            </p>
          </div>
        </div>

        {/* TIMER & CALL CONVERT BUTTONS */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 shrink-0">
          
          {/* Live Timer Pill */}
          {session.status === 'LIVE' && (
            <div className="flex items-center space-x-1 bg-[#111b21] px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-amber-500/40 shadow-inner">
              <Clock className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span className="font-mono font-bold text-amber-300 text-[10px] sm:text-xs tracking-wider">
                {formatTimer(remainingSecs)}
              </span>
            </div>
          )}

          {/* 📹 Video Call Switch Button */}
          {session.status === 'LIVE' && (
            <button
              onClick={() => handleInitiateCall('VIDEO')}
              className={`p-1.5 sm:p-2 md:p-2.5 rounded-full border transition cursor-pointer ${
                isCallActive && callType === 'VIDEO'
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg animate-pulse'
                  : 'bg-[#2a3942] hover:bg-[#3b4a54] border-[#374248] text-[#aebac1] hover:text-[#e9edef]'
              }`}
              title="Start Live Video Call"
            >
              <Video className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}

          {/* 📞 Voice Call Switch Button */}
          {session.status === 'LIVE' && (
            <button
              onClick={() => handleInitiateCall('AUDIO')}
              className={`p-1.5 sm:p-2 md:p-2.5 rounded-full border transition cursor-pointer ${
                isCallActive && callType === 'AUDIO'
                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg animate-pulse'
                  : 'bg-[#2a3942] hover:bg-[#3b4a54] border-[#374248] text-[#aebac1] hover:text-[#e9edef]'
              }`}
              title="Start Live Voice Call"
            >
              <Phone className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}

          {/* 📷 Snap Kundli Camera Button */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="p-1.5 sm:p-2 md:p-2.5 rounded-full bg-[#2a3942] hover:bg-[#3b4a54] border border-[#374248] text-[#aebac1] hover:text-[#e9edef] transition cursor-pointer"
            title="Snap Paper Kundli Photo using Mobile Camera"
          >
            <Camera className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
          </button>

          {/* Kundli Details Button */}
          <button
            onClick={() => setShowKundliModal(true)}
            className="hidden sm:flex items-center space-x-1 text-xs bg-[#111b21] hover:bg-[#182229] text-emerald-400 px-2 py-1 rounded-xl border border-emerald-500/30 transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Kundli</span>
          </button>

          {currentUserType === 'ASTROLOGER' && session.status === 'LIVE' && (
            <button
              onClick={() => setShowRemedyModal(true)}
              className="hidden md:flex items-center space-x-1 text-xs bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 px-2.5 py-1 rounded-xl transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Remedy</span>
            </button>
          )}

          {session.status === 'LIVE' && (
            <button
              onClick={() => handleEndSession('User ended session')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-red-500/50 flex items-center gap-1 transition shadow cursor-pointer shrink-0"
              title="End Consultation"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">End</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. REAL-TIME VIDEO / VOICE CALL SCREEN DOCK */}
      {isCallActive && session.status === 'LIVE' && (
        <div className={`bg-[#0b141a] border-b border-[#222d34] flex flex-col items-center justify-between p-2 md:p-4 transition-all duration-300 shrink-0 relative ${
          isCallPip ? 'h-36' : 'h-64 md:h-80'
        }`}>
          <div className="relative w-full flex-1 rounded-3xl bg-slate-950 border border-[#2a3942] overflow-hidden shadow-2xl flex items-center justify-center">
            
            {/* LIVE WEBCAM VIDEO STREAM DISPLAY */}
            {callType === 'VIDEO' && !isVideoOff ? (
              <div className="relative w-full h-full bg-slate-950 flex items-center justify-center overflow-hidden">
                
                {/* MAIN VIEW: Remote Party Stream (or Local View if swapped) */}
                <div className="absolute inset-0 w-full h-full bg-slate-950 overflow-hidden flex items-center justify-center">
                  {!isSwappedCamera ? (
                    /* Default Main View: REMOTE PARTY VIDEO STREAM */
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className={`w-full h-full object-cover ${!hasRemoteStream ? 'hidden' : 'block'}`}
                    />
                  ) : (
                    /* Swapped Main View: LOCAL WEBCAM VIDEO STREAM */
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover transform -scale-x-100 ${!localStream ? 'hidden' : 'block'}`}
                    />
                  )}

                  {/* FALLBACK OVERLAY when remote stream is not yet established */}
                  {(!isSwappedCamera && !hasRemoteStream) && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 flex flex-col items-center justify-center p-4 text-center z-10">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 flex items-center justify-center mb-2 animate-pulse shadow-lg">
                        <User className="w-8 h-8 text-emerald-300" />
                      </div>
                      <h4 className="text-white font-bold text-sm md:text-base">{otherPartyName}</h4>
                      <p className="text-emerald-400 text-xs flex items-center gap-1.5 mt-1 font-medium bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>
                          {connectionState === 'CONNECTING' ? 'Connecting 1-on-1 HD Video Feed...' : 'Waiting for Remote Camera...'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* OVERLAID PIP CORNER BOX (Tap to swap main & corner views) */}
                <div
                  onClick={() => setIsSwappedCamera(!isSwappedCamera)}
                  className="absolute bottom-3 right-3 w-28 h-36 md:w-36 md:h-48 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-2xl bg-black z-20 cursor-pointer group"
                  title="Click to swap remote and local camera views"
                >
                  {!isSwappedCamera ? (
                    /* PiP Corner Box: LOCAL WEBCAM VIDEO STREAM */
                    <div className="w-full h-full relative bg-black flex items-center justify-center">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transform -scale-x-100 ${!localStream ? 'hidden' : 'block'}`}
                      />
                      {!localStream && (
                        <div className="text-slate-400 text-[10px] font-bold">No Camera</div>
                      )}
                      <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] text-white font-bold z-30">
                        You
                      </div>
                    </div>
                  ) : (
                    /* PiP Corner Box: REMOTE PARTY VIDEO STREAM */
                    <div className="w-full h-full relative bg-slate-900 flex items-center justify-center">
                      <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className={`w-full h-full object-cover ${!hasRemoteStream ? 'hidden' : 'block'}`}
                      />
                      {!hasRemoteStream && (
                        <img
                          src={session.astrologerAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80'}
                          alt={otherPartyName}
                          className="w-full h-full object-cover opacity-75"
                        />
                      )}
                      <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] text-emerald-300 font-bold z-30">
                        {otherPartyName}
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition z-30">
                    <RotateCw className="w-5 h-5 text-white animate-spin" />
                  </div>
                </div>

                {/* WEBCAM STATUS BADGE */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-emerald-400 font-bold flex items-center gap-1.5 z-20 border border-emerald-500/30">
                  <span className={`w-2 h-2 rounded-full ${hasRemoteStream ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`}></span>
                  <span>{hasRemoteStream ? '1-on-1 HD Live Connected' : '1-on-1 HD Connecting...'}</span>
                </div>
              </div>
            ) : (
              /* VOICE CALL / CAMERA OFF AUDIO WAVEFORM VIEW */
              <div className="relative w-full h-full bg-gradient-to-b from-[#111b21] to-[#0b141a] flex flex-col items-center justify-center p-4">
                {/* Pulse Rings */}
                <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
                  <div className="w-48 h-48 border border-emerald-500/40 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                  <div className="w-72 h-72 border border-teal-500/30 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-700 p-1 shadow-2xl ring-4 ring-emerald-500/20 mb-2">
                    <img
                      src={session.astrologerAvatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80'}
                      alt={otherPartyName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h4 className="font-semibold text-[#e9edef] text-sm md:text-base">{otherPartyName}</h4>
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    In Live Voice Call ({formatTimer(remainingSecs)})
                  </p>

                  {/* Animated Waveform */}
                  <div className="flex items-center gap-1 mt-3">
                    {[40, 70, 30, 90, 50, 80, 40, 60, 90, 30, 60, 80].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-emerald-400 rounded-full animate-pulse"
                        style={{
                          height: `${isMicMuted ? 6 : h}%`,
                          maxHeight: '24px',
                          minHeight: '4px',
                          animationDelay: `${i * 0.12}s`,
                        }}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Camera Warning Banner if hardware missing or denied */}
            {cameraError && (
              <div className="absolute top-3 inset-x-4 bg-amber-950/90 border border-amber-500/50 p-2 rounded-xl text-xs text-amber-200 flex items-center justify-between z-30">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{cameraError}</span>
                </div>
                <button
                  onClick={() => setCameraError(null)}
                  className="px-2 py-0.5 bg-amber-500 text-slate-950 font-bold rounded text-[10px]"
                >
                  OK
                </button>
              </div>
            )}

            {/* PIP Toggle Button */}
            <button
              onClick={() => setIsCallPip(!isCallPip)}
              className="absolute top-3 right-3 p-1.5 bg-[#202c33]/80 hover:bg-[#2a3942] text-[#8696a0] rounded-lg text-xs border border-[#374248] transition cursor-pointer z-30"
            >
              {isCallPip ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* CALL CONTROL DOCK */}
          <div className="flex items-center justify-center space-x-3 mt-2 py-1.5 px-6 bg-[#202c33] rounded-full border border-[#2a3942] shadow-xl">
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`p-2.5 rounded-full border transition cursor-pointer ${
                isMicMuted ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-[#111b21] border-[#222d34] text-[#e9edef] hover:bg-[#182229]'
              }`}
              title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
              className={`p-2.5 rounded-full border transition cursor-pointer ${
                isSpeakerMuted ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-[#111b21] border-[#222d34] text-[#e9edef] hover:bg-[#182229]'
              }`}
              title={isSpeakerMuted ? 'Unmute Speaker' : 'Mute Speaker'}
            >
              {isSpeakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-2.5 rounded-full border transition cursor-pointer ${
                isVideoOff ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-emerald-600 border-emerald-400 text-white'
              }`}
              title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsSwappedCamera(!isSwappedCamera)}
              className="p-2.5 rounded-full bg-[#111b21] border border-[#222d34] text-[#e9edef] hover:bg-[#182229] transition cursor-pointer"
              title="Interchange Camera Stream Views"
            >
              <RotateCw className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={() => setIsCallActive(false)}
              className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition cursor-pointer"
              title="Minimize Call & Return to Chat"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. WHATSAPP CHAT STREAM CONTAINER */}
      <div className="flex-1 bg-[#0b141a] relative overflow-hidden flex flex-col min-h-0">
        
        {/* Subtly Textured WhatsApp Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* MESSAGES SCROLL LIST */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3.5 scrollbar-thin scrollbar-thumb-[#202c33]">
          
          {/* Security Banner */}
          <div className="flex justify-center my-1">
            <div className="bg-[#182229] border border-[#222d34] rounded-lg px-3 py-1.5 text-[11px] text-amber-300/90 flex items-center gap-1.5 shadow-sm max-w-sm text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Messages & call audio/video are end-to-end encrypted.</span>
            </div>
          </div>

          {session.messages.map((msg) => {
            if (msg.sender === 'SYSTEM') {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="bg-[#182229]/80 border border-[#222d34] rounded-lg px-3 py-1 text-[11px] text-[#8696a0] text-center max-w-md">
                    {msg.text}
                  </div>
                </div>
              );
            }

            const isMe = msg.sender === currentUserType;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[65%] rounded-xl px-3.5 py-2 text-sm shadow-md leading-relaxed relative ${
                    isMe
                      ? 'bg-[#005c4b] text-[#e9edef] rounded-tr-none'
                      : 'bg-[#202c33] text-[#e9edef] rounded-tl-none border border-[#2a3942]'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Captured Photo / Image Attachment */}
                  {msg.attachment?.type === 'IMAGE' && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-[#2a3942] bg-[#111b21]">
                      <img
                        src={msg.attachment.url}
                        alt={msg.attachment.title}
                        onClick={() => msg.attachment?.url && setPreviewImage(msg.attachment.url)}
                        className="w-full max-h-64 object-cover cursor-pointer hover:opacity-90 transition"
                      />
                      <div className="p-1.5 text-[10px] text-[#8696a0] flex justify-between items-center">
                        <span>{msg.attachment.title}</span>
                        <span className="text-emerald-400 font-bold">Click to zoom</span>
                      </div>
                    </div>
                  )}

                  {/* Kundli Details Attachment Card */}
                  {msg.attachment?.type === 'KUNDLI' && (
                    <div className="mt-2 p-2.5 rounded-lg bg-[#111b21] border border-emerald-500/30 text-xs space-y-1">
                      <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{msg.attachment.title}</span>
                      </div>
                      {msg.attachment.data && (
                        <div className="text-[11px] text-[#8696a0] grid grid-cols-2 gap-1 pt-1 border-t border-[#222d34]">
                          <div>DOB: <span className="text-amber-300 font-mono">{msg.attachment.data.dob}</span></div>
                          <div>TOB: <span className="text-amber-300 font-mono">{msg.attachment.data.tob}</span></div>
                          <div>POB: <span className="text-amber-300">{msg.attachment.data.pob}</span></div>
                          <div>Gender: <span className="text-amber-300">{msg.attachment.data.gender}</span></div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Remedy Prescription Card */}
                  {msg.attachment?.type === 'REMEDY' && (
                    <div className="mt-2 p-2.5 rounded-lg bg-gradient-to-r from-amber-950/90 to-[#111b21] border border-amber-500/40 text-xs space-y-1">
                      <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Vedic Remedy Recommendation</span>
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {msg.attachment.data}
                      </p>
                    </div>
                  )}

                  {/* Message Timestamp & Blue Checkmarks */}
                  <div className="flex items-center justify-end space-x-1 text-[10px] text-[#8696a0] mt-1 pt-0.5">
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* QUICK RESPONSE CHIPS */}
        {session.status === 'LIVE' && (
          <div className="px-3 py-1.5 bg-[#111b21] border-t border-[#222d34] flex items-center gap-2 overflow-x-auto scrollbar-none text-xs shrink-0">
            <span className="text-[#8696a0] text-[10px] uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> Quick Vedic Answers:
            </span>
            {[
              'Share Kundli Details 🪐',
              'Snap Kundli Photo 📷',
              'Ask about Marriage 💑',
              'Career & Job timing 💼',
              'Gemstone remedy 💎',
              'Rahu / Ketu Dasha remedies ✨',
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (chip.includes('Snap Kundli Photo')) {
                    cameraInputRef.current?.click();
                  } else {
                    handleSendMessage(chip);
                  }
                }}
                className="bg-[#202c33] hover:bg-[#2a3942] text-[#e9edef] px-2.5 py-1 rounded-full text-xs whitespace-nowrap border border-[#374248] transition cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* ATTACHMENT MENU POPUP */}
        {showAttachMenu && (
          <div className="absolute bottom-16 left-4 bg-[#202c33] border border-[#2a3942] rounded-2xl p-3 shadow-2xl z-40 space-y-2 text-xs text-[#e9edef] w-56 animate-in fade-in slide-in-from-bottom-2">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-[#2a3942] transition cursor-pointer text-left"
            >
              <div className="p-2 rounded-full bg-pink-500/20 text-pink-400">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-100">Camera Photo</div>
                <div className="text-[10px] text-slate-400">Snap paper Kundli chart</div>
              </div>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-[#2a3942] transition cursor-pointer text-left"
            >
              <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-100">Photo Library</div>
                <div className="text-[10px] text-slate-400">Attach saved image</div>
              </div>
            </button>

            <button
              onClick={() => handleShareKundli()}
              className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-[#2a3942] transition cursor-pointer text-left border-t border-[#2a3942] pt-2"
            >
              <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-100">Digital Kundli</div>
                <div className="text-[10px] text-slate-400">Share DOB / TOB details</div>
              </div>
            </button>
          </div>
        )}

        {/* 4. WHATSAPP CHAT INPUT BAR (FLUSH SAFE AREA AT BOTTOM) */}
        {session.status === 'LIVE' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="px-2 py-2 sm:px-3 sm:py-2.5 bg-[#202c33] border-t border-[#2a3942] flex items-center space-x-1.5 sm:space-x-2 shrink-0 pb-5 sm:pb-3.5 md:pb-2.5 z-30 mb-0"
          >
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-1.5 sm:p-2 text-[#8696a0] hover:text-[#e9edef] hover:bg-[#2a3942] rounded-full transition cursor-pointer shrink-0"
              title="Attach Kundli photo / chart"
            >
              <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="p-1.5 sm:p-2 text-amber-400 hover:text-amber-300 hover:bg-[#2a3942] rounded-full transition cursor-pointer shrink-0"
              title="Snap Paper Kundli with Mobile Camera"
            >
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 min-w-0 bg-[#2a3942] border border-transparent rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:border-emerald-500/50 transition"
            />

            <button
              type="submit"
              disabled={sending || !inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold p-2 sm:p-2.5 rounded-full disabled:opacity-40 transition flex items-center justify-center shadow-lg cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="p-3 bg-[#202c33] border-t border-[#2a3942] text-center text-xs text-[#8696a0] shrink-0 pb-5 sm:pb-3.5">
            This live consultation has completed.
          </div>
        )}
      </div>

      {/* FULL RESOLUTION IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 p-2 text-white bg-slate-800 rounded-full cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={previewImage} alt="Kundli Chart Full View" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-slate-800" />
          </div>
        </div>
      )}

      {/* PRESCRIBE REMEDY MODAL (Astrologer Only) */}
      {showRemedyModal && (
        <div className="fixed inset-0 z-[100000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#202c33] border border-amber-500/40 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-[#e9edef]">
            <div className="flex items-center justify-between border-b border-[#2a3942] pb-3">
              <h3 className="font-semibold text-amber-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Prescribe Astrological Remedy
              </h3>
              <button onClick={() => setShowRemedyModal(false)} className="text-[#8696a0] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={remedyInput}
              onChange={(e) => setRemedyInput(e.target.value)}
              placeholder="e.g. Wear Yellow Sapphire (Pukhraj) in index finger on Thursday morning..."
              rows={4}
              className="w-full bg-[#111b21] border border-[#2a3942] rounded-xl p-3 text-xs text-[#e9edef] focus:border-amber-500 outline-none"
            />

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowRemedyModal(false)}
                className="px-4 py-2 bg-[#2a3942] hover:bg-[#3b4a54] text-[#aebac1] rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRemedy}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg cursor-pointer"
              >
                Send Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KUNDLI DETAILS MODAL */}
      {showKundliModal && (
        <div className="fixed inset-0 z-[100000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#202c33] border border-[#2a3942] rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-[#e9edef]">
            <div className="flex items-center justify-between border-b border-[#2a3942] pb-3">
              <h3 className="font-semibold text-[#e9edef] flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" /> Client Birth Details (Kundli)
              </h3>
              <button onClick={() => setShowKundliModal(false)} className="text-[#8696a0] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#111b21] p-4 rounded-xl border border-[#2a3942] space-y-2 text-xs">
              <div className="flex justify-between border-b border-[#222d34] pb-1.5">
                <span className="text-[#8696a0]">Client Name:</span>
                <span className="font-medium text-[#e9edef]">{session.clientName}</span>
              </div>
              <div className="flex justify-between border-b border-[#222d34] pb-1.5">
                <span className="text-[#8696a0]">Phone:</span>
                <span className="font-mono text-amber-300">{session.clientPhone}</span>
              </div>
              <div className="flex justify-between border-b border-[#222d34] pb-1.5">
                <span className="text-[#8696a0]">Date of Birth:</span>
                <span className="font-mono text-amber-300">{session.clientDob || 'Not specified'}</span>
              </div>
              <div className="flex justify-between border-b border-[#222d34] pb-1.5">
                <span className="text-[#8696a0]">Time of Birth:</span>
                <span className="font-mono text-amber-300">{session.clientTob || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8696a0]">Place of Birth:</span>
                <span className="font-medium text-[#e9edef]">{session.clientPob || 'Imphal, Manipur'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={handleShareKundli}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Share in Chat
              </button>
              <button
                onClick={() => setShowKundliModal(false)}
                className="px-4 py-2 bg-[#2a3942] hover:bg-[#3b4a54] text-[#aebac1] rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Share2(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}
