import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sessionToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("Error en request interceptor:", error);
    return Promise.reject(handleApiError(error));
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "API Error:",
      error.response?.status,
      error.config?.url,
      error.message
    );

    if (error.response?.status >= 300 && error.response?.status < 400) {
      console.warn("Redirección bloqueada:", error.response.headers.location);
    }

    return Promise.reject(handleApiError(error));
  }
);

export default apiClient;
