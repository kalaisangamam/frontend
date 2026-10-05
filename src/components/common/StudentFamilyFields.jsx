import React from 'react';

export const emptyStudentFamily = {
  school_college: '', category: '',
  father_name: '', father_contact: '', father_occupation: '',
  mother_name: '', mother_contact: '', mother_occupation: '',
};

const fields = [
  ['school_college', 'School / College Name'],
  ['father_name', 'Father Name'],
  ['father_contact', 'Father Contact Number', 'tel'],
  ['father_occupation', 'Father Occupation'],
  ['mother_name', 'Mother Name'],
  ['mother_contact', 'Mother Contact Number', 'tel'],
  ['mother_occupation', 'Mother Occupation'],
];

const inputClass = 'w-full bg-ink-950 border border-parchment-100/10 rounded-sm px-4 py-2.5 text-sm text-parchment-100 focus:border-brass-500 outline-none';

export default function StudentFamilyFields({ form, onChange }) {
  return (
    <>
      <label className="block text-xs text-slate-400">
        <span className="mb-1.5 block">Category</span>
        <select value={form.category || ''} onChange={(event) => onChange('category', event.target.value)} className={inputClass}>
          <option value="">Select category</option>
          {['School', 'College', 'General', 'House Wife', 'Gov Staff'].map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </label>
      {fields.map(([key, label, type = 'text']) => (
        <label key={key} className="block text-xs text-slate-400">
          <span className="mb-1.5 block">{label}</span>
          <input type={type} value={form[key] || ''} onChange={(event) => onChange(key, event.target.value)} className={inputClass} />
        </label>
      ))}
    </>
  );
}
