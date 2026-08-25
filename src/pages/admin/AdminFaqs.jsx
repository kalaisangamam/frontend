import createAdminCrudPage from './createAdminCrudPage.jsx';
import { adminService } from '../../services/adminService';

const service = {
  list: adminService.getFaqsAdmin,
  create: adminService.createFaq,
  update: adminService.updateFaq,
  remove: adminService.deleteFaq,
};

const AdminFaqs = createAdminCrudPage({
  title: 'FAQs',
  subtitle: 'Common questions shown on the public FAQ section.',
  service,
  emptyForm: { question: '', answer: '', display_order: 0 },
  fields: [
    { key: 'question', label: 'Question', type: 'text', required: true },
    { key: 'answer', label: 'Answer', type: 'textarea', required: true },
    { key: 'display_order', label: 'Display Order', type: 'number' },
  ],
  columns: [
    { key: 'question', label: 'Question' },
    { key: 'display_order', label: 'Order' },
  ],
});

export default AdminFaqs;
