import React, { useEffect, useState } from 'react';
import { FiMail, FiPhone, FiTrash2 } from 'react-icons/fi';
import AdminDashboardLayout from '../../layouts/AdminDashboardLayout.jsx';
import AdminPageHeader from '../../components/dashboard/admin/AdminPageHeader.jsx';
import DataTable from '../../components/dashboard/admin/DataTable.jsx';
import ConfirmDialog from '../../components/dashboard/admin/ConfirmDialog.jsx';
import { ErrorState } from '../../components/common/StateViews.jsx';
import { adminService } from '../../services/adminService';

const contactColumn = {
  key: 'contact',
  label: 'Contact',
  render: (row) => <div><p>{row.phone}</p>{row.email && <p className="text-xs text-slate-500 mt-1">{row.email}</p>}</div>,
};
const messageColumn = {
  key: 'message',
  label: 'Message',
  render: (row) => <p className="max-w-sm whitespace-normal text-xs text-slate-400">{row.message || '—'}</p>,
};
const submittedColumn = { key: 'created_at', label: 'Submitted', render: (row) => new Date(row.created_at).toLocaleString() };

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState(null);
  const [error, setError] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    adminService.getContactEnquiries().then(({ data }) => setEnquiries(data.data)).catch(() => setError(true));
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminService.deleteContactEnquiry(deleteId);
      setEnquiries((items) => items.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError(true);
    }
  };

  const actionsColumn = {
    key: 'actions',
    label: 'Contact',
    render: (row) => <div className="flex items-center gap-2">
      <a href={`tel:${row.phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-1.5 rounded-full border border-brass-500/40 bg-brass-500/10 px-3 py-1.5 text-xs font-semibold text-brass-300 transition hover:bg-brass-500 hover:text-onaccent" aria-label={`Call ${row.name}`}>
        <FiPhone /> Call
      </a>
      {row.email ? (
        <a href={`mailto:${row.email}`} className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-300 transition hover:bg-sky-400 hover:text-onaccent" aria-label={`Email ${row.name}`}>
          <FiMail /> Email
        </a>
      ) : <span className="text-xs text-slate-600">No email</span>}
      <button type="button" onClick={() => setDeleteId(row.id)} className="inline-flex items-center gap-1.5 rounded-full border border-maroon-500/40 bg-maroon-500/10 px-3 py-1.5 text-xs font-semibold text-maroon-300 transition hover:bg-maroon-500 hover:text-parchment-100" aria-label={`Delete ${row.name}'s enquiry`}>
        <FiTrash2 /> Delete
      </button>
    </div>,
  };

  const sections = [
    {
      type: 'general', title: 'General Enquiries', empty: 'No general enquiries have been submitted yet.',
      columns: [{ key: 'name', label: 'Name' }, contactColumn, { key: 'subject', label: 'Subject' }, messageColumn, submittedColumn, actionsColumn],
    },
    {
      type: 'enrolment', title: 'Program Enrolment Requests', empty: 'No program enrolment requests have been submitted yet.',
      columns: [{ key: 'name', label: 'Student Name' }, contactColumn, { key: 'game', label: 'Program' }, { key: 'age', label: 'Age' }, { key: 'preferred_branch', label: 'Preferred Branch' }, messageColumn, submittedColumn, actionsColumn],
    },
    {
      type: 'event', title: 'Event Enquiries', empty: 'No event enquiries have been submitted yet.',
      columns: [{ key: 'name', label: 'Name' }, contactColumn, { key: 'event_name', label: 'Event Name' }, messageColumn, submittedColumn, actionsColumn],
    },
  ];

  return (
    <AdminDashboardLayout>
      <AdminPageHeader title="Contact Enquiries" subtitle="Contact requests are grouped by form type." />
      {error && <ErrorState message="Couldn't load or update contact enquiries right now." />}
      {!enquiries && !error && <p className="text-sm text-slate-400 py-8">Loading contact enquiries...</p>}
      {enquiries && <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.type}>
            <h2 className="font-display text-xl text-parchment-100 mb-4">{section.title}</h2>
            <DataTable columns={section.columns} rows={enquiries.filter((item) => item.enquiry_type === section.type)} emptyMessage={section.empty} />
          </section>
        ))}
      </div>}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Enquiry" message="This enquiry will be permanently deleted and cannot be recovered." confirmLabel="Delete" />
    </AdminDashboardLayout>
  );
};

export default AdminEnquiries;
