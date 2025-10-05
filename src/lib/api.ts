import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000,
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Auth API functions
export const signUpUser = async (email: string, password: string, fullName: string) => {
  const response = await api.post('/auth/signup', { email, password, fullName });
  return response.data;
};

export const signInUser = async (email: string, password: string) => {
  const response = await api.post('/auth/signin', { email, password });
  return response.data;
};

export const signOutUser = async () => {
  const response = await api.post('/auth/signout');
  return response.data;
};

export const getUserProfile = async (userId: string) => {
  const response = await api.get(`/auth/profile/${userId}`);
  return response.data;
};

export const analyzeWebsite = async (url: string, userId: string) => {
  const response = await api.post('/websites/analyze', { url, userId });
  return response.data;
};

export const bulkAnalyzeWebsites = async (urls: string[], userId: string) => {
  const response = await api.post('/analyze/bulk', { urls, userId });
  return response.data;
};

export const compareWebsites = async (websiteIds: string[]) => {
  const response = await api.post('/compare', { websiteIds });
  return response.data;
};

export const getUserWebsites = async (userId: string) => {
  const response = await api.get(`/websites/user/${userId}`);
  return response.data;
};

export const getWebsiteAnalyses = async (websiteId: string) => {
  const response = await api.get(`/websites/${websiteId}/analyses`);
  return response.data;
};

export const getUserNotifications = async (userId: string) => {
  const response = await api.get(`/notifications/${userId}`);
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

export const deleteWebsite = async (websiteId: string) => {
  const response = await api.delete(`/websites/${websiteId}`);
  return response.data;
};

export const generateReport = async (websiteId: string, type: string = 'detailed', format: string = 'json') => {
  const response = await api.post('/websites/report', { websiteId, type, format });
  return response.data;
};

export const getComplianceBadge = async (websiteId: string) => {
  const response = await api.get(`/websites/${websiteId}/badge`);
  return response.data;
};