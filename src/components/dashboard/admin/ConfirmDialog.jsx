import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Modal from './Modal.jsx';

const ConfirmDialog = ({ open, onClose, onConfirm, title = 'Are you sure?', message, confirmLabel = 'Confirm', danger = true }) => (
  <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
    <div className="text-center">
      <FiAlertTriangle className={`text-3xl mx-auto mb-3 ${danger ? 'text-maroon-500' : 'text-brass-500'}`} />
      <p className="text-slate-300 text-sm mb-6">{message}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="btn-secondary flex-1 !py-2.5">Cancel</button>
        <button
          onClick={onConfirm}
          className={`flex-1 !py-2.5 rounded-sm font-display font-semibold uppercase tracking-wide text-sm ${
            danger ? 'bg-maroon-600 hover:bg-maroon-500 text-on-danger' : 'bg-brass-500 hover:bg-brass-400 text-onaccent'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
