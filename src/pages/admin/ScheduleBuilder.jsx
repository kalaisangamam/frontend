import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const blank = () => ({ branch: '', days: [], start_time: '', end_time: '' });

export default function ScheduleBuilder({ value = [], onChange }) {
  const rows = Array.isArray(value) ? value : [];
  const update = (index, changes) => onChange(rows.map((row, i) => i === index ? { ...row, ...changes } : row));
  return <div className="space-y-3">
    {rows.map((row, index) => (
      <div key={index} className="rounded-xl border border-parchment-100/10 bg-ink-950/50 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between"><span className="text-xs uppercase tracking-widest text-brass-400">Schedule {index + 1}</span>
          <button type="button" onClick={() => onChange(rows.filter((_, i) => i !== index))} className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300"><FiTrash2 /> Remove</button></div>
        <label className="block text-xs text-slate-400">Branch
          <input value={row.branch || ''} onChange={(e) => update(index, { branch: e.target.value })} placeholder="e.g. Main Branch" className="mt-1" />
        </label>
        <fieldset><legend className="mb-2 text-xs text-slate-400">Days</legend><div className="flex flex-wrap gap-2">
          {DAYS.map((day) => { const selected = (row.days || []).includes(day); return <button key={day} type="button" aria-pressed={selected} onClick={() => update(index, { days: selected ? row.days.filter((d) => d !== day) : DAYS.filter((d) => [...(row.days || []), day].includes(d)) })} className={`rounded-full border px-3 py-1.5 text-xs transition ${selected ? 'border-brass-500 bg-brass-500/15 text-brass-300' : 'border-parchment-100/15 text-slate-400 hover:border-brass-500/50'}`}>{day}</button>; })}
        </div></fieldset>
        <div className="grid grid-cols-2 gap-3"><label className="text-xs text-slate-400">Start time<input type="time" value={row.start_time || ''} onChange={(e) => update(index, { start_time: e.target.value })} className="mt-1" /></label>
          <label className="text-xs text-slate-400">End time<input type="time" value={row.end_time || ''} onChange={(e) => update(index, { end_time: e.target.value })} className="mt-1" /></label></div>
      </div>
    ))}
    <button type="button" onClick={() => onChange([...rows, blank()])} className="btn-secondary w-full"><FiPlus /> Add Schedule</button>
  </div>;
}
