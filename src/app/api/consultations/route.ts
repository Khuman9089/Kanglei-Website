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
  orderRef?: string;
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
  status: 'PENDING_VERIFICATION' | 'CONFIRMED' | 'WAITING' | 'LIVE' | 'ENDED' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  durationMinutes: number;
  ratePerMin: number;
  totalFee: number;
  createdAt: string;
  scheduledDate?: string;
  shift?: 'Morning' | 'Evening';
  paymentUtr?: string;
  paymentStatus?: 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';
  meetingLink?: string;
  meetingLinkSent?: boolean;
  platformFeePercent?: number;
  platformFee?: number;
  astrologerNetPayout?: number;
  walletCredited?: boolean;
  startedAt?: string;
  endedAt?: string;
  remainingSeconds: number;
  messages: ConsultationMessage[];
  signals: WebRtcSignal[];
  remedyRecommended?: string;
}

const DEFAULT_SESSIONS: ConsultationSession[] = [
  {
    id: 'TEST-SESS-999',
    mode: 'CALL',
    callType: 'VIDEO',
    clientName: 'Test Client User',
    clientPhone: '+919999999999',
    astrologerId: 'astro-test',
    astrologerName: 'Acharya Test Guru',
    astrologerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80',
    status: 'ENDED',
    durationMinutes: 30,
    ratePerMin: 35,
    totalFee: 1050,
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    remainingSeconds: 1800,
    messages: [
      {
        id: 'msg-test-1',
        sender: 'SYSTEM',
        text: 'Live 1-on-1 Consultation Test Room active.',
        timestamp: new Date().toISOString(),
      },
    ],
    signals: [],
  },
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

async function getSessionsWithDefaults(): Promise<ConsultationSession[]> {
  const sessions = await readPersistentDataAsync<ConsultationSession[]>('consultation_sessions', DEFAULT_SESSIONS);
  let changed = false;
  for (const def of DEFAULT_SESSIONS) {
    const existing = sessions.find((s) => s.id === def.id);
    if (!existing) {
      sessions.unshift({ ...def });
      changed = true;
    } else if (def.id === 'TEST-SESS-999') {
      // Auto-revive test session if it was previously ended or out of time
      if (existing.status !== 'LIVE' || !existing.remainingSeconds || existing.remainingSeconds <= 60) {
        existing.status = 'LIVE';
        existing.remainingSeconds = 3600;
        existing.durationMinutes = 60;
        existing.callType = 'VIDEO';
        changed = true;
      }
    }
  }
  if (changed) {
    writePersistentDataAsync('consultation_sessions', sessions).catch(() => {});
  }
  return sessions;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const astrologerId = searchParams.get('astrologerId');
    const clientPhone = searchParams.get('clientPhone');

    const sessions = await getSessionsWithDefaults();

    if (sessionId) {
      const session = sessions.find((s) => s.id === sessionId);
      if (!session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      // If session is a confirmed or waiting booking, ensure it is ready to chat/call with valid timer
      if (session.status !== 'COMPLETED' && session.paymentStatus !== 'REJECTED') {
        let modified = false;
        if (session.status === 'ENDED' || session.status === 'CONFIRMED' || session.status === 'WAITING' || session.status === 'PENDING_VERIFICATION') {
          session.status = 'LIVE';
          modified = true;
        }
        const minSeconds = (session.durationMinutes || 15) * 60;
        if (!session.remainingSeconds || session.remainingSeconds <= 30) {
          session.remainingSeconds = minSeconds;
          modified = true;
        }
        if (modified) {
          writePersistentDataAsync('consultation_sessions', sessions).catch(() => {});
        }
      }

      return NextResponse.json({ session });
    }

    // Auto-expire stale WAITING sessions older than 2 minutes
    let dirty = false;
    const now = Date.now();
    sessions.forEach((s) => {
      if (s.status === 'WAITING' && s.createdAt) {
        const createdMs = new Date(s.createdAt).getTime();
        if (!isNaN(createdMs) && now - createdMs > 2 * 60 * 1000) {
          s.status = 'CANCELLED';
          dirty = true;
        }
      }
    });
    if (dirty) {
      writePersistentDataAsync('consultation_sessions', sessions).catch(() => {});
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
    const sessions = await getSessionsWithDefaults();

    if (action === 'CREATE_SESSION' || action === 'CREATE_BOOKING') {
      const newId = body.id || `SESS-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderRef = body.orderRef || `CONS-${Math.floor(100000 + Math.random() * 900000)}`;
      const duration = Number(body.durationMinutes) || 15;
      const rate = Number(body.ratePerMin) || 35;
      const totalFee = Number(body.totalFee) || (duration * rate);
      const defaultMeetingLink = `/consultation?sessionId=${newId}`;

      const newSession: ConsultationSession = {
        id: newId,
        orderRef: orderRef,
        mode: body.mode || 'CHAT',
        callType: body.callType || (body.mode === 'CALL' ? 'VIDEO' : 'AUDIO'),
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
        status: body.status || 'PENDING_VERIFICATION',
        durationMinutes: duration,
        ratePerMin: rate,
        totalFee: totalFee,
        createdAt: new Date().toISOString(),
        scheduledDate: body.scheduledDate || new Date().toISOString().split('T')[0],
        shift: body.shift === 'Evening' ? 'Evening' : 'Morning',
        paymentUtr: body.paymentUtr || body.utr || '',
        paymentStatus: body.paymentStatus || 'PENDING_VERIFICATION',
        meetingLink: body.meetingLink || defaultMeetingLink,
        meetingLinkSent: false,
        platformFeePercent: body.platformFeePercent ? Number(body.platformFeePercent) : undefined,
        walletCredited: false,
        remainingSeconds: duration * 60,
        messages: [
          {
            id: `msg-${Date.now()}-1`,
            sender: 'SYSTEM',
            text: `Consultation booked with ${body.astrologerName} for ${body.scheduledDate || 'selected date'} (${body.shift || 'Morning'} shift). Awaiting admin payment verification.`,
            timestamp: new Date().toISOString(),
          },
        ],
        signals: [],
      };

      sessions.unshift(newSession);
      await writePersistentDataAsync('consultation_sessions', sessions);

      // Also sync to kuthi_orders so admin order hubs see this order
      try {
        const kuthiOrders = await readPersistentDataAsync<any[]>('kuthi_orders', []);
        const syncedOrder = {
          id: 'k-' + newId,
          orderRef: orderRef,
          clientName: newSession.clientName,
          sex: newSession.clientGender || 'Client',
          mobile: newSession.clientPhone,
          whatsappNo: newSession.clientPhone,
          serviceType: `Live ${newSession.mode} (${newSession.shift} Shift)`,
          amount: newSession.totalFee,
          utr: newSession.paymentUtr || 'N/A',
          submittedAt: 'Just Now',
          status: 'PENDING',
          paymentStatus: 'VERIFICATION_PENDING',
          assignedAstrologerId: newSession.astrologerId,
          assignedAstrologerName: newSession.astrologerName,
        };
        const exists = kuthiOrders.find((o) => o.orderRef === orderRef || o.id === syncedOrder.id);
        if (!exists) {
          kuthiOrders.unshift(syncedOrder);
          await writePersistentDataAsync('kuthi_orders', kuthiOrders);
        }
      } catch (err) {
        console.warn('Sync to kuthi_orders non-critical note:', err);
      }

      return NextResponse.json({ success: true, session: newSession });
    }

    if (action === 'ADMIN_VERIFY_PAYMENT') {
      const { sessionId, orderRef, meetingLink } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId || s.orderRef === orderRef);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      sessions[idx].paymentStatus = 'VERIFIED';
      sessions[idx].status = 'CONFIRMED';
      if (meetingLink) {
        sessions[idx].meetingLink = meetingLink;
      } else if (!sessions[idx].meetingLink) {
        sessions[idx].meetingLink = `/consultation?sessionId=${sessions[idx].id}`;
      }

      sessions[idx].messages.push({
        id: `msg-${Date.now()}`,
        sender: 'SYSTEM',
        text: `✅ Payment Verified by Admin! Order confirmed for ${sessions[idx].scheduledDate || 'scheduled date'} (${sessions[idx].shift || 'Morning'} shift). Meeting link is prepared.`,
        timestamp: new Date().toISOString(),
      });

      await writePersistentDataAsync('consultation_sessions', sessions);

      // Sync status to kuthi_orders if present
      try {
        const kuthiOrders = await readPersistentDataAsync<any[]>('kuthi_orders', []);
        const kIdx = kuthiOrders.findIndex((o) => o.orderRef === sessions[idx].orderRef || o.id === 'k-' + sessions[idx].id);
        if (kIdx !== -1) {
          kuthiOrders[kIdx].paymentStatus = 'PAYMENT_RECEIVED';
          kuthiOrders[kIdx].status = 'ASSIGNED';
          await writePersistentDataAsync('kuthi_orders', kuthiOrders);
        }
      } catch (e) {}

      return NextResponse.json({ success: true, session: sessions[idx] });
    }

    if (action === 'UPDATE_PAYMENT_STATUS' || action === 'ADMIN_UPDATE_PAYMENT_STATUS') {
      const { sessionId, orderRef, paymentStatus } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId || s.orderRef === orderRef);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      const newStatus = paymentStatus || 'PENDING_VERIFICATION';
      sessions[idx].paymentStatus = newStatus;

      if (newStatus === 'VERIFIED') {
        sessions[idx].status = 'CONFIRMED';
        if (!sessions[idx].meetingLink) {
          sessions[idx].meetingLink = `/consultation?sessionId=${sessions[idx].id}`;
        }
      } else if (newStatus === 'REJECTED') {
        sessions[idx].status = 'REJECTED';
      } else if (newStatus === 'PENDING_VERIFICATION') {
        if (sessions[idx].status === 'CONFIRMED' || sessions[idx].status === 'REJECTED') {
          sessions[idx].status = 'PENDING_VERIFICATION';
        }
      }

      sessions[idx].messages.push({
        id: `msg-${Date.now()}`,
        sender: 'SYSTEM',
        text:
          newStatus === 'VERIFIED'
            ? `✅ Payment status updated to VERIFIED by Admin! Consultation order confirmed.`
            : newStatus === 'REJECTED'
            ? `❌ Payment status updated to REJECTED by Admin. UTR verification failed.`
            : `⏳ Payment status marked as PENDING VERIFICATION by Admin.`,
        timestamp: new Date().toISOString(),
      });

      await writePersistentDataAsync('consultation_sessions', sessions);

      // Bidirectional sync to kuthi_orders if linked
      try {
        const kuthiOrders = await readPersistentDataAsync<any[]>('kuthi_orders', []);
        const kIdx = kuthiOrders.findIndex(
          (o) => o.orderRef === sessions[idx].orderRef || o.id === 'k-' + sessions[idx].id
        );
        if (kIdx !== -1) {
          kuthiOrders[kIdx].paymentStatus =
            newStatus === 'VERIFIED'
              ? 'PAYMENT_RECEIVED'
              : newStatus === 'REJECTED'
              ? 'PAYMENT_NOT_RECEIVED'
              : 'VERIFICATION_PENDING';
          if (newStatus === 'VERIFIED' && kuthiOrders[kIdx].status === 'PENDING') {
            kuthiOrders[kIdx].status = 'ASSIGNED';
          }
          await writePersistentDataAsync('kuthi_orders', kuthiOrders);
        }
      } catch (e) {}

      return NextResponse.json({ success: true, session: sessions[idx] });
    }

    if (action === 'ADMIN_SEND_LINK') {
      const { sessionId, orderRef, meetingLink } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId || s.orderRef === orderRef);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      const linkToUse = meetingLink || sessions[idx].meetingLink || `/consultation?sessionId=${sessions[idx].id}`;
      sessions[idx].meetingLink = linkToUse;
      sessions[idx].meetingLinkSent = true;
      sessions[idx].status = 'WAITING';

      sessions[idx].messages.push({
        id: `msg-${Date.now()}`,
        sender: 'SYSTEM',
        text: `🔗 Consultation Room Link dispatched: ${linkToUse}. Both client and astrologer may now enter the live session.`,
        timestamp: new Date().toISOString(),
      });

      await writePersistentDataAsync('consultation_sessions', sessions);
      return NextResponse.json({ success: true, session: sessions[idx], meetingLink: linkToUse });
    }

    if (action === 'ADMIN_COMPLETE_SESSION') {
      const { sessionId, orderRef, platformFeePercent } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId || s.orderRef === orderRef);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      // Admin entered platform fee percentage (e.g. 15 or whatever admin inputs)
      const feePct = Number(platformFeePercent) >= 0 ? Number(platformFeePercent) : 15;
      const totalFee = Number(sessions[idx].totalFee) || 499;
      const platformFee = Math.round((totalFee * feePct) / 100);
      const netPayout = Math.max(0, totalFee - platformFee);

      sessions[idx].status = 'COMPLETED';
      sessions[idx].endedAt = new Date().toISOString();
      sessions[idx].remainingSeconds = 0;
      sessions[idx].platformFeePercent = feePct;
      sessions[idx].platformFee = platformFee;
      sessions[idx].astrologerNetPayout = netPayout;
      sessions[idx].walletCredited = true;

      sessions[idx].messages.push({
        id: `msg-${Date.now()}`,
        sender: 'SYSTEM',
        text: `Consultation session marked COMPLETED by Admin. Platform fee (${feePct}%): ₹${platformFee}. Net payout credited to astrologer wallet: ₹${netPayout}.`,
        timestamp: new Date().toISOString(),
      });

      await writePersistentDataAsync('consultation_sessions', sessions);

      // Automatically credit net payout into Astrologer's Wallet in persistent store
      try {
        const astrologers = await readPersistentDataAsync<any[]>('astrologers', []);
        const targetAstroId = sessions[idx].astrologerId;
        const aIdx = astrologers.findIndex((a) => a.id === targetAstroId || a.name === sessions[idx].astrologerName);
        if (aIdx !== -1) {
          const currentPending = Number(astrologers[aIdx].pendingPayout) || 0;
          const currentEarnings = Number(astrologers[aIdx].totalEarnings) || 0;
          const currentCompleted = Number(astrologers[aIdx].completedCount) || 0;

          astrologers[aIdx].pendingPayout = currentPending + netPayout;
          astrologers[aIdx].totalEarnings = currentEarnings + netPayout;
          astrologers[aIdx].completedCount = currentCompleted + 1;
          await writePersistentDataAsync('astrologers', astrologers);
        }
      } catch (walletErr) {
        console.warn('Wallet credit error:', walletErr);
      }

      // Sync completed status to kuthi_orders
      try {
        const kuthiOrders = await readPersistentDataAsync<any[]>('kuthi_orders', []);
        const kIdx = kuthiOrders.findIndex((o) => o.orderRef === sessions[idx].orderRef || o.id === 'k-' + sessions[idx].id);
        if (kIdx !== -1) {
          kuthiOrders[kIdx].status = 'COMPLETED';
          await writePersistentDataAsync('kuthi_orders', kuthiOrders);
        }
      } catch (e) {}

      return NextResponse.json({
        success: true,
        session: sessions[idx],
        payoutDetails: {
          totalFee,
          platformFeePercent: feePct,
          platformFee,
          netPayout,
        },
      });
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
      if (!sessions[idx].remainingSeconds || sessions[idx].remainingSeconds <= 60) {
        sessions[idx].remainingSeconds = (sessions[idx].durationMinutes || 30) * 60;
      }
      // Prune signals older than 20s so active in-flight offer/answer negotiation isn't wiped out
      const now = Date.now();
      sessions[idx].signals = (sessions[idx].signals || []).filter(
        (sig) => now - new Date(sig.timestamp).getTime() < 20000
      );
      await writePersistentDataAsync('consultation_sessions', sessions);
      return NextResponse.json({ success: true, session: sessions[idx] });
    }

    if (action === 'JOIN_ROOM') {
      const { sessionId, participantRole } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      if (sessions[idx].status !== 'COMPLETED' && sessions[idx].paymentStatus !== 'REJECTED') {
        sessions[idx].status = 'LIVE';
        if (!sessions[idx].remainingSeconds || sessions[idx].remainingSeconds <= 30) {
          sessions[idx].remainingSeconds = (sessions[idx].durationMinutes || 15) * 60;
        }
        await writePersistentDataAsync('consultation_sessions', sessions);
      }
      return NextResponse.json({ success: true, session: sessions[idx] });
    }


    if (action === 'UPDATE_TIMER') {
      const { sessionId, remainingSeconds } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      if (sessionId === 'TEST-SESS-999') {
        sessions[idx].status = 'LIVE';
        sessions[idx].remainingSeconds = 3600;
        await writePersistentDataAsync('consultation_sessions', sessions);
        return NextResponse.json({ success: true, session: sessions[idx] });
      }

      sessions[idx].remainingSeconds = Math.max(0, remainingSeconds);
      await writePersistentDataAsync('consultation_sessions', sessions);
      return NextResponse.json({ success: true, session: sessions[idx] });
    }

    if (action === 'END_SESSION') {
      const { sessionId, remedyRecommended } = body;
      const idx = sessions.findIndex((s) => s.id === sessionId);
      if (idx === -1) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

      // In TEST-SESS-999, reset the session so subsequent testing immediately has a fresh active room
      if (sessionId === 'TEST-SESS-999') {
        sessions[idx].status = 'LIVE';
        sessions[idx].remainingSeconds = 3600;
        sessions[idx].signals = [];
        await writePersistentDataAsync('consultation_sessions', sessions);
        return NextResponse.json({ success: true, session: sessions[idx] });
      }

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
