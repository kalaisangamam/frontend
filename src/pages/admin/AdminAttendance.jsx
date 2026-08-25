import React, { useEffect, useState } from 'react';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout.jsx';
import AdminPageHeader from '../../components/dashboard/admin/AdminPageHeader.jsx';
import ConfirmDialog from '../../components/dashboard/admin/ConfirmDialog.jsx';
import StudentMultiSelect from '../../components/dashboard/admin/StudentMultiSelect.jsx';
import { EmptyState, ErrorState } from '../../components/common/StateViews.jsx';
import { adminService } from '../../services/adminService';
import { publicService } from '../../services/publicService';
import { useToast } from '../../context/ToastContext.jsx';

const STATUSES = ['present', 'absent', 'leave'];
const displayDate = (value) => new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const AdminAttendance = () => {
  const { showToast } = useToast();
  const [students, setStudents] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [error, setError] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState('present');
  const [history, setHistory] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const historyStudentId = selectedIds.length === 1 ? selectedIds[0] : '';
  const filteredStudents = selectedProgramId
    ? (students || []).filter((student) => student.student_programs?.some((enrollment) => (
      enrollment.program_id === selectedProgramId && enrollment.status === 'active'
    )))
    : [];

  useEffect(() => {
    adminService.getStudents({ status: 'active' }).then(({ data }) => setStudents(data.data)).catch(() => setError(true));
    publicService.getPrograms().then(({ data }) => setPrograms(data.data)).catch(() => setPrograms([]));
  }, []);

  const handleProgramChange = (programId) => {
    setSelectedProgramId(programId);
    setSelectedIds([]);
    setHistory(null);
  };

  const loadHistory = (studentId) => {
    if (!studentId) return setHistory(null);
    adminService.getStudentAttendance(studentId).then(({ data }) => setHistory(data.data)).catch(() => setHistory(null));
  };
  useEffect(() => { loadHistory(historyStudentId); /* eslint-disable-next-line */ }, [historyStudentId]);

  const requestMark = (event) => {
    event.preventDefault();
    if (!selectedProgramId) return showToast('Please select a program.', 'error');
    if (!selectedIds.length) return showToast('Select at least one student.', 'error');
    setConfirmOpen(true);
  };
  const handleMark = async () => {
    setConfirmOpen(false);
    setSaving(true);
    try {
      const { data } = await adminService.markAttendanceBulk({ studentIds: selectedIds, programId: selectedProgramId, date, status });
      showToast(data.message || `Attendance updated successfully for ${selectedIds.length} students.`);
      setSelectedIds([]);
      loadHistory('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to record attendance.', 'error');
    } finally { setSaving(false); }
  };

  return <AdminDashboardLayout>
    <AdminPageHeader title="Attendance" subtitle="Select one or more students to mark attendance together." />
    {error && <ErrorState message="Couldn't load students right now." />}
    {students && <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
      <form onSubmit={requestMark} className="card p-6 space-y-4 h-fit">
        <div><label className="text-xs text-slate-400 mb-1.5 block">Program</label><select value={selectedProgramId} onChange={(event) => handleProgramChange(event.target.value)}><option value="">Select program...</option>{programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}</select></div>
        <div><label className="text-xs text-slate-400 mb-1.5 block">Students</label><StudentMultiSelect students={filteredStudents} selectedIds={selectedIds} onChange={setSelectedIds} emptyMessage={selectedProgramId ? 'No students registered for this program.' : 'Select a program first.'} /></div>
        <div><label className="text-xs text-slate-400 mb-1.5 block">Date</label><input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></div>
        <div><label className="text-xs text-slate-400 mb-1.5 block">Status</label><div className="flex flex-col sm:flex-row gap-2">{STATUSES.map((item) => <button type="button" key={item} onClick={() => setStatus(item)} className={`flex-1 capitalize text-xs py-2.5 rounded-sm border transition-colors ${status === item ? 'bg-brass-500 text-onaccent border-brass-500 font-semibold' : 'border-parchment-100/15 text-slate-400'}`}>{item}</button>)}</div></div>
        <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">{saving ? 'Saving...' : 'Save Attendance'}</button>
      </form>
      <div><p className="text-xs text-slate-500 uppercase tracking-wide mb-3">History</p>
        {!historyStudentId && <EmptyState message="Select one student to view their attendance history." />}
        {historyStudentId && history && history.records.length === 0 && <EmptyState message="No attendance recorded yet for this student." />}
        {historyStudentId && history && history.records.length > 0 && <div className="card overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-slate-500 text-xs uppercase border-b border-parchment-100/5"><th className="p-4">Date</th><th className="p-4">Status</th></tr></thead><tbody>{history.records.map((record) => <tr key={record.id} className="border-b border-parchment-100/5 last:border-0"><td className="p-4 text-parchment-200">{displayDate(record.date)}</td><td className="p-4 capitalize text-slate-300">{record.status}</td></tr>)}</tbody></table></div>}
      </div>
    </div>}
    <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleMark} title={`Mark ${selectedIds.length} student${selectedIds.length === 1 ? '' : 's'} as ${status}?`} message={`Date: ${displayDate(date)}`} confirmLabel="Confirm" danger={false} />
  </AdminDashboardLayout>;
};

export default AdminAttendance;
