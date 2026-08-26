import React, { useEffect, useState } from 'react';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout.jsx';
import AdminPageHeader from '../../components/dashboard/admin/AdminPageHeader.jsx';
import DataTable from '../../components/dashboard/admin/DataTable.jsx';
import Modal from '../../components/dashboard/admin/Modal.jsx';
import ConfirmDialog from '../../components/dashboard/admin/ConfirmDialog.jsx';
import { SkeletonGrid, ErrorState } from '../../components/common/StateViews.jsx';
import { adminService } from '../../services/adminService';
import { publicService } from '../../services/publicService';
import { useToast } from '../../context/ToastContext.jsx';

const emptyForm = {
  username: '', password: '', email: '', full_name: '', date_of_birth: '',
  gender: '', parent_name: '', parent_contact: '', contact_number: '',
  address: '', blood_group: '', emergency_contact: '', joining_date: '', program_id: '', program_ids: [],
};

const AdminStudents = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState(null);
  const [requests, setRequests] = useState(null);
  const [error, setError] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [programs, setPrograms] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadStudents = () => {
    adminService
      .getStudents(search ? { search } : {})
      .then(({ data }) => {
        setStudents(data.data);
        setError(false);
      })
      .catch(() => setError(true));
  };

  const loadRequests = () => {
    adminService
      .getStudentRequests({ status: 'pending' })
      .then(({ data }) => {
        setRequests(data.data);
        setRequestError(false);
      })
      .catch(() => setRequestError(true));
  };

  useEffect(() => { loadStudents(); }, [search]);
  useEffect(() => { loadRequests(); }, []);
  useEffect(() => {
    publicService.getPrograms().then(({ data }) => setPrograms(data.data)).catch(() => setPrograms([]));
  }, []);

  const toggleProgramSelection = (programId) => {
    setForm((current) => {
      const selectedProgramIds = current.program_ids.includes(programId)
        ? current.program_ids.filter((id) => id !== programId)
        : [...current.program_ids, programId];

      return {
        ...current,
        program_ids: selectedProgramIds,
        program_id: selectedProgramIds[0] || '',
      };
    });
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (student) => {
    setEditing(student);
    const selectedPrograms = student.student_programs?.map((item) => item.program_id) || [];
    setForm({ ...emptyForm, ...student, username: student.users?.username || '', program_ids: selectedPrograms, program_id: selectedPrograms[0] || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedProgramIds = form.program_ids.filter(Boolean);
    if (!selectedProgramIds.length) {
      showToast('Please select at least one program.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        program_ids: selectedProgramIds,
        program_id: selectedProgramIds[0],
      };

      if (editing) {
        await adminService.updateStudent(editing.id, payload);
        showToast('Student updated successfully.');
      } else {
        await adminService.createStudent(payload);
        showToast('Student created successfully.');
      }
      setModalOpen(false);
      loadStudents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save student.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirm) return;
    try {
      if (confirm.type === 'remove') {
        await adminService.deactivateStudent(confirm.id);
        showToast('Student removed.');
        loadStudents();
      }
      if (confirm.type === 'delete') {
        await adminService.deleteStudent(confirm.id);
        showToast('Student permanently deleted.');
        if (editing?.id === confirm.id) setModalOpen(false);
        loadStudents();
      }
      if (confirm.type === 'approve') {
        await adminService.approveStudentRequest(confirm.id);
        showToast('Registration request approved.');
        loadStudents();
        loadRequests();
      }
      if (confirm.type === 'reject') {
        await adminService.rejectStudentRequest(confirm.id);
        showToast('Registration request rejected.');
        loadRequests();
      }
      setConfirm(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed.', 'error');
    }
  };

  const pendingCount = requests?.length || 0;

  return (
    <AdminDashboardLayout>
      <AdminPageHeader title="Students" subtitle="Manage student accounts and review registration requests." actionLabel="Add Student" onAction={openCreate} />

      <div className="mb-6 flex flex-wrap items-center gap-3 border-b border-parchment-100/10">
        <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')}>
          Students
        </TabButton>
        <TabButton active={activeTab === 'requests'} onClick={() => setActiveTab('requests')}>
          Requests{pendingCount ? ` (${pendingCount})` : ''}
        </TabButton>
      </div>

      {activeTab === 'students' && (
        <>
          <input
            placeholder="Search by name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mb-6 w-full sm:w-72 bg-ink-900 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none"
          />

          {!students && !error && <SkeletonGrid count={4} />}
          {error && <ErrorState message="Couldn't load students right now." />}

          {students && (
            <DataTable
              columns={[
                { key: 'student_code', label: 'ID' },
                { key: 'full_name', label: 'Name' },
                { key: 'contact_number', label: 'Contact' },
                { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
              ]}
              rows={students}
              emptyMessage="No students found."
              actions={(row) => (
                <>
                  <button onClick={() => openEdit(row)} className="text-brass-400 text-xs hover:underline">Edit</button>
                  <button onClick={() => setConfirm({ type: 'remove', id: row.id })} className="text-slate-400 text-xs hover:underline">Deactivate</button>
                  <button onClick={() => setConfirm({ type: 'delete', id: row.id, name: row.full_name })} className="text-maroon-400 text-xs hover:underline">Delete</button>
                </>
              )}
            />
          )}
        </>
      )}

      {activeTab === 'requests' && (
        <>
          {!requests && !requestError && <SkeletonGrid count={3} />}
          {requestError && <ErrorState message="Couldn't load student requests right now." />}

          {requests && (
            <DataTable
              columns={[
                { key: 'created_at', label: 'Requested', render: (row) => formatDate(row.created_at) },
                { key: 'full_name', label: 'Name' },
                { key: 'username', label: 'Username' },
                { key: 'contact_number', label: 'Contact' },
                { key: 'parent_name', label: 'Parent' },
              ]}
              rows={requests}
              emptyMessage="No pending registration requests."
              actions={(row) => (
                <>
                  <button onClick={() => setConfirm({ type: 'approve', id: row.id })} className="text-brass-400 text-xs hover:underline">Approve</button>
                  <button onClick={() => setConfirm({ type: 'reject', id: row.id })} className="text-maroon-400 text-xs hover:underline">Reject</button>
                </>
              )}
            />
          )}
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Student' : 'Add Student'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          {!editing && (
            <>
              <Field label="Username" value={form.username} onChange={(value) => setForm({ ...form, username: value })} required />
              <Field label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} required />
            </>
          )}
          <Field label="Full Name" value={form.full_name} onChange={(value) => setForm({ ...form, full_name: value })} required />
          <Field label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
            <Field label="Contact Number" value={form.contact_number} onChange={(value) => setForm({ ...form, contact_number: value })} />
          
          <Field label="Date of Birth" type="date" value={form.date_of_birth} onChange={(value) => setForm({ ...form, date_of_birth: value })} />
          <Field label="Gender" value={form.gender} onChange={(value) => setForm({ ...form, gender: value })} />
          <Field label="Parent Name" value={form.parent_name} onChange={(value) => setForm({ ...form, parent_name: value })} />
          <Field label="Parent Contact" value={form.parent_contact} onChange={(value) => setForm({ ...form, parent_contact: value })} />
          
          <Field label="Blood Group" value={form.blood_group} onChange={(value) => setForm({ ...form, blood_group: value })} />
          {/* <Field label="Emergency Contact" value={form.emergency_contact} onChange={(value) => setForm({ ...form, emergency_contact: value })} /> */}
          <Field label="Joining Date" type="date" value={form.joining_date} onChange={(value) => setForm({ ...form, joining_date: value })} />
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400 mb-2 block">Programs</label>
            <div className="grid sm:grid-cols-2 gap-2">
              {programs.map((program) => (
                <label key={program.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-parchment-100/10 bg-ink-950/60 px-4 py-3 text-sm text-parchment-100 transition-all hover:-translate-y-0.5 hover:border-brass-500/60 hover:bg-ink-900 has-[:checked]:border-brass-500/70 has-[:checked]:bg-brass-500/10 has-[:checked]:text-brass-300">
                  <input
                    type="checkbox"
                    checked={form.program_ids.includes(program.id)}
                    onChange={() => toggleProgramSelection(program.id)}
                    className="h-4 w-4 accent-brass-500"
                  />
                  <span>{program.name}</span>
                </label>
              ))}
            </div>
          </div>
          <Field label="Address" value={form.address} onChange={(value) => setForm({ ...form, address: value })} className="sm:col-span-2" />

          <button type="submit" disabled={saving} className="btn-primary sm:col-span-2 disabled:opacity-60">
            {saving ? 'Saving...' : editing ? 'Update Student' : 'Create Student'}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirm}
        title={confirmTitle(confirm)}
        message={confirmMessage(confirm)}
        confirmLabel={confirmLabel(confirm)}
        danger={confirm?.type !== 'approve'}
      />
    </AdminDashboardLayout>
  );
};

const TabButton = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-1 pb-3 text-sm font-display uppercase tracking-wide border-b-2 transition-colors ${
      active ? 'border-brass-500 text-brass-400' : 'border-transparent text-slate-500 hover:text-parchment-200'
    }`}
  >
    {children}
  </button>
);

const StatusBadge = ({ status }) => (
  <span className={`capitalize text-xs px-2.5 py-1 rounded-full border ${
    status === 'active' ? 'border-brass-500/30 text-brass-400' : 'border-slate-500/30 text-slate-400'
  }`}>
    {status}
  </span>
);

const Field = ({ label, value, onChange, type = 'text', required, className = '' }) => (
  <div className={className}>
    <label className="text-xs text-slate-400 mb-1.5 block">{label}</label>
    <input
      type={type}
      required={required}
      value={value || ''}
      onChange={(event) => onChange(event.target.value)}
      className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none"
    />
  </div>
);

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');

const confirmTitle = (confirm) => {
  if (confirm?.type === 'approve') return 'Approve Request';
  if (confirm?.type === 'reject') return 'Reject Request';
  if (confirm?.type === 'delete') return 'Delete Student Permanently?';
  return 'Deactivate Student';
};

const confirmMessage = (confirm) => {
  if (confirm?.type === 'approve') return 'This will create an active student account from the request.';
  if (confirm?.type === 'reject') return 'This registration request will be rejected.';
  if (confirm?.type === 'delete') return 'This will permanently delete the student and their related records. This action cannot be undone.';
  return 'This student will be marked inactive and lose dashboard access.';
};

const confirmLabel = (confirm) => {
  if (confirm?.type === 'approve') return 'Approve';
  if (confirm?.type === 'reject') return 'Reject';
  if (confirm?.type === 'delete') return 'Delete Permanently';
  return 'Deactivate';
};

export default AdminStudents;
