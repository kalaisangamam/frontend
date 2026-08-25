import api from './api';

export const publicService = {
  getPrograms: () => api.get('/programs'),
  getProgramBySlug: (slug) => api.get(`/programs/slug/${slug}`),
  getMasters: () => api.get('/masters'),
  getAchievements: () => api.get('/achievements'),
  getGallery: (category) => api.get('/gallery', { params: category ? { category } : {} }),
  getEvents: () => api.get('/events'),
  getHeroEvent: () => api.get('/events/hero'),
  getTestimonials: () => api.get('/testimonials'),
  getFaqs: () => api.get('/faqs'),
  getSiteSettings: () => api.get('/settings/site_info'),
  getBranches: () => api.get('/settings/branches/list'),
  getAnnouncements: (branchId) => api.get('/announcements', { params: branchId ? { branch_id: branchId } : {} }),
  getHeroAnnouncement: (branchId) => api.get('/announcements/hero', { params: branchId ? { branch_id: branchId } : {} }),
  getPaymentSettings: () => api.get('/settings/payment_info'),
};
