import React, { useEffect, useMemo, useState } from "react";
import { FiAward, FiCheckCircle, FiPlus, FiX } from "react-icons/fi";
import AdminDashboardLayout from "../../layouts/AdminDashboardLayout.jsx";
import AdminPageHeader from "../../components/dashboard/admin/AdminPageHeader.jsx";
import StudentMultiSelect from "../../components/dashboard/admin/StudentMultiSelect.jsx";
import { EmptyState, ErrorState } from "../../components/common/StateViews.jsx";
import { adminService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext.jsx";

const AdminLevels = () => {
  const { showToast } = useToast();
  const [programs, setPrograms] = useState(null);
  const [programId, setProgramId] = useState("");
  const [enrollments, setEnrollments] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [draftLevels, setDraftLevels] = useState([]);
  const [levelName, setLevelName] = useState("");
  const [savingLevels, setSavingLevels] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState(false);

  const activePrograms = useMemo(
    () => (programs || []).filter((program) => program.status === "active"),
    [programs],
  );
  const selectedProgram = activePrograms.find(
    (program) => program.id === programId,
  );
  const students = useMemo(
    () =>
      (enrollments || []).map((enrollment) => ({
        ...enrollment.students,
        current_level: enrollment.current_level,
      })),
    [enrollments],
  );
  const selectedStudents = students.filter((student) =>
    selectedIds.includes(student.id),
  );

  const loadPrograms = async () => {
    try {
      const { data } = await adminService.getProgramsAdmin();
      setPrograms(data.data || []);
    } catch {
      setError(true);
    }
  };
  const loadEnrollments = async (selectedProgramId) => {
    if (!selectedProgramId) return setEnrollments(null);
    try {
      const { data } =
        await adminService.getLevelEnrollments(selectedProgramId);
      setEnrollments(data.data || []);
    } catch {
      setError(true);
      setEnrollments([]);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, []);
  useEffect(() => {
    setSelectedIds([]);
    setSelectedLevel("");
    setLevelName("");
    const program = activePrograms.find((item) => item.id === programId);
    setDraftLevels(program?.levels || []);
    loadEnrollments(programId);
  }, [programId, programs]); // Program refresh keeps the level editor in sync after saving.

  const addLevel = () => {
    const name = levelName.trim();
    if (!name) return;
    if (
      draftLevels.some(
        (level) => level.toLocaleLowerCase() === name.toLocaleLowerCase(),
      )
    )
      return showToast(
        "This level already exists for the selected program.",
        "error",
      );
    setDraftLevels([...draftLevels, name]);
    setLevelName("");
  };
  const saveLevels = async () => {
    if (!selectedProgram)
      return showToast("Select a program before managing levels.", "error");
    setSavingLevels(true);
    try {
      const { data } = await adminService.updateProgramLevels(
        selectedProgram.id,
        draftLevels,
      );
      const updated = data.data;
      setPrograms((items) =>
        items.map((item) => (item.id === updated.id ? updated : item)),
      );
      if (selectedLevel && !updated.levels.includes(selectedLevel))
        setSelectedLevel("");
      showToast("Levels saved for this program.");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Could not save program levels.",
        "error",
      );
    } finally {
      setSavingLevels(false);
    }
  };
  const assignLevel = async (event) => {
    event.preventDefault();
    if (!programId || !selectedIds.length || !selectedLevel)
      return showToast(
        "Select a program, at least one student, and a level.",
        "error",
      );
    setAssigning(true);
    try {
      const { data } = await adminService.assignLevelsBulk({
        program_id: programId,
        student_ids: selectedIds,
        level: selectedLevel,
      });
      showToast(data.message || "Level assigned successfully.");
      setSelectedIds([]);
      await loadEnrollments(programId);
    } catch (err) {
      showToast(
        err.response?.data?.message || "Could not assign level.",
        "error",
      );
    } finally {
      setAssigning(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <AdminPageHeader
        title="Levels Management"
        subtitle="Configure each program's progression path and assign the right level to enrolled students."
      />
      {error && (
        <ErrorState message="Couldn't load level management data right now." />
      )}
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <form onSubmit={assignLevel} className="card p-6 space-y-5">
          <div className="flex items-start gap-3 border-b border-parchment-100/5 pb-4">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-brass-500/10 text-brass-400">
              <FiAward />
            </span>
            <div>
              <h2 className="font-display text-lg text-parchment-100">
                Assign program level
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Levels are stored independently for every student-program
                enrollment.
              </p>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">
              1. Select program
            </label>
            <select
              value={programId}
              onChange={(event) => setProgramId(event.target.value)}
            >
              <option value="">Select program...</option>
              {activePrograms.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <label className="block text-xs text-slate-400">
                2. Select students
              </label>
              {programId && (
                <span className="text-xs text-slate-500">
                  {students.length} enrolled
                </span>
              )}
            </div>
            <StudentMultiSelect
              students={students}
              selectedIds={selectedIds}
              onChange={setSelectedIds}
              emptyMessage={
                programId
                  ? "No active students are enrolled in this program."
                  : "Select a program first."
              }
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">
              3. Select level
            </label>
            <select
              disabled={!programId || !draftLevels.length}
              value={selectedLevel}
              onChange={(event) => setSelectedLevel(event.target.value)}
            >
              <option value="">
                {programId && !draftLevels.length
                  ? "Add levels in the panel first..."
                  : "Select level..."}
              </option>
              {draftLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {programId && !draftLevels.length && (
              <p className="mt-2 text-xs text-maroon-300">
                This program has no configured levels yet.
              </p>
            )}
          </div>
          {selectedStudents.length > 0 && (
            <div className="rounded-sm border border-brass-500/20 bg-brass-500/5 px-4 py-3">
              <p className="text-xs font-medium text-brass-300">
                Ready to update {selectedStudents.length} student
                {selectedStudents.length === 1 ? "" : "s"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Current:{" "}
                {selectedStudents
                  .map((student) => student.current_level || "Not assigned")
                  .filter((value, index, all) => all.indexOf(value) === index)
                  .join(", ")}
              </p>
            </div>
          )}
          <button
            type="submit"
            disabled={
              assigning || !programId || !selectedIds.length || !selectedLevel
            }
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {assigning ? "Assigning..." : "Assign Level"}
          </button>
        </form>

        <section className="card p-6 space-y-5 h-fit">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Program configuration
            </p>
            <h2 className="mt-1 font-display text-lg text-parchment-100">
              Manage levels / belts / Achievements
            </h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              These options are available only for the selected program.
            </p>
          </div>
          {!programId ? (
            <EmptyState message="Select a program to configure its levels." />
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  value={levelName}
                  onChange={(event) => setLevelName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addLevel();
                    }
                  }}
                  placeholder="e.g. Yellow Belt or Level 1"
                />
                <button
                  type="button"
                  onClick={addLevel}
                  className="btn-secondary shrink-0 !px-3"
                  aria-label="Add level"
                >
                  <FiPlus />
                </button>
              </div>
              <div className="space-y-2">
                {draftLevels.length === 0 ? (
                  <p className="rounded-sm border border-dashed border-parchment-100/10 px-3 py-4 text-sm text-slate-500">
                    No levels configured. Add the first level above.
                  </p>
                ) : (
                  draftLevels.map((level, index) => (
                    <div
                      key={level}
                      className="flex items-center gap-3 rounded-sm border border-parchment-100/10 bg-ink-950 px-3 py-2.5"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brass-500/10 text-[10px] font-semibold text-brass-400">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 text-sm text-parchment-200">
                        {level}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setDraftLevels((items) =>
                            items.filter((item) => item !== level),
                          )
                        }
                        className="text-slate-500 transition-colors hover:text-maroon-300"
                        aria-label={`Remove ${level}`}
                      >
                        <FiX />
                      </button>
                    </div>
                  ))
                )}
              </div>
              <button
                type="button"
                onClick={saveLevels}
                disabled={savingLevels}
                className="btn-secondary w-full disabled:opacity-60"
              >
                {savingLevels ? "Saving..." : "Save Level Configuration"}
              </button>
            </>
          )}
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Assignment status
            </p>
            <h2 className="mt-1 font-display text-lg text-parchment-100">
              {selectedProgram
                ? `${selectedProgram.name} students`
                : "Program enrollments"}
            </h2>
          </div>
          {programId && (
            <span className="text-xs text-slate-500">
              A level shown here belongs only to this program.
            </span>
          )}
        </div>
        {!programId ? (
          <EmptyState message="Select a program to see its students and existing levels." />
        ) : enrollments === null ? (
          <div className="card p-5 text-sm text-slate-500">
            Loading enrolled students...
          </div>
        ) : enrollments.length === 0 ? (
          <EmptyState message="No active students are enrolled in this program." />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-parchment-100/5 text-left text-xs uppercase text-slate-500">
                  <th className="p-4">Student</th>
                  <th className="p-4">Student ID</th>
                  <th className="p-4">Current level</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr
                    key={enrollment.id}
                    className="border-b border-parchment-100/5 last:border-0"
                  >
                    <td className="p-4 font-medium text-parchment-200">
                      {enrollment.students?.full_name}
                    </td>
                    <td className="p-4 text-slate-400">
                      {enrollment.students?.student_code}
                    </td>
                    <td className="p-4">
                      {enrollment.current_level ? (
                        <span className="inline-flex rounded-full border border-brass-500/30 bg-brass-500/10 px-2.5 py-1 text-xs text-brass-300">
                          {enrollment.current_level}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-brass-400">
                        <FiCheckCircle /> Enrolled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AdminDashboardLayout>
  );
};

export default AdminLevels;
