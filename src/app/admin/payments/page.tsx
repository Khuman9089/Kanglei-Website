'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Check, X, Eye, FileText, Search, Clock } from 'lucide-react';

interface PendingPayment {
  id: string;
  bookingRef: string;
  clientName: string;
  serviceName: string;
  amount: number;
  utr: string;
  screenshotUrl?: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
}

const MOCK_PAYMENTS: PendingPayment[] = [
  {
    id: 'pay-1',
    bookingRef: 'KA-8F29A1',
    clientName: 'Vikram Sharma',
    serviceName: '60-Min Comprehensive Consultation',
    amount: 2499,
    utr: '423871928341',
    screenshotUrl: 'upi_screenshot_sample.jpg',
    submittedAt: '2026-08-26 09:15 AM',
    status: 'SUBMITTED',
  },
  {
    id: 'pay-2',
    bookingRef: 'KA-[#3B19C9]',
    clientName: 'Ananya Gupta',
    serviceName: 'Marriage Compatibility Report',
    amount: 1299,
    utr: '423871991204',
    submittedAt: '2026-08-26 08:30 AM',
    status: 'SUBMITTED',
  },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PendingPayment[]>(MOCK_PAYMENTS);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleVerify = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'VERIFIED' } : p))
    );
    setSelectedPayment(null);
  };

  const handleReject = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'REJECTED' } : p))
    );
    setSelectedPayment(null);
  };

  const filteredPayments = payments.filter(
    (p) =>
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.utr.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#0b132b] pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c69214]/10 border border-[#c69214]/20 text-[#e0a96d] text-xs font-medium mb-2">
              <ShieldCheck className="w-4 h-4 text-[#c69214]" />
              Solo Astrologer Portal
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#faf8f4]">UPI Payment Verification Queue</h1>
          </div>

          <div className="relative w-72">
            <Search className="w-4 h-4 text-[#5c7a99] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Ref, Client, UTR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#1c2541] border border-[#3a506b] text-[#faf8f4] text-sm focus:border-[#c69214] focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#faf8f4]">
              <thead className="bg-[#1c2541] text-[#c69214] font-serif border-b border-[#3a506b]">
                <tr>
                  <th className="px-6 py-4">Ref ID</th>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">UTR / Ref No.</th>
                  <th className="px-6 py-4">Submitted At</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3a506b]/40">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#1c2541]/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#c69214]">{p.bookingRef}</td>
                    <td className="px-6 py-4 font-medium">{p.clientName}</td>
                    <td className="px-6 py-4 text-[#5c7a99]">{p.serviceName}</td>
                    <td className="px-6 py-4 font-bold">₹{p.amount}</td>
                    <td className="px-6 py-4 font-mono text-[#e0a96d]">{p.utr}</td>
                    <td className="px-6 py-4 text-xs text-[#5c7a99]">{p.submittedAt}</td>
                    <td className="px-6 py-4">
                      {p.status === 'SUBMITTED' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Awaiting Review
                        </span>
                      )}
                      {p.status === 'VERIFIED' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                          Verified
                        </span>
                      )}
                      {p.status === 'REJECTED' && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {p.status === 'SUBMITTED' && (
                        <>
                          <button
                            onClick={() => handleVerify(p.id)}
                            className="px-3 py-1.5 rounded-lg bg-green-600/30 hover:bg-green-600 text-green-300 hover:text-white border border-green-500/40 text-xs font-medium transition-colors"
                          >
                            <Check className="w-3.5 h-3.5 inline mr-1" />
                            Verify
                          </button>
                          <button
                            onClick={() => handleReject(p.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-medium transition-colors"
                          >
                            <X className="w-3.5 h-3.5 inline mr-1" />
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
