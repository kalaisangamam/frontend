import React from 'react';
import { FiPlus } from 'react-icons/fi';

const AdminPageHeader = ({ title, subtitle, actionLabel, onAction }) => (
  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="section-heading !text-2xl lg:!text-3xl mb-1">{title}</h1>
      {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
    </div>
    {actionLabel && (
      <button onClick={onAction} className="btn-primary !py-2.5">
        <FiPlus /> {actionLabel}
      </button>
    )}
  </div>
);

export default AdminPageHeader;
