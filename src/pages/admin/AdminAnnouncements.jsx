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
  description: '', branch_id: '',
};

const AdminAnnouncements = () => {
  const { showToast } = useToast();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [branches, setBranches] = useState([]);

  const load = () => adminService.getAnnouncementsAdmin().then(({ data }) => setRows(data.data)).catch(() => setError(true));
  useEffect(() => { load(); }, []);
  useEffect(() => { publicService.getBranches().then(({ data }) => setBranches(data.data || [])).catch(() => setBranches([])); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (a) => { setEditing(a); setForm({ description: a.description || a.title || '', branch_id: a.branch_id || '' }); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ''));
      // Flash News is always surfaced in the Hero card.
      fd.append('show_on_hero', 'true');
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
      <AdminPageHeader title="Flash News" subtitle="Publish a short update for everyone or a selected branch." actionLabel="Add Flash News" onAction={openCreate} />

      {!rows && !error && <SkeletonGrid count={3} />}
      {error && <ErrorState message="Couldn't load announcements right now." />}

      {rows && (
        <DataTable
          columns={[
            { key: 'description', label: 'Description', render: (r) => r.description || r.title },
            { key: 'branch_id', label: 'Display Branch', render: (r) => r.branches?.name || 'Common' },
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Flash News' : 'Add Flash News'} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Display Branch</label>
            <select value={form.branch_id || ''} onChange={(e) => setForm({ ...form, branch_id: e.target.value })} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none">
              <option value="">Common</option>
              {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Description</label>
            <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Write the flash news update..." className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none resize-none" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saving…' : editing ? 'Update' : 'Publish Flash News'}</button>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Delete Announcement" message="This announcement will be removed from the Hero card and Announcements section." confirmLabel="Delete" />
    </AdminDashboardLayout>
  );
};

export default AdminAnnouncements;
