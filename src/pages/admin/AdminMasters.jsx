import React, { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import AdminDashboardLayout from "../../layouts/AdminDashboardLayout.jsx";
import AdminPageHeader from "../../components/dashboard/admin/AdminPageHeader.jsx";
import Modal from "../../components/dashboard/admin/Modal.jsx";
import ConfirmDialog from "../../components/dashboard/admin/ConfirmDialog.jsx";
import {
  SkeletonGrid,
  ErrorState,
  EmptyState,
} from "../../components/common/StateViews.jsx";
import { adminService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext.jsx";

const emptyForm = {
  master_type: "programme",
  name: "",
  role: "",
  programme: "Master",
  specialization: "",
  experience_years: "",
  bio: "",
  display_order: 0,
  status: "active",
};

const AdminMasters = () => {
  const { showToast } = useToast();
  const [masters, setMasters] = useState(null);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);
  const leadership = form.master_type === "leadership";

  const load = () =>
    adminService
      .getMastersAdmin()
      .then(({ data }) => setMasters(data.data))
      .catch(() => setError(true));
  useEffect(() => {
    load();
  }, []);
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setModalOpen(true);
  };
  const openEdit = (master) => {
    setEditing(master);
    setForm({
      ...emptyForm,
      ...master,
      master_type: master.master_type || "programme",
      programme: master.programme || "Master",
    });
    setFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (leadership && !file && !editing?.photo_url)
      return showToast(
        "A profile image is required for leadership masters.",
        "error",
      );
    setSaving(true);
    try {
      const fd = new FormData();
      const payload = {
        ...form,
        role: leadership ? form.role : form.role || "Master",
        programme: leadership ? "" : form.programme || "Master",
      };
      Object.entries(payload).forEach(([key, value]) =>
        fd.append(key, value ?? ""),
      );
      if (leadership && file) fd.append("photo", file);
      if (editing) await adminService.updateMaster(editing.id, fd);
      else await adminService.createMaster(fd);
      showToast(
        editing ? "Master updated successfully." : "Master added successfully.",
      );
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to save master.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminService.deleteMaster(confirmId);
      showToast("Master deleted.");
      setConfirmId(null);
      load();
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to delete master.",
        "error",
      );
    }
  };

  const leadershipMasters =
    masters?.filter((master) => master.master_type === "leadership") || [];
  const programmeMasters =
    masters?.filter((master) => master.master_type === "programme") || [];

  return (
    <AdminDashboardLayout>
      <AdminPageHeader
        title="Masters"
        subtitle="Leadership and programme-specific coaches."
        actionLabel="Add Master"
        onAction={openCreate}
      />
      {!masters && !error && (
        <SkeletonGrid count={4} className="sm:grid-cols-2 lg:grid-cols-4" />
      )}
      {error && <ErrorState message="Couldn't load masters right now." />}
      {masters?.length === 0 && <EmptyState message="No masters added yet." />}
      {masters?.length > 0 && (
        <div className="space-y-10">
          {leadershipMasters.length > 0 && (
            <section aria-labelledby="leadership-masters-heading">
              <h2
                id="leadership-masters-heading"
                className="mb-5 font-display text-2xl text-parchment-100"
              >
                Leadership Masters
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {leadershipMasters.map((master) => (
                  <MasterCard
                    key={master.id}
                    master={master}
                    onEdit={openEdit}
                    onDelete={setConfirmId}
                  />
                ))}
              </div>
            </section>
          )}
          {programmeMasters.length > 0 && (
            <section aria-labelledby="programme-masters-heading">
              <h2
                id="programme-masters-heading"
                className="mb-5 font-display text-2xl text-parchment-100"
              >
                Programme Coaches
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {programmeMasters.map((master) => (
                  <MasterCard
                    key={master.id}
                    master={master}
                    onEdit={openEdit}
                    onDelete={setConfirmId}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Master" : "Add Master"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <fieldset>
            <legend className="text-xs text-slate-400 mb-2">Master Type</legend>
            <div className="flex gap-5 text-sm text-parchment-100">
              <Radio
                label="Leadership"
                checked={leadership}
                onChange={() => setForm({ ...form, master_type: "leadership" })}
              />
              <Radio
                label="Programme Coach"
                checked={!leadership}
                onChange={() => {
                  setFile(null);
                  setForm({ ...form, master_type: "programme" });
                }}
              />
            </div>
          </fieldset>
          <Field
            label="Name"
            value={form.name}
            onChange={(value) => setForm({ ...form, name: value })}
            required
          />
          {leadership ? (
            <>
              <Field
                label="Role (Founder / Director / Head Coach)"
                value={form.role}
                onChange={(value) => setForm({ ...form, role: value })}
                required
              />
              <Field
                label="Specialization"
                value={form.specialization}
                onChange={(value) =>
                  setForm({ ...form, specialization: value })
                }
              />
              <Field
                label="Experience (years)"
                type="number"
                value={form.experience_years}
                onChange={(value) =>
                  setForm({ ...form, experience_years: value })
                }
              />
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">
                  Profile Image {editing?.photo_url ? "(replace optional)" : ""}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required={!editing?.photo_url}
                  onChange={(e) => setFile(e.target.files[0])}
                  className="text-sm text-slate-300"
                />
              </div>
            </>
          ) : (
            <>
              <Field
                label="Specialization"
                value={form.specialization}
                onChange={(value) =>
                  setForm({ ...form, specialization: value })
                }
                required
              />
              <Field
                label="Experience (years)"
                type="number"
                value={form.experience_years}
                onChange={(value) =>
                  setForm({ ...form, experience_years: value })
                }
              />
            </>
          )}
          <Field
            label="Display Order"
            type="number"
            value={form.display_order}
            onChange={(value) => setForm({ ...form, display_order: value })}
          />
          <SelectField
            label="Status"
            value={form.status}
            onChange={(value) => setForm({ ...form, status: value })}
          />
          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full disabled:opacity-60"
          >
            {saving ? "Saving…" : editing ? "Update Master" : "Add Master"}
          </button>
        </form>
      </Modal>
      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Master"
        message="This master profile and their Cloudinary photo will be permanently removed."
        confirmLabel="Delete"
      />
    </AdminDashboardLayout>
  );
};

const MasterCard = ({ master, onEdit, onDelete }) => (
  <div className="card overflow-hidden">
    {master.master_type === "leadership" && (
      <div className="h-40 bg-ink-700 flex items-center justify-center">
        {master.photo_url ? (
          <img
            src={master.photo_url}
            alt={master.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <FiUser className="text-4xl text-slate-600" />
        )}
      </div>
    )}
    <div className="p-4">
      <p className="font-display text-parchment-100">{master.name}</p>
      <p className="text-xs text-brass-400">
        {master.master_type === "leadership" ? master.role : master.programme}
      </p>
      <p className="text-xs text-slate-500 mt-1">
        {master.master_type === "leadership"
          ? "Leadership"
          : "Programme Master"}{" "}
        &middot; Order: {master.display_order} &middot; {master.status}
      </p>
      <div className="flex gap-3 mt-3">
        <button
          onClick={() => onEdit(master)}
          className="text-brass-400 text-xs hover:underline"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(master.id)}
          className="text-maroon-400 text-xs hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

const Radio = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="radio" checked={checked} onChange={onChange} />
    {label}
  </label>
);
const Field = ({ label, value, onChange, type = "text", required }) => (
  <div>
    <label className="text-xs text-slate-400 mb-1.5 block">{label}</label>
    <input
      type={type}
      required={required}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none"
    />
  </div>
);
const TextArea = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs text-slate-400 mb-1.5 block">{label}</label>
    <textarea
      rows={3}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none resize-none"
    />
  </div>
);
const SelectField = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs text-slate-400 mb-1.5 block">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none"
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  </div>
);

export default AdminMasters;
