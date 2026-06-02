import axios from "axios";

const api = axios.create({
  baseURL: "/",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  config.headers = config.headers ?? {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle 401 globally - but not for public endpoints
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect for public endpoints
      const publicEndpoints = ['/api/v1/admissions/enquiry', '/api/v1/campuses', '/api/v1/academic/programs', '/api/v1/admissions/cycles/open', '/api/v1/lookups', '/universities/dashboard', '/api/v1/academic/programs'];
      const isPublicEndpoint = publicEndpoints.some(endpoint => error.config?.url?.includes(endpoint));
      
      if (!isPublicEndpoint) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;