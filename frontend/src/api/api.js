import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }

    return config;
});

export function saveAuth(data) {
    if (data.token) {
        localStorage.setItem("token", data.token);
    }

    if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
    }
}

export function saveUser(user) {
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    }
}

export function getStoredUser() {
    const user = localStorage.getItem("user");

    if (!user || user === "undefined") {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch {
        localStorage.removeItem("user");
        return null;
    }
}

export function clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export default api;