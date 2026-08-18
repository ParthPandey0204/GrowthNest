import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error(
    '[GrowthNest] VITE_API_URL is not set. Add it to frontend/.env locally or to your hosting environment variables.'
  );
}

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const storedAuth = localStorage.getItem('growthnest_auth');
    const token = storedAuth ? JSON.parse(storedAuth).token : localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("growthnest_auth");
      window.dispatchEvent(new Event("growthnest:unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;
