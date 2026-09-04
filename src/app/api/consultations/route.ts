import { NextResponse } from 'next/server';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';

export interface ConsultationMessage {
  id: string;
  sender: 'CLIENT' | 'ASTROLOGER' | 'SYSTEM';
  text: string;
  timestamp: string;
  attachment?: {
    type: 'KUNDLI' | 'IMAGE' | 'REMEDY';
    title: string;
    url?: string;
    data?: any;
  };
}

export interface WebRtcSignal {
  id: string;
  type: 'OFFER' | 'ANSWER' | 'ICE_CANDIDATE';
  sender: 'CLIENT' | 'ASTROLOGER';
  sdp?: any;
  candidate?: any;
  timestamp: string;
}

export interface ConsultationSession {
  id: string;
  mode: 'CHAT' | 'CALL';
  callType?: 'AUDIO' | 'VIDEO';
  clientName: string;
  clientPhone: string;
  clientGender?: string;
  clientDob?: string;
  clientTob?: string;
  clientPob?: string;
  astrologerId: string;
  astrologerName: string;
  astrologerPhone?: string;
  astrologerAvatar?: string;
  status: 'WAITING' | 'LIVE' | 'ENDED' | 'REJECTED' | 'CANCELLED';
  durationMinutes: number;
  ratePerMin: number;
  totalFee: number;
  createdAt: string;
  startedAt?: string;
  endedAt?: string;
  remainingSeconds: number;
  messages: ConsultationMessage[];
  signals: WebRtcSignal[];
  remedyRecommended?: string;
}

const DEFAULT_SESSIONS: ConsultationSession[] = [
  {
    id: 'SESS-1001',
    mode: 'CHAT',
    callType: 'AUDIO',
    clientName: 'Laishram Sanatomba',
    clientPhone: '+919862001122',
    clientGender: 'Male',
    clientDob: '1996-04-12',
    clientTob: '08:45',
    clientPob: 'Imphal West, Manipur',
    astrologerId: 'astro-1',
    astrologerName: 'Acharya Tombi Sharma',
    astrologerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
    status: 'ENDED',
    durationMinutes: 15,
    ratePerMin: 35,
    totalFee: 525,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    endedAt: new Date(Date.now() - 3600000 * 2 + 900000).toISOString(),
    remainingSeconds: 0,
    messages: [
      {
        id: 'msg-1',
        sender: 'SYSTEM',
        text: 'Consultation session started between Laishram Sanatomba and Acharya Tombi Sharma.',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'msg-2',
        sender: 'CLIENT',
        text: 'Taramanna Guru-ji, I am asking about my career promotion in 2026.',
        timestamp: new Date(Date.now() - 3600000 * 2 + 60000).toISOString(),
      },
      {
        id: 'msg-3',
        sender: 'ASTROLOGER',
        text: 'Radhe Radhe! Let me look into your D-10 Dashamsha chart. Jupiter transit in 10th house indicates strong promotion opportunities starting October 2026.',
        timestamp: new Date(Date.now() - 3600000 * 2 + 120000).toISOString(),
      },
    ],
    signals: [],
    remedyRecommended: 'Yellow Sapphire (Pukhraj) & Chant Vishnu Sahasranama on Thursdays',
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const astrologerId = searchParams.get('astrologerId');
    const clientPhone = searchParams.get('clientPhone');

    const sessions = await readPersistentDataAsync<ConsultationSession[]>('consultation_sessions', DEFAULT_SESSIONS);

    if (sessionId) {
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      return NextResponse.json({ session });
    }

    let filtered = sessions;
    if (astrologerId) {
      filtered = filtered.filter((s) => s.astrologerId === astrologerId);
    }
    if (clientPhone) {
      filtered = filtered.filter((s) => s.clientPhone === clientPhone);
    }

    return NextResponse.json({ sessions: filtered });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;
    const sessions = await readPersistentDataAsync<ConsultationSession[]>('consultation_sessions', DEFAULT_SESSIONS);

    if (action === 'CREATE_SESSION') {
      const newId = `SESS-${Math.floor(100000 + Math.random() * 900000)}`;
      const duration = Number(body.durationMinutes) || 15;
      const rate = Number(body.ratePerMin) || 35;
      const totalFee = duration * rate;

      const newSession: ConsultationSession = {
        id: newId,
        mode: body.mode || 'CHAT',
        callType: body.callType || 'AUDIO',
        clientName: body.clientName || 'Client User',
        clientPhone: body.clientPhone || '+910000000000',
        clientGender: body.clientGender || 'Male',
        clientDob: body.clientDob || '',
        clientTob: body.clientTob || '',
        clientPob: body.clientPob || '',
        astrologerId: body.astrologerId || 'astro-1',
        astrologerName: body.astrologerName || 'Acharya Astrologer',
        astrologerAvatar: body.astrologerAvatar || '',
        astrologerPhone: body.astrologerPhone || '',
        status: 'WAITING',
        durationMinutes: duration,
        ratePerMin: rate,
        totalFee: totalFee,
        createdAt: new Date().toISOString(),
        remainingSeconds: duration * 60,
        messages: [
          {
            id: `msg-${Date.now()}-1`,
            sender: 'SYSTEM',
            text: `Consultation request sent to ${body.astrologerName}. Waiting for astrologer to accept...`,
            timestamp: new Date().toISOString(),
          },
        ],
        signals: [],
      };

      sessions.unshift(newSession);
      await writePersistentDataAsync('consultation_sessions', sessions);

      return NextResponse.json({ success: true, session: newSession });
    }

    if (action === 'ACCEPT_SESSION') {
      const { sessionId } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      sessions[idx].status = 'LIVE';
      sessions[idx].startedAt = new Date().toISOString();
      sessions[idx].remainingSeconds = sessions[idx].durationMinutes * 60;
      sessions[idx].messages.push({
        id: `msg-${Date.now()}`,
        sender: 'SYSTEM',
        text: `Astrologer ${sessions[idx].astrologerName} joined the consultation! Session timer started (${sessions[idx].durationMinutes} mins).`,
        timestamp: new Date().toISOString(),
      });

      await writePersistentDataAsync('consultation_sessions', sessions);
      return NextResponse.json({ success: true, session: sessions[idx] });
    }

    if (action === 'REJECT_SESSION') {
      const { sessionId } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      sessions[idx].status = 'REJECTED';
      sessions[idx].messages.push({
        id: `msg-${Date.now()}`,
        sender: 'SYSTEM',
        text: `Consultation was declined by the astrologer. Refund has been initiated.`,
        timestamp: new Date().toISOString(),
      });

      await writePersistentDataAsync('consultation_sessions', sessions);
      return NextResponse.json({ success: true, session: sessions[idx] });
    }

    if (action === 'SEND_MESSAGE') {
      const { sessionId, sender, text, attachment } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      const newMsg: ConsultationMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        sender: sender || 'CLIENT',
        text: text || '',
        timestamp: new Date().toISOString(),
        attachment,
      };

      sessions[idx].messages.push(newMsg);
      await writePersistentDataAsync('consultation_sessions', sessions);
      return NextResponse.json({ success: true, message: newMsg, session: sessions[idx] });
    }

    if (action === 'SIGNAL_CALL') {
      const { sessionId, signalType, sender, sdp, candidate } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      const newSignal: WebRtcSignal = {
        id: `sig-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        type: signalType,
        sender,
        sdp,
        candidate,
        timestamp: new Date().toISOString(),
      };

      sessions[idx].signals.push(newSignal);
      await writePersistentDataAsync('consultation_sessions', sessions);
      return NextResponse.json({ success: true, signal: newSignal });
    }

    if (action === 'INITIATE_CALL') {
      const { sessionId, callType, initiatedBy } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      sessions[idx].callType = callType || 'VIDEO';
      sessions[idx].status = 'LIVE';
      // Clear stale signals from any previous call attempt
      sessions[idx].signals = [];
      await writePersistentDataAsync('consultation_sessions', sessions);
      return NextResponse.json({ success: true, session: sessions[idx] });
    }


    if (action === 'UPDATE_TIMER') {
      const { sessionId, remainingSeconds } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      sessions[idx].remainingSeconds = Math.max(0, remainingSeconds);
      if (remainingSeconds <= 0 && sessions[idx].status === 'LIVE') {
        sessions[idx].status = 'ENDED';
        sessions[idx].endedAt = new Date().toISOString();
        sessions[idx].messages.push({
          id: `msg-${Date.now()}`,
          sender: 'SYSTEM',
          text: `Consultation time expired (${sessions[idx].durationMinutes} mins). Session completed.`,
          timestamp: new Date().toISOString(),
        });
      }

      await writePersistentDataAsync('consultation_sessions', sessions);
      return NextResponse.json({ success: true, session: sessions[idx] });
    }

    if (action === 'END_SESSION') {
      const { sessionId, remedyRecommended } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      sessions[idx].status = 'ENDED';
      sessions[idx].endedAt = new Date().toISOString();
      sessions[idx].remainingSeconds = 0;
      if (remedyRecommended) {
        sessions[idx].remedyRecommended = remedyRecommended;
      }

      sessions[idx].messages.push({
        id: `msg-${Date.now()}`,
        sender: 'SYSTEM',
        text: `Consultation ended by ${body.endedBy || 'user'}. Thank you for using KangleiAstro live consultation!`,
        timestamp: new Date().toISOString(),
      });

      await writePersistentDataAsync('consultation_sessions', sessions);
      return NextResponse.json({ success: true, session: sessions[idx] });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to process consultation request' }, { status: 500 });
  }
}
