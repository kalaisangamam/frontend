export const formatScheduleTime = (value) => {
  if (!/^\d{2}:\d{2}$/.test(value || '')) return value || '';
  const [hour, minute] = value.split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${suffix}`;
};

export const formatScheduleDays = (days = []) => {
  const ordered = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].filter((day) => days.includes(day));
  if (ordered.length < 2) return ordered.join('');
  if (ordered.length === 2) return `${ordered[0]} & ${ordered[1]}`;
  return `${ordered.slice(0, -1).join(', ')} & ${ordered.at(-1)}`;
};

export const groupScheduleByBranch = (entries = []) => {
  const groups = new Map();
  entries.forEach((entry) => {
    const key = entry.branch?.trim() || 'Training location';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  });
  return [...groups].map(([branch, schedules]) => ({ branch, schedules }));
};
