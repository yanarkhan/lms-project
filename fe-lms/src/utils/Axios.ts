import axios, { AxiosError } from "axios";
import { clearSession, getSession } from "./session";

const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
if (!baseURL) {
  console.warn("VITE_API_URL is empty. Check your .env");
}

const apiInstance = axios.create({
  baseURL,
  timeout: 10000,
});

export const apiInstanceAuth = axios.create({
  baseURL,
  timeout: 10000,
});

apiInstanceAuth.interceptors.request.use((config) => {
  const session = getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

apiInstanceAuth.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized request, logging out:", error);
      clearSession();
      window.location.href = "/manager/sign-in";
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
