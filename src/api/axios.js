import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const API = axios.create({ baseURL: `${backendURL}/api` });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
export { API, backendURL };
