import React, { useEffect, useState } from 'react';
import { FiEdit2, FiPlayCircle } from 'react-icons/fi';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout.jsx';
import AdminPageHeader from '../../components/dashboard/admin/AdminPageHeader.jsx';
import Modal from '../../components/dashboard/admin/Modal.jsx';
import ConfirmDialog from '../../components/dashboard/admin/ConfirmDialog.jsx';
import { SkeletonGrid, ErrorState, EmptyState } from '../../components/common/StateViews.jsx';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext.jsx';

const CATEGORIES = ['Silambam', 'Karate', 'Yoga', 'Skating', 'Archery', 'Hindi', 'Training', 'Competitions', 'Events', 'Award Ceremony'];
const initialForm = { title: '', category: 'Training', media_type: 'image', display_order: 0 };

const AdminGallery = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => adminService.getGalleryAdmin().then(({ data }) => setItems(data.data)).catch(() => setError(true));
  useEffect(() => { load(); }, []);

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setForm(initialForm);
    setFile(null);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setForm(initialForm);
    setFile(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      title: item.title || '',
      category: item.category || 'Training',
      media_type: item.media_type || 'image',
      display_order: item.display_order ?? 0,
    });
    setFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem && !file) { showToast('Please choose a file to upload.', 'error'); return; }
    setSaving(true);
    try {
      if (editingItem) {
        await adminService.updateGalleryItem(editingItem.id, {
          title: form.title,
          category: form.category,
          display_order: Number(form.display_order) || 0,
        });
        showToast('Gallery item updated.');
      } else {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        fd.append('media', file);
        await adminService.createGalleryItem(fd);
        showToast('Gallery item added.');
      }
      closeModal();
      load();
    } catch (err) {
      showToast(err.response?.data?.message || `Failed to ${editingItem ? 'update' : 'upload'} media.`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteGalleryItem(confirmId);
      showToast('Gallery item deleted.');
      setConfirmId(null);
      load();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete.', 'error');
    }
  };

  return (
    <AdminDashboardLayout>
      <AdminPageHeader title="Gallery" subtitle="Images and videos, uploaded via Cloudinary." actionLabel="Upload Media" onAction={openCreateModal} />

      {!items && !error && <SkeletonGrid count={8} className="sm:grid-cols-3 lg:grid-cols-4" />}
      {error && <ErrorState message="Couldn't load the gallery right now." />}
      {items && items.length === 0 && <EmptyState message="No media uploaded yet." />}

      {items && items.length > 0 && (
        <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="card overflow-hidden relative group">
              <div className="aspect-square bg-ink-700">
                <img src={item.media_type === 'video' ? item.video_url : item.image_url} alt={item.title || item.category} className="w-full h-full object-cover" />
                {item.media_type === 'video' && <FiPlayCircle className="absolute inset-0 m-auto text-2xl text-parchment-100" />}
              </div>
              <div className="p-3">
                <p className="text-xs text-parchment-200 truncate">{item.title || item.category}</p>
                <p className="text-[11px] text-slate-500">{item.category} &middot; order {item.display_order}</p>
                <div className="mt-2 flex items-center gap-4">
                  <button onClick={() => openEditModal(item)} className="inline-flex items-center gap-1 text-xs font-medium text-brass-400 hover:text-brass-500">
                    <FiEdit2 aria-hidden="true" /> Edit
                  </button>
                  <button onClick={() => setConfirmId(item.id)} className="text-maroon-400 text-xs hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editingItem ? 'Edit Gallery Item' : 'Upload Media'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Title / Description</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none" />
          </div>
          {!editingItem && <>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Media Type</label>
              <select value={form.media_type} onChange={(e) => setForm({ ...form, media_type: e.target.value })} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none">
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">File</label>
              <input type="file" accept={form.media_type === 'video' ? 'video/*' : 'image/*'} onChange={(e) => setFile(e.target.files[0])} className="text-sm text-slate-300" required />
            </div>
          </>}
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Display Order</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full disabled:opacity-60">{saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Upload'}</button>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Delete Media" message="This file will be permanently removed from Cloudinary and the gallery." confirmLabel="Delete" />
    </AdminDashboardLayout>
  );
};

export default AdminGallery;
