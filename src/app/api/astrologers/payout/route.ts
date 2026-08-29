import { NextResponse } from 'next/server';

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
}

// In-memory store for shared state between Admin and Astrologers
const WALLETS: Record<string, AstrologerWallet> = {
  'astro-1': {
    id: 'astro-1',
    name: 'Acharya Tombi Sharma',
    specialty: 'Vedic Horoscope & Kuthi Yengba Specialist',
    phone: '+91 98620 99881',
    whatsappNo: '+91 98620 99881',
    completedCount: 142,
    pendingPayout: 3500,
    totalEarnings: 12750,
    totalPaidOut: 9250,
  },
  'astro-2': {
    id: 'astro-2',
    name: 'Pandit Ningthem Meitei',
    specialty: 'Marriage Compatibility & Dasha Remedies',
    phone: '+91 97740 33411',
    whatsappNo: '+91 97740 33411',
    completedCount: 98,
    pendingPayout: 2250,
    totalEarnings: 8400,
    totalPaidOut: 6150,
  },
  'astro-3': {
    id: 'astro-3',
    name: 'Guru Sanatomba',
    specialty: 'Navamsha D9 Chart & Gemstone Analysis',
    phone: '+91 98561 77122',
    whatsappNo: '+91 98561 77122',
    completedCount: 64,
    pendingPayout: 1750,
    totalEarnings: 5900,
    totalPaidOut: 4150,
  },
};

const TRANSACTIONS: WalletTransaction[] = [
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
    astroName: 'Pandit Ningthem Meitei',
    type: 'CREDIT',
    amount: 779,
    description: 'Consultation Fee — Marriage Compatibility (#KY-2026-8912)',
    timestamp: 'Aug 23, 2026',
    status: 'COMPLETED',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const astroId = searchParams.get('astroId');

  if (astroId) {
    const wallet = WALLETS[astroId] || WALLETS['astro-1'];
    const astroTx = TRANSACTIONS.filter((t) => t.astroId === astroId || t.astroId === wallet.id);
    return NextResponse.json({
      success: true,
      wallet,
      transactions: astroTx,
    });
  }

  return NextResponse.json({
    success: true,
    wallets: Object.values(WALLETS),
    transactions: TRANSACTIONS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, astroId, amount, utr, paymentMethod, notes, orderRef, serviceTitle } = body;

    const targetAstroId = astroId || 'astro-1';
    const wallet = WALLETS[targetAstroId];

    if (!wallet) {
      return NextResponse.json({ error: 'Astrologer not found' }, { status: 404 });
    }

    if (action === 'PROCESS_PAYOUT') {
      // Admin disburses funds to astrologer
      const payAmount = Number(amount);
      if (isNaN(payAmount) || payAmount <= 0) {
        return NextResponse.json({ error: 'Invalid payout amount' }, { status: 400 });
      }

      if (payAmount > wallet.pendingPayout) {
        return NextResponse.json(
          { error: `Payout amount (₹${payAmount}) exceeds available wallet balance (₹${wallet.pendingPayout})` },
          { status: 400 }
        );
      }

      // Deduct from pending balance & add to total paid out
      wallet.pendingPayout = Math.max(0, wallet.pendingPayout - payAmount);
      wallet.totalPaidOut += payAmount;

      const newTx: WalletTransaction = {
        id: 'tx-' + Date.now(),
        astroId: wallet.id,
        astroName: wallet.name,
        type: 'DEBIT',
        amount: payAmount,
        description: notes || `Admin Payout Disbursement via ${paymentMethod || 'UPI'}`,
        utr: utr || `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        paymentMethod: paymentMethod || 'UPI Transfer',
        timestamp: 'Just Now',
        status: 'COMPLETED',
      };

      TRANSACTIONS.unshift(newTx);

      return NextResponse.json({
        success: true,
        message: `Successfully paid ₹${payAmount.toLocaleString()} to ${wallet.name}. Wallet balance updated.`,
        wallet,
        transaction: newTx,
      });
    }

    if (action === 'ADD_EARNING') {
      // Fee credited when consultation completes
      const feeAmount = Number(amount);
      if (isNaN(feeAmount) || feeAmount <= 0) {
        return NextResponse.json({ error: 'Invalid fee amount' }, { status: 400 });
      }

      wallet.pendingPayout += feeAmount;
      wallet.totalEarnings += feeAmount;
      wallet.completedCount += 1;

      const newTx: WalletTransaction = {
        id: 'tx-' + Date.now(),
        astroId: wallet.id,
        astroName: wallet.name,
        type: 'CREDIT',
        amount: feeAmount,
        description: `Consultation Fee — ${serviceTitle || 'Service'} (${orderRef || '#KY-2026'})`,
        timestamp: 'Just Now',
        status: 'COMPLETED',
      };

      TRANSACTIONS.unshift(newTx);

      return NextResponse.json({
        success: true,
        message: `Credited ₹${feeAmount} to ${wallet.name}'s wallet`,
        wallet,
        transaction: newTx,
      });
    }

    if (action === 'REQUEST_PAYOUT') {
      // Astrologer requests payout from admin
      const reqAmount = Number(amount);
      if (isNaN(reqAmount) || reqAmount <= 0) {
        return NextResponse.json({ error: 'Invalid payout request amount' }, { status: 400 });
      }

      if (reqAmount > wallet.pendingPayout) {
        return NextResponse.json(
          { error: `Requested amount (₹${reqAmount}) exceeds available balance (₹${wallet.pendingPayout})` },
          { status: 400 }
        );
      }

      const newTx: WalletTransaction = {
        id: 'tx-' + Date.now(),
        astroId: wallet.id,
        astroName: wallet.name,
        type: 'DEBIT',
        amount: reqAmount,
        description: `Payout Request submitted by ${wallet.name} (Pending Admin Approval)`,
        timestamp: 'Just Now',
        status: 'PENDING',
      };

      TRANSACTIONS.unshift(newTx);

      return NextResponse.json({
        success: true,
        message: `Payout request of ₹${reqAmount.toLocaleString()} submitted to Admin successfully!`,
        wallet,
        transaction: newTx,
      });
    }

    return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
