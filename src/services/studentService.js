import api from './api';

export const studentService = {
  register: (payload) => api.post('/students/register', payload),
  getMyProfile: () => api.get('/students/me/profile'),
  getMyAttendance: (month) => api.get('/attendance/me', { params: month ? { month } : {} }),
  getMyFees: () => api.get('/fees/me'),
  submitTestimonial: (payload) => api.post('/testimonials/submit', payload),
};
