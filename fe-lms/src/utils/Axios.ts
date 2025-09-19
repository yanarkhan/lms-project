import axios from "axios";

const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
if (!baseURL) {
  console.warn("VITE_API_URL is empty. Check your .env");
}

const apiInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default apiInstance;
