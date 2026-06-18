import axios from "axios";

// Prioritaskan backend Laravel baru, tetap bisa override via .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

/**
 * Client HTTP untuk Laundry Management System Backend
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// Request interceptor untuk menambahkan auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

// Response interceptor untuk handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API methods object untuk ekspor
export const api = {
  // Auth endpoints
  auth: {
    login: (credentials) => apiClient.post("/auth/login", credentials),
    register: (userData) => apiClient.post("/auth/register", userData),
    getCurrentUser: () => apiClient.get("/auth/me"),
    logout: () => apiClient.post("/auth/logout"),
    refreshToken: () => apiClient.post("/auth/refresh-token"),
  },

  // Customer endpoints
  customers: {
    getAll: (params) => apiClient.get("/customers", { params }),
    getById: (id) => apiClient.get(`/customers/${id}`),
    create: (data) => apiClient.post("/customers", data),
    update: (id, data) => apiClient.put(`/customers/${id}`, data),
    delete: (id) => apiClient.delete(`/customers/${id}`),
    getStats: () => apiClient.get("/customers/stats/overview"),
  },

  // Service endpoints
  services: {
    getAll: () => apiClient.get("/services"),
    getById: (id) => apiClient.get(`/services/${id}`),
    create: (data) => apiClient.post("/services", data),
    update: (id, data) => apiClient.put(`/services/${id}`, data),
    delete: (id) => apiClient.delete(`/services/${id}`),
    getStats: () => apiClient.get("/services/stats/popular"),
  },

  // Outlet endpoints
  outlets: {
    getAll: (params) => apiClient.get("/outlets", { params }),
    getById: (id) => apiClient.get(`/outlets/${id}`),
    create: (data) => apiClient.post("/outlets", data),
    update: (id, data) => apiClient.put(`/outlets/${id}`, data),
    delete: (id) => apiClient.delete(`/outlets/${id}`),
  },

  // Transaction endpoints
  transactions: {
    getAll: (params) => apiClient.get("/transactions", { params }),
    getById: (id) => apiClient.get(`/transactions/${id}`),
    create: (data) => apiClient.post("/transactions", data),
    update: (id, data) => apiClient.put(`/transactions/${id}`, data),
    delete: (id) => apiClient.delete(`/transactions/${id}`),
    getStats: () => apiClient.get("/transactions/stats/dashboard"),
  },

  // Item endpoints
  items: {
    getAll: (params) => apiClient.get("/items", { params }),
    getById: (id) => apiClient.get(`/items/${id}`),
    create: (data) => apiClient.post("/items", data),
    update: (id, data) => apiClient.put(`/items/${id}`, data),
    updateStock: (id, data) => apiClient.patch(`/items/${id}/stock`, data),
    delete: (id) => apiClient.delete(`/items/${id}`),
    getStats: () => apiClient.get("/items/stats/overview"),
  },

  // Expense endpoints
  expenses: {
    getAll: (params) => apiClient.get("/expenses", { params }),
    getById: (id) => apiClient.get(`/expenses/${id}`),
    create: (data) => apiClient.post("/expenses", data),
    update: (id, data) => apiClient.put(`/expenses/${id}`, data),
    delete: (id) => apiClient.delete(`/expenses/${id}`),
    getStats: (params) => apiClient.get("/expenses/stats/overview", { params }),
  },

  // Health check
  health: () => apiClient.get("/health"),
};