// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add auth token to requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Handle token expiration
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Authentication API
// export const authAPI = {
//   register: (userData) => api.post('/auth/register', userData),
//   login: (email, password) => api.post('/auth/login', { email, password }),
//   getCurrentUser: () => api.get('/auth/me'),
//   updateProfile: (userData) => api.put('/users/profile', userData),
//   changePassword: (passwordData) => api.put('/users/change-password', passwordData),
//   deleteAccount: () => api.delete('/users/account'),
//   refreshToken: () => api.post('/auth/refresh'),
//   logout: () => api.post('/auth/logout'),
// };

// // User API
// export const userAPI = {
//   getProfile: () => api.get('/users/profile'),
//   updateProfile: (userData) => api.put('/users/profile', userData),
//   updateSettings: (settings) => api.put('/users/settings', settings),
//   getStats: () => api.get('/users/stats'),
//   changePassword: (passwordData) => api.put('/users/change-password', passwordData),
//   deleteAccount: (password) => api.delete('/users/account', { data: { password } }),
// };

// // Health Plans API
// export const plansAPI = {
//   generatePlan: (preferences) => api.post('/plans/generate', preferences),
//   getUserPlans: () => api.get('/plans/user'),
//   getPlans: (params) => api.get('/plans', { params }),
//   getPlan: (planId) => api.get(`/plans/${planId}`),
//   updatePlan: (planId, updates) => api.put(`/plans/${planId}`, updates),
//   ratePlan: (planId, rating) => api.post(`/plans/${planId}/rating`, rating),
//   submitFeedback: (planId, feedback) => api.post(`/plans/${planId}/feedback`, feedback),
//   downloadPDF: (planId) => api.get(`/plans/${planId}/pdf`, { responseType: 'blob' }),
//   emailPlan: (planId) => api.post(`/plans/${planId}/email`),
//   deletePlan: (planId) => api.delete(`/plans/${planId}`),
// };

// // Progress API
// export const progressAPI = {
//   addProgress: (progressData) => api.post('/progress', progressData),
//   getUserProgress: (days) => api.get('/progress/user', { params: { days } }),
//   updateProgress: (progressId, updates) => api.put(`/progress/${progressId}`, updates),
//   deleteProgress: (progressId) => api.delete(`/progress/${progressId}`),
//   getProgressHistory: (params) => api.get('/progress', { params }),
//   getAnalytics: (params) => api.get('/progress/analytics', { params }),
//   getTodayProgress: () => api.get('/progress/today'),
//   updateGoals: (goalData) => api.put('/progress/goals', goalData),
// };

// // Chatbot API
// export const chatbotAPI = {
//   sendMessage: (message) => api.post('/chatbot/chat', { message }),
//   chat: (message) => api.post('/chatbot/chat', { message }),
//   getHealthInfo: (query) => api.get('/chatbot/health-info', { params: { query } }),
//   getTips: () => api.get('/chatbot/tips'),
//   calculate: (data) => api.post('/chatbot/calculate', data),
//   getMotivation: () => api.get('/chatbot/motivation'),
// };

// export default api;












import axios from 'axios';

// Unified API base URL configuration
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors and token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
  deleteAccount: () => api.delete('/users/account'),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  updateSettings: (settings) => api.put('/users/settings', settings),
  getStats: () => api.get('/users/stats'),
  changePassword: (passwordData) => api.put('/users/change-password', passwordData),
  deleteAccount: (password) => api.delete('/users/account', { data: { password } }),
};

// Health Plans API
export const plansAPI = {
  generatePlan: (preferences) => api.post('/plans/generate', preferences),
  getUserPlans: () => api.get('/plans/user'),
  getPlans: (params) => api.get('/plans', { params }),
  getPlan: (planId) => api.get(`/plans/${planId}`),
  updatePlan: (planId, updates) => api.put(`/plans/${planId}`, updates),
  ratePlan: (planId, rating) => api.post(`/plans/${planId}/rating`, rating),
  submitFeedback: (planId, feedback) => api.post(`/plans/${planId}/feedback`, feedback),
  downloadPDF: (planId) => api.get(`/plans/${planId}/pdf`, { responseType: 'blob' }),
  emailPlan: (planId) => api.post(`/plans/${planId}/email`),
  deletePlan: (planId) => api.delete(`/plans/${planId}`),
};

// Progress API
export const progressAPI = {
  addProgress: (progressData) => api.post('/progress', progressData),
  getUserProgress: (days) => api.get('/progress/user', { params: { days } }),
  updateProgress: (progressId, updates) => api.put(`/progress/${progressId}`, updates),
  deleteProgress: (progressId) => api.delete(`/progress/${progressId}`),
  getProgressHistory: (params) => api.get('/progress', { params }),
  getAnalytics: (params) => api.get('/progress/analytics', { params }),
  getTodayProgress: () => api.get('/progress/today'),
  updateGoals: (goalData) => api.put('/progress/goals', goalData),
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: (message) => api.post('/chatbot/chat', { message }),
  chat: (message) => api.post('/chatbot/chat', { message }),
  getHealthInfo: (query) => api.get('/chatbot/health-info', { params: { query } }),
  getTips: () => api.get('/chatbot/tips'),
  calculate: (data) => api.post('/chatbot/calculate', data),
  getMotivation: () => api.get('/chatbot/motivation'),
};

// Coaching API (new functionality)
export const coachingAPI = {
  getCoachingPlans: () => api.get('/coaching/plans'),
  getCoachingPlan: (planId) => api.get(`/coaching/plans/${planId}`),
  generateCoachingPlan: (preferences) => api.post('/coaching/generate', preferences),
  updateCoachingProgress: (planId, progressData) => api.put(`/coaching/plans/${planId}/progress`, progressData),
  getCoachingProgress: (planId) => api.get(`/coaching/plans/${planId}/progress`),
  getCoachingAnalytics: (planId, params) => api.get(`/coaching/plans/${planId}/analytics`, { params }),
  scheduleSession: (sessionData) => api.post('/coaching/sessions', sessionData),
  getSessions: () => api.get('/coaching/sessions'),
  updateSession: (sessionId, updates) => api.put(`/coaching/sessions/${sessionId}`, updates),
  cancelSession: (sessionId) => api.delete(`/coaching/sessions/${sessionId}`),
  getCoachFeedback: (planId) => api.get(`/coaching/plans/${planId}/feedback`),
  submitCoachFeedback: (planId, feedback) => api.post(`/coaching/plans/${planId}/feedback`, feedback),
};

// Export the main api instance as default
export default api;