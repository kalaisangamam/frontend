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

  /* ============================================================
     LOAD MASTERS
  ============================================================ */

  const load = () =>
    adminService
      .getMastersAdmin()
      .then(({ data }) => setMasters(data.data))
      .catch(() => setError(true));

  useEffect(() => {
    load();
  }, []);

  /* ============================================================
     CREATE
  ============================================================ */

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFile(null);
    setModalOpen(true);
  };

  /* ============================================================
     EDIT
  ============================================================ */

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

  /* ============================================================
     SUBMIT
  ============================================================ */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (leadership && !file && !editing?.photo_url) {
      return showToast(
        "A profile image is required for leadership masters.",
        "error",
      );
    }

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

      if (leadership && file) {
        fd.append("photo", file);
      }

      if (editing) {
        await adminService.updateMaster(editing.id, fd);
      } else {
        await adminService.createMaster(fd);
      }

      showToast(
        editing
          ? "Master updated successfully."
          : "Master added successfully.",
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

  /* ============================================================
     DELETE
  ============================================================ */

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

  /* ============================================================
     FILTER
  ============================================================ */

  const leadershipMasters =
    masters?.filter(
      (master) => master.master_type === "leadership",
    ) || [];

  const programmeMasters =
    masters?.filter(
      (master) => master.master_type === "programme",
    ) || [];

  return (
    <AdminDashboardLayout>
      <AdminPageHeader
        title="Masters"
        subtitle="Leadership and programme-specific coaches."
        actionLabel="Add Master"
        onAction={openCreate}
      />

      {/* =========================================================
          LOADING
      ========================================================== */}

      {!masters && !error && (
        <SkeletonGrid
          count={4}
          className="sm:grid-cols-2 lg:grid-cols-4"
        />
      )}

      {/* =========================================================
          ERROR
      ========================================================== */}

      {error && (
        <ErrorState message="Couldn't load masters right now." />
      )}

      {/* =========================================================
          EMPTY
      ========================================================== */}

      {masters?.length === 0 && (
        <EmptyState message="No masters added yet." />
      )}

      {/* =========================================================
          MASTER LIST
      ========================================================== */}

      {masters?.length > 0 && (
        <div className="space-y-10">
          {/* =====================================================
              LEADERSHIP MASTERS
          ====================================================== */}

          {leadershipMasters.length > 0 && (
            <section aria-labelledby="leadership-masters-heading">
              <h2
                id="leadership-masters-heading"
                className="mb-5 font-display text-2xl text-parchment-100"
              >
                Leadership Masters
              </h2>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

          {/* =====================================================
              PROGRAMME COACHES
          ====================================================== */}

          {programmeMasters.length > 0 && (
            <section aria-labelledby="programme-masters-heading">
              <h2
                id="programme-masters-heading"
                className="mb-5 font-display text-2xl text-parchment-100"
              >
                Programme Coaches
              </h2>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* =========================================================
          ADD / EDIT MODAL
      ========================================================== */}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Master" : "Add Master"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Master Type */}

          <fieldset>
            <legend className="mb-2 text-xs text-slate-400">
              Master Type
            </legend>

            <div className="flex gap-5 text-sm text-parchment-100">
              <Radio
                label="Leadership"
                checked={leadership}
                onChange={() =>
                  setForm({
                    ...form,
                    master_type: "leadership",
                  })
                }
              />

              <Radio
                label="Programme Coach"
                checked={!leadership}
                onChange={() => {
                  setFile(null);

                  setForm({
                    ...form,
                    master_type: "programme",
                  });
                }}
              />
            </div>
          </fieldset>

          {/* Name */}

          <Field
            label="Name"
            value={form.name}
            onChange={(value) =>
              setForm({
                ...form,
                name: value,
              })
            }
            required
          />

          {/* =====================================================
              LEADERSHIP
          ====================================================== */}

          {leadership ? (
            <>
              <Field
                label="Role (Founder / Director / Head Coach)"
                value={form.role}
                onChange={(value) =>
                  setForm({
                    ...form,
                    role: value,
                  })
                }
                required
              />

              <Field
                label="Specialization"
                value={form.specialization}
                onChange={(value) =>
                  setForm({
                    ...form,
                    specialization: value,
                  })
                }
              />

              <Field
                label="Experience (years)"
                type="number"
                value={form.experience_years}
                onChange={(value) =>
                  setForm({
                    ...form,
                    experience_years: value,
                  })
                }
              />

              {/* Profile Image */}

              <div>
                <label className="mb-1.5 block text-xs text-slate-400">
                  Profile Image{" "}
                  {editing?.photo_url
                    ? "(replace optional)"
                    : ""}
                </label>

                <input
                  type="file"
                  accept="image/*"
                  required={!editing?.photo_url}
                  onChange={(e) =>
                    setFile(e.target.files[0])
                  }
                  className="text-sm text-slate-300"
                />
              </div>
            </>
          ) : (
            /* =====================================================
               PROGRAMME COACH
            ====================================================== */

            <>
              <Field
                label="Specialization"
                value={form.specialization}
                onChange={(value) =>
                  setForm({
                    ...form,
                    specialization: value,
                  })
                }
                required
              />

              <Field
                label="Experience (years)"
                type="number"
                value={form.experience_years}
                onChange={(value) =>
                  setForm({
                    ...form,
                    experience_years: value,
                  })
                }
              />
            </>
          )}

          {/* Display Order */}

          <Field
            label="Display Order"
            type="number"
            value={form.display_order}
            onChange={(value) =>
              setForm({
                ...form,
                display_order: value,
              })
            }
          />

          {/* Status */}

          <SelectField
            label="Status"
            value={form.status}
            onChange={(value) =>
              setForm({
                ...form,
                status: value,
              })
            }
          />

          {/* Submit */}

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full disabled:opacity-60"
          >
            {saving
              ? "Saving…"
              : editing
                ? "Update Master"
                : "Add Master"}
          </button>
        </form>
      </Modal>

      {/* =========================================================
          DELETE CONFIRMATION
      ========================================================== */}

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

/* ===============================================================
   MASTER CARD
   =============================================================== */

const MasterCard = ({ master, onEdit, onDelete }) => {
  const isLeadership =
    master.master_type === "leadership";

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-xl
        border
        border-parchment-100/10
        bg-ink-900
        shadow-lg
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-brass-400/30
        hover:shadow-xl
      "
    >
      {/* =========================================================
          LEADERSHIP PHOTO

          IMPORTANT:
          - Full card width
          - Large portrait
          - 4:5 portrait ratio
          - Top aligned
          - No inner photo box
          - No padding around image
      ========================================================== */}

      {isLeadership && (
        <div
          className="
            relative
            w-full
            aspect-[4/5]
            overflow-hidden
            bg-white
          "
        >
          {master.photo_url ? (
            <img
              src={master.photo_url}
              alt={`${master.name} profile`}
              loading="lazy"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-top
                transition-transform
                duration-500
                ease-out
                group-hover:scale-[1.015]
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                bg-ink-800
              "
            >
              <FiUser className="text-6xl text-slate-600" />
            </div>
          )}

          {/* Very subtle image bottom transition */}

          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-10
              bg-gradient-to-t
              from-black/15
              to-transparent
            "
          />
        </div>
      )}

      {/* =========================================================
          MASTER DETAILS
      ========================================================== */}

      <div className="p-4 sm:p-5">
        {/* Name */}

        <p
          className="
            font-display
            text-base
            leading-tight
            text-parchment-100
            sm:text-lg
          "
        >
          {master.name}
        </p>

        {/* Role / Programme */}

        <p
          className="
            mt-1
            text-xs
            font-medium
            text-brass-400
            sm:text-sm
          "
        >
          {isLeadership
            ? master.role
            : master.programme}
        </p>

        {/* Meta */}

        <p className="mt-1 text-xs text-slate-500">
          {isLeadership
            ? "Leadership"
            : "Programme Master"}{" "}
          &middot; Order: {master.display_order}{" "}
          &middot;{" "}
          <span
            className={
              master.status === "active"
                ? "text-emerald-400"
                : "text-slate-500"
            }
          >
            {master.status}
          </span>
        </p>

        {/* Actions */}

        <div
          className="
            mt-4
            flex
            gap-4
            border-t
            border-parchment-100/10
            pt-3
          "
        >
          <button
            type="button"
            onClick={() => onEdit(master)}
            className="
              text-xs
              font-medium
              text-brass-400
              transition-colors
              hover:text-brass-300
              hover:underline
              sm:text-sm
            "
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(master.id)
            }
            className="
              text-xs
              font-medium
              text-maroon-400
              transition-colors
              hover:text-red-400
              hover:underline
              sm:text-sm
            "
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

/* ===============================================================
   RADIO
   =============================================================== */

const Radio = ({
  label,
  checked,
  onChange,
}) => (
  <label className="flex cursor-pointer items-center gap-2">
    <input
      type="radio"
      checked={checked}
      onChange={onChange}
    />

    {label}
  </label>
);

/* ===============================================================
   FIELD
   =============================================================== */

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  required,
}) => (
  <div>
    <label className="mb-1.5 block text-xs text-slate-400">
      {label}
    </label>

    <input
      type={type}
      required={required}
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value)
      }
      className="
        w-full
        rounded-sm
        border
        border-parchment-100/10
        bg-ink-950
        px-4
        py-2.5
        text-sm
        text-parchment-100
        outline-none
        focus:border-brass-500
      "
    />
  </div>
);

/* ===============================================================
   TEXT AREA
   =============================================================== */

const TextArea = ({
  label,
  value,
  onChange,
}) => (
  <div>
    <label className="mb-1.5 block text-xs text-slate-400">
      {label}
    </label>

    <textarea
      rows={3}
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value)
      }
      className="
        w-full
        resize-none
        rounded-sm
        border
        border-parchment-100/10
        bg-ink-950
        px-4
        py-2.5
        text-sm
        text-parchment-100
        outline-none
        focus:border-brass-500
      "
    />
  </div>
);

/* ===============================================================
   SELECT
   =============================================================== */

const SelectField = ({
  label,
  value,
  onChange,
}) => (
  <div>
    <label className="mb-1.5 block text-xs text-slate-400">
      {label}
    </label>

    <select
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      className="
        w-full
        rounded-sm
        border
        border-parchment-100/10
        bg-ink-950
        px-4
        py-2.5
        text-sm
        text-parchment-100
        outline-none
        focus:border-brass-500
      "
    >
      <option value="active">
        Active
      </option>

      <option value="inactive">
        Inactive
      </option>
    </select>
  </div>
);

export default AdminMasters;