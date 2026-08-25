import React, { useEffect, useState } from 'react';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout.jsx';
import AdminPageHeader from '../../components/dashboard/admin/AdminPageHeader.jsx';
import DataTable from '../../components/dashboard/admin/DataTable.jsx';
import Modal from '../../components/dashboard/admin/Modal.jsx';
import ConfirmDialog from '../../components/dashboard/admin/ConfirmDialog.jsx';
import { SkeletonGrid, ErrorState } from '../../components/common/StateViews.jsx';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext.jsx';
import { publicService } from '../../services/publicService';

const emptyForm = {
  title: '', description: '', event_date: '', last_date: '', registration_status: 'coming_soon',
  registration_link: '', qr_code_url: '', contact_info: '', show_on_hero: true,
  branch_id: '',
};

const AdminAnnouncements = () => {
  const { showToast } = useToast();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [branches, setBranches] = useState([]);

  const load = () => adminService.getAnnouncementsAdmin().then(({ data }) => setRows(data.data)).catch(() => setError(true));
  useEffect(() => { load(); }, []);
  useEffect(() => { publicService.getBranches().then(({ data }) => setBranches(data.data || [])).catch(() => setBranches([])); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFile(null); setModalOpen(true); };
  const openEdit = (a) => { const { branches: _branch, ...announcement } = a; setEditing(a); setForm({ ...emptyForm, ...announcement }); setFile(null); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''));
      if (file) fd.append('image', file);

      if (editing) {
        await adminService.updateAnnouncement(editing.id, fd);
        showToast('Announcement updated.');
      } else {
        await adminService.createAnnouncement(fd);
        showToast('Announcement created.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save announcement.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteAnnouncement(confirmId);
      showToast('Announcement deleted.');
      setConfirmId(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete.', 'error');
    }
  };

  return (
    <AdminDashboardLayout>
      <AdminPageHeader title="Flash News" subtitle="Choose whether each update is common or visible for a specific branch." actionLabel="Add Flash News" onAction={openCreate} />

      {!rows && !error && <SkeletonGrid count={3} />}
      {error && <ErrorState message="Couldn't load announcements right now." />}

      {rows && (
        <DataTable
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'registration_status', label: 'Status' },
            { key: 'branch_id', label: 'Display Branch', render: (r) => r.branches?.name || 'Common' },
            { key: 'show_on_hero', label: 'On Hero', render: (r) => (r.show_on_hero ? 'Yes' : 'No') },
          ]}
          rows={rows}
          emptyMessage="No announcements yet."
          actions={(r) => (
            <>
              <button onClick={() => openEdit(r)} className="text-brass-400 text-xs hover:underline">Edit</button>
              <button onClick={() => setConfirmId(r.id)} className="text-maroon-400 text-xs hover:underline">Delete</button>
            </>
          )}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Flash News' : 'Add Flash News'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400 mb-1.5 block">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Display Branch</label>
            <select value={form.branch_id || ''} onChange={(e) => setForm({ ...form, branch_id: e.target.value })} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none">
              <option value="">Common</option>
              {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400 mb-1.5 block">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none resize-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400 mb-1.5 block">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm text-slate-300" />
          </div>
          <Field label="Event Date" type="date" value={form.event_date} onChange={(v) => setForm({ ...form, event_date: v })} />
          <Field label="Last Date to Register" type="date" value={form.last_date} onChange={(v) => setForm({ ...form, last_date: v })} />
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Registration Status</label>
            <select value={form.registration_status} onChange={(e) => setForm({ ...form, registration_status: e.target.value })} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none">
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>
          <Field label="Registration Link" value={form.registration_link} onChange={(v) => setForm({ ...form, registration_link: v })} />
          <Field label="QR Code URL" value={form.qr_code_url} onChange={(v) => setForm({ ...form, qr_code_url: v })} />
          <Field label="Contact Info" value={form.contact_info} onChange={(v) => setForm({ ...form, contact_info: v })} />
          <label className="flex items-center gap-2 sm:col-span-2 text-sm text-slate-300">
            <input type="checkbox" checked={!!form.show_on_hero} onChange={(e) => setForm({ ...form, show_on_hero: e.target.checked })} />
            Show on Hero section
          </label>
          <button type="submit" disabled={saving} className="btn-primary sm:col-span-2 disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Update' : 'Create'}</button>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Delete Announcement" message="This announcement will be removed from the Hero card and Announcements section." confirmLabel="Delete" />
    </AdminDashboardLayout>
  );
};

const Field = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="text-xs text-slate-400 mb-1.5 block">{label}</label>
    <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none" />
  </div>
);

export default AdminAnnouncements;
