import React from 'react';

const StudentMultiSelect = ({ students = [], selectedIds = [], onChange, emptyMessage }) => {
  const selectedStudents = students.filter((student) => selectedIds.includes(student.id));
  const allSelected = students.length > 0 && selectedIds.length === students.length;

  const toggleStudent = (id) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((selectedId) => selectedId !== id) : [...selectedIds, id]);
  };

  return (
    <div className="space-y-3">
      <div className="min-h-[44px] rounded-sm border border-parchment-100/10 bg-ink-950 px-3 py-2 text-sm">
        {selectedStudents.length === 0 ? <span className="text-slate-500">Select students...</span> : selectedStudents.length > 3 ? <span className="text-parchment-100">{selectedStudents.length} students selected</span> : (
          <div className="flex flex-wrap gap-1.5">
            {selectedStudents.map((student) => <button key={student.id} type="button" onClick={() => toggleStudent(student.id)} className="rounded-full border border-brass-500/30 bg-brass-500/10 px-2 py-0.5 text-xs text-brass-300 hover:bg-brass-500/20">
              {student.full_name} <span aria-hidden="true">×</span>
            </button>)}
          </div>
        )}
      </div>
      <div className="max-h-48 overflow-y-auto rounded-sm border border-parchment-100/10 divide-y divide-parchment-100/5">
        {students.length === 0 ? <p className="px-3 py-2.5 text-sm text-slate-500">{emptyMessage || 'No students found.'}</p> : <>
          <label className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm text-brass-300 hover:bg-parchment-100/5">
            <input type="checkbox" checked={allSelected} onChange={() => onChange(allSelected ? [] : students.map((student) => student.id))} />
            Select all
          </label>
          {students.map((student) => <label key={student.id} className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-parchment-100/5">
            <input type="checkbox" checked={selectedIds.includes(student.id)} onChange={() => toggleStudent(student.id)} />
            <span>{student.full_name} <span className="text-slate-500">({student.student_code})</span></span>
          </label>)}
        </>}
      </div>
    </div>
  );
};

export default StudentMultiSelect;
