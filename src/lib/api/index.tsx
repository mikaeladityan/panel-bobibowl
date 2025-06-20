import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    withCredentials: true,
    timeout: 10000,
});

export const setupCSRFToken = async (): Promise<void> => {
    try {
        await api.get("/csrf");
    } catch (err) {
        console.error("Failed to initialize CSRF token:", err);
        throw err;
    }
};

api.interceptors.request.use((config) => {
    const csrfToken = Cookies.get(process.env.NEXT_PUBLIC_CSRF_COOKIE_NAME!);
    if (csrfToken && config.headers) {
        config.headers[process.env.NEXT_PUBLIC_CSRF_HEADER_NAME!.toUpperCase()] = csrfToken;
    }
    return config;
});

// Optional: handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // if (error.response.status === 401) {
        //     // redirect to login or clear client state
        //     window.location.href = "/login";
        // }
        return Promise.reject(error);
    }
);
