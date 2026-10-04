import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout.jsx';
import AdminPageHeader from '../../components/dashboard/admin/AdminPageHeader.jsx';
import ConfirmDialog from '../../components/dashboard/admin/ConfirmDialog.jsx';
import DataTable from '../../components/dashboard/admin/DataTable.jsx';
import { EmptyState, ErrorState } from '../../components/common/StateViews.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { adminService } from '../../services/adminService';
import { publicService } from '../../services/publicService';

const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
const blankForm = () => ({ program_id: '', student_id: '', achievement_date: today(), title: '', achievement: '' });
const displayDate = (value) => new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const AdminStudentAchievements = () => {
  const { showToast } = useToast();
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [filters, setFilters] = useState({ program_id: '', student_id: '', date: '' });
  const [loading, setLoading] = useState(true);
  const [referenceError, setReferenceError] = useState(false);
  const [listError, setListError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);

  const enrolledStudents = useMemo(() => students.filter((student) => student.student_programs?.some((enrollment) => (
    enrollment.program_id === form.program_id && enrollment.status === 'active'
  ))), [students, form.program_id]);
  const filterStudents = useMemo(() => students.filter((student) => !filters.program_id || student.student_programs?.some((enrollment) => (
    enrollment.program_id === filters.program_id && enrollment.status === 'active'
  ))), [students, filters.program_id]);

  const loadRows = useCallback(async () => {
    setLoading(true); setListError(false);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const { data } = await adminService.getStudentAchievementsAdmin(params);
      setRows(data.data || []);
    } catch {
      setListError(true);
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => {
    Promise.all([publicService.getPrograms(), adminService.getStudents({ status: 'active' })])
      .then(([programResult, studentResult]) => {
        setPrograms(programResult.data.data || []);
        setStudents(studentResult.data.data || []);
      })
      .catch(() => setReferenceError(true));
  }, []);
  useEffect(() => { loadRows(); }, [loadRows]);

  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value, ...(key === 'program_id' ? { student_id: '' } : {}) }));
  const clearForm = () => { setForm(blankForm()); setEditing(null); };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.program_id || !form.student_id || !form.achievement_date || !form.title.trim() || !form.achievement.trim()) {
      showToast('Program, student, date, title and achievement are required.', 'error'); return;
    }
    if (saving) return;
    setSaving(true);
    try {
      if (editing) await adminService.updateStudentAchievement(editing.id, form);
      else await adminService.createStudentAchievement(form);
      showToast(editing ? 'Achievement updated successfully.' : 'Achievement added successfully.');
      clearForm();
      await loadRows();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save achievement.', 'error');
    } finally { setSaving(false); }
  };

  const editRow = (row) => {
    setEditing(row);
    setForm({ program_id: row.program_id, student_id: row.student_id, achievement_date: row.achievement_date, title: row.title, achievement: row.achievement });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const deleteRow = async () => {
    if (!deleting || actionBusy) return;
    setActionBusy(true);
    try {
      await adminService.deleteStudentAchievement(deleting.id);
      showToast('Achievement deleted successfully.'); setDeleting(null); await loadRows();
    } catch (error) { showToast(error.response?.data?.message || 'Failed to delete achievement.', 'error'); }
    finally { setActionBusy(false); }
  };

  const columns = [
    { key: 'student', label: 'Student', render: (row) => <span>{row.students?.full_name || '—'}{row.students?.student_code && <span className="block text-xs text-slate-500">{row.students.student_code}</span>}</span> },
    { key: 'program', label: 'Program', render: (row) => row.programs?.name || '—' },
    { key: 'achievement_date', label: 'Date', render: (row) => displayDate(row.achievement_date) },
    { key: 'title', label: 'Title', render: (row) => <span className="whitespace-normal min-w-40 block">{row.title}</span> },
    { key: 'achievement', label: 'Achievement', render: (row) => <span className="whitespace-normal min-w-32 block">{row.achievement}</span> },
  ];

  return <AdminDashboardLayout>
    <AdminPageHeader title="Student Achievements" subtitle="Add and manage achievements for students." />
    {referenceError && <ErrorState message="Couldn't load programs or students. Refresh the page and try again." />}
    <form onSubmit={submit} className="card p-5 sm:p-6 mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div><label htmlFor="achievement-program" className="text-xs text-slate-400 mb-1.5 block">Program</label><select id="achievement-program" value={form.program_id} onChange={(event) => updateForm('program_id', event.target.value)} required><option value="">Select program...</option>{programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}</select>{programs.length === 0 && !referenceError && <p className="text-xs text-slate-500 mt-1">No programs are available.</p>}</div>
      <div><label htmlFor="achievement-student" className="text-xs text-slate-400 mb-1.5 block">Student</label><select id="achievement-student" value={form.student_id} onChange={(event) => updateForm('student_id', event.target.value)} disabled={!form.program_id || enrolledStudents.length === 0} required><option value="">Select student...</option>{enrolledStudents.map((student) => <option key={student.id} value={student.id}>{student.full_name} ({student.student_code})</option>)}</select>{form.program_id && enrolledStudents.length === 0 && <p className="text-xs text-slate-500 mt-1">No students enrolled in this program.</p>}</div>
      <div><label htmlFor="achievement-date" className="text-xs text-slate-400 mb-1.5 block">Achievement Date</label><input id="achievement-date" type="date" value={form.achievement_date} onChange={(event) => updateForm('achievement_date', event.target.value)} required /></div>
      <div className="sm:col-span-2 xl:col-span-1"><label htmlFor="achievement-title" className="text-xs text-slate-400 mb-1.5 block">Achievement Title</label><input id="achievement-title" value={form.title} onChange={(event) => updateForm('title', event.target.value)} placeholder="Enter achievement title" maxLength={200} required /></div>
      <div className="sm:col-span-2"><label htmlFor="achievement-result" className="text-xs text-slate-400 mb-1.5 block">Achievement</label><textarea id="achievement-result" value={form.achievement} onChange={(event) => updateForm('achievement', event.target.value)} placeholder="Enter achievement or result" rows="3" maxLength={2000} required className="w-full" /></div>
      <div className="sm:col-span-2 xl:col-span-3 flex flex-wrap gap-3"><button type="submit" disabled={saving || referenceError} className="btn-primary disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update Achievement' : 'Add Achievement'}</button>{editing && <button type="button" onClick={clearForm} className="btn-secondary">Cancel Edit</button>}</div>
    </form>

    <section>
      <h2 className="font-display text-lg text-parchment-100 mb-4">Existing Achievements</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-5">
        <div><label htmlFor="filter-program" className="text-xs text-slate-400 mb-1.5 block">Filter by program</label><select id="filter-program" value={filters.program_id} onChange={(event) => setFilters((current) => ({ ...current, program_id: event.target.value, student_id: '' }))}><option value="">All programs</option>{programs.map((program) => <option key={program.id} value={program.id}>{program.name}</option>)}</select></div>
        <div><label htmlFor="filter-student" className="text-xs text-slate-400 mb-1.5 block">Filter by student</label><select id="filter-student" value={filters.student_id} onChange={(event) => setFilters((current) => ({ ...current, student_id: event.target.value }))}><option value="">All students</option>{filterStudents.map((student) => <option key={student.id} value={student.id}>{student.full_name}</option>)}</select></div>
        <div><label htmlFor="filter-date" className="text-xs text-slate-400 mb-1.5 block">Filter by date</label><input id="filter-date" type="date" value={filters.date} onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))} /></div>
      </div>
      {listError && <ErrorState message="Couldn't load student achievements right now." />}
      {!listError && loading && <p className="text-sm text-slate-500 py-6">Loading achievements...</p>}
      {!listError && !loading && rows.length === 0 && <EmptyState message="No student achievements found." />}
      {!listError && !loading && rows.length > 0 && <DataTable columns={columns} rows={rows} tableClassName="min-w-[850px]" actions={(row) => <><button type="button" onClick={() => editRow(row)} className="text-brass-400 hover:text-brass-300" aria-label="Edit achievement"><FiEdit2 /></button><button type="button" onClick={() => setDeleting(row)} className="text-maroon-400 hover:text-maroon-300" aria-label="Delete achievement"><FiTrash2 /></button></>} />}
    </section>
    <ConfirmDialog open={!!deleting} onClose={() => setDeleting(null)} onConfirm={deleteRow} title="Delete achievement?" message="Are you sure you want to delete this achievement?" confirmLabel={actionBusy ? 'Deleting...' : 'Delete'} />
  </AdminDashboardLayout>;
};

export default AdminStudentAchievements;
