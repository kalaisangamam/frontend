import createAdminCrudPage from './createAdminCrudPage.jsx';
import { adminService } from '../../services/adminService';

const service = {
  list: adminService.getProgramsAdmin,
  create: adminService.createProgram,
  update: adminService.updateProgram,
  remove: adminService.deleteProgram,
};

const AdminPrograms = createAdminCrudPage({
  title: 'Programs',
  subtitle: 'Silambam, Karate, Yoga, Skating, Archery, Hindi and their training details.',
  service,
  emptyForm: {
    slug: '', name: '', tagline: '', introduction: '', training_details: '', training_schedule: '',
    benefits: [], levels: [], display_order: 0,
  },
  fields: [
    { key: 'slug', label: 'Slug (used in image filename, e.g. "silambam")', type: 'text', required: true },
    { key: 'name', label: 'Program Name', type: 'text', required: true },
    { key: 'tagline', label: 'Tagline', type: 'text' },
    { key: 'introduction', label: 'Introduction', type: 'textarea' },
    { key: 'benefits', label: 'Benefits', type: 'tags' },
    { key: 'training_details', label: 'Training Details', type: 'textarea' },
    { key: 'training_schedule', label: 'Training Schedule', type: 'textarea' },
    { key: 'levels', label: 'Levels / Belts', type: 'tags' },
    { key: 'display_order', label: 'Display Order', type: 'number' },
  ],
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'display_order', label: 'Order' },
    { key: 'status', label: 'Status' },
  ],
});

export default AdminPrograms;
