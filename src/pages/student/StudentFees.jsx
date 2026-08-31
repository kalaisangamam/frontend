import React, { useEffect, useState } from "react";
import {
  FiCreditCard,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

import StudentDashboardLayout from "../../layouts/StudentDashboardLayout.jsx";
import { EmptyState, ErrorState } from "../../components/common/StateViews.jsx";
import { studentService } from "../../services/studentService";
import { publicService } from "../../services/publicService";

const statusStyles = {
  paid: "bg-brass-500/10 text-brass-400 border-brass-500/25",
  pending: "bg-maroon-500/10 text-maroon-400 border-maroon-500/25",
  partially_paid: "bg-slate-500/10 text-slate-300 border-slate-500/25",
  overdue: "bg-maroon-600/15 text-maroon-300 border-maroon-600/30",
};

const statusIcons = {
  paid: FiCheckCircle,
  pending: FiClock,
  partially_paid: FiClock,
  overdue: FiAlertCircle,
};

const StudentFees = () => {
  const [fees, setFees] = useState(null);
  const [error, setError] = useState(false);
  const [payment, setPayment] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    studentService
      .getMyFees()
      .then(({ data }) => setFees(data.data))
      .catch(() => setError(true));

    publicService
      .getPaymentSettings()
      .then(({ data }) => setPayment(data.data))
      .catch(() => {});
  }, []);

  const current = fees?.[0];

  const formatStatus = (status) => status?.replace("_", " ") || "Unknown";

  const StatusBadge = ({ status }) => {
    const Icon = statusIcons[status] || FiClock;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium capitalize tracking-wide ${
          statusStyles[status] ||
          "bg-slate-500/10 text-slate-400 border-slate-500/20"
        }`}
      >
        <Icon size={12} />
        {formatStatus(status)}
      </span>
    );
  };

  return (
    <StudentDashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brass-500/10 border border-brass-500/20 flex items-center justify-center">
              <FiCreditCard className="text-brass-400" size={19} />
            </div>

            <div>
              <h1 className="section-heading !text-2xl lg:!text-3xl">
                Fees & Payments
              </h1>

              <p className="text-slate-500 text-xs mt-0.5">
                Manage your monthly fees and payment history
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}
        {error && <ErrorState message="Couldn't load fee details right now." />}

        {fees && (
          <div className="grid xl:grid-cols-[minmax(0,1.5fr)_380px] gap-6">
            {/* =================================================
                LEFT COLUMN
            ================================================== */}
            <div className="min-w-0">
              {/* =================================================
                  CURRENT FEE SUMMARY
              ================================================== */}
              {current && (
                <div className="relative overflow-hidden rounded-2xl border border-parchment-100/10 bg-ink-800/70 shadow-lg shadow-black/10 mb-7">
                  {/* Decorative Background */}
                  <div className="absolute -right-20 -top-20 w-56 h-56 rounded-full bg-brass-500/5 blur-3xl pointer-events-none" />

                  <div className="relative p-6 lg:p-7">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                          Current Fee
                        </p>

                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <FiCalendar className="text-brass-500" size={15} />

                          <h2 className="font-display text-xl text-parchment-100">
                            {current.month}
                          </h2>
                          <span className="text-sm font-medium text-brass-400">
                            {current.programs?.name || "Programme not assigned"}
                          </span>
                        </div>
                      </div>

                      <StatusBadge status={current.status} />
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Fee */}
                      <div className="rounded-xl border border-parchment-100/10 bg-ink-900/40 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                          Fee Amount
                        </p>

                        <p className="text-xl font-mono font-medium text-parchment-100">
                          Rs. {current.fee_amount}
                        </p>
                      </div>

                      {/* Paid */}
                      <div className="rounded-xl border border-brass-500/10 bg-brass-500/5 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                          Amount Paid
                        </p>

                        <p className="text-xl font-mono font-medium text-brass-400">
                          Rs. {current.paid_amount}
                        </p>
                      </div>

                      {/* Pending */}
                      <div className="rounded-xl border border-maroon-500/10 bg-maroon-500/5 p-4">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
                          Amount Pending
                        </p>

                        <p className="text-xl font-mono font-medium text-maroon-400">
                          Rs. {current.pending_amount}
                        </p>
                      </div>
                    </div>

                    {/* Payment Progress */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-500">
                          Payment Progress
                        </span>

                        <span className="text-xs text-slate-400">
                          {current.fee_amount > 0
                            ? Math.min(
                                100,
                                Math.round(
                                  (current.paid_amount / current.fee_amount) *
                                    100,
                                ),
                              )
                            : 0}
                          %
                        </span>
                      </div>

                      <div className="h-1.5 rounded-full bg-ink-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brass-500 transition-all duration-500"
                          style={{
                            width: `${
                              current.fee_amount > 0
                                ? Math.min(
                                    100,
                                    (current.paid_amount / current.fee_amount) *
                                      100,
                                  )
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  RECORDS HEADER
              ================================================== */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Records
                  </p>

                  <h2 className="font-display text-lg text-parchment-100 mt-1">
                    {showHistory ? "Monthly Fee History" : "Recent Payment"}
                  </h2>
                </div>

                {/* View / Hide History */}
                {fees.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setShowHistory((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-brass-500/20 bg-brass-500/5 text-xs text-brass-400 hover:bg-brass-500/10 hover:border-brass-500/30 transition-all duration-200"
                  >
                    {showHistory ? "Hide History" : "View History"}

                    <span className="text-[10px]">
                      {showHistory ? "↑" : "↓"}
                    </span>
                  </button>
                )}
              </div>

              {/* =================================================
                  FEE RECORDS
              ================================================== */}
              {fees.length === 0 ? (
                <EmptyState message="No fee records yet." />
              ) : (
                <div className="space-y-4">
                  {(showHistory ? fees : fees.slice(0, 1)).map((fee) => (
                    <article
                      key={fee.id}
                      className="group rounded-2xl border border-parchment-100/10 bg-ink-800/60 hover:bg-ink-800/80 transition-colors duration-200 overflow-hidden"
                    >
                      {/* =================================================
                          FEE HEADER
                      ================================================== */}
                      <div className="p-5 lg:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-ink-700 border border-parchment-100/10 flex items-center justify-center">
                                <FiCalendar
                                  size={14}
                                  className="text-brass-400"
                                />
                              </div>

                              <div>
                                <h3 className="font-display text-parchment-100">
                                  {fee.month}
                                </h3>

                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {fee.programs?.name || "Programme not assigned"} · Monthly fee record
                                </p>
                              </div>
                            </div>
                          </div>

                          <StatusBadge status={fee.status} />
                        </div>

                        {/* Amount Grid */}
                        <div className="grid grid-cols-4 gap-3 mt-5">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                              Fee
                            </p>

                            <p className="text-sm font-mono text-parchment-200">
                              Rs. {fee.fee_amount}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                              Paid
                            </p>

                            <p className="text-sm font-mono text-brass-400">
                              Rs. {fee.paid_amount}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                              Pending
                            </p>

                            <p className="text-sm font-mono text-maroon-400">
                              Rs. {fee.pending_amount}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                              Programme
                            </p>

                            <p className="text-sm font-mono text-maroon-400">
                              {fee.programs?.name || "Programme not assigned"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* =================================================
                          PAYMENT TRANSACTIONS
                      ================================================== */}
                      <div className="border-t border-parchment-100/10 bg-ink-900/25 px-5 lg:px-6 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            Payment Transactions
                          </p>

                          {fee.payments?.length > 0 && (
                            <span className="text-[10px] text-slate-600">
                              {fee.payments.length}{" "}
                              {fee.payments.length === 1
                                ? "transaction"
                                : "transactions"}
                            </span>
                          )}
                        </div>

                        {fee.payments?.length ? (
                          <div className="space-y-2">
                            {fee.payments.map((entry) => (
                              <div
                                key={entry.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-parchment-100/5 bg-ink-800/50 px-3.5 py-3"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-full bg-brass-500/10 flex items-center justify-center">
                                    <FiCheckCircle
                                      size={13}
                                      className="text-brass-400"
                                    />
                                  </div>

                                  <div>
                                    <p className="text-sm font-mono text-brass-400">
                                      Rs. {entry.amount}
                                    </p>

                                    {entry.payment_note && (
                                      <p className="text-[10px] text-slate-500 mt-0.5">
                                        {entry.payment_note}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <p className="text-xs text-slate-500">
                                  {new Date(
                                    entry.payment_date,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg border border-dashed border-parchment-100/10 py-5 text-center">
                            <p className="text-xs text-slate-500">
                              No payment received yet.
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* =================================================
                RIGHT COLUMN - ONLINE PAYMENT
            ================================================== */}
            <div className="xl:sticky xl:top-6 h-fit">
              {/* <div className="rounded-2xl border border-parchment-100/10 bg-ink-800/70 shadow-lg shadow-black/10 overflow-hidden"> */}
                {/* Payment Header */}
                {/* <div className="p-6 border-b border-parchment-100/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brass-500/10 border border-brass-500/20 flex items-center justify-center">
                      <FiCreditCard className="text-brass-400" size={18} />
                    </div>

                    <div>
                      <h2 className="font-display text-lg text-parchment-100">
                        Online Payment
                      </h2>

                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Pay your monthly fee securely
                      </p>
                    </div>
                  </div>
                </div> */}

                {/* Payment Content */}
                {/* <div className="p-6"> */}
                  {/* QR Code */}
                  {/* <div className="rounded-xl bg-white p-4 flex items-center justify-center mb-5">
                    {payment?.upi_qr_url ? (
                      <img
                        src={payment.upi_qr_url}
                        alt="Payment QR Code"
                        className="w-full max-w-[260px] aspect-square object-contain"
                      />
                    ) : (
                      <div className="h-56 w-full flex items-center justify-center text-slate-400 text-xs bg-slate-100 rounded-lg">
                        QR code not configured yet
                      </div>
                    )}
                  </div> */}

                  {/* Scan Text */}
                  {/* <div className="text-center mb-6">
                    <p className="text-sm text-parchment-200">
                      Scan QR Code to Pay
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1">
                      Use any supported UPI application
                    </p>
                  </div> */}

                  {/* Payment Details */}
                  {/* <div className="space-y-3"> */}
                    {/* {payment?.payment_number && (
                      <div className="rounded-lg border border-parchment-100/10 bg-ink-900/40 px-4 py-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">
                          Payment Number
                        </p>

                        <p className="text-base font-semibold font-mono text-parchment-100 break-all">
                          {payment.payment_number}
                        </p>
                      </div>
                    )} */}

                    {/* {payment?.upi_id && (
                      <div className="rounded-lg border border-parchment-100/10 bg-ink-900/40 px-4 py-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1.5">
                          UPI ID
                        </p>

                        <p className="text-base font-semibold font-mono text-brass-400 break-all">
                          {payment.upi_id}
                        </p>
                      </div>
                    )} */}
                  {/* </div> */}

                  {/* Verification Notice */}
                  {/* <div className="mt-5 rounded-xl border border-brass-500/10 bg-brass-500/5 p-4">
                    <div className="flex gap-3">
                      <FiCheckCircle
                        className="text-brass-400 mt-0.5 shrink-0"
                        size={15}
                      />

                      <p className="text-[11px] leading-relaxed text-slate-400">
                        After completing the payment, the academy will verify
                        the transaction and update it under the appropriate
                        monthly fee.
                      </p>
                    </div>
                  </div> */}
                {/* </div> */}
              {/* </div> */}
            </div>
          </div>
        )}
      </div>
    </StudentDashboardLayout>
  );
};

export default StudentFees;
