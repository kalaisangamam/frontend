import React, { useEffect, useState } from 'react';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout.jsx';
import AdminPageHeader from '../../components/dashboard/admin/AdminPageHeader.jsx';
import ConfirmDialog from '../../components/dashboard/admin/ConfirmDialog.jsx';
import StudentMultiSelect from '../../components/dashboard/admin/StudentMultiSelect.jsx';
import DataTable from '../../components/dashboard/admin/DataTable.jsx';
import { ErrorState } from '../../components/common/StateViews.jsx';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext.jsx';

const statusStyles = { paid: 'text-brass-400 border-brass-500/30', pending: 'text-maroon-400 border-maroon-500/30', partially_paid: 'text-slate-300 border-slate-500/30', overdue: 'text-maroon-300 border-maroon-600/40' };
const emptyForm = { month: '', fee_amount: '', payment_amount: '', payment_date: '', payment_note: '' };
const displayDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Today';

const AdminFees = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState(null);
  const [fees, setFees] = useState(null);
  const [error, setError] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const loadFees = () => adminService.getFees().then(({ data }) => setFees(data.data)).catch(() => setError(true));

  useEffect(() => {
    adminService.getStudents({ status: 'active' }).then(({ data }) => setStudents(data.data)).catch(() => setError(true));
    loadFees();
  }, []);
  const requestSubmit = (event) => {
    event.preventDefault();
    if (!selectedIds.length || !form.month || form.fee_amount === '') return showToast('Students, month and fee amount are required.', 'error');
    setConfirmOpen(true);
  };
  const handleSubmit = async () => {
    setConfirmOpen(false);
    setSaving(true);
    try {
      const { data } = await adminService.upsertFeesBulk({ studentIds: selectedIds, month: form.month, monthlyFeeAmount: Number(form.fee_amount), paymentReceivedNow: Number(form.payment_amount || 0), paymentDate: form.payment_date || undefined, paymentNote: form.payment_note || undefined });
      const { updated = [], skipped = [], failed = [] } = data.data || {};
      const details = [...skipped, ...failed].map((item) => `${item.studentName}: ${item.reason}`).join(' | ');
      showToast(`Updated: ${updated.length} student${updated.length === 1 ? '' : 's'}.${details ? ` ${details}` : ''}`, failed.length ? 'error' : undefined);
      setSelectedIds([]);
      loadFees();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to save fee records.', 'error'); } finally { setSaving(false); }
  };

  return <AdminDashboardLayout>
    <AdminPageHeader title="Fees" subtitle="One monthly fee record per student, with multiple payments supported." />
    {error && <ErrorState message="Couldn't load fee data right now." />}
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
      <form onSubmit={requestSubmit} className="card p-6 space-y-4 h-fit">
        <div><label className="text-xs text-slate-400 mb-1.5 block">Students</label><StudentMultiSelect students={students || []} selectedIds={selectedIds} onChange={setSelectedIds} /></div>
        <div><label className="text-xs text-slate-400 mb-1.5 block">Month (e.g. August 2026)</label><input required value={form.month} onChange={(event) => setForm({ ...form, month: event.target.value })} /></div>
        <div className="grid sm:grid-cols-2 gap-3"><div><label className="text-xs text-slate-400 mb-1.5 block">Monthly Fee Amount</label><input required min="0" type="number" value={form.fee_amount} onChange={(event) => setForm({ ...form, fee_amount: event.target.value })} /></div><div><label className="text-xs text-slate-400 mb-1.5 block">Payment Received Now</label><input min="0" type="number" value={form.payment_amount} onChange={(event) => setForm({ ...form, payment_amount: event.target.value })} /></div></div>
        <div><label className="text-xs text-slate-400 mb-1.5 block">Payment Date</label><input type="date" value={form.payment_date} onChange={(event) => setForm({ ...form, payment_date: event.target.value })} /></div>
        <div><label className="text-xs text-slate-400 mb-1.5 block">Payment Note (optional)</label><input value={form.payment_note} onChange={(event) => setForm({ ...form, payment_note: event.target.value })} /></div>
        <p className="text-xs text-slate-500">Each selected student is processed independently. Existing monthly records retain their payment history.</p>
        <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">{saving ? 'Saving...' : 'Save Fee'}</button>
      </form>
      <div className="min-w-0"><p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Monthly Fee Records</p>{fees && <DataTable tableClassName="min-w-[760px]" columns={[{ key: 'student_code', label: 'Student ID', render: (row) => row.students?.student_code || '-' }, { key: 'student', label: 'Student', render: (row) => row.students?.full_name || '-' }, { key: 'month', label: 'Month' }, { key: 'fee_amount', label: 'Fee', render: (row) => `Rs. ${row.fee_amount}` }, { key: 'paid_amount', label: 'Paid', render: (row) => `Rs. ${row.paid_amount}` }, { key: 'pending_amount', label: 'Balance', render: (row) => `Rs. ${row.pending_amount}` }, { key: 'payments', label: 'Payments', render: (row) => row.payments?.length || 0 }, { key: 'status', label: 'Status', render: (row) => <span className={`inline-flex whitespace-nowrap capitalize text-xs px-2.5 py-1 rounded-full border ${statusStyles[row.status]}`}>{row.status?.replace('_', ' ')}</span> }]} rows={fees} emptyMessage="No fee records yet." />}</div>
    </div>
    <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleSubmit} title={`Apply Rs. ${form.payment_amount || 0} payment to ${selectedIds.length} student${selectedIds.length === 1 ? '' : 's'}?`} message={`Month: ${form.month}\nPayment date: ${displayDate(form.payment_date)}`} confirmLabel="Confirm" danger={false} />
  </AdminDashboardLayout>;
};

export default AdminFees;
