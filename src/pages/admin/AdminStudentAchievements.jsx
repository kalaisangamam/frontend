import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiAward,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiEdit2,
  FiFilter,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import AdminDashboardLayout from "../../layouts/AdminDashboardLayout.jsx";
import ConfirmDialog from "../../components/dashboard/admin/ConfirmDialog.jsx";
import { EmptyState, ErrorState } from "../../components/common/StateViews.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { adminService } from "../../services/adminService";
import { publicService } from "../../services/publicService";

const today = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};
const blankForm = () => ({
  program_id: "",
  student_id: "",
  achievement_date: today(),
  title: "",
  achievement: "",
});
const displayDate = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const AdminStudentAchievements = () => {
  const { showToast } = useToast();
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [filters, setFilters] = useState({
    program_id: "",
    student_id: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);
  const [referenceError, setReferenceError] = useState(false);
  const [listError, setListError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [existingOpen, setExistingOpen] = useState(false);

  const enrolledStudents = useMemo(
    () =>
      students.filter((student) =>
        student.student_programs?.some(
          (enrollment) =>
            enrollment.program_id === form.program_id &&
            enrollment.status === "active",
        ),
      ),
    [students, form.program_id],
  );
  const filterStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          !filters.program_id ||
          student.student_programs?.some(
            (enrollment) =>
              enrollment.program_id === filters.program_id &&
              enrollment.status === "active",
          ),
      ),
    [students, filters.program_id],
  );

  const loadRows = useCallback(async () => {
    setLoading(true);
    setListError(false);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value),
      );
      const { data } = await adminService.getStudentAchievementsAdmin(params);
      setRows(data.data || []);
    } catch {
      setListError(true);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    Promise.all([
      publicService.getPrograms(),
      adminService.getStudents({ status: "active" }),
    ])
      .then(([programResult, studentResult]) => {
        setPrograms(programResult.data.data || []);
        setStudents(studentResult.data.data || []);
      })
      .catch(() => setReferenceError(true));
  }, []);
  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const updateForm = (key, value) =>
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "program_id" ? { student_id: "" } : {}),
    }));
  const clearForm = () => {
    setForm(blankForm());
    setEditing(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (
      !form.program_id ||
      !form.student_id ||
      !form.achievement_date ||
      !form.title.trim() ||
      !form.achievement.trim()
    ) {
      showToast(
        "Program, student, date, title and achievement are required.",
        "error",
      );
      return;
    }
    if (saving) return;
    setSaving(true);
    try {
      if (editing)
        await adminService.updateStudentAchievement(editing.id, form);
      else await adminService.createStudentAchievement(form);
      showToast(
        editing
          ? "Achievement updated successfully."
          : "Achievement added successfully.",
      );
      clearForm();
      await loadRows();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to save achievement.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const editRow = (row) => {
    setEditing(row);
    setForm({
      program_id: row.program_id,
      student_id: row.student_id,
      achievement_date: row.achievement_date,
      title: row.title,
      achievement: row.achievement,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const deleteRow = async () => {
    if (!deleting || actionBusy) return;
    setActionBusy(true);
    try {
      await adminService.deleteStudentAchievement(deleting.id);
      showToast("Achievement deleted successfully.");
      setDeleting(null);
      await loadRows();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to delete achievement.",
        "error",
      );
    } finally {
      setActionBusy(false);
    }
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <AdminDashboardLayout>
      <header className="mb-7 sm:mb-8">
        <h1 className="section-heading !text-2xl lg:!text-3xl mb-1.5">
          Student Achievements
        </h1>
        <p className="text-slate-500 text-sm">
          Add and manage achievements for students.
        </p>
      </header>
      {referenceError && (
        <ErrorState message="Couldn't load programs or students. Refresh the page and try again." />
      )}
      <form
        onSubmit={submit}
        className="card mb-7 overflow-hidden !border-parchment-100/10"
      >
        <div className="flex items-center gap-3 border-b border-parchment-100/10 px-5 py-4 sm:px-7 sm:py-5">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brass-500/20 bg-brass-500/10 text-lg text-brass-400">
            <FiAward />
          </span>
          <div>
            <h2 className="font-display text-lg text-parchment-100">
              {editing ? "Edit Achievement" : "Add New Achievement"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Assign an achievement to a student.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 p-5 sm:grid-cols-2 sm:p-7 xl:grid-cols-6">
          <div className="xl:col-span-2">
            <label
              htmlFor="achievement-program"
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              Program
            </label>
            <select
              id="achievement-program"
              value={form.program_id}
              onChange={(event) => updateForm("program_id", event.target.value)}
              required
            >
              <option value="">Select program...</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
            {programs.length === 0 && !referenceError && (
              <p className="mt-1.5 text-xs text-slate-500">
                No programs are available.
              </p>
            )}
          </div>
          <div className="xl:col-span-2">
            <label
              htmlFor="achievement-student"
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              Student
            </label>
            <select
              id="achievement-student"
              value={form.student_id}
              onChange={(event) => updateForm("student_id", event.target.value)}
              disabled={!form.program_id || enrolledStudents.length === 0}
              required
            >
              <option value="">Select student...</option>
              {enrolledStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name} ({student.student_code})
                </option>
              ))}
            </select>
            {form.program_id && enrolledStudents.length === 0 && (
              <p className="mt-1.5 text-xs text-slate-500">
                No students enrolled in this program.
              </p>
            )}
          </div>
          <div className="xl:col-span-2">
            <label
              htmlFor="achievement-date"
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              Achievement Date
            </label>
            <input
              id="achievement-date"
              type="date"
              value={form.achievement_date}
              onChange={(event) =>
                updateForm("achievement_date", event.target.value)
              }
              required
            />
          </div>
          <div className="sm:col-span-2 xl:col-span-3">
            <label
              htmlFor="achievement-title"
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              Achievement Title
            </label>
            <input
              id="achievement-title"
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder="Enter achievement title"
              maxLength={200}
              required
            />
          </div>
          <div className="sm:col-span-2 xl:col-span-3">
            <label
              htmlFor="achievement-result"
              className="mb-1.5 block text-xs font-medium text-slate-400"
            >
              Achievement
            </label>
            <textarea
              id="achievement-result"
              value={form.achievement}
              onChange={(event) =>
                updateForm("achievement", event.target.value)
              }
              placeholder="Enter achievement or result"
              rows="3"
              maxLength={2000}
              required
              className="w-full resize-y"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-parchment-100/5 pt-4 sm:col-span-2 xl:col-span-6">
            <button
              type="submit"
              disabled={saving || referenceError}
              className="btn-primary min-w-44 disabled:opacity-60"
            >
              <FiPlus />
              {saving
                ? "Saving..."
                : editing
                  ? "Update Achievement"
                  : "Add Achievement"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={clearForm}
                className="btn-secondary"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      </form>

      <section className="card overflow-hidden !border-parchment-100/10">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="font-display text-lg text-parchment-100">
                Existing Achievements
              </h2>
              {!loading && !listError && (
                <span className="rounded-full border border-parchment-100/10 px-2.5 py-0.5 text-[11px] text-slate-400">
                  {rows.length} {rows.length === 1 ? "record" : "records"}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Manage and review previously added student achievements.
            </p>
          </div>
          <button
            type="button"
            aria-expanded={existingOpen}
            aria-controls="existing-achievements-content"
            onClick={() => setExistingOpen((open) => !open)}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-brass-500/30 bg-brass-500/5 px-4 py-2 text-xs font-semibold text-brass-400 transition hover:border-brass-500/60 hover:bg-brass-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/40"
          >
            {existingOpen
              ? "Hide Existing Achievements"
              : "Show Existing Achievements"}
            {existingOpen ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {existingOpen && (
            <motion.div
              id="existing-achievements-content"
              key="existing-achievements-content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-4 border-t border-parchment-100/10 p-4 sm:p-6">
                <div className="rounded-xl border border-parchment-100/10 bg-ink-950/25 p-4 sm:p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <FiFilter className="text-brass-400" />
                    Filters
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <label
                        htmlFor="filter-program"
                        className="mb-1.5 block text-xs text-slate-400"
                      >
                        Program
                      </label>
                      <div className="relative">
                        <select
                          id="filter-program"
                          className="h-11 w-full appearance-none rounded-lg border border-parchment-100/15 bg-ink-950/70 py-2.5 pl-4 pr-10 text-sm text-parchment-100 outline-none transition duration-200 hover:border-parchment-100/25 focus:border-brass-500 focus:ring-2 focus:ring-brass-500/15"
                          value={filters.program_id}
                          onChange={(event) =>
                            setFilters((current) => ({
                              ...current,
                              program_id: event.target.value,
                              student_id: "",
                            }))
                          }
                        >
                          <option value="">All programs</option>
                          {programs.map((program) => (
                            <option key={program.id} value={program.id}>
                              {program.name}
                            </option>
                          ))}
                        </select>
                        <FiChevronDown
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-brass-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="filter-student"
                        className="mb-1.5 block text-xs text-slate-400"
                      >
                        Student
                      </label>
                      <div className="relative">
                        <select
                          id="filter-student"
                          className="h-11 w-full appearance-none rounded-lg border border-parchment-100/15 bg-ink-950/70 py-2.5 pl-4 pr-10 text-sm text-parchment-100 outline-none transition duration-200 hover:border-parchment-100/25 focus:border-brass-500 focus:ring-2 focus:ring-brass-500/15"
                          value={filters.student_id}
                          onChange={(event) =>
                            setFilters((current) => ({
                              ...current,
                              student_id: event.target.value,
                            }))
                          }
                        >
                          <option value="">All students</option>
                          {filterStudents.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.full_name}
                            </option>
                          ))}
                        </select>
                        <FiChevronDown
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-brass-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="filter-date"
                        className="mb-1.5 block text-xs text-slate-400"
                      >
                        Date
                      </label>
                      <input
                        id="filter-date"
                        type="date"
                        className="h-11 w-full rounded-lg border border-parchment-100/15 bg-ink-950/70 py-2.5 pl-4 pr-10 text-sm text-parchment-100 outline-none transition duration-200 hover:border-parchment-100/25 focus:border-brass-500 focus:ring-2 focus:ring-brass-500/15 [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:invert"
                        value={filters.date}
                        onChange={(event) =>
                          setFilters((current) => ({
                            ...current,
                            date: event.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                {listError && (
                  <ErrorState message="Couldn't load student achievements right now." />
                )}
                {!listError && loading && (
                  <div className="rounded-xl border border-parchment-100/10 px-5 py-10 text-center">
                    <span className="mx-auto mb-3 block h-6 w-6 animate-spin rounded-full border-2 border-brass-500/25 border-t-brass-400" />
                    <p className="text-sm text-slate-400">
                      Loading achievements...
                    </p>
                  </div>
                )}
                {!listError && !loading && rows.length === 0 && (
                  <div className="rounded-xl border border-dashed border-parchment-100/15 px-5 py-10 text-center">
                    <span className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-brass-500/10 text-lg text-brass-400">
                      {hasFilters ? <FiSearch /> : <FiAward />}
                    </span>
                    <h3 className="text-sm font-semibold text-parchment-100">
                      {hasFilters
                        ? "No achievements found"
                        : "No achievements yet"}
                    </h3>
                    <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                      {hasFilters
                        ? "Try changing your filters."
                        : "Achievements added for students will appear here."}
                    </p>
                  </div>
                )}
                {!listError && !loading && rows.length > 0 && (
                  <div
                    className="max-w-full overflow-x-auto rounded-xl border border-parchment-100/10"
                    role="region"
                    aria-label="Student achievements table"
                    tabIndex="0"
                  >
                    <table className="w-full min-w-[850px] border-collapse text-sm">
                      <thead>
                        <tr className="bg-ink-950/60 text-left text-[11px] uppercase tracking-wider text-slate-500">
                          <th className="px-4 py-3.5 font-semibold sm:px-5">
                            Student
                          </th>
                          <th className="px-4 py-3.5 font-semibold sm:px-5">
                            Program
                          </th>
                          <th className="px-4 py-3.5 font-semibold sm:px-5">
                            Date
                          </th>
                          <th className="px-4 py-3.5 font-semibold sm:px-5">
                            Title
                          </th>
                          <th className="px-4 py-3.5 font-semibold sm:px-5">
                            Achievement
                          </th>
                          <th className="px-4 py-3.5 text-right font-semibold sm:px-5">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr
                            key={row.id}
                            className="border-t border-parchment-100/5 transition-colors hover:bg-parchment-100/[0.025]"
                          >
                            <td className="px-4 py-4 align-top sm:px-5">
                              <span className="font-medium text-parchment-200">
                                {row.students?.full_name || "—"}
                              </span>
                              {row.students?.student_code && (
                                <span className="mt-0.5 block text-xs text-slate-500">
                                  {row.students.student_code}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 align-top text-slate-300 sm:px-5">
                              {row.programs?.name || "—"}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 align-top text-slate-400 sm:px-5">
                              <span className="inline-flex items-center gap-2">
                                <FiCalendar className="text-brass-500/80" />
                                {displayDate(row.achievement_date)}
                              </span>
                            </td>
                            <td className="max-w-56 whitespace-normal px-4 py-4 align-top font-medium leading-5 text-parchment-200 sm:px-5">
                              {row.title}
                            </td>
                            <td className="max-w-56 whitespace-normal px-4 py-4 align-top leading-5 text-slate-400 sm:px-5">
                              {row.achievement}
                            </td>
                            <td className="px-4 py-4 align-top sm:px-5">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  title="Edit achievement"
                                  onClick={() => editRow(row)}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brass-500/20 text-brass-400 transition hover:border-brass-500/50 hover:bg-brass-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/40"
                                  aria-label="Edit achievement"
                                >
                                  <FiEdit2 />
                                </button>
                                <button
                                  type="button"
                                  title="Delete achievement"
                                  onClick={() => setDeleting(row)}
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-maroon-500/20 text-maroon-300 transition hover:border-maroon-500/50 hover:bg-maroon-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon-500/40"
                                  aria-label="Delete achievement"
                                >
                                  <FiTrash2 />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={deleteRow}
        title="Delete achievement?"
        message="Are you sure you want to delete this achievement?"
        confirmLabel={actionBusy ? "Deleting..." : "Delete"}
      />
    </AdminDashboardLayout>
  );
};

export default AdminStudentAchievements;
