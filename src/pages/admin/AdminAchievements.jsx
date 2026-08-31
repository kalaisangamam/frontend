import createAdminCrudPage from './createAdminCrudPage.jsx';
import { adminService } from '../../services/adminService';

const service = {
  list: adminService.getAchievementsAdmin,
  create: adminService.createAchievement,
  update: adminService.updateAchievement,
  remove: adminService.deleteAchievement,
};

const AdminAchievements = createAdminCrudPage({
  title: 'Achievements',
  subtitle: 'Animated statistics (e.g. 15+ Schools) and milestone timeline entries.',
  service,
  emptyForm: { type: 'milestone', label: '', value: '', year: '', description: '', display_order: 0 },
  fields: [
    { key: 'type', label: 'Type', type: 'select', options: ['milestone'], required: true },
    // { key: 'label', label: 'Label (e.g. "Schools")', type: 'text'},
    // { key: 'value', label: 'Value (e.g. "15+")', type: 'text'},
    { key: 'year', label: 'Year (for milestones)', type: 'number' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'display_order', label: 'Display Order', type: 'number' },
  ],
  columns: [
    // { key: 'label', label: 'Label' },
    // { key: 'value', label: 'Value' },
    { key: 'type', label: 'Type' },
    { key: 'display_order', label: 'Order' },
  ],
});

export default AdminAchievements;
