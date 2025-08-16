import axios from 'axios';
import { requestCache } from './requestCache';

// Create optimized axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor with caching
api.interceptors.response.use(
  (response) => {
    // Cache GET requests
    if (response.config.method === 'get') {
      const cacheKey = response.config.url;
      const options = { method: 'GET' };
      
      // Different TTL for different endpoints
      let ttl = 300000; // 5 minutes default
      
      if (cacheKey.includes('/course/')) {
        ttl = 600000; // 10 minutes for course data
      } else if (cacheKey.includes('/study-materials/')) {
        ttl = 180000; // 3 minutes for materials
      } else if (cacheKey.includes('/enrolled')) {
        ttl = 120000; // 2 minutes for enrollment status
      }
      
      requestCache.set(response.config.url, options, response.data, ttl);
    }
    return response;
  },
  (error) => {
    // Handle network errors gracefully
    if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
      console.warn('Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Cached GET request function
export const cachedGet = async (url, options = {}) => {
  // Check cache first
  const cached = requestCache.get(url, { method: 'GET' });
  if (cached) {
    console.log('🎯 Cache hit for:', url);
    return { data: cached };
  }
  
  console.log('🌐 Fetching from server:', url);
  return api.get(url, options);
};

// Regular API methods
export const apiPost = (url, data, options = {}) => api.post(url, data, options);
export const apiPut = (url, data, options = {}) => api.put(url, data, options);
export const apiDelete = (url, options = {}) => api.delete(url, options);

// Clear cache when data is modified
export const clearCachePattern = (pattern) => {
  for (const [key] of requestCache.cache.entries()) {
    if (key.includes(pattern)) {
      requestCache.cache.delete(key);
    }
  }
};

export default api;
