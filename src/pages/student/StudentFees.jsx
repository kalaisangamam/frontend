import React, { useEffect, useState } from 'react';
import { FiCreditCard } from 'react-icons/fi';
import StudentDashboardLayout from '../../layouts/StudentDashboardLayout.jsx';
import { EmptyState, ErrorState } from '../../components/common/StateViews.jsx';
import { studentService } from '../../services/studentService';
import { publicService } from '../../services/publicService';

const statusStyles = {
  paid: 'bg-brass-500/15 text-brass-400 border-brass-500/30', pending: 'bg-maroon-500/15 text-maroon-400 border-maroon-500/30',
  partially_paid: 'bg-slate-500/15 text-slate-300 border-slate-500/30', overdue: 'bg-maroon-600/20 text-maroon-300 border-maroon-600/40',
};

const StudentFees = () => {
  const [fees, setFees] = useState(null);
  const [error, setError] = useState(false);
  const [payment, setPayment] = useState(null);
  useEffect(() => {
    studentService.getMyFees().then(({ data }) => setFees(data.data)).catch(() => setError(true));
    publicService.getPaymentSettings().then(({ data }) => setPayment(data.data)).catch(() => {});
  }, []);
  const current = fees?.[0];

  return <StudentDashboardLayout>
    <h1 className="section-heading !text-2xl lg:!text-3xl mb-1">Fees</h1>
    <p className="text-slate-500 text-sm mb-8">Your monthly fee and every verified payment are shown below.</p>
    {error && <ErrorState message="Couldn't load fee details right now." />}
    {fees && <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6">
      <div>
        {current && <div className="card p-6 mb-6">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Latest Fee - {current.month}</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div><p className="text-lg font-mono text-parchment-100">Rs. {current.fee_amount}</p><p className="text-xs text-slate-500">Fee Amount</p></div>
            <div><p className="text-lg font-mono text-brass-400">Rs. {current.paid_amount}</p><p className="text-xs text-slate-500">Paid</p></div>
            <div><p className="text-lg font-mono text-maroon-400">Rs. {current.pending_amount}</p><p className="text-xs text-slate-500">Pending</p></div>
          </div>
          <span className={`inline-block text-xs px-3 py-1 rounded-full border capitalize ${statusStyles[current.status]}`}>{current.status?.replace('_', ' ')}</span>
        </div>}
        <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Monthly Fee & Payment History</p>
        {fees.length === 0 ? <EmptyState message="No fee records yet." /> : <div className="space-y-4">
          {fees.map((fee) => <article key={fee.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-100/10 pb-3">
              <div><p className="font-display text-parchment-100">{fee.month}</p><p className="text-xs text-slate-500 mt-1">Fee: Rs. {fee.fee_amount} · Paid: Rs. {fee.paid_amount} · Pending: Rs. {fee.pending_amount}</p></div>
              <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${statusStyles[fee.status]}`}>{fee.status?.replace('_', ' ')}</span>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mt-4 mb-2">Payment Transactions</p>
            {fee.payments?.length ? <div className="space-y-2">{fee.payments.map((entry) => <div key={entry.id} className="flex items-center justify-between gap-3 text-sm"><span className="text-brass-400">Rs. {entry.amount}</span><span className="text-slate-400">{new Date(entry.payment_date).toLocaleDateString()}</span>{entry.payment_note && <span className="text-xs text-slate-500">{entry.payment_note}</span>}</div>)}</div> : <p className="text-sm text-slate-500">No payment received yet.</p>}
          </article>)}
        </div>}
      </div>
      <div className="card p-8 h-fit"><div className="flex items-center gap-2 mb-4"><FiCreditCard className="text-brass-500" /><p className="font-display text-parchment-100">Online Payment</p></div>
        {payment?.upi_qr_url ? <img src={payment.upi_qr_url} alt="Payment QR Code" className="w-full rounded-md mb-4" /> : <div className="h-40 bg-ink-700 rounded-md flex items-center justify-center text-slate-500 text-xs mb-4">QR code not configured yet</div>}
        <p className="text-xs text-slate-500 mb-1">Scan QR Code to Pay</p>{payment?.payment_number && <p className="text-sm text-parchment-200 font-mono mt-3">Payment Number: {payment.payment_number}</p>}
        <p className="text-xs text-slate-500 mt-4 leading-relaxed">After payment, the academy will verify it and add it as a transaction under the correct monthly fee.</p>
      </div>
    </div>}
  </StudentDashboardLayout>;
};

export default StudentFees;
