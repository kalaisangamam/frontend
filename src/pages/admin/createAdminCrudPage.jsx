import React, { useEffect, useState } from 'react';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout.jsx';
import AdminPageHeader from '../../components/dashboard/admin/AdminPageHeader.jsx';
import DataTable from '../../components/dashboard/admin/DataTable.jsx';
import Modal from '../../components/dashboard/admin/Modal.jsx';
import ConfirmDialog from '../../components/dashboard/admin/ConfirmDialog.jsx';
import { SkeletonGrid, ErrorState } from '../../components/common/StateViews.jsx';
import { useToast } from '../../context/ToastContext.jsx';

/**
 * Builds a full admin CRUD page (list + add/edit modal + delete confirm)
 * from a field/column config. Used for Programs, Achievements, FAQs and
 * Testimonials, which are all simple flat-record resources.
 *
 * fields: [{ key, label, type: 'text'|'textarea'|'number'|'select'|'tags', options?, required? }]
 * columns: [{ key, label, render? }] — for the list table
 */
const createAdminCrudPage = ({ title, subtitle, fields, columns, service, emptyForm }) => {
  const Page = () => {
    const { showToast } = useToast();
    const [rows, setRows] = useState(null);
    const [error, setError] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [confirmId, setConfirmId] = useState(null);
    const [saving, setSaving] = useState(false);

    const load = () => service.list().then(({ data }) => setRows(data.data)).catch(() => setError(true));
    useEffect(() => { load(); }, []);

    const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
    const openEdit = (row) => { setEditing(row); setForm({ ...emptyForm, ...row }); setModalOpen(true); };

    const handleChange = (key, value, type) => {
      setForm((f) => ({ ...f, [key]: type === 'tags' ? value.split(',').map((s) => s.trim()).filter(Boolean) : value }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSaving(true);
      try {
        const payload = { ...form };
        fields.filter((f) => f.type === 'tags').forEach((f) => {
          if (typeof payload[f.key] === 'string') {
            payload[f.key] = payload[f.key].split(',').map((s) => s.trim()).filter(Boolean);
          }
        });
        if (editing) {
          await service.update(editing.id, payload);
          showToast(`${title.slice(0, -1)} updated successfully.`);
        } else {
          await service.create(payload);
          showToast(`${title.slice(0, -1)} added successfully.`);
        }
        setModalOpen(false);
        load();
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to save.', 'error');
      } finally {
        setSaving(false);
      }
    };

    const handleDelete = async () => {
      try {
        await service.remove(confirmId);
        showToast('Deleted successfully.');
        setConfirmId(null);
        load();
      } catch (err) {
        showToast(err.response?.data?.message || 'Failed to delete.', 'error');
      }
    };

    return (
      <AdminDashboardLayout>
        <AdminPageHeader title={title} subtitle={subtitle} actionLabel={`Add ${title.slice(0, -1)}`} onAction={openCreate} />

        {!rows && !error && <SkeletonGrid count={3} />}
        {error && <ErrorState message={`Couldn't load ${title.toLowerCase()} right now.`} />}

        {rows && (
          <DataTable
            columns={columns}
            rows={rows}
            emptyMessage={`No ${title.toLowerCase()} added yet.`}
            actions={(r) => (
              <>
                <button onClick={() => openEdit(r)} className="text-brass-400 text-xs hover:underline">Edit</button>
                <button onClick={() => setConfirmId(r.id)} className="text-maroon-400 text-xs hover:underline">Delete</button>
              </>
            )}
          />
        )}

        <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-slate-400 mb-1.5 block">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    required={f.required}
                    value={form[f.key] ?? ''}
                    onChange={(e) => handleChange(f.key, e.target.value, f.type)}
                    className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none resize-none"
                  />
                ) : f.type === 'select' ? (
                  <select
                    required={f.required}
                    value={form[f.key] ?? ''}
                    onChange={(e) => handleChange(f.key, e.target.value, f.type)}
                    className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none"
                  >
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type === 'number' ? 'number' : 'text'}
                    required={f.required}
                    value={f.type === 'tags' ? (Array.isArray(form[f.key]) ? form[f.key].join(', ') : form[f.key] ?? '') : form[f.key] ?? ''}
                    onChange={(e) => handleChange(f.key, e.target.value, f.type)}
                    placeholder={f.type === 'tags' ? 'Comma-separated' : undefined}
                    className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none"
                  />
                )}
              </div>
            ))}
            <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">
              {saving ? 'Saving…' : editing ? 'Update' : 'Add'}
            </button>
          </form>
        </Modal>

        <ConfirmDialog
          open={!!confirmId}
          onClose={() => setConfirmId(null)}
          onConfirm={handleDelete}
          title={`Delete ${title.slice(0, -1)}`}
          message="This will be permanently removed."
          confirmLabel="Delete"
        />
      </AdminDashboardLayout>
    );
  };

  return Page;
};

export default createAdminCrudPage;
