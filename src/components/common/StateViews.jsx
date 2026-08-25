import React from 'react';
import { FiAlertTriangle, FiInbox } from 'react-icons/fi';

export const SkeletonGrid = ({ count = 3, className = '' }) => (
  <div className={`grid gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="skeleton h-64 w-full" />
    ))}
  </div>
);

export const ErrorState = ({ message = 'Something went wrong while loading this section.' }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4">
    <FiAlertTriangle className="text-maroon-500 text-3xl mb-3" />
    <p className="text-parchment-300 text-sm max-w-sm">{message}</p>
  </div>
);

export const EmptyState = ({ message = 'Nothing to show here yet.' }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4">
    <FiInbox className="text-slate-500 text-3xl mb-3" />
    <p className="text-slate-400 text-sm max-w-sm">{message}</p>
  </div>
);
