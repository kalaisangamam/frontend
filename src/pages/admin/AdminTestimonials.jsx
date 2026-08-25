import createAdminCrudPage from './createAdminCrudPage.jsx';
import { adminService } from '../../services/adminService';

const service = {
  list: adminService.getTestimonialsAdmin,
  create: adminService.createTestimonial,
  update: adminService.updateTestimonial,
  remove: adminService.deleteTestimonial,
};

const AdminTestimonials = createAdminCrudPage({
  title: 'Testimonials',
  subtitle: 'Messages shared by students, shown in a carousel on the public site.',
  service,
  emptyForm: { student_name: '', message: '', program: '', designation: '', display_order: 0 },
  fields: [
    { key: 'student_name', label: 'Student Name', type: 'text', required: true },
    { key: 'message', label: 'Message', type: 'textarea', required: true },
    { key: 'program', label: 'Program', type: 'text' },
    { key: 'designation', label: 'Designation (optional)', type: 'text' },
    { key: 'display_order', label: 'Display Order', type: 'number' },
  ],
  columns: [
    { key: 'student_name', label: 'Student' },
    { key: 'program', label: 'Program' },
    { key: 'display_order', label: 'Order' },
  ],
});

export default AdminTestimonials;
