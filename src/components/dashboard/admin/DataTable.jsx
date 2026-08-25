import React from 'react';
import { EmptyState } from '../../common/StateViews.jsx';

// columns: [{ key, label, render? }]
const DataTable = ({ columns, rows, actions, emptyMessage = 'No records found.', tableClassName = 'min-w-[600px]' }) => {
  if (!rows || rows.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <div className="card max-w-full overflow-x-auto" role="region" aria-label="Data table" tabIndex="0">
      <table className={`w-full text-sm ${tableClassName}`}>
        <thead>
          <tr className="text-left text-slate-500 text-xs uppercase border-b border-parchment-100/5">
            {columns.map((c) => (
              <th key={c.key} className="p-4 whitespace-nowrap">{c.label}</th>
            ))}
            {actions && <th className="p-4 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-parchment-100/5 last:border-0 hover:bg-ink-800/40">
              {columns.map((c) => (
                <td key={c.key} className="p-4 text-parchment-200 whitespace-nowrap">
                  {c.render ? c.render(row) : row[c.key] ?? '—'}
                </td>
              ))}
              {actions && <td className="p-4 text-right space-x-3 whitespace-nowrap">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
