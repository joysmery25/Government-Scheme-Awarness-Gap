import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Optionally add interceptors for tokens here if we use them
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global response error handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Auto logout if 401 Unauthorized is returned from API
            const isApi = window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/dashboard');

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('admin');

            if (isApi) {
                window.location.href = window.location.pathname.startsWith('/admin') ? '/admin-login' : '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
