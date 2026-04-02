import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: `${BASE_API}`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})


export default axiosInstance;