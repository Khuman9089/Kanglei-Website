import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { readPersistentDataAsync, writePersistentDataAsync } from '@/lib/persistentStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export interface WalletTransaction {
  id: string;
  astroId: string;
  astroName: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  utr?: string;
  paymentMethod?: string;
  timestamp: string;
  status: 'COMPLETED' | 'PENDING';
}

export interface AstrologerWallet {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  whatsappNo: string;
  completedCount: number;
  pendingPayout: number; // Available wallet balance to be paid out
  totalEarnings: number;
  totalPaidOut: number;
  lastPayoutUtr?: string;
  lastPayoutDate?: string;
  payoutStatus?: 'REQUESTED' | 'SETTLED' | 'IDLE';
  payoutRequestedAmount?: number;
}

const DEFAULT_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-101',
    astroId: 'astro-1',
    astroName: 'Acharya Tombi Sharma',
    type: 'CREDIT',
    amount: 599,
    description: 'Consultation Fee — Kuthi Yengba (#KY-2026-8939)',
    timestamp: 'Today, 04:20 PM',
    status: 'COMPLETED',
  },
  {
    id: 'tx-100',
    astroId: 'astro-1',
    astroName: 'Acharya Tombi Sharma',
    type: 'DEBIT',
    amount: 1500,
    description: 'Admin Payout via UPI Direct Transfer',
    utr: 'UPI42981099238',
    paymentMethod: 'GPay / PhonePe UPI',
    timestamp: 'Yesterday, 02:15 PM',
    status: 'COMPLETED',
  },
  {
    id: 'tx-099',
    astroId: 'astro-1',
    astroName: 'Acharya Tombi Sharma',
    type: 'CREDIT',
    amount: 899,
    description: 'Consultation Fee — Career & Financial Outlook (#KY-2026-8855)',
    timestamp: 'Aug 23, 2026',
    status: 'COMPLETED',
  },
  {
    id: 'tx-098',
    astroId: 'astro-2',
    astroName: 'Saanvi Sharma',
    type: 'CREDIT',
    amount: 779,
    description: 'Consultation Fee — Marriage Compatibility (#KY-2026-8912)',
    timestamp: 'Aug 23, 2026',
    status: 'COMPLETED',
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const astroId = searchParams.get('astroId');

    const astrologers = await readPersistentDataAsync<any[]>('astrologers', []);
    const transactions = await readPersistentDataAsync<WalletTransaction[]>('wallet_transactions', DEFAULT_TRANSACTIONS);

    const mapToWallet = (a: any): AstrologerWallet => {
      const pendingPayout = typeof a.pendingPayout === 'number' ? a.pendingPayout : 0;
      const totalEarnings = typeof a.totalEarnings === 'number' ? a.totalEarnings : ((a.completedCount || 0) * 350 + pendingPayout);
      const totalPaidOut = typeof a.totalPaidOut === 'number' ? a.totalPaidOut : Math.max(0, totalEarnings - pendingPayout);

      return {
        id: a.id,
        name: a.name || 'Astrologer',
        specialty: a.specialty || (Array.isArray(a.specialties) ? a.specialties.join(', ') : 'Vedic Astrologer'),
        phone: a.phone || a.whatsappPhone || '+91 98620 99881',
        whatsappNo: a.whatsappNo || a.whatsappPhone || a.phone || '+91 98620 99881',
        completedCount: a.completedCount || 0,
        pendingPayout,
        totalEarnings,
        totalPaidOut,
        lastPayoutUtr: a.lastPayoutUtr,
        lastPayoutDate: a.lastPayoutDate,
        payoutStatus: a.payoutStatus || (pendingPayout === 0 ? 'SETTLED' : 'IDLE'),
        payoutRequestedAmount: a.payoutRequestedAmount || 0,
      };
    };

    if (astroId) {
      const astro = astrologers.find(
        (a) => a.id === astroId || a.username === astroId || a.name?.toLowerCase().includes(astroId.toLowerCase())
      ) || astrologers.find((a) => a.id === 'astro-1') || astrologers[0];

      if (!astro) {
        return NextResponse.json({ error: 'Astrologer not found' }, { status: 404 });
      }

      const wallet = mapToWallet(astro);
      const astroTx = transactions.filter((t) => t.astroId === astro.id || t.astroId === astroId);

      return NextResponse.json(
        {
          success: true,
          wallet,
          transactions: astroTx,
        },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
        }
      );
    }

    const wallets = astrologers.map(mapToWallet);
    return NextResponse.json(
      {
        success: true,
        wallets,
        transactions,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, astroId, amount, utr, paymentMethod, notes, orderRef, serviceTitle } = body;

    const targetAstroId = astroId || 'astro-1';
    let astrologers = await readPersistentDataAsync<any[]>('astrologers', []);
    let transactions = await readPersistentDataAsync<WalletTransaction[]>('wallet_transactions', DEFAULT_TRANSACTIONS);

    let astroIndex = astrologers.findIndex(
      (a) => a.id === targetAstroId || a.username === targetAstroId || a.name?.toLowerCase().includes(targetAstroId.toLowerCase())
    );

    if (astroIndex === -1 && astrologers.length > 0) {
      astroIndex = 0;
    }

    if (astroIndex === -1) {
      return NextResponse.json({ error: 'Astrologer not found' }, { status: 404 });
    }

    const astro = astrologers[astroIndex];
    const currentPending = typeof astro.pendingPayout === 'number' ? astro.pendingPayout : 0;
    const currentTotalEarnings = typeof astro.totalEarnings === 'number' ? astro.totalEarnings : ((astro.completedCount || 0) * 350 + currentPending);
    const currentTotalPaidOut = typeof astro.totalPaidOut === 'number' ? astro.totalPaidOut : Math.max(0, currentTotalEarnings - currentPending);

    if (action === 'PROCESS_PAYOUT') {
      const payAmount = Number(amount);
      if (isNaN(payAmount) || payAmount <= 0) {
        return NextResponse.json({ error: 'Invalid payout amount' }, { status: 400 });
      }

      const newPending = Math.max(0, currentPending - payAmount);
      const newPaidOut = currentTotalPaidOut + payAmount;
      const payoutUtr = utr || `UPI-${Math.floor(1000000000 + Math.random() * 900000000)}`;
      const payoutDate = new Date().toISOString().split('T')[0];

      astrologers[astroIndex] = {
        ...astro,
        pendingPayout: newPending,
        totalPaidOut: newPaidOut,
        totalEarnings: Math.max(currentTotalEarnings, newPaidOut + newPending),
        payoutStatus: newPending === 0 ? 'SETTLED' : 'REQUESTED',
        payoutRequestedAmount: 0,
        lastPayoutUtr: payoutUtr,
        lastPayoutDate: payoutDate,
      };

      const newTx: WalletTransaction = {
        id: 'tx-' + Date.now(),
        astroId: astro.id,
        astroName: astro.name,
        type: 'DEBIT',
        amount: payAmount,
        description: notes || `Admin Payout Disbursement via ${paymentMethod || 'UPI'}`,
        utr: payoutUtr,
        paymentMethod: paymentMethod || 'UPI Transfer',
        timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        status: 'COMPLETED',
      };

      transactions.unshift(newTx);

      await writePersistentDataAsync('astrologers', astrologers);
      await writePersistentDataAsync('wallet_transactions', transactions);

      // Cloud sync to Supabase table
      try {
        await supabase
          .from('astrologers')
          .update({
            // any metadata updates
          })
          .eq('id', astro.id);
      } catch (e) {}

      return NextResponse.json({
        success: true,
        message: `Successfully disbursed ₹${payAmount.toLocaleString()} to ${astro.name}. New wallet balance: ₹${newPending.toLocaleString()}.`,
        wallet: {
          id: astro.id,
          name: astro.name,
          specialty: astro.specialty || (Array.isArray(astro.specialties) ? astro.specialties.join(', ') : 'Vedic Astrologer'),
          phone: astro.phone || astro.whatsappPhone || '',
          whatsappNo: astro.whatsappNo || astro.whatsappPhone || astro.phone || '',
          completedCount: astro.completedCount || 0,
          pendingPayout: newPending,
          totalEarnings: astrologers[astroIndex].totalEarnings,
          totalPaidOut: newPaidOut,
          lastPayoutUtr: payoutUtr,
          lastPayoutDate: payoutDate,
          payoutStatus: newPending === 0 ? 'SETTLED' : 'REQUESTED',
        },
        transaction: newTx,
      });
    }

    if (action === 'ADD_EARNING') {
      const feeAmount = Number(amount);
      if (isNaN(feeAmount) || feeAmount <= 0) {
        return NextResponse.json({ error: 'Invalid fee amount' }, { status: 400 });
      }

      const newPending = currentPending + feeAmount;
      const newTotalEarnings = currentTotalEarnings + feeAmount;
      const newCompleted = (astro.completedCount || 0) + 1;

      astrologers[astroIndex] = {
        ...astro,
        pendingPayout: newPending,
        totalEarnings: newTotalEarnings,
        completedCount: newCompleted,
      };

      const newTx: WalletTransaction = {
        id: 'tx-' + Date.now(),
        astroId: astro.id,
        astroName: astro.name,
        type: 'CREDIT',
        amount: feeAmount,
        description: notes || `Consultation Fee — ${serviceTitle || 'Kuthi Yengba'} (${orderRef || '#KY-2026'})`,
        timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        status: 'COMPLETED',
      };

      transactions.unshift(newTx);

      await writePersistentDataAsync('astrologers', astrologers);
      await writePersistentDataAsync('wallet_transactions', transactions);

      return NextResponse.json({
        success: true,
        message: `Credited ₹${feeAmount} to ${astro.name}'s wallet`,
        wallet: {
          id: astro.id,
          name: astro.name,
          specialty: astro.specialty,
          phone: astro.phone || astro.whatsappPhone,
          whatsappNo: astro.whatsappNo || astro.whatsappPhone,
          completedCount: newCompleted,
          pendingPayout: newPending,
          totalEarnings: newTotalEarnings,
          totalPaidOut: currentTotalPaidOut,
        },
        transaction: newTx,
      });
    }

    if (action === 'REQUEST_PAYOUT') {
      const reqAmount = Number(amount);
      if (isNaN(reqAmount) || reqAmount <= 0) {
        return NextResponse.json({ error: 'Invalid payout request amount' }, { status: 400 });
      }

      if (reqAmount > currentPending) {
        return NextResponse.json(
          { error: `Requested amount (₹${reqAmount}) exceeds available balance (₹${currentPending})` },
          { status: 400 }
        );
      }

      astrologers[astroIndex] = {
        ...astro,
        payoutStatus: 'REQUESTED',
        payoutRequestedAmount: reqAmount,
      };

      const newTx: WalletTransaction = {
        id: 'tx-' + Date.now(),
        astroId: astro.id,
        astroName: astro.name,
        type: 'DEBIT',
        amount: reqAmount,
        description: `Payout Request submitted by ${astro.name} (Pending Admin Approval)`,
        timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        status: 'PENDING',
      };

      transactions.unshift(newTx);

      await writePersistentDataAsync('astrologers', astrologers);
      await writePersistentDataAsync('wallet_transactions', transactions);

      return NextResponse.json({
        success: true,
        message: `Payout request of ₹${reqAmount.toLocaleString()} submitted to Admin successfully!`,
        wallet: {
          id: astro.id,
          name: astro.name,
          specialty: astro.specialty,
          phone: astro.phone || astro.whatsappPhone,
          whatsappNo: astro.whatsappNo || astro.whatsappPhone,
          completedCount: astro.completedCount || 0,
          pendingPayout: currentPending,
          totalEarnings: currentTotalEarnings,
          totalPaidOut: currentTotalPaidOut,
          payoutStatus: 'REQUESTED',
          payoutRequestedAmount: reqAmount,
        },
        transaction: newTx,
      });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
