import React, { useEffect, useState } from 'react';
import StudentDashboardLayout from '../../layouts/StudentDashboardLayout.jsx';
import { EmptyState, ErrorState } from '../../components/common/StateViews.jsx';
import { studentService } from '../../services/studentService';

const statusColor = { present: 'text-brass-400', absent: 'text-maroon-400', leave: 'text-slate-400' };

const StudentAttendance = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    studentService
      .getMyAttendance()
      .then(({ data }) => setData(data.data))
      .catch(() => setError(true));
  }, []);

  return (
    <StudentDashboardLayout>
      <h1 className="section-heading !text-2xl lg:!text-3xl mb-1">Attendance</h1>
      <p className="text-slate-500 text-sm mb-8">Your training presence, marked by your masters.</p>

      {error && <ErrorState message="Couldn't load attendance right now." />}

      {data && (
        <>
          <div className="grid sm:grid-cols-3 gap-5 mb-8">
            <div className="card p-6">
              <p className="text-2xl font-mono text-brass-400">{data.summary.percentage}%</p>
              <p className="text-slate-400 text-xs mt-1">Attendance percentage</p>
            </div>
            <div className="card p-6">
              <p className="text-2xl font-mono text-parchment-100">{data.summary.present}</p>
              <p className="text-slate-400 text-xs mt-1">Present days</p>
            </div>
            <div className="card p-6">
              <p className="text-2xl font-mono text-parchment-100">{data.summary.total}</p>
              <p className="text-slate-400 text-xs mt-1">Total recorded days</p>
            </div>
          </div>

          {data.records.length === 0 ? (
            <EmptyState message="No attendance has been recorded yet." />
          ) : (
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 text-xs uppercase border-b border-parchment-100/5">
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.records.map((r) => (
                    <tr key={r.id} className="border-b border-parchment-100/5 last:border-0">
                      <td className="p-4 text-parchment-200">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className={`p-4 capitalize font-medium ${statusColor[r.status]}`}>{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </StudentDashboardLayout>
  );
};

export default StudentAttendance;
