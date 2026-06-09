import axios from "axios";

const api = axios.create({
  baseURL: "https://inventory-management-system-jfxq.onrender.com/api",
  timeout: 60000, // 60 seconds — Render free tier can take 30-50s to cold start
});

// Add a request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
