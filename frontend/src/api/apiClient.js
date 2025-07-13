import axios from "axios";
import { handleApiError } from "../utils/errorHandler";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3001/api",
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

    return config;
  },
  (error) => {
    console.error("Error en request interceptor:", error);
    return Promise.reject(handleApiError(error));
  }
);

export default apiClient;
