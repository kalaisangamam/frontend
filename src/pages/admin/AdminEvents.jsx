import React, { useEffect, useState } from 'react';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout.jsx';
import AdminPageHeader from '../../components/dashboard/admin/AdminPageHeader.jsx';
import DataTable from '../../components/dashboard/admin/DataTable.jsx';
import Modal from '../../components/dashboard/admin/Modal.jsx';
import ConfirmDialog from '../../components/dashboard/admin/ConfirmDialog.jsx';
import { SkeletonGrid, ErrorState } from '../../components/common/StateViews.jsx';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext.jsx';

const emptyForm = {
  title: '',
  description: '',
  event_date: '',
  last_date: '',
  registration_status: 'coming_soon',
  registration_link: '',
  qr_code_url: '',
  contact_info: '',
  image_url: '',
  show_on_hero: false,
};

const AdminEvents = () => {
  const { showToast } = useToast();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const load = () => adminService.getEventsAdmin().then(({ data }) => setRows(data.data)).catch(() => setError(true));
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setModalOpen(true); };
  const openEdit = (eventItem) => { setEditing(eventItem); setForm({ ...emptyForm, ...eventItem }); setImageFile(null); setModalOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = new FormData();
      Object.entries(emptyForm).forEach(([key]) => {
        const value = form[key];
        payload.append(key, value ?? '');
      });
      if (imageFile) payload.append('image', imageFile);
      if (editing) {
        await adminService.updateEvent(editing.id, payload);
        showToast('Event updated.');
      } else {
        await adminService.createEvent(payload);
        showToast('Event created.');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save event.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseRegistration = async (id) => {
    try {
      await adminService.closeEventRegistration(id);
      showToast('Registration closed.');
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to close registration.', 'error');
    }
  };

  const handleConfirmAction = async () => {
    try {
      if (confirm.action === 'archive') {
        await adminService.archiveEvent(confirm.id);
        showToast('Event archived.');
      } else {
        await adminService.deleteEvent(confirm.id);
        showToast('Event permanently deleted.');
      }
      setConfirm(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed.', 'error');
    }
  };

  return (
    <AdminDashboardLayout>
      <AdminPageHeader title="Events" subtitle="Belt tests, championships, camps and other academy events." actionLabel="Add Event" onAction={openCreate} />

      {!rows && !error && <SkeletonGrid count={3} />}
      {error && <ErrorState message="Couldn't load events right now." />}

      {rows && (
        <DataTable
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'event_date', label: 'Date', render: (r) => new Date(r.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            { key: 'registration_status', label: 'Registration' },
            { key: 'show_on_hero', label: 'Hero', render: (r) => (r.show_on_hero ? 'Yes' : 'No') },
            { key: 'status', label: 'Status' },
          ]}
          rows={rows}
          emptyMessage="No events yet."
          actions={(r) => (
            <>
              <button onClick={() => openEdit(r)} className="text-brass-400 text-xs hover:underline">Edit</button>
              {r.registration_status !== 'closed' && (
                <button onClick={() => handleCloseRegistration(r.id)} className="text-slate-400 text-xs hover:underline">Close Reg.</button>
              )}
              {r.status !== 'archived' && (
                <button onClick={() => setConfirm({ id: r.id, action: 'archive' })} className="text-brass-400 text-xs hover:underline">Archive</button>
              )}
              <button onClick={() => setConfirm({ id: r.id, action: 'delete' })} className="text-maroon-400 text-xs hover:underline">Delete</button>
            </>
          )}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Event' : 'Add Event'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400 mb-1.5 block">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400 mb-1.5 block">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none resize-none" />
          </div>
          <Field label="Event Date" type="date" value={form.event_date} onChange={(v) => setForm({ ...form, event_date: v })} required />
          <Field label="Last Date to Register" type="date" value={form.last_date} onChange={(v) => setForm({ ...form, last_date: v })} />
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Registration Status</label>
            <select value={form.registration_status} onChange={(e) => setForm({ ...form, registration_status: e.target.value })} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none">
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="coming_soon">Coming Soon</option>
            </select>
          </div>
          {/* <Field label="Contact Info" value={form.contact_info} onChange={(v) => setForm({ ...form, contact_info: v })} /> */}
          <Field label="Registration Link" value={form.registration_link} onChange={(v) => setForm({ ...form, registration_link: v })} />
          {/* <Field label="QR Code URL" value={form.qr_code_url} onChange={(v) => setForm({ ...form, qr_code_url: v })} /> */}
          <div className="sm:col-span-2">
            <label className="text-xs text-slate-400 mb-1.5 block">Event Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-slate-300" />
            <p className="mt-1 text-[11px] text-slate-500">{imageFile ? imageFile.name : editing && form.image_url ? 'Leave empty to keep the current image.' : 'Optional. JPG, PNG, WebP, or GIF.'}</p>
          </div>
          <label className="flex items-center gap-2 sm:col-span-2 text-sm text-slate-300">
            <input type="checkbox" checked={!!form.show_on_hero} onChange={(e) => setForm({ ...form, show_on_hero: e.target.checked })} />
            Show this event in the Hero section
          </label>

          <button type="submit" disabled={saving} className="btn-primary sm:col-span-2 disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirmAction}
        title={confirm?.action === 'archive' ? 'Archive Event' : 'Delete Event'}
        message={
          confirm?.action === 'archive'
            ? 'This event will be moved out of the public Upcoming Events list but kept on record.'
            : 'This event will be permanently deleted. This cannot be undone.'
        }
        confirmLabel={confirm?.action === 'archive' ? 'Archive' : 'Delete'}
      />
    </AdminDashboardLayout>
  );
};

const Field = ({ label, value, onChange, type = 'text', required, className = '' }) => (
  <div className={className}>
    <label className="text-xs text-slate-400 mb-1.5 block">{label}</label>
    <input type={type} required={required} value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none" />
  </div>
);

export default AdminEvents;
